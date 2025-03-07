import User from "../models/user.models";
import { ObjectId } from "mongodb";
import {
  decryptLineData,
  decryptTelegramData,
  generateAuthToken,
} from "../services/auth.services";
import {
  addTeamMember,
  createDefaultUserMyth,
  addNewTelegramUser,
  addNewLineUser,
  addNewOneWaveUser,
} from "../services/user.services";
import { Request, Response } from "express";
import { IUser } from "../../ts/models.interfaces";
import {
  encryptOneWaveHash,
  decryptOneWaveHash,
} from "../../helpers/crypt.helpers";
import config from "../../config/config";

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
      existingUser = await addNewTelegramUser(newUser);
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
      existingUser = await addNewTelegramUser(newUser);
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
      return res.json({ refers: existingUser.directReferralCount });
    }

    let newUser: Partial<IUser> = {
      telegramId,
      telegramUsername,
      isPremium,
    };

    const createdUser = await addNewTelegramUser(newUser);
    await createDefaultUserMyth(createdUser);

    return res.json({ refers: 0 });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create user.",
      error: error.message,
    });
  }
};

export const authenticateLine = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.body;
    let isUpdated = false;

    const { lineId, lineName, photoUrl } = await decryptLineData(token);

    let existingUser: IUser | null = await User.findOne({ lineId: lineId });

    if (existingUser) {
      if (lineName !== existingUser.lineName) {
        existingUser.lineName = lineName;
        isUpdated = true;
      }

      if (isUpdated) {
        existingUser.save();
      }
    } else {
      let newUser: Partial<IUser> = {
        lineId,
        lineName,
        ...(photoUrl && {
          profile: {
            avatarUrl: photoUrl,
            updateAt: new Date(),
          },
        }),
      };

      // create new  user
      existingUser = await addNewLineUser(newUser);
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

export const createOneWaveSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { puid, username } = req.body;

    if (!puid || !username) {
      res.status(400).json({
        message: "Invalid input. Please provide a valid PUID and username.",
      });
      return;
    }

    const oneWaveCredentials = {
      platform: "onewave",
      oneWaveId: puid,
      oneWaveUsername: username,
      expiresAt: Math.floor(Date.now() / 1000) + 300,
    };

    const oneWaveHash = await encryptOneWaveHash(oneWaveCredentials);

    res
      .status(200)
      .json({ url: `${config.source.client}?onewave=${oneWaveHash}` });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

export const authenticateOneWave = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sessionHash } = req.body;
    const { oneWaveId, oneWaveUsername } = await decryptOneWaveHash(
      sessionHash
    );
    let isUpdated = false;

    if (!oneWaveId || !oneWaveUsername) {
      res.status(400).json({
        message: "Invalid input. Please provide a valid PUID and username.",
      });
    }

    // existing user or not
    let existingUser: IUser | null = await User.findOne({
      oneWaveId: oneWaveId,
    });

    if (existingUser) {
      // check if user details have updated
      if (oneWaveUsername !== existingUser.oneWaveUsername) {
        existingUser.oneWaveUsername = oneWaveUsername;
        isUpdated = true;
      }

      if (isUpdated) {
        existingUser.save();
      }
    } else {
      let newUser: Partial<IUser> = {
        oneWaveId,
        oneWaveUsername,
      };

      // create new  user
      existingUser = await addNewOneWaveUser(newUser);
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
