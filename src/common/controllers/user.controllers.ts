import { countries } from "../../utils/constants/country";
import { deleteImage, storeImage } from "../services/storage.services";
import axios from "axios";
import config from "../../config/config";
import { PaymentLogs } from "../models/transactions.models";
import userMythologies from "../models/mythologies.models";
import {
  updateMultiAutomata,
  updateMultiBurst,
} from "../../fof/services/boosters.fof.services";
import { verifyMessage } from "ethers";
import { getKaiaValue } from "../../helpers/crypt.helpers";
import { fetchKaiaValue } from "../services/redis.services";
import { v4 as uuidv4 } from "uuid";

export const connectTonWallet = async (req, res) => {
  try {
    const user = req.user;
    const { tonAddress } = req.body;

    if (tonAddress) {
      user.tonAddress = tonAddress;
      await user.save();
    }

    res.status(200).json({ message: "Ton wallet connected successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update ton wallet.",
      error: error.message,
    });
  }
};

export const disconnectTonWallet = async (req, res) => {
  try {
    const user = req.user;

    if (!user.tonAddress) {
      return res.status(400).json({ message: "Please connect your wallet." });
    }

    user.tonAddress = null;
    user.save();

    res.status(200).json({ message: "Ton wallet disconnected successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete ton wallet.",
      error: error.message,
    });
  }
};

export const connectLineWallet = async (req, res) => {
  try {
    const user = req.user;
    const { signature, message } = req.body;

    if (!signature || !message) {
      return res
        .status(400)
        .json({ message: "Please provide signed wallet details." });
    }

    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress) {
      user.kaiaAddress = recoveredAddress;
      await user.save();
    }

    res.status(200).json({ message: "Line wallet connected successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update ton wallet.",
      error: error.message,
    });
  }
};

export const disconnectLineWallet = async (req, res) => {
  try {
    const user = req.user;

    if (!user.kaiaAddress) {
      return res.status(400).json({ message: "Please connect your wallet." });
    }

    user.kaiaAddress = null;
    user.save();

    res.status(200).json({ message: "Line wallet disconnected successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete ton wallet.",
      error: error.message,
    });
  }
};

export const updateCountry = async (req, res) => {
  try {
    const user = req.user;
    const { country } = req.body;
    const isValidCountry = countries.find((item) => item.code == country);

    if (!isValidCountry) {
      return res.status(400).json({ message: "Invalid country code." });
    }

    if (country && country != user.country) {
      user.country = country;
      await user.save();
    }

    res.status(200).json({ message: "Country selected successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update country.",
      error: error.message,
    });
  }
};

export const updateAvatar = async (req, res) => {
  const user = req.user;

  if (user.profile.avatarUrl) {
    await deleteImage(user.profile.avatarUrl);
  }

  try {
    const profileImg = await storeImage(user);
    if (profileImg) {
      await user.updateOne({
        $set: {
          "profile.avatarUrl": profileImg.id,
          updatedAt: new Date().toISOString(),
        },
      });
      res.status(201).json({ avatarUrl: profileImg.id });
    } else {
      res.status(201).json({ avatarUrl: null });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile image.",
      error: error.message,
    });
  }
};

