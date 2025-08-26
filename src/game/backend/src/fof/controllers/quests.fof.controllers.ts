import quest from "../../common/models/quests.models";
import milestones from "../../common/models/milestones.models";
import userMythologies from "../../common/models/mythologies.models";
import {
  CoinsTransactions,
  OrbsTransactions,
} from "../../common/models/transactions.models";
import mongoose from "mongoose";
import { fofGameData } from "../../common/models/game.model";
import {
  mintQuestPackets,
  registerFOFQuestCmpl,
} from "../../common/services/icp.services";

export const claimQuest = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const quest = req.quest;
    const requiredOrbs = quest.requiredOrbs;
    const mythData = req.mythData;

    // Add to claimed quests
    const updatedGameData = await fofGameData.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          claimedQuests: { taskId: new mongoose.Types.ObjectId(quest.taskId) },
        },
      },
      { upsert: true, new: true }
    );

    if (updatedGameData.claimedQuests.length >= 12 && user.principalId) {
      const registered = await registerFOFQuestCmpl(user, mythData.name);

      if (!registered) {
        console.warn(
          `Quest completion registration failed for user ${user.principalId}, mythology: ${mythData.name}`
        );

        return res.status(500).json({
          message: "Failed to register quest completion.",
        });
      }

      console.log(
        `Quest completion registered successfully for user ${user.principalId}, mythology: ${mythData.name}`
      );
    }

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

export const claimQuestPacket = async (req, res) => {
  try {
    const user = req.user;
    const userGameData = req.userGameData;
    const { mythologyName } = req.body;

    if (!user?.principalId) {
      return res.status(400).json({ message: "User principal ID missing." });
    }

    const mintResult: any = await mintQuestPackets(user, mythologyName);

    if (mintResult?.err) {
      return res.status(400).json({
        message: "Failed to mint quest packet.",
        error: mintResult.err,
      });
    }

    if (mintResult?.ok !== 0) {
      return res.status(500).json({
        message: "Minting quest packet failed unexpectedly.",
        result: mintResult,
      });
    }

    await userGameData.updateOne({
      $push: {
        mintedPackets: mythologyName,
      },
    });

    return res.status(200).json({
      message: "Quest claimed successfully.",
      result: mintResult,
    });
  } catch (error) {
    console.error("claimQuestPacket error:", error);
    return res.status(500).json({
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
    await fofGameData.findOneAndUpdate(
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
    await fofGameData.updateOne(
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
