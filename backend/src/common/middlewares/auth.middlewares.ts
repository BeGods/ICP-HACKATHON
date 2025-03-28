import jwt from "jsonwebtoken";
import config from "../../config/config";
import User from "../models/user.models";

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
    );
    const user = await User.findOne({ _id: decodedUserData._id });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Not authorized to access this resource" });
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

export const validateBotNewUser = async (req, res, next) => {
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
