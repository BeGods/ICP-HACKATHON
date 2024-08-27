import {
  claimDailyBonus,
  getLeaderboard,
  // getUsers,
  ping,
  updateAnnouncement,
  updateRanks,
  test,
} from "../controllers/general.controllers";
import express from "express";
const router = express.Router();
import cron from "node-cron";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { deactivateQuest } from "../controllers/quests.controllers";
import { validDailyBonusReq } from "../middlewares/general.middlewares";

router.get("/ping", ping);
router.get("/leaderboard", authMiddleware, getLeaderboard);
router.post("/announcements", authMiddleware, updateAnnouncement);
router.get("/bonus/claim", authMiddleware, claimDailyBonus);
// router.get("/bonus/status", authMiddleware, checkBonus);
router.get("/test", authMiddleware, test);

//TODO: make it on every 00:00:00 UTC
// schedule cron job for leaderboard
// cron.schedule("*/10 * * * * *", updateRanks);

// deactivate quest
// cron.schedule("0 * * * *", deactivateQuest);

export default router;
