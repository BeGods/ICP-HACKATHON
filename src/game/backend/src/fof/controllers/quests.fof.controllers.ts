import quest from "../../common/models/quests.models";
import milestones from "../../common/models/milestones.models";
import userMythologies from "../../common/models/mythologies.models";
import {
  CoinsTransactions,
  OrbsTransactions,
} from "../../common/models/transactions.models";
import mongoose from "mongoose";

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
      message: "Failed to claim quest.",
      error: error.message,
    });
  }
};

export const claimTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const quest = req.quest;
    const { game } = req.body;

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

    if (game == "fof") {
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
    } else if (game == "ror") {
      await userMythologies.findOneAndUpdate(
        { userId: userId },
        {
          $inc: { gobcoin: quest.requiredOrbs.multiOrbs },
        }
      );

      const newCoinTransaction = new CoinsTransactions({
        userId: userId,
        source: "quests",
        coins: quest.requiredOrbs.multiOrbs,
      });
      await newCoinTransaction.save();
    } else {
      res.stats(400).json({ message: "Invalid game." });
    }

    res.status(200).json({ message: "Quest claimed successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to claim task.",
      error: error.message,
    });
  }
};

export const claimQuestRwrd = async (req, res) => {
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
      message: "Failed to claim quest complete reward.",
      error: error.message,
    });
  }
};

export const claimQuestInfoRwrd = async (req, res) => {
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
      message: "Failed to claim quest info reward.",
      error: error.message,
    });
  }
};
