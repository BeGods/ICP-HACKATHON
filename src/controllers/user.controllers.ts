import User from "../models/user.models";

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
      message: "Internal server error.",
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
      message: "Internal server error.",
      error: error.message,
    });
  }
};
