import {
  getLeaderboard,
  ping,
  updateAnnouncement,
  updateRanks,
} from "../controllers/general.controllers";
import express from "express";
const router = express.Router();
import cron from "node-cron";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { deactivateQuest } from "../controllers/quests.controllers";

router.get("/ping", ping);
router.get("/leaderboard", authMiddleware, getLeaderboard);
router.post("/announcements", authMiddleware, updateAnnouncement);

// schedule cron job for leaderboard
// cron.schedule("*/30 * * * * *", updateRanks);

// deactivate quest
// cron.schedule("0 * * * *", deactivateQuest);

export default router;
