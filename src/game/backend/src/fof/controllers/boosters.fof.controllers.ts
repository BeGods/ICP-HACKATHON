import userMythologies from "../../common/models/mythologies.models";
import { OrbsTransactions } from "../../common/models/transactions.models";
import { isWithinOneMinute } from "../../helpers/game.helpers";
import { Document } from "mongodb";
import {
  getAutomataStartTimes,
  getBurstStartTimes,
  getShortestStartTime,
} from "../../helpers/booster.helpers";

// alchemist booster
export const claimAlchemist = async (req, res) => {
  try {
    const userId = req.user;
    const userMyth = req.userMyth;
    const deductValue = req.deductValue;

    userMyth.boosters.shardslvl = Math.min(userMyth.boosters.shardslvl + 2, 99);
    userMyth.boosters.isShardsClaimActive = false;
    userMyth.boosters.shardsLastClaimedAt = Date.now();

    const updatedMythData = (await userMythologies
      .findOneAndUpdate(
        { userId, "mythologies.name": userMyth.name },
        {
          $inc: { multiColorOrbs: deductValue },
          $set: { "mythologies.$": userMyth },
        },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt")) as Document;

    const updatedBoosterData = updatedMythData.mythologies.filter(
      (item) => item.name === userMyth.name
    )[0].boosters;

    // orb transaction
    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "alchemist",
      orbs: { MultiOrb: deductValue == 0 ? 0 : 1 },
    });
    await newOrbsTransaction.save();

    res.status(200).json({
      message: "Booster claimed successfully.",
      updatedBooster: updatedBoosterData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to claim alchemist.",
      error: error.message,
    });
  }
};

// automata booster
export const claimAutomata = async (req, res) => {
  try {
    const { user, userMyth, mythData, deductValue, userGameData } = req;
    const now = Date.now();

    let autoPayLock = -1;

    userMyth.boosters.automatalvl = Math.min(
      userMyth.boosters.automatalvl + 2,
      99
    );
    userMyth.boosters.isAutomataActive = true;
    userMyth.boosters.automataLastClaimedAt = now;
    userMyth.boosters.automataStartTime = now;
    const automataStartTimes = getAutomataStartTimes(mythData.mythologies);
    automataStartTimes.push(now);

    // activate when claimed in
    if (!userGameData.isAutomataAutoPayEnabled) {
      if (isWithinOneMinute(automataStartTimes)) {
        userGameData.isAutomataAutoPayEnabled = true;
      }
    }

    if (automataStartTimes.length === 5) {
      autoPayLock = getShortestStartTime(automataStartTimes);
    }

    const updatedMythData = await userMythologies
      .findOneAndUpdate(
        { userId: user, "mythologies.name": userMyth.name },
        {
          $inc: { multiColorOrbs: deductValue },
          $set: {
            "mythologies.$": userMyth,
          },
        },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt -_id");

    await userGameData.updateOne({
      $set: {
        isAutomataAutoPayEnabled: userGameData.isAutomataAutoPayEnabled,
      },
    });

    const updatedBoosterData = updatedMythData.mythologies.find(
      (item) => item.name === userMyth.name
    ).boosters;

    await new OrbsTransactions({
      userId: user,
      source: "automata",
      orbs: { MultiOrb: deductValue == 0 ? 0 : 1 },
    }).save();

    res.status(200).json({
      message: "Automata claimed successfully.",
      updatedBooster: updatedBoosterData,
      autoPayLock: autoPayLock,
    });
  } catch (error) {
    console.error("Claim automata error:", error);
    res.status(500).json({
      message: "Failed to claim automata.",
      error: error.message,
    });
  }
};

// star booster
export const claimBurst = async (req, res) => {
  try {
    const userId = req.user._id;
    const userMyth = req.userMyth;
    const mythData = req.mythData;
    const now = Date.now();
    let userGameData = req.userGameData;

    userMyth.boosters.burstlvl = Math.min(userMyth.boosters.burstlvl + 2, 99);
    userMyth.boosters.isBurstActive = true;
    userMyth.boosters.isBurstActiveToClaim = false;
    userMyth.boosters.burstActiveAt = Date.now();

    const burstStartTimes = getBurstStartTimes(mythData.mythologies);
    burstStartTimes.push(now);

    // activate when claimed in
    if (!userGameData.isBurstAutoPayEnabled) {
      if (isWithinOneMinute(burstStartTimes)) {
        userGameData.isBurstAutoPayEnabled = true;
      }
    }

    const updatedMythData = (await userMythologies
      .findOneAndUpdate(
        { userId, "mythologies.name": userMyth.name },
        {
          $inc: { multiColorOrbs: -3 },
          $set: {
            "mythologies.$": userMyth,
          },
        },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt _id")) as Document;

    await userGameData.updateOne({
      $set: {
        isBurstAutoPayEnabled: userGameData.isBurstAutoPayEnabled ?? false,
      },
    });

    const updatedBoosterData = updatedMythData.mythologies.filter(
      (item) => item.name === userMyth.name
    )[0].boosters;

    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "burst",
      orbs: { MulitOrb: 3 },
    });

    await newOrbsTransaction.save();

    res.status(200).json({
      message: "Burst claimed successfully.",
      updatedBooster: updatedBoosterData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to claim burst.",
      error: error.message,
    });
  }
};

// (multiple) star booster
export const claimMultiBurst = async (req, res) => {
  try {
    const userId = req.user._id;
    const { deductValue, userGameData } = req;

    const userMyth = await userMythologies.findOne({ userId: userId });

    userMyth.mythologies.forEach((mythology) => {
      mythology.boosters.isBurstActive = true;
    });

    await userMythologies
      .findOneAndUpdate(
        { userId: userId },
        {
          $inc: { multiColorOrbs: deductValue },
          $set: {
            mythologies: userMyth.mythologies,
          },
        },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt -_id");

    await userGameData.updateOne({
      $set: {
        burstAutoPayExpiration: Date.now(),
      },
    });

    // maintain transaction
    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "multiBurst",
      orbs: { multiColorOrb: deductValue == 0 ? 0 : 9 },
    });
    await newOrbsTransaction.save();

    res.status(200).json({
      message: "Burst claimed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to claim multi burst.",
      error: error.message,
    });
  }
};

