import { OrbsTransactions } from "../models/transactions.models";
import userMythologies from "../models/mythologies.models";
import partners from "../models/partners.models";
import rewards from "../models/rewards.models";
import milestones from "../models/milestones.models";

export const validateMultiOrbReward = async (userId) => {
  try {
    // check valid transaction
    const convTransaction = await OrbsTransactions.findOne({
      userId: userId,
      source: "conversion",
    });

    if (!convTransaction) {
      throw new Error("Failed to verify. Please complete the mission.");
    }

    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const validateBurstReward = async (userId) => {
  try {
    // check valid transaction
    const userMyth = await userMythologies.findOne({ userId: userId });

    if (!userMyth) {
      throw new Error("Failed to game data.");
    }

    const isAutoBurstActive = userMyth.mythologies?.some(
      (myth) => myth.boosters.isBurstActiveToClaim === true
    );

    if (!isAutoBurstActive) {
      throw new Error("Failed to verify. Please complete the mission.");
    }

    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const validateInviteReward = async (user, num) => {
  try {
    // check valid invite
    if (!user.directReferralCount || user.directReferralCount < num) {
      throw new Error("Failed to verify. Please complete the mission.");
    }

    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const fetchUserRewards = async (userId) => {
  try {
    const [activePartners, activeRewards] = await Promise.all([
      partners
        .find({ status: true })
        .lean()
        .select("-__v -createdAt -updatedAt"),
      rewards
        .find({ status: true })
        .lean()
        .select("-__v -createdAt -updatedAt"),
    ]);

    let userMilestones = await milestones.findOne({ userId });

    const result = {
      activePartners,
      activeRewards,
      userMilestones,
    };

    return result;
  } catch (error) {}
};

export const updatePartnersInLastHr = async (userMilestones) => {
  try {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const timeElapsed = now - userMilestones.rewards.lastResetAt;

    if (userMilestones.rewards.lastResetAt === 0 || timeElapsed > oneHour) {
      userMilestones.updateOne({
        $set: {
          "rewards.rewardsInLastHr": [],
          "rewards.lastResetAt": now,
        },
      });
    }

    return userMilestones;
  } catch (error) {
    throw new Error(error.message);
  }
};
