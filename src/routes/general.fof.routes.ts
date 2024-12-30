import {
  claimDailyBonus,
  getLeaderboard,
  claimJoiningBonus,
  claimStreakBonus,
  fetchUserData,
  addUserBet,
  updateReward,
} from "../controllers/general.fof.controllers";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  validateStreakBonus,
  validateUserBet,
  validDailyBonusReq,
  validDailyHackBonus,
  validJoinBonusReq,
} from "../middlewares/general.fof.middlewares";
import { storeImage } from "../controllers/storage.controllers";
import express from "express";
const router = express.Router();

// leaderboard
router.get("/leaderboard", authMiddleware, getLeaderboard);
// router.get("/user", authMiddleware, fetchUserData);
router.post("/leaderboard/bet", authMiddleware, validateUserBet, addUserBet);
router.get("/update/reward", authMiddleware, updateReward);

// bonus
router.get("/bonus/daily", authMiddleware, validDailyBonusReq, claimDailyBonus);
router.get("/bonus/dail", authMiddleware, validDailyHackBonus, claimDailyBonus);
router.get("/bonus/join", authMiddleware, validJoinBonusReq, claimJoiningBonus);
router.get(
  "/bonus/streak",
  authMiddleware,
  validateStreakBonus,
  claimStreakBonus
);

// avatar
router.get("/profile/avatar", authMiddleware, storeImage);

// router.get("/test/script", runProfileScript);

// announcements
// router.post("/announcements", authMiddleware, updateAnnouncement);

// Schedule cron job for leaderboard update every hour
// deactivate quest
// cron.schedule("0 * * * *", deactivateQuest);

export default router;
