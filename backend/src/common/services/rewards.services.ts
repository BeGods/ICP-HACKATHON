import mongoose from "mongoose";
import milestones from "../models/milestones.models";
import rewards from "../models/rewards.models";
import { OrbsTransactions } from "../models/transactions.models";
import userMythologies from "../models/mythologies.models";

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

export const validateInviteReward = async (user) => {
  try {
    // check valid invite
    if (!user.directReferralCount || user.directReferralCount < 6) {
      throw new Error("Failed to verify. Please complete the mission.");
    }

    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
