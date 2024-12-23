import {
  getDailyActiveUsers,
  getDailyUsers,
  getHourlyUsers,
  getTotalUsers,
  migrateDb,
  ping,
  updateDailyQuest,
  updateRanks,
} from "../controllers/general.fof.controllers";
import { createQuest } from "../controllers/quests.fof.controllers";
import cron from "node-cron";
import express from "express";
import config from "../config/config";
import { authMiddleware } from "../middlewares/auth.middlewares";
const router = express.Router();

// ping
router.get("/ping", ping);

// get total routes
router.get(`/${config.security.ADMIN_KEY}/totalUsers`, getTotalUsers);
router.get(`/${config.security.ADMIN_KEY}/dailyUsers`, getDailyUsers);
router.get(`/${config.security.ADMIN_KEY}/hourlyUsers`, getHourlyUsers);
router.get(`/${config.security.ADMIN_KEY}/activeUsers`, getDailyActiveUsers);
router.get(`/${config.security.ADMIN_KEY}/migrate`, migrateDb);

// manually update leaderboard
router.get(`/${config.security.ADMIN_KEY}/leaderboard`, updateRanks);

// manually deactive quest
// router.get(`/${config.security.ADMIN_KEY}/update/quest`, updateDailyQuest);

// manually create quest
router.post(
  `/${config.security.ADMIN_KEY}/quests/create`,
  authMiddleware,
  createQuest
);

// schedule leaderboard
cron.schedule("0 * * * *", updateRanks);
cron.schedule("0 0 * * *", updateDailyQuest);

export default router;
