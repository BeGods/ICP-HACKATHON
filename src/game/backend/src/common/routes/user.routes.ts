import {
  authMiddleware,
  validateTgUser,
} from "../middlewares/auth.middlewares";
import {
  claimFinishRwrd,
  connectLineWallet,
  connectTonWallet,
  disconnectLineWallet,
  disconnectTonWallet,
  getWithdrawHistory,
  updateAvatar,
  updateCountry,
  initateWithdraw,
  claimMsnReward,
} from "../controllers/user.controllers";
import express from "express";
import { createNewUserIfNoExists } from "../controllers/auth.controllers";
import {
  validateFoFEnd,
  validateValidMsn,
  validateWithdrawBal,
} from "../middlewares/user.middlewares";
import { registerFOFQuestCmpl } from "../services/icp.services";

const router = express.Router();

// wallets
router.post("/connect/ton", authMiddleware, connectTonWallet);
router.get("/disconnect/ton", authMiddleware, disconnectTonWallet);
router.post("/connect/line", authMiddleware, connectLineWallet);
router.get("/disconnect/line", authMiddleware, disconnectLineWallet);

// profile
router.post("/user/country", authMiddleware, updateCountry);
router.get("/profile/avatar", authMiddleware, updateAvatar);

// fof
router.get("/user/finish", authMiddleware, validateFoFEnd, claimFinishRwrd);

// new user
router.post("/user/refer", validateTgUser, createNewUserIfNoExists);

// balance
router.post(
  "/holdings/withdraw",
  authMiddleware,
  validateWithdrawBal,
  initateWithdraw
);
router.get("/holdings/history", authMiddleware, getWithdrawHistory);

// rewards
// reward
router.post("/reward/claim", authMiddleware, validateValidMsn, claimMsnReward);

router.get("/icp/register", registerFOFQuestCmpl);

export default router;
