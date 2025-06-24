import jwt from "jsonwebtoken";
import config from "../../config/config";
import { validate, parse } from "@tma.js/init-data-node";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import User from "../models/user.models";
import qs from "qs";
import { getTokenExpiryMs, parseTimeToMs } from "../../helpers/auth.helpers";

export const generateAuthToken = async (user: any, res) => {
  try {
    const refreshTokenExpiryMs = getTokenExpiryMs(
      config.security.REFRESH_TOKEN_EXPIRE
    );
    const userObj = { _id: user._id, role: "user" };

    const accessToken = jwt.sign(userObj, config.security.ACCESS_TOKEN_SECRET, {
      expiresIn: config.security.ACCESS_TOKEN_EXPIRE as any,
    });

    const refreshToken = jwt.sign(
      userObj,
      config.security.REFRESH_TOKEN_SECRET,
      {
        expiresIn: config.security.REFRESH_TOKEN_EXPIRE as any,
      }
    );

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
    ) as jwt.JwtPayload & { _id: string };

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
      expiresIn: config.security.ACCESS_TOKEN_EXPIRE as any,
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
          expiresIn: config.security.REFRESH_TOKEN_EXPIRE as any,
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
  if (!token) {
    throw new Error("Missing LINE id_token.");
  }

  const clientID = config.security.LINE_CHANNEL_ID;
  const agent = new HttpsProxyAgent(config.source.PROXY_SERVER_JP);
  const url = `https://api.line.me/oauth2/v2.1/verify?id_token=${token}&client_id=${clientID}`;

  const axiosOptions = {
    httpsAgent: agent,
    timeout: 3000,
  };

  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await axios.post(url, {}, axiosOptions);
      const parsedData = response.data;

      const lineId = parsedData?.sub;
      const lineName = parsedData?.name;
      const photoUrl = parsedData?.picture;

      if (!lineId) {
        throw new Error("Ivalid user Id");
      }

      return { lineId, lineName, photoUrl };
    } catch (err) {
      lastError = err;
      console.warn(
        `Decryption attempt ${attempt + 1} failed:`,
        err.response?.data || err.message
      );

      if (attempt === 0) {
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }

  throw new Error(
    `LINE id_token verification failed: ${
      lastError?.response?.data?.error_description || lastError?.message
    }`
  );
};

export const getLineIdToken = async (code) => {
  if (!code) {
    throw new Error("Line code misising");
  }

  const agent = new HttpsProxyAgent(config.source.PROXY_SERVER_JP);

  const data = qs.stringify({
    grant_type: "authorization_code",
    code,
    redirect_uri: `${config.source.client}/auth/line/callback`,
    client_id: config.security.LINE_CHANNEL_ID,
    client_secret: config.security.LINE_CHANNEL_SECRET,
  });

  const axiosOptions = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    httpsAgent: agent,
    timeout: 3000,
  };

  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await axios.post(
        "https://api.line.me/oauth2/v2.1/token",
        data,
        axiosOptions
      );

      if (!response.data?.id_token) {
        throw new Error("Failed to get id token from line.");
      }

      return response.data.id_token;
    } catch (err) {
      lastError = err;
      console.warn(
        `fetch attempt ${attempt + 1} failed:`,
        err.response?.data || err.message
      );

      if (attempt === 0) {
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }

  throw new Error(
    `Token request failed after 2 attempts: ${
      lastError?.response?.data?.error_description || lastError?.message
    }`
  );
};
