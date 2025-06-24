import mongoose from "mongoose";
import {
  validateBurstReward,
  validateInviteReward,
  validateMultiOrbReward,
} from "../services/missions.services";
import milestones from "../models/milestones.models";
import rewards from "../models/rewards.models";

export const validateFoFEnd = async (req, res, next) => {
  const user = req.user;

  try {
    if (user.gameCompletedAt.hasClaimedFoFRwrd) {
      throw new Error("FOF Finish reward has been already claimed");
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to validate user.",
      error: error.message,
    });
  }
};

export const validateWithdrawBal = async (req, res, next) => {
  const user = req.user;
  const { type } = req.body;
  const amount = user.holdings[type] ?? 0;

  try {
    // chekc valid balance
    if (type === "usdt" && amount < 1) {
      throw new Error(`Failed to withdraw. Atleast need 1 ${type}.`);
    }

    if (type !== "usdt" && amount < 10) {
      throw new Error(`Failed to withdraw. Atleast need 10 ${type}.`);
    }

    // check wallet connected
    if (!user.kaiaAddress) {
      throw new Error(`Failed to withdraw. Wallet not connected.`);
    }

    req.amount = amount;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      error: error.message,
    });
  }
};

export const validateValidMsn = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;
    const { rewardId, paymentType } = req.body;

    // valid rewardId
    if (!mongoose.Types.ObjectId.isValid(rewardId)) {
      throw new Error("Invalid reward Id.");
    }

    // check valid reward
    const rewardDetails = await rewards.findOne({
      _id: new mongoose.Types.ObjectId(rewardId),
    });

    if (!rewardDetails) {
      throw new Error("Invalid reward.");
    }

    // check if rewards already claimed
    const userMilestones = await milestones.findOne({
      userId: user._id,
    });
    const rewardExists = userMilestones.rewards.monetaryRewards.find(
      (itm) => itm.rewardId.toString() == rewardId.toString()
    );

    if (rewardExists) {
      throw new Error("Reward already claimed.");
    }

    if (rewardDetails.limit <= 0) {
      throw new Error("Reward has reached its quota");
    }

    // checl valid payment type
    if (!rewardDetails.paymentType?.includes(paymentType?.toUpperCase())) {
      throw new Error("Invalid payment type.");
    }

    // validate action
    const conversionMsnId = new mongoose.Types.ObjectId(
      "6848818c7c77e14a7262bbc9"
    );
    const playMsnId = new mongoose.Types.ObjectId("684882aa7c77e14a7262bbcc");
    const burstMsnId = new mongoose.Types.ObjectId("6848842225befb7c13c9dcaa");
    const inviteSixMsnId = new mongoose.Types.ObjectId(
      "684deac96a2ad7c99d758973"
    );
    const inviteTwelveMsnId = new mongoose.Types.ObjectId(
      "685111495e5f4cc871608299"
    );
    const inviteEighteenMsnId = new mongoose.Types.ObjectId(
      "6854f8053caa936e11321a6f"
    );
    const inviteThirtySixMsnId = new mongoose.Types.ObjectId(
      "68586fc397c39c48458214a7"
    );

    // validate mission action
    if (rewardDetails._id.toString() === conversionMsnId.toString()) {
      await validateMultiOrbReward(userId);
    } else if (rewardDetails._id.toString() === burstMsnId.toString()) {
      await validateBurstReward(userId);
    } else if (rewardDetails._id.toString() === playMsnId.toString()) {
      return res.status(400).json({ message: "Coming Soon" });
    } else if (rewardDetails._id.toString() === inviteSixMsnId.toString()) {
      await validateInviteReward(user, 6);
    } else if (rewardDetails._id.toString() === inviteTwelveMsnId.toString()) {
      await validateInviteReward(user, 12);
    } else if (
      rewardDetails._id.toString() === inviteThirtySixMsnId.toString()
    ) {
      await validateInviteReward(user, 36);
    } else if (
      rewardDetails._id.toString() === inviteEighteenMsnId.toString()
    ) {
      await validateInviteReward(user, 18);
    } else {
      return res.status(400).json({ message: "Invalid rewardId." });
    }

    req.rewardDetails = rewardDetails;
    req.userMilestones = userMilestones;
    next();
  } catch (error) {
    console.log(error);
  }
};
