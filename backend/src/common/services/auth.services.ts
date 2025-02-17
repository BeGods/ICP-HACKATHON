import jwt from "jsonwebtoken";
import config from "../../config/config";
import { validate, parse } from "@tma.js/init-data-node";
import axios from "axios";

export const generateAuthToken = async (user: any) => {
  const userObj = { _id: user._id, role: "user" };

  try {
    const token = jwt.sign(userObj, config.security.JWT_SECRET, {
      expiresIn: config.security.TOKEN_EXPIRE,
    });

    return token;
  } catch (error) {
    throw new Error(error);
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

    // validate initData
    try {
      const response = await axios.get(`https://api.line.me/v2/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      parsedData = response.data;
    } catch (validateError) {
      throw new Error("InitData validation failed.");
    }

    const lineId = parsedData.userId;
    const lineName = parsedData.displayName;
    const photoUrl = parsedData.pictureUrl;

    if (!lineId) {
      throw new Error("Invalid userId. User not found.");
    }

    return { lineId, lineName, photoUrl };
  } catch (error) {
    throw new Error(error);
  }
};
