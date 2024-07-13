import quest from "../models/quests.models";
import milestones from "../models/milestones.models";
import userMythologies from "../models/mythologies.models";
import { OrbsTransactions } from "../models/transactions.models";
import mongoose from "mongoose";

export const createQuest = async (req, res) => {
  try {
    const { questData } = req.body;

    const newQuest = new quest(questData);
    const newQuestCreated = await newQuest.save();

    res.status(200).json({ data: newQuestCreated });
  } catch (error) {
    console.log(error);
  }
};

export const claimQuest = async (req, res) => {
  try {
    const userId = req.user;
    const quest = req.quest;

    // add to claim quest
    await milestones.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          claimedQuests: { taskId: new mongoose.Types.ObjectId(quest.taskId) },
        },
      },
      { upsert: true }
    );

    // increase faith and increase energy limit
    await userMythologies.findOneAndUpdate(
      { userId: userId, "mythologies.name": quest.mythology },
      {
        $inc: {
          "mythologies.$.faith": 1,
          "mythologies.$.energyLimit": 1000,
        },
      },
      { new: true }
    );

    // maintain transaction
    const newOrbTransaction = new OrbsTransactions({
      userId: userId,
      source: "quests",
      orbs: quest.requiredOrbs,
    });
    await newOrbTransaction.save();

    res.status(200).json({ message: "Quest claimed successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const claimOrbOnShare = async (req, res) => {
  try {
    const userId = req.user;
    const { questId } = req.body;

    const questData = await quest.findOne({ _id: questId });

    // increment orb
    await userMythologies.findOneAndUpdate(
      { userId: userId, "mythologies.name": questData.mythology },
      {
        $inc: {
          "mythologies.$.orbs": 1,
        },
      }
    );

    // update claim status
    await milestones.findOneAndUpdate(
      {
        userId: userId,
        "claimedQuests.taskId": questId,
      },
      {
        $set: { "claimedQuests.$.orbClaimed": true },
      },
      { new: true }
    );

    // maintain transaction
    const newOrbTransaction = new OrbsTransactions({
      userId: userId,
      source: "share",
      orbs: { [questData.mythology]: 1 },
    });
    await newOrbTransaction.save();

    res.status(200).json({ message: "Orb claimed successfully!" });
  } catch (error) {
    console.log(error);
  }
};

export const unClaimedQuests = async (req, res) => {
  try {
    const userId = req.user;
    const { mythologyName } = req.query;

    const twentyFourHoursAgo = new Date(
      new Date().getTime() - 24 * 60 * 60 * 1000
    ).toISOString();

    const pipeline = [
      {
        $match: {
          mythology: mythologyName,
          status: "Active",
          createdAt: { $lt: new Date(twentyFourHoursAgo) },
        },
      },
      {
        $lookup: {
          from: "milestones",
          let: { questId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                    { $not: { $in: ["$$questId", "$claimedQuests.taskId"] } },
                  ],
                },
              },
            },
          ],
          as: "userMilestones",
        },
      },
      {
        $match: {
          userMilestones: { $size: 1 },
        },
      },
      {
        $sort: { createdAt: -1 as -1 },
      },
      {
        $project: {
          questName: 1,
          description: 1,
          type: 1,
          link: 1,
          mythology: 1,
          status: 1,
          requiredOrbs: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
        },
      },
    ];

    const lostQuests = await quest.aggregate(pipeline).exec();

    res.status(200).json({ lostQuest: lostQuests });
  } catch (error) {
    console.log(error);
  }
};
