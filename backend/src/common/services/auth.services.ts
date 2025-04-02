import jwt from "jsonwebtoken";
import config from "../../config/config";
import { validate, parse } from "@tma.js/init-data-node";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import User from "../models/user.models";
import qs from "qs";

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

const parseTimeToMs = (timeString: string) => {
  const match = timeString.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid time format: ${timeString}`);
  }

  const timeValue = parseInt(match[1]);
  const timeUnit = match[2];

  switch (timeUnit) {
    case "s":
      return timeValue * 1000; // Convert seconds to ms
    case "m":
      return timeValue * 60 * 1000; // Convert minutes to ms
    case "h":
      return timeValue * 60 * 60 * 1000; // Convert hours to ms
    case "d":
      return timeValue * 24 * 60 * 60 * 1000; // Convert days to ms
    default:
      throw new Error(`Unsupported time unit: ${timeUnit}`);
  }
};

export const generateAuthToken = async (user: any, res) => {
  try {
    const refreshTokenExpiryMs = getTokenExpiryMs(
      config.security.REFRESH_TOKEN_EXPIRE
    );
    const userObj = { _id: user._id, role: "user" };

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

    // Only set cookies if response hasn't been sent
    if (!res.headersSent) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // https
        sameSite: "none", // cross-origin
        maxAge: refreshTokenExpiryMs,
      });
    }

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation failed:", error);
    throw new Error(error.message || "Failed to generate tokens");
  }
};

export const validateRefreshToken = async (refreshToken, res) => {
  try {
    const decodedUserData = jwt.verify(
      refreshToken,
      config.security.REFRESH_TOKEN_SECRET
    );

    if (!decodedUserData) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      throw new Error("Invalid Token");
    }

    const user = await User.findOne({ _id: decodedUserData._id });

    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      throw new Error("Not authorized to access this resource");
    }

    const userObj = { _id: user._id, role: "user" };
    const accessToken = jwt.sign(userObj, config.security.ACCESS_TOKEN_SECRET, {
      expiresIn: config.security.ACCESS_TOKEN_EXPIRE,
    });

    let newRefreshToken = null;
    const now = Date.now();
    const refreshTokenLifespan = parseTimeToMs(
      config.security.REFRESH_TOKEN_EXPIRE
    );
    const issuedAtMs = decodedUserData.iat * 1000;
    const refreshTokenAge = now - issuedAtMs;

    // if token in older than 80% of expiry then new
    if (refreshTokenAge > refreshTokenLifespan * 0.8) {
      const refreshUserObj = {
        _id: user._id,
        role: "user",
      };

      newRefreshToken = jwt.sign(
        refreshUserObj,
        config.security.REFRESH_TOKEN_SECRET,
        {
          expiresIn: config.security.REFRESH_TOKEN_EXPIRE,
        }
      );
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: refreshTokenLifespan,
      });
    }

    return { accessToken, newRefreshToken };
  } catch (error) {
    throw new Error(error || "Failed to validate refresh token");
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

    const agent = new HttpsProxyAgent(config.source.PROXY_SERVER_JP);

    // validate initData
    try {
      const response = await axios.post(
        `https://api.line.me/oauth2/v2.1/verify?id_token=${token}&client_id=${clientID}`,
        {},
        {
          httpsAgent: agent,
        }
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

export const getLineIdToken = async (code) => {
  try {
    if (!code) {
      throw new Error("Invalid input. Line code is required.");
    }

    const agent = new HttpsProxyAgent(config.source.PROXY_SERVER_JP);

    const data = qs.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: config.source.client + "/auth/line/callback",
      client_id: config.security.LINE_CHANNEL_ID,
      client_secret: config.security.LINE_CHANNEL_SECRET,
    });

    const response = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      data,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        httpsAgent: agent,
      }
    );

    if (!response.data) {
      throw new Error("Invalid response from LINE API.");
    }

    return response.data.id_token;
  } catch (error) {
    console.error(
      "Error fetching LINE ID token:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error_description || "Failed to retrieve token."
    );
  }
};
