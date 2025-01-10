import {
  generateOtp,
  getAllPartners,
  redeemCustomRwrd,
  redeemPlayuperRwrd,
  resendOtp,
  verifyOtp,
} from "../controllers/partners.controllers";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  validMobileNo,
  validOnboardInput,
  validPartnerRwrd,
  validPlaysuperRedeem,
} from "../middlewares/general.fof.middlewares";
import express from "express";
const router = express.Router();

// playsuper
router.post("/playsuper/otp", authMiddleware, validMobileNo, generateOtp);
router.post("/playsuper/resendOtp", authMiddleware, validMobileNo, resendOtp);
router.post("/playsuper/verify", authMiddleware, validOnboardInput, verifyOtp);
router.post(
  "/playsuper/redeem",
  authMiddleware,
  validPlaysuperRedeem,
  redeemPlayuperRwrd
);

// partners
router.get("/partners", authMiddleware, getAllPartners);
router.post(
  "/custom/redeem",
  authMiddleware,
  validPartnerRwrd,
  redeemCustomRwrd
);

export default router;
