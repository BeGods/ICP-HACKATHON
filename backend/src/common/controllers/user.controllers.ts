import { countries } from "../../utils/constants/country";
import {
  deleteRedisKey,
  getOTP,
  setOTP,
  setRequestCnt,
} from "../services/redis.services";
import { deleteImage, storeImage } from "../services/storage.services";
import { fourDigitCode } from "../../helpers/general.helpers";
import { callAlibabaSendMsg } from "../services/alibaba.services";

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

export const generateOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    const requestCount = await setRequestCnt(mobileNumber);

    // if (requestCount && requestCount > 3) {
    //   return res.status(429).json({
    //     message: "You have exceeded the OTP request limit. Try after 1hr.",
    //   });
    // }

    const otp = fourDigitCode();
    const message = `${otp} is your OTP / verification code for BeGods and is valid for 5 minutes. Do not share this with anyone. -FrogDog Games`;
    const params = {
      RegionId: "ap-southeast-1",
      To: mobileNumber.replace(/\s/g, ""),
      Message: message,
      From: "FROGDOGIND",
    };

    await callAlibabaSendMsg(params);
    await setOTP(mobileNumber.toString(), otp.toString(), 300);

    res.status(200).json({ message: "OTP has been sent successfully!" });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to generate otp.",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;
    const user = req.user;

    const storedOTP = await getOTP(mobileNumber);

    if (!storedOTP) {
      throw new Error("Please generate an OTP to verify.");
    }

    if (storedOTP !== otp) {
      throw new Error("Invalid OTP.");
    }

    await deleteRedisKey(`count_${mobileNumber}`);
    await deleteRedisKey(`${mobileNumber}`);

    await user.updateOne({ $set: { phoneNumber: `+${mobileNumber}` } });
    res.status(200).json({ message: "OTP Verified." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to verify otp.",
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
