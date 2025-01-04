import jwt from "jsonwebtoken";
import config from "../config/config";
import { validate, parse } from "@tma.js/init-data-node";

export const generateAuthToken = async (user: any) => {
  const userObj = { _id: user._id, role: "user" };

  try {
    const token = jwt.sign(userObj, config.security.JWT_SECRET, {
      expiresIn: config.security.TOKEN_EXPIRE,
    });

    return token;
  } catch (error) {
    throw Error(error);
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
      throw Error("InitData validation failed.");
    }

    const telegramId = parsedInitData.user.id.toString();
    const telegramUsername = parsedInitData.user.username;
    const isPremium = parsedInitData.user.isPremium;

    if (!telegramId) {
      throw Error("Invalid telegramId. User not found.");
    }

    return { telegramId, telegramUsername, isPremium };
  } catch (error) {
    throw Error(error);
  }
};
