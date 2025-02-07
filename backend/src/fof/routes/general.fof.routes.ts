import {
  claimDailyBonus,
  getLeaderboard,
  claimJoinBonus,
  claimStreakBonus,
  addUserBet,
  updateBetRwrdStatus,
  validateUserPlayed,
} from "../controllers/general.fof.controllers";
import { authMiddleware } from "../../common/middlewares/auth.middlewares";
import {
  validateStreakBonus,
  validateUserBet,
  validDailyBonusReq,
  validDailyHackBonus,
  validJoinBonusReq,
} from "../middlewares/general.fof.middlewares";
import express from "express";
const router = express.Router();

// leaderboard
router.get("/leaderboard", authMiddleware, getLeaderboard);
router.post("/leaderboard/bet", authMiddleware, validateUserBet, addUserBet);
router.get("/update/reward", authMiddleware, updateBetRwrdStatus);

// bonus
router.get("/bonus/daily", authMiddleware, validDailyBonusReq, claimDailyBonus);
router.get("/bonus/dail", authMiddleware, validDailyHackBonus, claimDailyBonus);
router.get("/bonus/join", authMiddleware, validJoinBonusReq, claimJoinBonus);
router.get(
  "/bonus/streak",
  authMiddleware,
  validateStreakBonus,
  claimStreakBonus
);

router.get("/validate/user", authMiddleware, validateUserPlayed);

// router.get("/test/script", runProfileScript);

// announcements
// router.post("/announcements", authMiddleware, updateAnnouncement);

// Schedule cron job for leaderboard update every hour
// deactivate quest
// cron.schedule("0 * * * *", deactivateQuest);

export default router;
