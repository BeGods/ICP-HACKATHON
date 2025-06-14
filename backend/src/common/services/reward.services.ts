import { IReward } from "../../ts/models.interfaces";
import { RewardsTransactions } from "../models/transactions.models";

export const updateTokenReward = async (
  user,
  milestones,
  reward: IReward,
  paymentType
) => {
  try {
    const token = paymentType;
    const validTokens = ["stars", "usdt", "kaia"];
    const precision = 1e6;
    const rewardAmount = Math.round(reward.amount * precision);

    if (!token || !validTokens?.includes(token)) {
      throw new Error("Invalid payment type.");
    }

    // add to milestones
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
        new: true,
      }
    );

    // update token balance
    await user.updateOne(
      {
        $inc: {
          [`holdings.${token}`]: rewardAmount,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    // register transaction
    const newTransaction = {
      rewardId: reward._id,
      type: token.toUpperCase(),
    };

    // deduct reward limit
    await reward.updateOne({
      $inc: {
        limit: -1,
      },
    });

    await RewardsTransactions.findOneAndUpdate(
      { userId: user._id },
      { $set: newTransaction },
      { upsert: true, new: true }
    );

    return true;
  } catch (error) {
    console.log(error);
  }
};

export const initalizeWithdraw = async (userId, rewardId) => {
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
