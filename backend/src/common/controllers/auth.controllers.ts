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
  addNewOTPUser,
  validateUsername,
} from "../services/user.services";
import { Request, Response } from "express";
import { IUser } from "../../ts/models.interfaces";
import {
  encryptOneWaveHash,
  decryptOneWaveHash,
} from "../../helpers/crypt.helpers";
import config from "../../config/config";
import {
  getOneWaveSession,
  setOneWaveSession,
} from "../services/redis.services";
import { v4 as uuidv4 } from "uuid";
import { generateAliOTP, verifyOtp } from "../services/otp.services";

// login
export const authenticateTg = async (
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

      const match = existingUser.telegramUsername.match(/^(.*)_\w{3}$/);
      const baseUsername = match ? match[1] : existingUser.telegramUsername;

      if (telegramUsername && telegramUsername !== baseUsername) {
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
      const match = existingUser.telegramUsername.match(/^(.*)_\w{3}$/);
      const baseUsername = match ? match[1] : existingUser.telegramUsername;
      if (lineName !== baseUsername) {
        existingUser.telegramUsername = lineName;
        isUpdated = true;
      }

      if (isUpdated) {
        existingUser.save();
      }
    } else {
      // handle this
      let usernameToAdd = lineName;
      const usernameExists = await validateUsername(usernameToAdd);
      if (usernameExists) {
        const randomSuffix = Math.random().toString(36).substring(2, 5); // random 3-letter string
        usernameToAdd = `${usernameToAdd}_${randomSuffix}`;
      }
      let newUser: Partial<IUser> = {
        lineId: lineId,
        telegramUsername: usernameToAdd,
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

    const sessionId = uuidv4();
    const oneWaveHash = await encryptOneWaveHash(oneWaveCredentials);
    await setOneWaveSession(sessionId, oneWaveHash, 300);

    res
      .status(200)
      .json({ url: `${config.source.client}?onewave=${sessionId}` });
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
    const { sessionId } = req.body;
    const sessionHash = await getOneWaveSession(sessionId);

    if (!sessionHash) {
      res.status(400).json({
        message: "Invalid sessionId.",
      });
      return;
    }

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
      const match = existingUser.telegramUsername.match(/^(.*)_\w{3}$/);
      const baseUsername = match ? match[1] : existingUser.telegramUsername;
      // check if user details have updated
      if (oneWaveUsername !== baseUsername) {
        existingUser.telegramUsername = oneWaveUsername;
        isUpdated = true;
      }

      if (isUpdated) {
        existingUser.save();
      }
    } else {
      // handle this
      let usernameToAdd = oneWaveUsername;
      const usernameExists = await validateUsername(usernameToAdd);
      if (usernameExists) {
        const randomSuffix = Math.random().toString(36).substring(2, 5); // random 3-letter string
        usernameToAdd = `${usernameToAdd}_${randomSuffix}`;
      }
      let newUser: Partial<IUser> = {
        oneWaveId,
        telegramUsername: usernameToAdd,
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

export const generateOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    const sanitizedNumber = mobileNumber.replace(/[^0-9]/g, "");

    const mobileRegex = /^\+\d{1,3}-\d{5,15}$/;

    if (!mobileNumber || !mobileRegex.test(mobileNumber)) {
      res.status(400).json({
        message: "Invalid input. Please provide a valid mobileNumber.",
      });
      return;
    }

    const result = await generateAliOTP(sanitizedNumber);

    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to generate OTP.",
      error: error.message,
    });
  }
};

export const authenticateOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { mobileNumber, username, otp, referPartner, stanId } = req.body;
    const sanitizedNumber = mobileNumber?.replace(/[^0-9]/g, "");
    const sanitizedUsername = username?.replace(/[^a-zA-Z0-9]/g, "");
    const mobileRegex = /^\+\d{1,3}-\d{5,15}$/;
    await verifyOtp(sanitizedNumber, otp);

    if (!mobileNumber || !mobileRegex.test(mobileNumber)) {
      res.status(400).json({
        message: "Invalid input. Please provide a valid mobileNumber.",
      });
      return;
    }

    // existing user or not
    let existingUser: IUser | null = await User.findOne({
      mobileNumber: mobileNumber,
    });

    if (existingUser) {
      // check if user details have updated
      // if (sanitizedUsername !== existingUser.telegramUsername) {
      //   existingUser.telegramUsername = sanitizedUsername;
      //   isUpdated = true;
      // }
      // if (isUpdated) {
      //   existingUser.save();
      // }
    } else {
      if (!sanitizedUsername) {
        res.status(400).json({
          message: "Invalid input. Please provide a valid username.",
        });
      }
      let usernameToAdd = sanitizedUsername;
      const usernameExists = await validateUsername(usernameToAdd);
      if (usernameExists) {
        const randomSuffix = Math.random().toString(36).substring(2, 5); // random 3-letter string
        usernameToAdd = `${usernameToAdd}_${randomSuffix}`;
      }
      let newUser: Partial<IUser> = {
        mobileNumber,
        telegramUsername: usernameToAdd,
        ...(stanId && { stanId }),
      };

      // create new  user
      const refPartner = referPartner ? referPartner : "";
      existingUser = await addNewOTPUser(newUser, refPartner);
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
