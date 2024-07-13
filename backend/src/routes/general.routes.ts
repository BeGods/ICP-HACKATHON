import {
  getLeaderboard,
  ping,
  updateRanks,
} from "../controllers/general.controllers";
import express from "express";
const router = express.Router();
import cron from "node-cron";
import { authMiddleware } from "../middlewares/auth.middlewares";

router.get("/ping", ping);
router.get("/leaderboard", authMiddleware, getLeaderboard);

// schedule cron job for leaderboard
cron.schedule("*/30 * * * * *", updateRanks);

export default router;
