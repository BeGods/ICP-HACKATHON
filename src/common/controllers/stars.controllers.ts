import { randomUUID } from "crypto";
import { createInvoice } from "../services/star.services";
import { StarsTransactions } from "../models/transactions.models";
import User from "../models/user.models";
import userMythologies from "../models/mythologies.models";
import {
  updateMultiAutomata,
  updateMultiBurst,
} from "../../fof/services/boosters.fof.services";

export const generateStarInvoice = async (req, res) => {
  const userId = req.user._id;
  const { type } = req.query;

  try {
    if (!type || (type !== "automata" && type !== "burst")) {
      return res.status(400).json({ message: "Invalid or missing type." });
    }

    const uuid = randomUUID() + "." + type;
    const invoice = await createInvoice(type, uuid);

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
