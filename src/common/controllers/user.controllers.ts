import { countries } from "../../utils/constants/country";
import { deleteImage, storeImage } from "../services/storage.services";
import { generateAliOTP } from "../services/otp.services";

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
    const { kaiaAddress } = req.body;

    if (kaiaAddress) {
      user.kaiaAddress = kaiaAddress;
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
