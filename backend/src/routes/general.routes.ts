import {
  claimDailyBonus,
  getLeaderboard,
  ping,
  claimJoiningBonus,
  updateRanks,
  getRewards,
  generateOtp,
  resendOtp,
  verifyOtp,
  createPartner,
  clearRewardsInLastHr,
  redeemPlayuperReward,
} from "../controllers/general.controllers";
import express from "express";
import cron from "node-cron";
const router = express.Router();
import { authMiddleware } from "../middlewares/auth.middlewares";
import { deactivateQuest } from "../controllers/quests.controllers";
import {
  validDailyBonusReq,
  validDailyHackBonus,
  validJoinBonusReq,
  validPlaysuperRedeem,
} from "../middlewares/general.middlewares";
import {
  getFolders,
  getProfilePhotoUrl,
  storeImage,
} from "../controllers/storage.controllers";

// ping
router.get("/ping", ping);

// leaderboard
router.get("/leaderboard", authMiddleware, getLeaderboard);
router.get(
  "/f115d48c-4929-4190-b326-e50f228500c7/update/rewardsInLastHr",
  updateRanks
);

// bonus
router.get("/bonus/daily", authMiddleware, validDailyBonusReq, claimDailyBonus);
router.get("/bonus/dail", authMiddleware, validDailyHackBonus, claimDailyBonus);
router.get("/bonus/join", authMiddleware, validJoinBonusReq, claimJoiningBonus);

// playsuper
router.post("/playsuper/otp", authMiddleware, generateOtp);
router.post("/playsuper/resendOtp", authMiddleware, resendOtp);
router.post("/playsuper/orders", authMiddleware, resendOtp);
router.post("/playsuper/verify", authMiddleware, verifyOtp);
router.post(
  "/playsuper/redeem",
  authMiddleware,
  validPlaysuperRedeem,
  redeemPlayuperReward
);

// partners
router.get("/partners", authMiddleware, getRewards);
router.post("/partners/create", authMiddleware, createPartner);

// clear rewards 1hr stats
router.get(
  "/f115d48c-4929-4190-b326-e50f228500c7/update/clearLast1hr",
  clearRewardsInLastHr
);

// schedule quest
router.get(
  "/f115d48c-4929-4190-b326-e50f228500c7/update/quest",
  deactivateQuest
);

router.get("/profile/avatar", authMiddleware, storeImage);

// announcements
// router.post("/announcements", authMiddleware, updateAnnouncement);

// Schedule cron job for leaderboard update every hour
cron.schedule("0 * * * *", updateRanks);

// deactivate quest
// cron.schedule("0 * * * *", deactivateQuest);

export default router;
