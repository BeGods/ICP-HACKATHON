import milestones, { IClaimedReward } from "../models/milestones.models";

export const validDailyBonusReq = async (req, res, next) => {
  try {
    const user = req.user;
    const dailyBonusClaimed = user.dailyBonusClaimedAt;
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
    const dailyBonusClaimed = user.dailyBonusClaimedAt;
    const exploitCount = user.exploitCount;
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

    if (user.joiningBonus) {
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
    const now = new Date();
    const lastClaimedDate = new Date(user.streakBonus);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const lastClaimedMidnight = new Date(
      lastClaimedDate.getFullYear(),
      lastClaimedDate.getMonth(),
      lastClaimedDate.getDate()
    );

    // edge case : 0
    if (user.streakBonus === 0) {
      user.streakBonus = Date.now();
      next();
      return;
    }

    // check if already claimed today
    if (lastClaimedMidnight.getTime() === today.getTime()) {
      throw new Error("You have already claimed the streak bonus today.");
    }

    // check if it was claimed yesterday
    if (
      lastClaimedMidnight.getTime() !== yesterday.getTime() &&
      yesterday.getTime() != 0
    ) {
      throw new Error(
        "You are not eligible to claim. Streak must be continuous."
      );
    }

    user.streakBonus = Date.now();
    next();
  } catch (error) {
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

    if (partnerReward.tokensCollected !== 12 && partnerReward.isClaimed) {
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
