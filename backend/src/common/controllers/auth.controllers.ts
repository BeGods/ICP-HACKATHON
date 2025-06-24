import User from "../models/user.models";
import { ObjectId } from "mongodb";
import {
  decryptLineData,
  decryptTelegramData,
  generateAuthToken,
  getLineIdToken,
  validateRefreshToken,
} from "../services/auth.services";
import {
  addTeamMember,
  createDefaultUserMyth,
  validateUsername,
  addNewUser,
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
import { genOTP, verifyOtp } from "../services/otp.services";
import { verifyMessage } from "ethers";
import admin from "../../config/firebase";

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
      existingUser = await addNewUser(newUser, "TG", "telegram");
      await addTeamMember(existingUser, existingReferrer, referralCode);
      await createDefaultUserMyth(existingUser);
    }

    // response token
    const { accessToken } = await generateAuthToken(existingUser, res);
    res.status(200).json({
      message: "User authenticated successfully.",
      data: {
        token: accessToken,
        // refreshToken: refreshToken
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

// telegram
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
      existingUser = await addNewUser(newUser, "TG", "telegram");
      await addTeamMember(existingUser, existingReferrer, referralCode);
      await createDefaultUserMyth(existingUser);
    }

    // response token
    const { accessToken } = await generateAuthToken(existingUser, res);
    res.status(200).json({
      message: "User authenticated successfully.",
      data: {
        accessToken: accessToken,
        // refreshToken: refreshToken
      },
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

// telegram -- non auth
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

    const createdUser = await addNewUser(newUser, "TG", "telegram");
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

// ine
export const authenticateLine = async (req: Request, res: Response) => {
  try {
    const { token, code } = req.body;
    const { referralCode } = req.query as { referralCode?: string | null };

    let idToken = token;
    let isUpdated = false;

    if (code && !idToken) {
      idToken = await getLineIdToken(code);
    }

    const { lineId, lineName, photoUrl } = await decryptLineData(idToken);

    let existingUser: IUser | null = await User.findOne({ lineId: lineId });

    if (existingUser) {
      const match = lineName.match(/^(.*)_\w{3}$/);
      const baseUsername = match ? match[1] : existingUser.telegramUsername;
      if (lineName !== baseUsername) {
        existingUser.telegramUsername = lineName;

        try {
          await existingUser.save();
        } catch (err: any) {
          if (err.code === 11000) {
            console.warn(
              "Duplicate telegramUsername while updating:",
              lineName
            );
          } else {
            throw err;
          }
        }
      }

      if (isUpdated) {
        existingUser.save();
      }
    } else {
      // handle this
      let usernameToAdd = lineName;
      let maxAttempts = 3;

      // Retry username generation on duplicate
      while (maxAttempts-- > 0) {
        const usernameExists = await validateUsername(usernameToAdd);
        if (!usernameExists) break;

        const randomSuffix = Math.random().toString(36).substring(2, 5);
        usernameToAdd = `${lineName}_${randomSuffix}`;
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
      try {
        existingUser = await addNewUser(newUser, "LN", "line");
      } catch (err: any) {
        if (err.code === 11000) {
          return res
            .status(409)
            .json({ message: "Username conflict. Try again." });
        }
        throw err;
      }

      await addTeamMember(existingUser, existingReferrer, referralCode);
      await createDefaultUserMyth(existingUser);
    }

    // response token
    const { accessToken } = await generateAuthToken(existingUser, res);
    res.status(200).json({
      message: "User authenticated successfully.",
      data: {
        accessToken: accessToken,
        // refreshToken: refreshToken
      },
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

//  dapp
export const authenticateKaiaAddr = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { signature, message } = req.body;
    const { referralCode } = req.query as { referralCode?: string | null };

    const recoveredAddress = verifyMessage(message, signature);

    if (!recoveredAddress) {
      res.status(400).json({
        message: "Invalid address.",
      });
      return;
    }

    let existingUser: IUser | null = await User.findOne({
      kaiaAddress: recoveredAddress,
    });

    if (existingUser) {
    } else {
      let newUser: Partial<IUser> = {
        kaiaAddress: recoveredAddress,
      };

      let existingReferrer: IUser;
      if (referralCode) {
        existingReferrer = await User.findOne({ referralCode });

        if (!existingReferrer) {
          res.status(404).json({ message: "Invalid referral code." });
        }

        newUser.parentReferrerId = existingReferrer._id as ObjectId;
      }
      // create new  user
      existingUser = await addNewUser(newUser, "dp", "dapp");
      await addTeamMember(existingUser, existingReferrer, referralCode);
      await createDefaultUserMyth(existingUser);
    }

    // response token
    const { accessToken } = await generateAuthToken(existingUser, res);
    res.status(200).json({
      message: "User authenticated successfully.",
      data: {
        accessToken: accessToken,
        // refreshToken: refreshToken
      },
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

// onewave - create
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
      .json({ url: `${config.source.client}?onewave=${sessionId}&refer=ONW` });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

// onewave
export const authenticateOneWave = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sessionId, refer } = req.body;
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
        const randomSuffix = Math.random().toString(36).substring(2, 5);
        usernameToAdd = `${usernameToAdd}_${randomSuffix}`;
      }
      let newUser: Partial<IUser> = {
        oneWaveId,
        telegramUsername: usernameToAdd,
      };

      const refPartner = "OW";

      // create new  user
      existingUser = await addNewUser(newUser, "OW", "onewave");
      await createDefaultUserMyth(existingUser);
    }

    // response token
    const { accessToken } = await generateAuthToken(existingUser, res);
    res.status(200).json({
      message: "User authenticated successfully.",
      data: {
        accessToken: accessToken,
        // refreshToken: refreshToken
      },
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

// otp - create
export const generateOtp = async (req, res) => {
  try {
    const { mobileNumber, username } = req.body;
    const sanitizedNumber = mobileNumber.replace(/[^0-9]/g, "");
    let usernameExists;

    if (username) {
      usernameExists = await validateUsername(username);
    }

    if (usernameExists) {
      res.status(400).json({
        message: "Username already exists.",
      });
      return;
    }

    const mobileRegex = /^\+\d{1,3}-\d{5,15}$/;

    if (!mobileNumber || !mobileRegex.test(mobileNumber)) {
      res.status(400).json({
        message: "Invalid input. Please provide a valid mobileNumber.",
      });
      return;
    }

    const result = await genOTP(sanitizedNumber);

    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to generate OTP.",
      error: error.message,
    });
  }
};

// otp
export const authenticateOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { mobileNumber, username, otp, refer, stanId } = req.body;
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
      const refPartner = refer === "stab" ? refer : "";
      existingUser = await addNewUser(newUser, "OT", "OTP");

      await createDefaultUserMyth(existingUser);
    }

    // response token
    const { accessToken } = await generateAuthToken(existingUser, res);
    res.status(200).json({
      message: "User authenticated successfully.",
      data: {
        accessToken: accessToken,
        // refreshToken: refreshToken
      },
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

// twitter
export const authenticateTwitter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, twitterUsername } = req.body;
    const { refer } = req.query;
    let isUpdated = false;

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    const twitterInfo = userRecord.providerData.find(
      (provider) => provider.providerId === "twitter.com"
    );
    const xId = twitterInfo.uid;
    const photoUrl = twitterInfo.photoURL;
    const username = twitterUsername ?? twitterInfo.displayName;

    // existing user or not
    let existingUser: IUser | null = await User.findOne({
      xId: xId,
    });

    if (existingUser) {
      // check if user details have updated
      if (username !== existingUser.telegramUsername) {
        existingUser.telegramUsername = username;
        isUpdated = true;
      }
      if (isUpdated) {
        existingUser.save();
      }
    } else {
      if (!username) {
        res.status(400).json({
          message: "Invalid input. Please provide a valid username.",
        });
      }
      let usernameToAdd = username;
      const usernameExists = await validateUsername(usernameToAdd);
      if (usernameExists) {
        const randomSuffix = Math.random().toString(36).substring(2, 5);
        usernameToAdd = `${usernameToAdd}_${randomSuffix}`;
      }
      let newUser: Partial<IUser> = {
        xId,
        telegramUsername: usernameToAdd,
        ...(photoUrl && {
          profile: {
            avatarUrl: photoUrl,
            updateAt: new Date(),
          },
        }),
      };

      let existingReferrer: IUser;
      if (refer) {
        existingReferrer = await User.findOne({ refer });

        if (!existingReferrer) {
          res.status(404).json({ message: "Invalid referral code." });
        }

        newUser.parentReferrerId = existingReferrer._id as ObjectId;
      }

      // create new  user
      existingUser = await addNewUser(newUser, "X", "x");
      await addTeamMember(existingUser, existingReferrer, refer);
      await createDefaultUserMyth(existingUser);
    }

    // response token
    const { accessToken } = await generateAuthToken(existingUser, res);
    res.status(200).json({
      message: "User authenticated successfully.",
      data: {
        accessToken: accessToken,
        // refreshToken: refreshToken
      },
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

// create refresh token
export const generateRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.cookies.refreshToken;

    if (!refreshToken)
      return res
        .status(401)
        .json({ message: "Unauthorized:  Invalid refresh token" });

    const { accessToken, newRefreshToken } = await validateRefreshToken(
      refreshToken,
      res
    );

    res.status(200).json({
      data: {
        accessToken: accessToken,
        // refreshToken: refreshToken
      },
    });
  } catch (error) {
    console.log(error.message || "Failed to generate refresh token.");

    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};

// delete refresh token
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.status(200).json({
      message: "User logout successful!",
    });
  } catch (error) {
    console.log(error.message || "Failed to generate refresh token.");

    res.status(500).json({
      message: "Failed to authenticate user.",
      error: error.message,
    });
  }
};
