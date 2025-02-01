import User from "../models/user.models";
import { ObjectId } from "mongodb";
import {
  decryptTelegramData,
  generateAuthToken,
} from "../services/auth.services";
import {
  addTeamMember,
  createDefaultUserMyth,
  addNewUser,
} from "../services/user.services";
import { Request, Response } from "express";
import { IUser } from "../../ts/models.interfaces";

// login
export const authenticate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { initData } = req.body;
    const { referralCode } = req.query as { referralCode?: string | null };
    let isUpdated = false;

    const { telegramId, telegramUsername, isPremium } =
      await decryptTelegramData(initData);

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
    } else {
      let newUser: Partial<IUser> = {
        telegramId,
        telegramUsername,
        isPremium,
      };

      let existingReferrer: IUser;

      //check referrer
      if (referralCode) {
        existingReferrer = await User.findOne({ referralCode });

        if (!existingReferrer) {
          res.status(404).json({ message: "Invalid referral code." });
        }

        newUser.parentReferrerId = existingReferrer._id as ObjectId;
      }

      // create new  user
      existingUser = await addNewUser(newUser);
      await addTeamMember(existingUser, existingReferrer, referralCode);
      await createDefaultUserMyth(existingUser);
    }

    // response token
    const accessToken: string | null = await generateAuthToken(existingUser);
    res.status(200).json({
      message: "User authenticated successfully.",
      data: { token: accessToken },
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

//test login
export const testAuthenticate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { telegramId, telegramUsername, isPremium, referralCode } = req.body;

    let isUpdated = false;

    if (!telegramId) {
      res.status(404).json({
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
    } else {
      let newUser: Partial<IUser> = {
        telegramId,
        telegramUsername,
        isPremium,
      };

      let existingReferrer: IUser;

      //check referrer
      if (referralCode) {
        existingReferrer = await User.findOne({ referralCode });

        if (!existingReferrer) {
          res.status(404).json({ message: "Invalid referral code." });
        }

        newUser.parentReferrerId = existingReferrer._id as ObjectId;
      }

      // create new  user
      existingUser = await addNewUser(newUser);
      await addTeamMember(existingUser, existingReferrer, referralCode);
      await createDefaultUserMyth(existingUser);
    }

    // response token
    const accessToken = await generateAuthToken(existingUser);
    res.status(200).json({
      message: "User authenticated successfully.",
      data: { token: accessToken },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

export const createNewUserIfNoExists = async (req, res) => {
  const { telegramId, telegramUsername, isPremium } = req.body;

  try {
    let existingUser = await User.findOne({ telegramId: telegramId });

    if (existingUser) {
      return res.json({ newUser: false });
    }

    let newUser: Partial<IUser> = {
      telegramId,
      telegramUsername,
      isPremium,
    };

    const createdUser = await addNewUser(newUser);
    await createDefaultUserMyth(createdUser);

    return res.json({ newUser: true });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create user.",
      error: error.message,
    });
  }
};
