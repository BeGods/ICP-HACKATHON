import { randomUUID } from "crypto";
import { createTGStarInvoice } from "../services/payment.services";
import { PaymentLogs, StarsTransactions } from "../models/transactions.models";
import User from "../models/user.models";
import userMythologies from "../models/mythologies.models";
import {
  updateMultiAutomata,
  updateMultiBurst,
} from "../../fof/services/boosters.fof.services";
import axios from "axios";
import config from "../../config/config";
import { fetchKaiaValue } from "../services/redis.services";
import { getKaiaValue } from "../../helpers/crypt.helpers";

// tg star - create session
export const genStarInvoice = async (req, res) => {
  const userId = req.user._id;
  const { type } = req.query;

  try {
    if (!type || (type !== "automata" && type !== "burst")) {
      return res.status(400).json({ message: "Invalid or missing type." });
    }

    const uuid = randomUUID() + "." + type;
    const invoice = await createTGStarInvoice(type, uuid);

    if (!invoice) {
      return res.status(500).json({ message: "Failed to generate invoice." });
    }

    const newTransaction = new StarsTransactions({
      userId: userId,
      paymentId: uuid,
      status: "pending",
    });

    await newTransaction.save();

    return res.status(200).json({ invoice: invoice });
  } catch (error) {
    console.error("Error in generateStarInvoice:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// tg star - verify session
export const verifyStarPayment = async (req, res) => {
  const { transactionId, paymentId, telegramId } = req.body;

  try {
    if (!transactionId || !paymentId || !telegramId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const transaction = await StarsTransactions.findOne({
      userId: user._id,
      paymentId,
      status: "pending",
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found or already processed." });
    }

    const reward = paymentId.split(".")[1];
    const userId = user._id;

    const userMythologiesData = await userMythologies.findOne({ userId });
    if (!userMythologiesData) {
      return res.status(404).json({ message: "Game data not found." });
    }

    let updateSuccess = false;

    if (reward === "automata") {
      if (!userMythologiesData.autoPay.isAutomataAutoPayEnabled) {
        return res
          .status(403)
          .json({ message: "You are not eligible for auto pay." });
      }

      updateSuccess = await updateMultiAutomata(
        userMythologiesData,
        Date.now(),
        0,
        userId
      );
    } else if (reward === "burst") {
      if (!userMythologiesData.autoPay.isBurstAutoPayEnabled) {
        return res
          .status(403)
          .json({ message: "You are not eligible for auto pay." });
      }

      const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
      if (
        userMythologiesData.autoPay.burstAutoPayExpiration - Date.now() >
        millisecondsIn24Hours
      ) {
        return res.status(400).json({
          message: "Your previous burst has not expired yet. Try later.",
        });
      }

      updateSuccess = await updateMultiBurst(userMythologiesData, 0, userId);
    } else {
      return res.status(400).json({ message: "Invalid reward type." });
    }

    if (!updateSuccess) {
      await transaction.updateOne({ status: "success" });
      return res
        .status(500)
        .json({ message: `Failed to update ${reward} auto pay.` });
    }

    const updateResult = await transaction.updateOne({
      transactionId: transactionId,
      status: "rewarded",
    });

    if (updateResult.modifiedCount === 0) {
      return res
        .status(500)
        .json({ message: "Failed to finalize transaction." });
    }

    return res.status(200).json({ message: `${reward} claimed successfully.` });
  } catch (error) {
    console.error("Error in verifyStarPayment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// dapp - create session
export const createDappInvoice = async (req, res) => {
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

    const url = "https://payment.dappportal.io/api/payment-v1/payment/create";

    const headers = {
      "X-Client-Id": clientId,
      "X-Client-Secret": clientSecret,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://payment.dappportal.io/api/payment-v1/payment/create",
      data,
      { headers }
    );

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

// dapp - verify session
export const verifyDappPayment = async (req, res) => {
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

// dapp - update session status
export const checkDappPaymentStatus = async (req, res) => {
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

export const pullKaiaValue = async (req, res) => {
  try {
    const kaiaValue = await fetchKaiaValue();

    res.status(200).json({ data: kaiaValue });
  } catch (error) {
    console.error("Error in pulling kaia", error);
    res.status(500).json({ message: "Error in pulling kaia" });
  }
};
