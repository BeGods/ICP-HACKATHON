import mongoose from "mongoose";
import userMythologies from "../models/mythologies.models";
import { areObjectsEqual } from "../utils/helpers/helpers";
import { questAggregator } from "../services/quest.fof.services";
import milestones from "../models/milestones.models";

export const verifyValidQuest = async (req, res, next) => {
  try {
    const { questId } = req.body;
    const userId = req.user._id;

    // Check if the questId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(questId)) {
      throw new Error("Invalid quest Id.");
    }

    const validQuest = await questAggregator(userId, questId);

    // Check if the questId exists
    if (!validQuest) {
      return res.status(404).json({ message: "Quest not found." });
    }

    // Check if user has already claimed this quest
    if (validQuest.isClaimed) {
      throw new Error("Quest already completed.");
    }

    // Check if user has enough orbs
    const orbValues = {};

    const userOrbsData = await userMythologies.findOne({ userId: userId });

    userOrbsData.mythologies.forEach((mythology) => {
      orbValues[mythology.name] = mythology.orbs;
    });

    // error if not match
    if (!areObjectsEqual(orbValues, validQuest.requiredOrbs)) {
      throw new Error("Insufficient orbs to claim this quest.");
    }

    const currMyth = userOrbsData.mythologies.filter(
      (item) => item.name === validQuest.mythology
    );

    req.quest = validQuest;
    req.mythData = currMyth;

    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

export const verifyCompletedQuest = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { questId } = req.body;

    const validCompletedQuest = await questAggregator(userId, questId);

    // Check if task is not completed
    if (!validCompletedQuest.isClaimed) {
      throw new Error("Please complete the quest to claim reward.");
    }

    // Check if reward already claimed
    if (validCompletedQuest.orbClaimed) {
      throw new Error("Reward already claimed.");
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyValidShareClaim = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { questId } = req.body;

    const validShareReq = await milestones.findOne({ userId: userId });

    // Check if task is not completed
    if (validShareReq) {
      const sharedQuestExists = validShareReq?.sharedQuests.includes(questId);

      // Check if reward already claimed
      if (sharedQuestExists) {
        throw new Error("Reward already claimed.");
      }
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// export const verifyValidLostQuest = async (req, res, next) => {
//   try {
//     const { questId } = req.body;
//     const userId = req.user._id;

//     // Check if the questId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(questId)) {
//       throw new Error("Invalid quest Id.");
//     }

//     const validQuest = await questAggregator(userId, questId);

//     // Check if the questId exists
//     if (!validQuest) {
//       return res.status(404).json({ message: "Quest not found." });
//     }

//     // Check if user has already claimed this quest
//     if (validQuest.isClaimed) {
//       throw new Error("Quest already claimed.");
//     }

//     // Check if user has enough orbs
//     const orbValues = {};

//     const userOrbsData = await userMythologies.findOne({ userId: userId });

//     if (userOrbsData.multiColorOrbs < 1) {
//       throw new Error("Insufficient multiColorOrbs to claim this booster.");
//     }

//     userOrbsData.mythologies.forEach((mythology) => {
//       orbValues[mythology.name] = mythology.orbs;
//     });

//     if (!areObjectsEqual(orbValues, validQuest.requiredOrbs)) {
//       throw new Error("Insufficient orbs to claim this quest.");
//     }

//     req.quest = validQuest;
//     next();
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
