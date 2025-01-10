import { updateLeadboardRanks } from "../../fof/controllers/general.fof.controllers";
import cron from "node-cron";
import express from "express";
import config from "../../config/config";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  createPartner,
  createQuest,
  getDailyActiveUsers,
  getDailyUsers,
  getHourlyUsers,
  getTotalUsers,
  ping,
  updateDailyQuest,
} from "../controllers/admin.controllers";
const router = express.Router();

// ping
router.get("/ping", ping);

// get total routes
router.get(`/${config.security.ADMIN_KEY}/totalUsers`, getTotalUsers);
router.get(`/${config.security.ADMIN_KEY}/dailyUsers`, getDailyUsers);
router.get(`/${config.security.ADMIN_KEY}/hourlyUsers`, getHourlyUsers);
router.get(`/${config.security.ADMIN_KEY}/activeUsers`, getDailyActiveUsers);

// manually update leaderboard
router.get(`/${config.security.ADMIN_KEY}/leaderboard`, updateLeadboardRanks);

// manually create quest
router.post(
  `/${config.security.ADMIN_KEY}/quests/create`,
  authMiddleware,
  createQuest
);

// add partner
router.post("/partners/create", authMiddleware, createPartner);

// migrate db
// router.get(`/${config.security.ADMIN_KEY}/migrate`, updateFileCode);

// schedule leaderboard
cron.schedule("0 * * * *", updateLeadboardRanks);
cron.schedule("0 0 * * *", updateDailyQuest);

export default router;
