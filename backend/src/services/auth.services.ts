import jwt from "jsonwebtoken";
import config from "../config/config";

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
