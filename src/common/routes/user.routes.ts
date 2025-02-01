import {
  authMiddleware,
  validateBotNewUser,
} from "../middlewares/auth.middlewares";
import {
  connectTonWallet,
  disconnectTonWallet,
  generateOtp,
  updateAvatar,
  updateCountry,
  verifyOtp,
} from "../controllers/user.controllers";
import express from "express";
import { createNewUserIfNoExists } from "../controllers/auth.controllers";

const router = express.Router();

router.post("/user/country", authMiddleware, updateCountry);
router.post("/user/connectTon", authMiddleware, connectTonWallet);
router.get("/user/disconnectTon", authMiddleware, disconnectTonWallet);
router.post("/auth/otp", authMiddleware, generateOtp);
router.post("/auth/verify", authMiddleware, verifyOtp);
router.get("/profile/avatar", authMiddleware, updateAvatar);

// new user
router.post("/user/refer", validateBotNewUser, createNewUserIfNoExists);

export default router;
