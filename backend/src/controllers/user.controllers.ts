import { countries } from "../utils/constants/countrt";

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
      message: "Internal server error.",
      error: error.message,
    });
  }
};
