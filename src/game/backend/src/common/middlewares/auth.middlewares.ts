import jwt from "jsonwebtoken";
import config from "../../config/config";
import User from "../models/user.models";
import rateLimit from "express-rate-limit";
import { getRealClientIP } from "../../utils/logger/logger";

export const authLimiter = rateLimit({
  windowMs: 3 * 60 * 60 * 1000, // 3 hours
  max: 3,
  handler: (req, res) => {
    const realIp = getRealClientIP(req);
    console.warn(`⚠️ Rate limit hit for IP: ${realIp} on /wallet/auth`);
    res.status(429).json({
      message: "Too many login attempts from this IP. Try again after 3 hours.",
    });
  },
  keyGenerator: (req) => {
    return getRealClientIP(req);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authMiddleware = async (req, res, next) => {
  try {
    const tokenString = req.headers?.authorization;
    const token = tokenString?.split(" ")[1];

    if (!token || !tokenString) {
      return res.status(401).json({ message: "Invalid token." });
    }

    const decodedUserData = jwt.verify(
      token,
      config.security.ACCESS_TOKEN_SECRET
    ) as jwt.JwtPayload & { _id: string };

    const user = await User.findOne({ _id: decodedUserData._id });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Not authorized to access this resource" });
    }

    if (user.isBlacklisted === true) {
      return res.status(403).json({
        error: "Your account has been blacklisted. Please connect support.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      return res.status(500).json({
        message: "Failed to validate user.",
        error: error.message,
      });
    }
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    const tokenString = req.headers?.authorization;
    const token = tokenString?.split(" ")[1];

    if (!token || !tokenString) {
      return res.status(401).json({ message: "Invalid token." });
    }

    const decodedUserData = jwt.verify(
      token,
      config.security.ACCESS_TOKEN_SECRET
    ) as jwt.JwtPayload & { _id: string };
    const user = await User.findOne({ _id: decodedUserData._id });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Not authorized to access this resource" });
    }

    if (user.role !== "admin") {
      return res.status(401).json({
        error:
          "Not authorized to access this resource. Admin permissions needed.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      return res.status(500).json({
        message: "Failed to validate user.",
        error: error.message,
      });
    }
  }
};

export const validateTgUser = async (req, res, next) => {
  const { telegramId } = req.body;

  try {
    if (!telegramId && telegramId.length < 8) {
      throw new Error("Invalid telegram user details.");
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to validate user.",
      error: error.message,
    });
  }
};
