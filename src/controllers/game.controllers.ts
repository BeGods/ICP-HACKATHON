import User from "../models/user.models";
import userMythologies, {
  IMyth,
  IUserMyths,
} from "../models/mythologies.models";
import { calculateEnergy } from "../utils/game.utils";
import { ShardsTransactions } from "../models/transactions.models";

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
    console.log(error);
    res.status(500).json({ message: "An error occurred." });
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
      mythData.energy
    );

    // check if numberOfTaps are valid
    if (restoredEnergy < taps) {
      taps = restoredEnergy;
      console.log("taps during condition", taps);
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
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getGameStats = async (req, res) => {
  try {
    const userId = req.user;
    const profile = await User.findOne({ userId: userId });
    const gameData = await userMythologies.findOne({ userId: userId });
    res.status(200).json({
      data: {
        user: profile,
        stats: gameData,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
