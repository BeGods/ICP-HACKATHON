import mongoose from "mongoose";
import { IReward } from "../../ts/models.interfaces";
import { RewardsTransactions } from "../models/transactions.models";
import { io } from "../../config/socket";

export const updateTokenReward = async (
  user,
  milestones,
  reward,
  paymentType
) => {
  try {
    const token = paymentType;
    const validTokens = ["stars", "usdt", "kaia"];
    const rewardAmount = Number(reward.amount.toFixed(6));

    if (!token || !validTokens.includes(token)) {
      throw new Error("Invalid payment type.");
    }

    // add milestone
    await milestones.updateOne(
      {
        $push: {
          "rewards.monetaryRewards": {
            rewardId: reward._id,
            status: "pending",
            claimedAt: new Date(),
          },
        },
      },
      {
        upsert: true,
      }
    );

    // update balance
    await user.updateOne(
      {
        $inc: {
          [`holdings.${token}`]: rewardAmount,
        },
      },
      {
        upsert: true,
      }
    );

    // deduct slot
    await reward.updateOne({
      $inc: { limit: -1 },
    });

    io.emit("reward_limit_updated", {
      rewardId: reward._id,
      newLimit: reward.limit - 1,
    });

    const newTransaction = new RewardsTransactions({
      userId: user._id,
      rewardId: reward._id,
      type: token.toUpperCase(),
    });

    await newTransaction.save();

    return true;
  } catch (error) {
    console.log("Update Token Reward Error:", error);
    return false;
  }
};

export const initalizeWithdraw = async () => {
  try {
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const successPayment = async (userId, rewardId, transactionId) => {
  try {
    await RewardsTransactions.findOneAndUpdate(
      { userId: userId, rewardId: rewardId, status: "pending" },
      {
        $set: {
          status: "success",
        },
      },
      { new: true }
    );

    return true;
  } catch (error) {
    console.log(error);
  }
};

export const failedPayment = async (userId, rewardId) => {
  try {
    await RewardsTransactions.findOneAndUpdate(
      { userId: userId, "monetary.rewardId": rewardId },
      {
        $set: {
          "monetary.$.status": "failed",
        },
      },
      { new: true }
    );

    return true;
  } catch (error) {
    console.log(error);
  }
};
