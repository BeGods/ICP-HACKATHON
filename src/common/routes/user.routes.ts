import {
  authMiddleware,
  validateBotNewUser,
} from "../middlewares/auth.middlewares";
import {
  claimFinishRwrd,
  connectLineWallet,
  connectTonWallet,
  createLinePayment,
  disconnectLineWallet,
  disconnectTonWallet,
  updateAvatar,
  updateCountry,
  updateLinePaymentStatus,
  withdrawReward,
} from "../controllers/user.controllers";
import express from "express";
import { createNewUserIfNoExists } from "../controllers/auth.controllers";
import {
  validateFinishedRwrd,
  validateWithdrawRwrd,
} from "../middlewares/user.middlewares";

const router = express.Router();

router.post("/user/country", authMiddleware, updateCountry);
router.post("/connect/ton", authMiddleware, connectTonWallet);
router.get("/disconnect/ton", authMiddleware, disconnectTonWallet);
router.post("/connect/line", authMiddleware, connectLineWallet);
router.get("/disconnect/line", authMiddleware, disconnectLineWallet);
router.get("/profile/avatar", authMiddleware, updateAvatar);
router.get(
  "/user/finish",
  authMiddleware,
  validateFinishedRwrd,
  claimFinishRwrd
);

// new user
router.post("/user/refer", validateBotNewUser, createNewUserIfNoExists);
router.get("/line/createPayment", authMiddleware, createLinePayment);
router.post("/line/paymentStatus", updateLinePaymentStatus);
router.post("/rewards/withdraw", validateWithdrawRwrd, withdrawReward);

export default router;
