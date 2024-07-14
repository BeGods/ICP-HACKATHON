import { calculateEnergy } from "../utils/game";
import userMythologies, {
  IMyth,
  IUserMyths,
} from "../models/mythologies.models";
import {
  OrbsTransactions,
  ShardsTransactions,
} from "../models/transactions.models";
import { validateBooster, validateAutomata } from "../services/game.services";

export const startTapSession = async (req, res) => {
  try {
    const userId = req.user;
    const { mythologyName } = req.query as { mythologyName?: string | null };

    const updatedMyth = {
      tapSessionStartTime: Date.now(),
    };

    // First, attempt to find and update the mythology
    let result = await userMythologies.findOneAndUpdate(
      { userId: userId, "mythologies.name": mythologyName },
      {
        $set: {
          "mythologies.$.tapSessionStartTime": updatedMyth.tapSessionStartTime,
        },
      },
      { new: true }
    );

    // If the mythology does not exist, insert a new mythology
    if (!result) {
      result = await userMythologies.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            mythologies: {
              name: mythologyName,
              tapSessionStartTime: updatedMyth.tapSessionStartTime,
              orbs: 0,
              lastTapAcitivityTime: Date.now(),
              shards: 0,
              energy: 1000,
              faith: 0,
              boosters: { shardslvl: 1 },
            },
          },
        },
        { new: true, upsert: true }
      );
    }

    res.status(200).json({ message: "Tap session has started." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimTapSession = async (req, res) => {
  try {
    const userId = req.user;
    let { taps, mythologyName } = req.body;

    // get mythDta
    const userMythology = (await userMythologies.findOne({
      userId: userId,
    })) as IUserMyths;

    if (!userMythology) {
      return res.status(404).json({ message: "User mythology not found." });
    }

    const mythData = userMythology.mythologies.find(
      (item) => item.name === mythologyName
    ) as IMyth;

    if (!mythData) {
      return res.status(404).json({ message: "Mythology not found." });
    }

    // check if session is valid
    if (mythData.tapSessionStartTime < mythData.lastTapAcitivityTime) {
      return res.status(400).json({ message: "Tap session has not started." });
    }

    // calculate energy
    const restoredEnergy = calculateEnergy(
      mythData.tapSessionStartTime,
      mythData.lastTapAcitivityTime,
      mythData.energy,
      mythData.energyLimit
    );

    // check if numberOfTaps are valid
    if (restoredEnergy < taps) {
      taps = restoredEnergy;
    }

    // update energy after tapping, shards, lastTapActivityTime
    const updatedEnergy = restoredEnergy - taps;
    const updatedShards = taps * mythData.boosters.shardslvl;

    // maintain transaction
    const newShardTransaction = new ShardsTransactions({
      userId: userId,
      source: "game",
      shards: updatedShards,
    });
    await newShardTransaction.save();

    // return status and update User
    const updatedUserMythology = await userMythologies.findOneAndUpdate(
      { userId: userId, "mythologies.name": mythologyName },
      {
        $set: {
          "mythologies.$.lastTapAcitivityTime": Date.now(),
          "mythologies.$.energy": updatedEnergy,
        },
        $inc: { "mythologies.$.shards": updatedShards },
      },
      { new: true }
    );

    if (!updatedUserMythology) {
      return res.status(500).json({ message: "Failed to update mythology." });
    }

    res.status(200).json({ message: "Tap session shards claimed." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getGameStats = async (req, res) => {
  try {
    const userId = req.user;
    const userMythologiesData = (await userMythologies.findOne({
      userId: userId,
    })) as IUserMyths;

    // Calculate and update energy for each mythology
    const updatedMythologies = userMythologiesData.mythologies.map(
      (mythology) => {
        const restoredEnergy = calculateEnergy(
          Date.now(),
          mythology.lastTapAcitivityTime,
          mythology.energy,
          mythology.energyLimit
        );

        // validate boosters
        mythology.boosters = validateBooster(mythology.boosters);
        if (mythology.boosters.isAutomataActive) {
          mythology = validateAutomata(mythology);
        }
        mythology.energy = restoredEnergy;
        mythology.lastTapAcitivityTime = Date.now();

        return mythology;
      }
    );

    await userMythologies.updateOne(
      { userId: userId },
      { $set: { mythologies: updatedMythologies } }
    );

    res.status(200).json({
      data: updatedMythologies,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimShardsBooster = async (req, res) => {
  try {
    const userId = req.user;
    const userMyth = req.userMyth;

    userMyth.orbs -= 1;
    userMyth.boosters.shardslvl += 1;
    userMyth.boosters.isShardsClaimActive = false;
    userMyth.boosters.shardsLastClaimedAt = Date.now();

    await userMythologies.updateOne(
      { userId, "mythologies.name": userMyth.name },
      { $set: { "mythologies.$": userMyth } }
    );

    // maintain transaction
    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "boosters",
      orbs: { [userMyth.name]: 1 },
    });
    await newOrbsTransaction.save();

    res.status(200).json({ message: "Booster claimed successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimAutomata = async (req, res) => {
  try {
    const userId = req.user;
    const userMyth = req.userMyth;

    userMyth.orbs -= 1;
    userMyth.boosters.isAutomataActive = true;
    userMyth.boosters.automataLastClaimedAt = Date.now();
    userMyth.boosters.automataStartTime = Date.now();

    await userMythologies.updateOne(
      { userId, "mythologies.name": userMyth.name },
      { $set: { "mythologies.$": userMyth } }
    );

    // maintain transaction
    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "automata",
      orbs: { [userMyth.name]: 1 },
    });
    await newOrbsTransaction.save();

    res.status(200).json({ message: "Automata claimed successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const convertOrbs = async (req, res) => {
  try {
    const userId = req.user;
    const userMyth = req.userMyth;

    userMyth.orbs -= 2;

    await userMythologies.updateOne(
      { userId, "mythologies.name": userMyth.name },
      { $set: { "mythologies.$": userMyth }, $inc: { multiColorOrbs: 1 } }
    );

    // maintain transaction
    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "conversion",
      orbs: { [userMyth.name]: 2 },
    });
    await newOrbsTransaction.save();

    res.status(200).json({ message: "Orbs converted successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
