import {
  clearRewardsInLastHr,
  createPartner,
  generateOtp,
  getRewards,
  redeemCustomReward,
  redeemPlayuperReward,
  resendOtp,
  verifyOtp,
} from "../controllers/general.fof.controllers";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  validMobileNo,
  validOnboardInput,
  validPartnerReward,
  validPlaysuperRedeem,
} from "../middlewares/general.fof.middlewares";
import express from "express";
const router = express.Router();

// playsuper
router.post("/playsuper/otp", authMiddleware, validMobileNo, generateOtp);
router.post("/playsuper/resendOtp", authMiddleware, validMobileNo, resendOtp);
router.post("/playsuper/orders", authMiddleware, resendOtp);
router.post("/playsuper/verify", authMiddleware, validOnboardInput, verifyOtp);
router.post(
  "/playsuper/redeem",
  authMiddleware,
  validPlaysuperRedeem,
  redeemPlayuperReward
);

// partners
router.get("/partners", authMiddleware, getRewards);
router.post("/partners/create", authMiddleware, createPartner);
router.post(
  "/custom/redeem",
  authMiddleware,
  validPartnerReward,
  redeemCustomReward
);

// clear rewards 1hr stats
router.get(
  "/f115d48c-4929-4190-b326-e50f228500c7/update/clearLast1hr",
  clearRewardsInLastHr
);

export default router;