// (multiple) automata booster
export const claimMultiAutomata = async (req, res) => {
  try {
    const { user, mythData, deductValue } = req;
    const now = Date.now();

    mythData.mythologies.forEach((mythology) => {
      mythology.boosters.automatalvl = Math.min(
        mythology.boosters.automatalvl + 2,
        99
      );
      mythology.boosters.isAutomataActive = true;
      mythology.boosters.automataLastClaimedAt = now;
      mythology.boosters.automataStartTime = now;
    });

    await userMythologies
      .findOneAndUpdate(
        { userId: user._id },
        {
          $inc: { multiColorOrbs: deductValue },
          $set: {
            mythologies: mythData.mythologies,
          },
        },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt -_id");

    await new OrbsTransactions({
      userId: user,
      source: "multiAutomata",
      orbs: { MulitOrb: deductValue ? 0 : 3 },
    }).save();

    res.status(200).json({
      message: "Automata claimed successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to claim multi automata.",
      error: error.message,
    });
  }
};

// moon booster
export const claimMoon = async (req, res) => {
  try {
    const { user, deductValue, userGameData } = req;
    const now = Date.now();

    await userGameData
      .updateOne({
        $set: {
          lastMoonClaimAt: now,
        },
      })
      .select("-__v -createdAt -updatedAt -_id");

    await new OrbsTransactions({
      userId: user,
      source: "moon",
      orbs: { MultiOrb: deductValue == 0 ? 0 : 3 },
    }).save();

    res.status(200).json({
      message: "Moon Boost claimed successfully.",
    });
  } catch (error) {
    console.error("Moon Boost error:", error);
    res.status(500).json({
      message: "Failed to enable moon booster.",
      error: error.message,
    });
  }
};
