import {
  fetchUserData,
  validateAutomata,
  validateBooster,
} from "../services/game.services";
import userMythologies, {
  IMyth,
  IUserMyths,
} from "../models/mythologies.models";
import { calculateAutomataEarnings } from "../utils/helpers/game.helpers";
import { mythOrder } from "../utils/constants/variables";

export const validShardsBoosterReq = async (req, res, next) => {
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

    // Check sufficient orbs to claim booster
    if (userMythologiesData.multiColorOrbs < 1) {
      throw new Error("Insufficient multiColorOrbs to claim this booster.");
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

    if (requestedMyth.boosters.isAutomataActive) {
      requestedMyth = validateAutomata(requestedMyth);

      if (requestedMyth.boosters.isAutomataActive) {
        throw new Error("Automata is already active. Try again later.");
      }
    }

    // Check sufficient orbs to claim automata
    if (userMythologiesData.multiColorOrbs < 1) {
      throw new Error("Insufficient multiColorOrbs to claim this automata.");
    }

    req.userMyth = requestedMyth;
    next();
  } catch (error) {
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

// export const validateOrbsConversion = async (req, res, next) => {
//   try {
//     const userId = req.user;
//     const { mythologyName } = req.body;

//     const userMythologiesData = (await userMythologies.findOne({
//       userId,
//     })) as IUserMyths;

//     if (!userMythologiesData) {
//       throw new Error("User mythologies not found.");
//     }

//     const requestedMyth = userMythologiesData.mythologies.find(
//       (item) => item.name === mythologyName
//     ) as IMyth;

//     if (requestedMyth.orbs < 2) {
//       throw new Error("Insufficient orbs to make this transaction.");
//     }

//     req.userMyth = requestedMyth;

//     next();
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

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

    requestedMyth.shards += calculateAutomataEarnings(
      requestedMyth.boosters.automataLastClaimedAt,
      requestedMyth.boosters.automatalvl
    );

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
