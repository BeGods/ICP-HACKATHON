import { validate, parse } from "@tma.js/init-data-node";
import config from "../config/config";
import User, { IUser } from "../models/user.models";
import { ObjectId } from "mongodb";
import { generateAuthToken } from "../utils/auth";
import { createUser } from "../services/user.services";

export const login = async (req, res) => {
  try {
    const { initData } = req.body;

    const { referralCode } = req.query as { referralCode?: string | null };

    const parsedInitData = parse(initData);
    let isUpdated = false;

    // validate initData
    try {
      validate(initData, config.security.TMA_BOT_TOKEN);
    } catch (validateError) {
      return res.status(400).json({
        message: "initData validation failed",
        error: validateError.message,
      });
    }

    const telegramId = parsedInitData.user.id.toString();
    const telegramUsername = parsedInitData.user.username;
    const isPremium = parsedInitData.user.isPremium;

    if (!telegramId) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // existing user or not
    let existingUser = await User.findOne({ telegramId });

    if (existingUser) {
      // check if user details have updated
      if (isPremium !== existingUser.isPremium) {
        existingUser.isPremium = isPremium;
        isUpdated = true;
      }
      if (telegramUsername && telegramUsername !== telegramUsername) {
        existingUser.telegramUsername = telegramUsername;
        isUpdated = true;
      }
      if (isUpdated) {
        existingUser.save();
      }

      // response token
      const accessToken = await generateAuthToken(existingUser);
      res.status(200).json({
        message: "User authenticated successfully.",
        data: { token: accessToken },
      });
    } else {
      let newUser: Partial<IUser> = {
        telegramId,
        telegramUsername,
        isPremium,
      };

      //check referrer
      if (referralCode) {
        let existingReferrer = await User.findOne({ referralCode });
        if (!existingReferrer) {
          return res.status(404).json({ message: "Invalid referral code." });
        }

        newUser.parentReferrerId = existingReferrer._id as ObjectId;
      }

      // create new  user
      existingUser = await createUser(newUser);
      // response token
      const accessToken = await generateAuthToken(existingUser);

      res.status(201).json({
        message: "User authenticated successfully.",
        data: { token: accessToken },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default login;
