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
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimQuest = async (req, res) => {
  try {
    const userId = req.user;
    const quest = req.quest;
    const requiredOrbs = quest.requiredOrbs;

    console.log("userId", userId._id);
    console.log("quest", quest.taskId);

    // Add to claimed quests
    await milestones.findOneAndUpdate(
      { userId: userId._id, "claimedQuests.taskId": quest.taskId },
      {
        $set: { "claimedQuests.$.questClaimed": true },
      },
      {
        new: true,
      }
    );

    // deduct required orbs
    const updateOperations = Object.entries(requiredOrbs).map(
      ([mythologyName, orbsToDeduct]) => ({
        updateOne: {
          filter: { userId: userId, "mythologies.name": mythologyName },
          update: {
            $inc: {
              "mythologies.$.orbs": -orbsToDeduct,
            } as any,
          },
        },
      })
    );

    // update rewards
    updateOperations.push({
      updateOne: {
        filter: { userId: userId, "mythologies.name": quest.mythology },
        update: {
          $inc: {
            "mythologies.$.faith": 1,
            "mythologies.$.energyLimit": 1000,
          } as any,
        },
      },
    });

    // Execute all updates in bulk
    if (updateOperations.length > 0) {
      await userMythologies.bulkWrite(updateOperations);
    }

    const newOrbTransaction = new OrbsTransactions({
      userId: userId,
      source: "quests",
      orbs: quest.requiredOrbs,
    });
    await newOrbTransaction.save();

    res.status(200).json({ message: "Quest claimed successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const completeQuest = async (req, res) => {
  try {
    const userId = req.user;
    const quest = req.quest;

    // Add to claimed quests
    await milestones.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          claimedQuests: { taskId: new mongoose.Types.ObjectId(quest.taskId) },
        },
      },
      { upsert: true }
    );

    res.status(200).json({ message: "Quest Completed" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimLostQuest = async (req, res) => {
  try {
    const userId = req.user;
    const quest = req.quest;
    const requiredOrbs = quest.requiredOrbs;

    // Add to claimed quests
    await milestones.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          claimedQuests: { taskId: new mongoose.Types.ObjectId(quest.taskId) },
        },
      },
      { upsert: true }
    );

    // deduct required orbs
    const updateOperations = Object.entries(requiredOrbs).map(
      ([mythologyName, orbsToDeduct]) => ({
        updateOne: {
          filter: { userId: userId, "mythologies.name": mythologyName },
          update: {
            $inc: {
              "mythologies.$.orbs": -orbsToDeduct,
            } as any,
          },
        },
      })
    );

    // update rewards
    updateOperations.push({
      updateOne: {
        filter: { userId: userId, "mythologies.name": quest.mythology },
        update: {
          $inc: {
            multiColorOrbs: -1,
            "mythologies.$.faith": 1,
            "mythologies.$.energyLimit": 1000,
          } as any,
        },
      },
    });

    // Execute all updates in bulk
    if (updateOperations.length > 0) {
      await userMythologies.bulkWrite(updateOperations);
    }

    const newOrbTransaction = new OrbsTransactions({
      userId: userId,
      source: "quests",
      orbs: quest.requiredOrbs,
    });
    await newOrbTransaction.save();

    res.status(200).json({ message: "Quest claimed successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
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
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const deactivateQuest = async (req, res) => {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    await quest.updateMany(
      {
        status: "Active",
        createdAt: { $lt: twentyFourHoursAgo },
      },
      {
        status: "Inactive",
      }
    );

    res.status(200).json({ message: "Task Deactivated Successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimQuestShare = async (req, res) => {
  try {
    const userId = req.user;
    const { questId } = req.body;

    // increment orb
    await userMythologies.findOneAndUpdate(
      { userId: userId },
      {
        $inc: {
          multiColorOrbs: 1,
        },
      }
    );

    // update claim status
    await milestones.updateOne(
      { userId: userId },
      {
        $push: { sharedQuests: questId },
      },
      { new: true, upsert: true }
    );

    // maintain transaction
    const newOrbTransaction = new OrbsTransactions({
      userId: userId,
      source: "share",
      orbs: { multiColorOrbs: 1 },
    });
    await newOrbTransaction.save();

    res.status(200).json({ message: "Orb claimed successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const unClaimedQuests = async (req, res) => {
  const userId = req.user._id;
  const { mythologyName } = req.query;

  try {
    const pipeline = [
      {
        $lookup: {
          from: "milestones",
          let: { userId: new mongoose.Types.ObjectId(userId) },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
              },
            },
            {
              $project: {
                claimedQuests: 1,
                sharedQuests: 1,
              },
            },
          ],
          as: "milestones",
        },
      },
      {
        $addFields: {
          milestones: { $arrayElemAt: ["$milestones", 0] },
          claimedQuests: {
            $ifNull: ["$milestones.claimedQuests", []],
          },
          sharedQuests: {
            $ifNull: ["$milestones.sharedQuests", []],
          },
        },
      },
      {
        $lookup: {
          from: "quests",
          let: {
            claimedQuests: "$claimedQuests",
            sharedQuests: "$sharedQuests",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$status", "Inactive"] },
                    { $eq: ["$mythology", mythologyName] },
                    {
                      $not: {
                        $in: [
                          "$_id",
                          {
                            $map: {
                              input: "$$claimedQuests",
                              as: "cq",
                              in: "$$cq.taskId",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
            {
              $addFields: {
                isOrbClaimed: {
                  $cond: [
                    {
                      $in: [
                        "$_id",
                        {
                          $map: {
                            input: "$$claimedQuests",
                            as: "cq",
                            in: "$$cq.taskId",
                          },
                        },
                      ],
                    },
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$$claimedQuests",
                            cond: { $eq: ["$$this.taskId", "$_id"] },
                          },
                        },
                        0,
                      ],
                    },
                    false,
                  ],
                },
                isShared: {
                  $in: ["$_id", "$$sharedQuests"],
                },
              },
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
                isOrbClaimed: 1,
                isShared: 1,
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "inactiveUnclaimedQuests",
        },
      },
      {
        $project: {
          _id: 0,
          inactiveUnclaimedQuests: 1,
        },
      },
    ];

    const lostQuests = await milestones.aggregate(pipeline);

    res
      .status(200)
      .json({ lostQuests: lostQuests[0]?.inactiveUnclaimedQuests });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ error: "There was a problem fetching lost quests." });
  }
};
