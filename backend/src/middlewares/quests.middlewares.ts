import mongoose from "mongoose";
import userMythologies from "../models/mythologies.models";
import { areObjectsEqual } from "../utils/compareObjects";
import { questAggregator } from "../services/quest.services";

// 46ms
// export const testValidQuest = async (req, res, next) => {
//   try {
//     const { questId } = req.body;
//     const userId = req.user;

//     // Check if the questId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(questId)) {
//       throw new Error("Invalid quest ID.");
//     }

//     const result = await questAggregator(userId, questId);
//     console.log(result);

//     res.status(200).json({ message: "hllo" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// 20ms
export const verifyValidQuest = async (req, res, next) => {
  try {
    const { questId } = req.body;
    const userId = req.user;

    // Check if the questId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(questId)) {
      throw new Error("Invalid quest Id.");
    }

    const validQuest = await questAggregator(userId, questId);
    console.log(validQuest);

    // Check if the questId exists
    if (!validQuest) {
      return res.status(404).json({ message: "Quest not found." });
    }

    // Check if user has already claimed this quest
    if (validQuest.isClaimed) {
      throw new Error("Quest already claimed.");
    }

    // Check if user has enough orbs
    const orbValues = {};

    const userOrbsData = await userMythologies.findOne({ userId: userId });

    userOrbsData.mythologies.forEach((mythology) => {
      orbValues[mythology.name] = mythology.orbs;
    });

    if (!areObjectsEqual(orbValues, validQuest.requiredOrbs)) {
      throw new Error("Insufficient orbs to claim this quest.");
    }

    req.quest = validQuest;
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyCompletedQuest = async (req, res, next) => {
  try {
    const userId = req.user;
    const { questId } = req.body;

    const validCompletedQuest = await questAggregator(userId, questId);

    // Check if task is not completed
    if (!validCompletedQuest) {
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
