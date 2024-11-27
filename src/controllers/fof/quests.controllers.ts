import quest from "../../models/quests.models";
import milestones from "../../models/milestones.models";
import userMythologies from "../../models/mythologies.models";
import { OrbsTransactions } from "../../models/transactions.models";
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
      ([mythologyName, orbsToDeduct]) => {
        if (mythologyName === "MultiOrb") {
          return {
            updateOne: {
              filter: { userId: userId },
              update: {
                $inc: {
                  multiColorOrbs: -orbsToDeduct,
                },
              },
            },
          };
        } else {
          return {
            updateOne: {
              filter: { userId: userId, "mythologies.name": mythologyName },
              update: {
                $inc: {
                  "mythologies.$.orbs": -orbsToDeduct,
                } as any,
              },
            },
          };
        }
      }
    );

    // update rewards
    updateOperations.push({
      updateOne: {
        filter: { userId: userId, "mythologies.name": quest.mythology },
        update: {
          $inc: {
            "mythologies.$.faith": 1,
            "mythologies.$.energyLimit": 200,
          },
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

export const claimSocialQuest = async (req, res) => {
  try {
    const userId = req.user._id;
    const quest = req.quest;

    // Add to claimed quests
    await milestones.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          claimedQuests: {
            taskId: quest.taskId,
          },
        },
      },
      { upsert: true, new: true }
    );

    await userMythologies.findOneAndUpdate(
      { userId: userId },
      {
        $inc: { multiColorOrbs: quest.requiredOrbs.multiOrbs },
      }
    );

    const newOrbTransaction = new OrbsTransactions({
      userId: userId,
      source: "quests",
      orbs: { multiColorOrbs: quest.requiredOrbs.multiOrbs },
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
          claimedQuests: {
            taskId: quest.taskId,
            questClaimed: true,
          },
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
    //   const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    //   await quest.updateMany(
    //     {
    //       status: "Active",
    //       createdAt: { $lt: twentyFourHoursAgo },
    //       mythology: { $ne: "Other" },
    //     },
    //     {
    //       status: "Inactive",
    //     }
    //   );

    const currentDate = now.toISOString().split("T")[0];

    console.log(currentDate);

    //   res.status(200).json({ message: "Task Deactivated Successfully." });
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
          from: "quests",
          let: { userId: new mongoose.Types.ObjectId(userId) },
          pipeline: [
            {
              $match: {
                mythology: mythologyName,
                status: "Inactive",
              },
            },
            {
              $lookup: {
                from: "milestones",
                let: { questId: "$_id", userId: "$$userId" },
                pipeline: [
                  {
                    $unwind: "$claimedQuests",
                  },
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", "$$userId"] },
                          { $eq: ["$$questId", "$claimedQuests.taskId"] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      questClaimed: "$claimedQuests.questClaimed",
                    },
                  },
                ],
                as: "claimedQuestData",
              },
            },
            {
              $addFields: {
                isQuestClaimed: {
                  $cond: {
                    if: { $gt: [{ $size: "$claimedQuestData" }, 0] },
                    then: {
                      $arrayElemAt: ["$claimedQuestData.questClaimed", 0],
                    },
                    else: false,
                  },
                },
              },
            },
            {
              $match: {
                isQuestClaimed: false,
              },
            },
            {
              $sort: { createdAt: -1 as -1 },
            },
            {
              $project: {
                claimedQuestData: 0,
                updatedAt: 0,
                createdAt: 0,
                __v: 0,
              },
            },
          ],
          as: "inactiveUnclaimedQuests",
        },
      },
      {
        $project: {
          inactiveUnclaimedQuests: 1,
        },
      },
    ];

    const result = await milestones.aggregate(pipeline);

    res
      .status(200)
      .json({ lostQuests: result[0]?.inactiveUnclaimedQuests || [] });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "There was a problem fetching lost quests." });
  }
};
