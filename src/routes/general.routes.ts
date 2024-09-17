import {
  claimDailyBonus,
  getLeaderboard,
  ping,
  updateAnnouncement,
  claimJoiningBonus,
  updateRanks,
} from "../controllers/general.controllers";
import express from "express";
const router = express.Router();
import cron from "node-cron";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { deactivateQuest } from "../controllers/quests.controllers";
import {
  validDailyBonusReq,
  validJoinBonusReq,
} from "../middlewares/general.middlewares";

router.get("/ping", ping);
router.get("/leaderboard", authMiddleware, getLeaderboard);
router.post("/announcements", authMiddleware, updateAnnouncement);
router.get("/bonus/daily", authMiddleware, claimDailyBonus);
router.get("/bonus/join", authMiddleware, validJoinBonusReq, claimJoiningBonus);
// router.get("/bonus/status", authMiddleware, checkBonus);
// router.get("/test", authMiddleware, test);

//TODO: make it on every 00:00:00 UTC
// schedule cron job for leaderboard
cron.schedule("*/60 * * * *", updateRanks);

// deactivate quest
// cron.schedule("0 * * * *", deactivateQuest);

export default router;
