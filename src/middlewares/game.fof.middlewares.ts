import userMythologies from "../models/mythologies.models";
import { mythOrder } from "../utils/constants/variables";
import config from "../config/config";
import { hasBeenFourDaysSinceClaimedUTC } from "../helpers/game.helpers";
import {
  checkAutomataStatus,
  validateBooster,
} from "../helpers/booster.helpers";
import {
  aggregateConvStats,
  filterDataByMyth,
} from "../services/game.fof.services";
import { decryptHash } from "../helpers/security";
import { IMyth, IUserMyths } from "../ts/models.interfaces";

export const validateAlchemist = async (req, res, next) => {
  try {
    const userId = req.user;
    const { mythologyName, adId } = await decryptHash(req.body.data);

    if (!mythologyName) {
      throw new Error("Mythology name is required.");
    }

    const { mythData, userMythology } = await filterDataByMyth(
      mythologyName,
      userId
    );

    if (!mythData.boosters.isShardsClaimActive) {
      mythData.boosters = validateBooster(mythData.boosters);
      console.log(mythData);

      if (!mythData.boosters.isShardsClaimActive) {
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
    if (userMythology.multiColorOrbs < 1 && !adId) {
      throw new Error("Insufficient multiColorOrbs to claim this booster.");
    }

    if (adId) {
      req.deductValue = 0;
    } else {
      req.deductValue = -1;
    }
    req.userMyth = mythData;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validateAutomata = async (req, res, next) => {
  try {
    const userId = req.user;
    const { mythologyName, adId } = await decryptHash(req.body.data);

    const { mythData, userMythology } = await filterDataByMyth(
      mythologyName,
      userId
    );

    if (mythData.boosters.isAutomataActive) {
      mythData.boosters = checkAutomataStatus(mythData);

      if (mythData.boosters.isAutomataActive) {
        throw new Error("Automata is already active. Try again later.");
      }
    }

    if (adId && String(adId) !== String(config.adsgram.AD_BOOSTER_ID)) {
      throw new Error("Invalid ad request.");
    }

    // Check sufficient orbs to claim automata
    if (userMythology.multiColorOrbs < 1 && !adId) {
      throw new Error("Insufficient multiColorOrbs to claim this automata.");
    }

    if (adId) {
      req.deductValue = 0;
    } else {
      req.deductValue = -1;
    }
    req.userMyth = mythData;
    req.mythData = userMythology;
    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
};

export const validAutoAutomataReq = async (req, res, next) => {
  try {
    const userId = req.user;
    const { mythologyName, adId } = await decryptHash(req.body.data);

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
    if (userMythologiesData.multiColorOrbs < 9 && !adId) {
      throw new Error("Insufficient multiColorOrbs to claim this automata.");
    }

    if (adId && String(adId) !== String(config.adsgram.AD_BOOSTER_ID)) {
      throw new Error("Invalid ad request.");
    }

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

export const validateMultiBurst = async (req, res, next) => {
  try {
    const userId = req.user;
    const { mythologyName, adId } = await decryptHash(req.body.data);

    const userMythologiesData = (await userMythologies.findOne({
      userId,
    })) as IUserMyths;

    if (!userMythologiesData) {
      throw new Error("Game data not found.");
    }

    if (!userMythologiesData.autoPay.isBurstAutoPayEnabled) {
      return res
        .status(400)
        .json({ message: `You are not eligible for auto pay.` });
    }

    // Check sufficient orbs to claim automata
    if (userMythologiesData.multiColorOrbs < 3 && !adId) {
      throw new Error("Insufficient multiColorOrbs to claim this burst.");
    }

    if (adId && String(adId) !== String(config.adsgram.AD_BOOSTER_ID)) {
      throw new Error("Invalid ad request.");
    }

    const millisecondsIn24Hours = 24 * 60 * 60 * 1000;

    if (
      userMythologiesData.autoPay.burstAutoPayExpiration - Date.now() >
      millisecondsIn24Hours
    ) {
      throw new Error(
        "Your previous burst has not expired yet. Please try again later."
      );
    }

    if (adId) {
      req.deductValue = 0;
    } else {
      req.deductValue = -9;
    }
    req.mythData = userMythologiesData;

    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
};

export const validateBurst = async (req, res, next) => {
  try {
    const userId = req.user;
    const { mythologyName } = req.body;

    if (!mythologyName) {
      throw new Error("Mythology name is required.");
    }

    const { mythData, userMythology } = await filterDataByMyth(
      mythologyName,
      userId
    );

    if (
      !mythData.isEligibleForBurst ||
      !mythData.boosters.isBurstActiveToClaim
    ) {
      throw new Error("You are not eligible to buy burst. Try again later.");
    }

    if (mythData.boosters.isBurstActive) {
      throw new Error("Burst is already active. Try again later.");
    }

    // Check sufficient orbs to claim automata
    if (userMythology.multiColorOrbs < 3) {
      throw new Error("Insufficient multiColorOrbs to claim this burst.");
    }

    req.userMyth = mythData;
    req.mythData = userMythology;

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validateOrbsConversion = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { mythologyName, key, convertedOrbs } = req.body;

    const data = await aggregateConvStats(userId);

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

export const validateClaimMoon = async (req, res, next) => {
  try {
    const userId = req.user;
    const { mythologyName, adId } = await decryptHash(req.body.data);

    const userMythologiesData = (await userMythologies.findOne({
      userId,
    })) as IUserMyths;

    if (hasBeenFourDaysSinceClaimedUTC(userMythologiesData.lastMoonClaimAt)) {
      throw new Error(
        "Your previous boost has not expired yet. Please try again later."
      );
    }

    // Check sufficient orbs to claim automata
    if (userMythologiesData.multiColorOrbs < 1 && !adId) {
      throw new Error("Insufficient multiColorOrbs to claim this moon.");
    }

    if (adId && String(adId) !== String(config.adsgram.AD_BOOSTER_ID)) {
      throw new Error("Invalid ad request.");
    }

    if (adId) {
      req.deductValue = 0;
    } else {
      req.deductValue = -3;
    }
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

    const { mythData, userMythology } = await filterDataByMyth(
      mythologyName,
      userId
    );

    if (!mythData) {
      return res
        .status(404)
        .json({ message: `Mythology ${mythologyName} not found.` });
    }

    if (mythData.boosters.isBurstActive) {
      req.userMyth = mythData;
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

export const validateRatClaim = async (req, res, next) => {
  try {
    const userId = req.user;
    const { mythologyName } = req.body;

    const { mythData, userMythology } = await filterDataByMyth(
      mythologyName,
      userId
    );

    if (mythData.boosters.rats.count > 0) {
      req.userMyth = mythData;
      next();
    } else {
      throw new Error("You are not eligible to claim rat.");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
