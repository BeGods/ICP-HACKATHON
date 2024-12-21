import {
  fetchUserData,
  validateAutomata,
  validateBooster,
} from "../services/game.fof.services";
import userMythologies, {
  IMyth,
  IUserMyths,
} from "../models/mythologies.models";
import { mythOrder } from "../utils/constants/variables";
import config from "../config/config";
import CryptoJs from "crypto-js";

export const validShardsBoosterReq = async (req, res, next) => {
  try {
    const userId = req.user;
    const secretKey = config.security.HASH_KEY;
    const hashedData = req.body.data;
    const decryptedData = CryptoJs.AES.decrypt(hashedData, secretKey);
    const { mythologyName, adId } = JSON.parse(
      decryptedData.toString(CryptoJs.enc.Utf8)
    );

    if (!mythologyName) {
      throw new Error("Mythology name is required.");
    }

    const userMythologiesData = (await userMythologies.findOne({
      userId,
    })) as IUserMyths;

    if (!userMythologiesData) {
      throw new Error("User mythologies not found.");
    }

    const requestedMyth = userMythologiesData.mythologies.find(
      (item) => item.name === mythologyName
    ) as IMyth;

    if (!requestedMyth) {
      return res
        .status(404)
        .json({ message: `Mythology ${mythologyName} not found.` });
    }

    if (!requestedMyth.boosters.isShardsClaimActive) {
      requestedMyth.boosters = validateBooster(requestedMyth.boosters);
      console.log(requestedMyth);

      if (!requestedMyth.boosters.isShardsClaimActive) {
        throw new Error(
          "Booster activation failed. Please try to multiply your shards tapping power later."
        );
      }
    }

    // validate ad
    if (adId && String(adId) !== String(config.adsgram.AD_BOOSTER_ID)) {
      throw new Error("Invalid ad request.");
    }

    // Check sufficient orbs to claim booster
    if (userMythologiesData.multiColorOrbs < 1 && !adId) {
      throw new Error("Insufficient multiColorOrbs to claim this booster.");
    }

    if (adId) {
      req.deductValue = 0;
    } else {
      req.deductValue = -1;
    }
    req.userMyth = requestedMyth;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validAutomataReq = async (req, res, next) => {
  try {
    const userId = req.user;
    const secretKey = config.security.HASH_KEY;

    const hashedData = req.body.data;

    const decryptedData = CryptoJs.AES.decrypt(hashedData, secretKey);

    const { mythologyName, adId } = JSON.parse(
      decryptedData.toString(CryptoJs.enc.Utf8)
    );

    if (!mythologyName) {
      throw new Error("Mythology name is required.");
    }

    const userMythologiesData = (await userMythologies.findOne({
      userId,
    })) as IUserMyths;

    if (!userMythologiesData) {
      throw new Error("Insufficient orbs to claim automata.");
    }

    let requestedMyth = userMythologiesData.mythologies.find(
      (item) => item.name === mythologyName
    ) as IMyth;

    if (!requestedMyth) {
      return res
        .status(404)
        .json({ message: `Mythology ${mythologyName} not found.` });
    }

    if (requestedMyth.boosters.isAutomataActive) {
      requestedMyth = validateAutomata(requestedMyth);

      if (requestedMyth.boosters.isAutomataActive) {
        throw new Error("Automata is already active. Try again later.");
      }
    }

    if (adId && String(adId) !== String(config.adsgram.AD_BOOSTER_ID)) {
      throw new Error("Invalid ad request.");
    }

    // Check sufficient orbs to claim automata
    if (userMythologiesData.multiColorOrbs < 1 && !adId) {
      throw new Error("Insufficient multiColorOrbs to claim this automata.");
    }

    if (adId) {
      req.deductValue = 0;
    } else {
      req.deductValue = -1;
    }
    req.userMyth = requestedMyth;
    req.mythData = userMythologiesData;
    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
};

export const validAutoAutomataReq = async (req, res, next) => {
  try {
    const userId = req.user;
    const secretKey = config.security.HASH_KEY;

    const hashedData = req.body.data;

    const decryptedData = CryptoJs.AES.decrypt(hashedData, secretKey);

    const { adId } = JSON.parse(decryptedData.toString(CryptoJs.enc.Utf8));

    const userMythologiesData = (await userMythologies.findOne({
      userId,
    })) as IUserMyths;

    if (!userMythologiesData) {
      throw new Error("Insufficient orbs to claim automata.");
    }

    if (!userMythologiesData.autoPay.isAutomataAutoPayEnabled) {
      return res
        .status(404)
        .json({ message: `You are not eligible for auto pay.` });
    }

    // Check sufficient orbs to claim automata
    if (userMythologiesData.multiColorOrbs < 3 && !adId) {
      throw new Error("Insufficient multiColorOrbs to claim this automata.");
    }

    if (adId && String(adId) !== String(config.adsgram.AD_BOOSTER_ID)) {
      throw new Error("Invalid ad request.");
    }

    // const millisecondsIn24Hours = 24 * 60 * 60 * 1000;

    // if (
    //   userMythologiesData.autoPay.automataAutoPayExpiration - Date.now() >
    //   millisecondsIn24Hours
    // ) {
    //   throw new Error(
    //     "Your previous automata has not expired yet. Please try again later."
    //   );
    // }

    if (adId) {
      req.deductValue = 0;
    } else {
      req.deductValue = -3;
    }

    req.mythData = userMythologiesData;

    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
};

export const validateBurstReq = async (req, res, next) => {
  try {
    const userId = req.user;
    const { mythologyName } = req.body;

    if (!mythologyName) {
      throw new Error("Mythology name is required.");
    }

    const userMythologiesData = (await userMythologies.findOne({
      userId,
    })) as IUserMyths;

    if (!userMythologiesData) {
      throw new Error("Insufficient orbs to claim automata.");
    }

    let requestedMyth = userMythologiesData.mythologies.find(
      (item) => item.name === mythologyName
    ) as IMyth;

    if (!requestedMyth) {
      return res
        .status(404)
        .json({ message: `Mythology ${mythologyName} not found.` });
    }

    if (
      !requestedMyth.isEligibleForBurst ||
      !requestedMyth.boosters.isBurstActiveToClaim
    ) {
      throw new Error("You are not eligible to buy burst. Try again later.");
    }

    if (requestedMyth.boosters.isBurstActive) {
      throw new Error("Burst is already active. Try again later.");
    }

    // Check sufficient orbs to claim automata
    if (userMythologiesData.multiColorOrbs < 3) {
      throw new Error("Insufficient multiColorOrbs to claim this burst.");
    }

    req.userMyth = requestedMyth;

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validateOrbsConversion = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { mythologyName, key, convertedOrbs } = req.body;

    const data = await fetchUserData(userId);

    const quests = data[0].quests.map((quest) => ({
      ...quest,
      isQuestClaimed:
        quest.isQuestClaimed !== undefined ? quest.isQuestClaimed : false,
    }));

    const completedQuests = quests.filter(
      (item) => item.isQuestClaimed === true && !item.isKeyClaimed
    );

    let towerKeys = null;

    if (towerKeys) {
      towerKeys = completedQuests?.map((item) => {
        const indexes = Object.keys(item.requiredOrbs)
          .map((myth) => mythOrder.indexOf(myth))
          .join("");

        return indexes;
      });
    }

    const towerId = completedQuests?.map((item) => item._id);

    const requestedMyth = data[0].mythologies.find(
      (item) => item.name === mythologyName
    ) as IMyth;

    // check valid number of orbs
    if (requestedMyth.orbs < convertedOrbs) {
      throw new Error("Insufficient orbs to make this transaction.");
    }

    // check if exists in claimedQuest
    if (towerKeys && key && towerKeys?.includes(key)) {
      req.isValidKey = towerId[towerKeys?.indexOf(key)];
    } else {
      req.isValidKey = null;
    }
    req.convertedOrbs = convertedOrbs;
    req.userMyth = data[0];

    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
};

export const validateStarClaim = async (req, res, next) => {
  try {
    const userId = req.user;
    const { mythologyName } = req.body;

    const userMythologiesData = (await userMythologies.findOne({
      userId,
    })) as IUserMyths;

    if (!userMythologiesData) {
      throw new Error("User mythologies not found.");
    }

    const requestedMyth = userMythologiesData.mythologies.find(
      (item) => item.name === mythologyName
    ) as IMyth;

    if (!requestedMyth) {
      return res
        .status(404)
        .json({ message: `Mythology ${mythologyName} not found.` });
    }

    if (requestedMyth.boosters.isBurstActive) {
      req.userMyth = requestedMyth;
      next();
    } else {
      throw new Error("You are not eligible to claim star bonus.");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validateAnnounceReward = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.announcements === 1) {
      throw new Error("Reward already claimed.");
    }

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
