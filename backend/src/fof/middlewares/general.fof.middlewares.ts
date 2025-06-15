import { IClaimedReward } from "../../ts/models.interfaces";
import milestones from "../../common/models/milestones.models";
import userMythologies from "../../common/models/mythologies.models";
import mongoose from "mongoose";
import rewards from "../../common/models/rewards.models";
import {
  validateBurstReward,
  validateInviteReward,
  validateMultiOrbReward,
} from "../../common/services/rewards.services";

export const validDailyBonusReq = async (req, res, next) => {
  try {
    const user = req.user;
    const dailyBonusClaimed = user.bonus.fof.dailyBonusClaimedAt;
    const nowUtc = new Date();

    const startOfTodayUtc = new Date(
      Date.UTC(
        nowUtc.getUTCFullYear(),
        nowUtc.getUTCMonth(),
        nowUtc.getUTCDate(),
        0,
        0,
        0
      )
    );

    const endOfTodayUtc = new Date(
      Date.UTC(
        nowUtc.getUTCFullYear(),
        nowUtc.getUTCMonth(),
        nowUtc.getUTCDate(),
        23,
        59,
        59
      )
    );
    const validClaim =
      dailyBonusClaimed >= startOfTodayUtc &&
      dailyBonusClaimed <= endOfTodayUtc;

    if (validClaim) {
      throw Error("You have already claimed today's daily bonus!");
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const validDailyHackBonus = async (req, res, next) => {
  try {
    const user = req.user;
    const dailyBonusClaimed = user.bonus.fof.dailyBonusClaimedAt;
    const exploitCount = user.bonus.fof.exploitCount;
    const nowUtc = new Date();

    const startOfTodayUtc = new Date(
      Date.UTC(
        nowUtc.getUTCFullYear(),
        nowUtc.getUTCMonth(),
        nowUtc.getUTCDate(),
        0,
        0,
        0
      )
    );

    const endOfTodayUtc = new Date(
      Date.UTC(
        nowUtc.getUTCFullYear(),
        nowUtc.getUTCMonth(),
        nowUtc.getUTCDate(),
        23,
        59,
        59
      )
    );
    const validClaim =
      dailyBonusClaimed >= startOfTodayUtc &&
      dailyBonusClaimed <= endOfTodayUtc;

    // if not claimed today
    if (!validClaim) {
      req.isNotClaimedToday = true;
    }

    if (validClaim && exploitCount >= 7) {
      throw Error("You have already claimed today's daily bonus!");
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const validJoinBonusReq = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.bonus.fof.joiningBonus) {
      throw Error("You have already claimed joining bonus!");
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const validateStreakBonus = async (req, res, next) => {
  try {
    const user = req.user;
    const { bonus } = user;
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);

    const lastClaimedDate = new Date(bonus.fof.streak.claimedAt ?? new Date(0));
    lastClaimedDate.setUTCHours(0, 0, 0, 0);

    // already claimed today
    if (lastClaimedDate.getTime() === now.getTime()) {
      throw new Error("You are not eligible to claim the bonus today.");
    }

    // if not
    bonus.fof.streak.claimedAt = new Date().toISOString();
    next();
  } catch (error) {
    console.error("Error in validateStreakBonus:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const validPlaysuperRedeem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { rewardId } = req.body;

    const userMilestones = await milestones.findOne({ userId });

    if (!userMilestones) {
      throw new Error("Milestones not found for this user.");
    }

    const partnerReward = userMilestones.rewards.claimedRewards.find(
      (item) => item.partnerId === rewardId
    ) as IClaimedReward | undefined;

    if (!partnerReward) {
      throw new Error("You are not eligible to claim this reward.");
    }

    if (partnerReward.tokensCollected !== 4 && partnerReward.isClaimed) {
      throw new Error("You are not eligible to claim this reward.");
    }

    req.partner = partnerReward;
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const validMobileNo = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;

    if (mobileNumber.length < 10) {
      throw new Error("Invalid mobile number.");
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const validOnboardInput = async (req, res, next) => {
  try {
    const { mobileNumber, name, otp } = req.body;

    if (mobileNumber.length < 10) {
      throw new Error("Invalid mobile number.");
    }
    if (name.length === 0 || name == "" || !name) {
      throw new Error("Invalid name.");
    }

    if (otp.length === 0) {
      throw new Error("Invalid otp.");
    }
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const validPartnerRwrd = async (req, res, next) => {
  try {
    const { partnerId } = req.body;
    const user = req.user;

    const userMilestones = await milestones.findOne({ userId: user._id });

    const fetchedPartner = userMilestones.rewards.claimedRewards.find(
      (reward) => reward.partnerId.toString() === partnerId
    );

    if (!fetchedPartner.partnerId) {
      throw new Error("Invalid partnerId.");
    }

    if (fetchedPartner.tokensCollected < 4) {
      throw new Error("Invalid request. Please complete all part to claim.");
    }

    if (fetchedPartner.isClaimed) {
      throw new Error("Invalid request. Reward already claimed.");
    }

    req.partner = fetchedPartner;
    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

export const validateUserBet = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.userBetAt) {
      throw new Error("You have already placed your bet.");
    }
    if (user.gameCompletedAt.fof) {
      throw new Error("You are not eligible to bet.");
    }
    const userMythData = await userMythologies.findOne({ userId: user._id });
    if (!userMythData) {
      throw new Error("There was a problem fetching Mythology data.");
    }

    if (userMythData.blackOrbs < 1) {
      throw new Error("Insufficient black orbs to bet.");
    }

    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

export const validateValidReward = async (req, res, next) => {
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
    const inviteMsnId = new mongoose.Types.ObjectId("684deac96a2ad7c99d758973");

    // validate mission action
    if (rewardDetails._id.toString() === conversionMsnId.toString()) {
      await validateMultiOrbReward(userId);
    } else if (rewardDetails._id.toString() === burstMsnId.toString()) {
      await validateBurstReward(userId);
    } else if (rewardDetails._id.toString() === playMsnId.toString()) {
      return res.status(400).json({ message: "Coming Soon" });
    } else if (rewardDetails._id.toString() === inviteMsnId.toString()) {
      await validateInviteReward(user);
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
