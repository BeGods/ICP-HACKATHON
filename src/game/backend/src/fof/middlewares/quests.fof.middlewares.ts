import mongoose from "mongoose";
import userMythologies from "../../common/models/mythologies.models";
import { areObjectsEqual } from "../../helpers/general.helpers";
import { aggregateQuests } from "../services/quest.fof.services";
import { fofGameData } from "../../common/models/game.model";
import { mythOrder } from "../../utils/constants/variables";

export const verifyValidQuest = async (req, res, next) => {
  try {
    const { questId } = req.body;
    const userId = req.user._id;

    // Check if the questId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(questId)) {
      throw new Error("Invalid quest Id.");
    }

    const validQuest = await aggregateQuests(userId, questId);

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

    const userMythData = await userMythologies.findOne({ userId: userId });

    userMythData.mythologies.forEach((mythology) => {
      orbValues[mythology.name] = mythology.orbs;
    });

    // error if not match
    if (!areObjectsEqual(orbValues, validQuest.requiredOrbs)) {
      throw new Error("Insufficient orbs to claim this quest.");
    }

    const currMyth = userMythData.mythologies.filter(
      (item) => item.name === validQuest.mythology
    );

    req.quest = validQuest;
    req.mythData = currMyth[0];

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

    const validCompletedQuest = await aggregateQuests(userId, questId);

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

    const validShareReq = await fofGameData.findOne({ userId: userId });

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

export const verifyPakcetClaim = async (req, res, next) => {
  try {
    const { mythologyName } = req.body;
    const userId = req.user._id;

    const userGameData = await fofGameData.findOne({ userId: userId });
    const userMythData = await userMythologies.findOne({ userId: userId });

    // error if not match
    const currMyth = userMythData.mythologies.filter(
      (item) => item.name === mythologyName
    )[0];

    console.log(mythologyName);

    if (!mythOrder.includes(mythologyName)) {
      throw new Error("Invalid mythology name");
    }

    if (userGameData.mintedPackets.includes(mythologyName)) {
      throw new Error("Packet already claimed");
    }

    if (currMyth.faith < 12) {
      throw new Error(
        "Invlaid request you dont have enough faith to claim packet."
      );
    }

    req.mythData = currMyth;
    req.userGameData = userGameData;
    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};
