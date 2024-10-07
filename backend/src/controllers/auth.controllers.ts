import { validate, parse } from "@tma.js/init-data-node";
import config from "../config/config";
import User, { IUser } from "../models/user.models";
import { ObjectId } from "mongodb";
import { generateAuthToken } from "../services/auth.services";
import {
  addTeamMember,
  createDefaultUserMyth,
  addNewUser,
} from "../services/user.services";

const validateInitData = (initData, res) => {
  try {
    const parsedInitData = parse(initData);

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

    return { telegramId, telegramUsername, isPremium };
  } catch (error) {
    console.log(error);
  }
};

const createNewUser = async (newUserData, referralCode, res) => {
  try {
    let existingReferrer: any;

    //check referrer
    if (referralCode) {
      existingReferrer = await User.findOne({ referralCode });

      if (!existingReferrer) {
        return res.status(404).json({ message: "Invalid referral code." });
      }

      newUserData.parentReferrerId = existingReferrer._id as ObjectId;
    }

    // create new  user
    const updatedUser = await addNewUser(newUserData);
    await addTeamMember(updatedUser, existingReferrer, referralCode);
    await createDefaultUserMyth(updatedUser);

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

export const authenticate = async (req, res) => {
  try {
    const { initData } = req.body as { initData: string };
    const { referralCode } = req.query as { referralCode?: string | null };
    let isUpdated = false;

    if (!initData) {
      return res.status(400).json({
        message: "Telegram initData is required.",
      });
    }

    // validate initData
    const { telegramId, telegramUsername, isPremium } = validateInitData(
      initData,
      res
    );

    // existing user or not
    let existingUser: IUser | null = await User.findOne({ telegramId });

    if (existingUser) {
      // check if user details have updated
      if (isPremium !== existingUser.isPremium) {
        existingUser.isPremium = isPremium;
        isUpdated = true;
      }

      if (
        telegramUsername &&
        telegramUsername !== existingUser.telegramUsername
      ) {
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
      let newUserObject: Partial<IUser> = {
        telegramId,
        telegramUsername,
        isPremium,
      };

      // handle create new user
      const createdNewUser = createNewUser(newUserObject, referralCode, res);

      // response token
      const accessToken = await generateAuthToken(createdNewUser);

      res.status(201).json({
        message: "User authenticated successfully.",
        data: { token: accessToken },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//test login
export const testAuthenticate = async (req, res) => {
  try {
    const { telegramId, telegramUsername, isPremium, referralCode } = req.body;

    let isUpdated = false;

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
      if (
        telegramUsername &&
        telegramUsername !== existingUser.telegramUsername
      ) {
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
      let newUserObject: Partial<IUser> = {
        telegramId,
        telegramUsername,
        isPremium,
      };

      // handle create new user
      const createdNewUser = createNewUser(newUserObject, referralCode, res);

      // response token
      const accessToken = await generateAuthToken(createdNewUser);

      res.status(201).json({
        message: "User authenticated successfully.",
        data: { token: accessToken },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
