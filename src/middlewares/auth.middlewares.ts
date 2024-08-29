import jwt from "jsonwebtoken";
import config from "../config/config";
import User from "../models/user.models";

export const authMiddleware = async (req, res, next) => {
  try {
    const tokenString = req.headers?.authorization;

    const token = tokenString?.split(" ")[1];

    if (!token || !tokenString) {
      return res.status(400).json({ message: "Invalid token." });
      console.log("Invalid Token");
    }

    const decodedUserData = await jwt.verify(token, config.security.JWT_SECRET);
    const user = await User.findOne({ _id: decodedUserData._id });

    if (!user) {
      throw new Error("Not authorized to access this resource");
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ error: "Not authorized to access this resource" });
    } else {
      res.status(500).json({
        message: "Internal server error.",
        error: error.message,
      });
    }
  }
};
