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

    if (!paymentType) {
      throw new Error("Invalid payment type.");
    }

    // add to milestones
    await milestones.updateOne(
      {
        userId: user._id,
      },
      {
        $push: {
          "rewards.monetaryRewards": {
            rewardId: reward._id,
            claimedAt: new Date(),
          },
        },
      }
    );

    // update token balance
    await user.updateOne({
      $inc: {
        [token]: reward.amount,
      },
    });

    // register transaction
    const newTransaction = {
      rewardId: reward._id,
      type: token,
    };

    await RewardsTransactions.findOneAndUpdate(
      { userId: user._id },
      { $set: newTransaction },
      { upsert: true, new: true }
    );
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