export const claimFinishRwrd = async (req, res) => {
  try {
    const user = req.user;

    await user.updateOne({
      $set: {
        "gameCompletedAt.hasClaimedFoFRwrd": true,
      },
    });
    res.status(200).json({ message: "Reward Claimed Successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

export const createLinePayment = async (req, res) => {
  const { booster, paymentMethod } = req.query;
  const userWalletAddr = req.user.kaiaAddress;
  const clientId = config.line.LINE_WALLET_CLIENT;
  const clientSecret = config.line.LINE_WALLET_SECRET;

  if (!userWalletAddr) {
    return res.status(400).json({ message: "Wallet not connected." });
  }

  if (paymentMethod !== "kaia" && paymentMethod !== "stripe") {
    return res.status(400).json({ message: "Invalid payment method." });
  }

  const kaiaValue = await fetchKaiaValue();

  const kaiaPayment = {
    automata: {
      itemIdentifier: "automata-pack",
      name: "Automata Pack",
      price: String(getKaiaValue(1, kaiaValue)),
      pgType: "CRYPTO",
      currencyCode: "KAIA",
    },
    burst: {
      itemIdentifier: "burst-pack",
      name: "Burst Pack",
      price: String(getKaiaValue(3, kaiaValue)),
      pgType: "CRYPTO",
      currencyCode: "KAIA",
    },
  };

  const stripePayment = {
    automata: {
      itemIdentifier: "automata-pack",
      name: "Automata Pack",
      price: "100",
      pgType: "STRIPE",
      currencyCode: "USD",
    },
    burst: {
      itemIdentifier: "burst-pack",
      name: "Burst Pack",
      price: "300",
      pgType: "STRIPE",
      currencyCode: "USD",
    },
  };

  const boosters =
    paymentMethod === "kaia"
      ? kaiaPayment
      : paymentMethod === "stripe"
      ? stripePayment
      : {};

  try {
    const url = "https://payment.dappportal.io/api/payment-v1/payment/create";

    const headers = {
      "X-Client-Id": clientId,
      "X-Client-Secret": clientSecret,
      "Content-Type": "application/json",
    };

    const data = {
      buyerDappPortalAddress: userWalletAddr,
      pgType: boosters[booster].pgType,
      currencyCode: boosters[booster].currencyCode,
      price: boosters[booster].price,
      confirmCallbackUrl: `${config.source.server}/api/v1/line/paymentStatus`,
      items: [
        {
          itemIdentifier: boosters[booster].itemIdentifier,
          name: boosters[booster].name,
          imageUrl:
            "https://raw.githubusercontent.com/BeGods/public-assets/refs/heads/main/fof.bot.thumbnail.jpg",
          price: boosters[booster].price,
          currencyCode: boosters[booster].currencyCode,
        },
      ],
      testMode: config.server.ENVIRONMENT === "dev" ? true : false,
    };

    const response = await axios.post(url, data, { headers });

    const newTransaction = new PaymentLogs({
      userId: req.user._id,
      transactionId: response.data.id,
      reward: boosters[booster].itemIdentifier,
      amount: boosters[booster].price,
      currency: boosters[booster].pgType,
      transferType: "recieve",
      status: "pending",
    });

    newTransaction.save();

    res.status(200).json({ payment_id: response.data.id });
  } catch (error) {
    console.error(
      "Error Creating Payment:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

export const updateLinePaymentStatus = async (req, res) => {
  try {
    const { paymentId, status } = req.body;

    if (status !== "CONFIRMED") {
      await PaymentLogs.findOneAndUpdate(
        { transactionId: paymentId },
        { $set: { status: "failed" } }
      );
      console.error(`Payment failed with status ${status}`);
      return res.status(400).json({ message: "Payment not confirmed" });
    }

    const transaction = await PaymentLogs.findOne({
      paymentId,
      status: "pending",
    });

    if (!transaction) {
      console.error(`Transaction not found or already processed.`);
      return res.status(400).json({ message: "Transaction not found" });
    }

    const reward = transaction.reward;
    const userId = transaction.userId;

    const userMythologiesData = await userMythologies.findOne({ userId });
    if (!userMythologiesData) {
      console.error(`Game data not found.`);
      return res.status(400).json({ message: "Game data not found" });
    }

    let updateSuccess = false;

    if (reward === "automata-pack") {
      if (!userMythologiesData.autoPay.isAutomataAutoPayEnabled) {
        console.error(`Not eligible for automata auto-pay.`);
        return res
          .status(400)
          .json({ message: "Not eligible for automata auto-pay" });
      }

      updateSuccess = await updateMultiAutomata(
        userMythologiesData,
        Date.now(),
        0,
        userId
      );
    } else if (reward === "burst-pack") {
      if (!userMythologiesData.autoPay.isBurstAutoPayEnabled) {
        console.error(`Not eligible for burst auto-pay.`);
        return res
          .status(400)
          .json({ message: "Not eligible for burst auto-pay" });
      }

      const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
      if (
        userMythologiesData.autoPay.burstAutoPayExpiration - Date.now() >
        millisecondsIn24Hours
      ) {
        console.error(`Previous burst has not expired yet.`);
        return res
          .status(400)
          .json({ message: "Previous burst not expired yet" });
      }

      updateSuccess = await updateMultiBurst(userMythologiesData, 0, userId);
    } else {
      console.error(`Invalid reward type.`);
      return res.status(400).json({ message: "Invalid reward type" });
    }

    if (!updateSuccess) {
      console.error(`Failed to update ${reward} auto-pay.`);
      return res.status(500).json({ message: `Failed to update ${reward}` });
    }

    const updateResult = await transaction.updateOne({
      paymentId: paymentId,
      status: "rewarded",
    });

    if (updateResult.modifiedCount === 0) {
      console.error(`Failed to finalize transaction.`);
      return res
        .status(500)
        .json({ message: "Failed to finalize transaction" });
    }

    console.log(`${reward} claimed successfully.`);
    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error in payment confirmation:", error);
    res.status(500).json({ message: "Error processing payment" });
  }
};

export const getLinePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.query;
    const clientId = config.line.LINE_WALLET_CLIENT;
    const clientSecret = config.line.LINE_WALLET_SECRET;

    const url = `https://payment.dappportal.io/api/payment-v1/payment/info?id=${paymentId}`;

    const headers = {
      "X-Client-Id": clientId,
      "X-Client-Secret": clientSecret,
    };

    const response = await axios.get(url, { headers });

    res.status(200).json({ data: response.data });
  } catch (error) {
    console.error("Error in payment confirmation:", error);
    res.status(500).json({ message: "Error processing payment" });
  }
};

export const withdrawReward = async (req, res) => {
  const user = req.user;
  const { type } = req.body;
  const amount = req.amount;
  const transactionId = uuidv4();

  try {
    const newTransaction = new PaymentLogs({
      userId: user._id,
      transactionId: transactionId,
      reward: "withdraw",
      amount: amount,
      currency: type?.toUpperCase(),
      transferType: "send",
      status: "pending",
    });

    await newTransaction.save();

    await user.updateOne({
      $inc: {
        [`holdings.${type}`]: -amount,
      },
    });

    res.status(200).json({ message: "Withdrawal has been processed." });
  } catch (error) {
    console.error("Withdrawal request failed.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getUserWithdrawHistory = async (req, res) => {
  try {
    const user = req.user;

    const transactions = await PaymentLogs.find({
      userId: user._id,
      transferType: "send",
      reward: "withdraw",
    }).select(
      "-__v -_id -userId -reward -transactionId -transferType -createdAt"
    );

    res.status(200).json({ data: transactions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching history" });
  }
};
