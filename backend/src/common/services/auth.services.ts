import jwt from "jsonwebtoken";
import config from "../../config/config";
import { validate, parse } from "@tma.js/init-data-node";
import axios from "axios";

const getTokenExpiryMs = (expiry: string): number => {
  const timeUnit = expiry.slice(-1);
  const timeValue = parseInt(expiry.slice(0, -1));

  switch (timeUnit) {
    case "s":
      return timeValue * 1000;
    case "m":
      return timeValue * 60 * 1000;
    case "h":
      return timeValue * 60 * 60 * 1000;
    case "d":
      return timeValue * 24 * 60 * 60 * 1000;
    default:
      throw new Error("Invalid token expiry format");
  }
};

export const generateAuthToken = async (user: any, res) => {
  const userObj = { _id: user._id, role: "user" };

  try {
    const accessToken = jwt.sign(userObj, config.security.ACCESS_TOKEN_SECRET, {
      expiresIn: config.security.ACCESS_TOKEN_EXPIRE,
    });

    const refreshToken = jwt.sign(
      userObj,
      config.security.REFRESH_TOKEN_SECRET,
      {
        expiresIn: config.security.REFRESH_TOKEN_EXPIRE,
      }
    );

    const refreshTokenExpiryMs = getTokenExpiryMs(
      config.security.REFRESH_TOKEN_EXPIRE
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: refreshTokenExpiryMs, // 90 days
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(error.message || "Failed to generate tokens");
  }
};

export const decryptTelegramData = async (initData) => {
  try {
    if (!initData) {
      throw Error("Invalid input. Telegram initData is required.");
    }

    const parsedInitData = parse(initData);

    // validate initData
    try {
      validate(initData, config.security.TMA_BOT_TOKEN);
    } catch (validateError) {
      throw new Error("InitData validation failed.");
    }

    const telegramId = parsedInitData.user.id.toString();
    const telegramUsername = parsedInitData.user.username;
    const isPremium = parsedInitData.user.isPremium;

    if (!telegramId) {
      throw new Error("Invalid telegramId. User not found.");
    }

    return { telegramId, telegramUsername, isPremium };
  } catch (error) {
    throw new Error(error);
  }
};

export const decryptLineData = async (token) => {
  try {
    if (!token) {
      throw Error("Invalid input. Line initData is required.");
    }
    let parsedData;

    const clientID = config.security.LINE_CHANNEL_ID;

    // validate initData
    try {
      const response = await axios.post(
        `https://api.line.me/oauth2/v2.1/verify?id_token=${token}&client_id=${clientID}`,
        {}
      );

      parsedData = response.data;
    } catch (validateError) {
      console.log(validateError);
      throw new Error(validateError);
    }

    const lineId = parsedData.sub;
    const lineName = parsedData.name;
    const photoUrl = parsedData.picture;

    if (!lineId) {
      throw new Error("Invalid userId. User not found.");
    }

    return { lineId, lineName, photoUrl };
  } catch (error) {
    throw new Error(error);
  }
};
