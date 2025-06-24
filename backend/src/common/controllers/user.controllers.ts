import { countries } from "../../utils/constants/country";
import { deleteImage, storeImage } from "../services/cdn.services";
import { PaymentLogs } from "../models/transactions.models";
import { verifyMessage } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { updateMntryRwrd } from "../services/payment.services";

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

export const updateBalance = async (req, res) => {
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

export const getWithdrawHistory = async (req, res) => {
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

export const claimMsnReward = async (req, res) => {
  try {
    const reward = req.rewardDetails;
    const userMilestones = req.userMilestones;
    const user = req.user;
    const { paymentType } = req.body;

    await updateMntryRwrd(user, userMilestones, reward, paymentType);

    res.status(200).json({ message: "Reward claimed successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to claim reward",
      error: error.message,
    });
  }
};
