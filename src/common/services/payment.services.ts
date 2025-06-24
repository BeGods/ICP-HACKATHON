import { RewardsTransactions } from "../models/transactions.models";

export const updateMntryRwrd = async (
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

    // io.emit("reward_limit_updated", {
    //   rewardId: reward._id,
    //   newLimit: reward.limit - 1,
    // });

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

import axios from "axios";
import config from "../../config/config";

const invoiceDetails = {
  automata: {
    title: "Automata Pack",
    description: "Claim Automata pack all at once for all mythologies.",
    currency: "XTR",
    amount: 1,
    photo_url: "https://i.postimg.cc/2yztL9mh/tg-star.png",
  },
  burst: {
    title: "Burst Pack",
    description: "Claim Burst pack all at once for all mythologies.",
    currency: "XTR",
    amount: 3,
    photo_url: "https://i.postimg.cc/2yztL9mh/tg-star.png",
  },
};

export const createTGStarInvoice = async (rewardType, uuid) => {
  const { title, description, currency, amount, payload, photo_url } =
    invoiceDetails[rewardType];
  const totalAmount = amount;

  const data = {
    title,
    description,
    payload,
    provider_token: "",
    photo_url,
    currency,
    prices: [{ label: title, amount: totalAmount }],
  };

  if (uuid) {
    data["payload"] = uuid;
  }

  try {
    const TELEGRAM_BOT_TOKEN = config.security.TMA_BOT_TOKEN;

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/createInvoiceLink`,
      data
    );
    return response.data.result;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw new Error("Failed to create invoice");
  }
};
