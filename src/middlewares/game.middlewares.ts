import { validateAutomata, validateBooster } from "../services/game.services";
import userMythologies, {
  IMyth,
  IUserMyths,
} from "../models/mythologies.models";

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

export const validateOrbsConversion = async (req, res, next) => {
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

    if (requestedMyth.orbs < 2) {
      throw new Error("Insufficient orbs to make this transaction.");
    }

    req.userMyth = requestedMyth;

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
