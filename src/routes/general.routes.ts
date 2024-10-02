import {
  claimDailyBonus,
  getLeaderboard,
  ping,
  updateAnnouncement,
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

router.get("/ping", ping);
router.get("/leaderboard", authMiddleware, getLeaderboard);
router.post("/announcements", authMiddleware, updateAnnouncement);
router.get("/rewards", authMiddleware, getRewards);

router.get("/bonus/daily", authMiddleware, validDailyBonusReq, claimDailyBonus);
router.get("/bonus/dail", authMiddleware, validDailyHackBonus, claimDailyBonus);
router.get("/bonus/join", authMiddleware, validJoinBonusReq, claimJoiningBonus);

// playsuper
router.post("/playsuper/otp", authMiddleware, generateOtp);
router.post("/playsuper/resendOtp", authMiddleware, resendOtp);
router.post("/playsuper/verify", authMiddleware, verifyOtp);
router.post("/partners/create", authMiddleware, createPartner);
router.post(
  "/playsuper/redeem",
  authMiddleware,
  validPlaysuperRedeem,
  redeemPlayuperReward
);

router.get(
  "/f115d48c-4929-4190-b326-e50f228500c7/update/clearLast1hr",
  clearRewardsInLastHr
);
router.get(
  "/f115d48c-4929-4190-b326-e50f228500c7/update/rewardsInLastHr",
  updateRanks
);
router.get(
  "/f115d48c-4929-4190-b326-e50f228500c7/update/quest",
  deactivateQuest
);
// Schedule cron job for leaderboard update every hour
cron.schedule("0 * * * *", updateRanks);

// Schedule cron job for clearing rewards every hour
cron.schedule("0 * * * *", clearRewardsInLastHr);

// deactivate quest
// cron.schedule("0 * * * *", deactivateQuest);

export default router;
