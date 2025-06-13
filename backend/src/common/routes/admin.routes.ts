import { updateLeadboardRanks } from "../../fof/controllers/general.fof.controllers";
import cron from "node-cron";
import express from "express";
import config from "../../config/config";
import { adminMiddleware } from "../middlewares/auth.middlewares";
import {
  createPartner,
  createQuest,
  createReward,
  getActiveUsers,
  getDailyUsers,
  getHourlyUsers,
  getTotalUsers,
  ping,
} from "../controllers/admin.controllers";
const router = express.Router();

// ping
router.get("/ping", ping);

// get total routes
router.get(`/${config.security.ADMIN_KEY}/totalUsers`, getTotalUsers);
router.get(`/${config.security.ADMIN_KEY}/dailyUsers`, getDailyUsers);
router.get(`/${config.security.ADMIN_KEY}/hourlyUsers`, getHourlyUsers);
router.get(`/${config.security.ADMIN_KEY}/activeUsers`, getActiveUsers);

// admin: update leaderboard
router.get(
  `/${config.security.ADMIN_KEY}/leaderboard`,
  adminMiddleware,
  updateLeadboardRanks
);

// admin: create quest
router.post(
  `/${config.security.ADMIN_KEY}/quests/create`,
  adminMiddleware,
  createQuest
);

// admin: create partner
router.post("/partners/create", adminMiddleware, createPartner);

// admin: create reward
router.post("/rewards/create", adminMiddleware, createReward);
// admin: update status
router.post("/payments/verify", adminMiddleware, createReward);

// migrate db
// router.get(`/${config.security.ADMIN_KEY}/migrate`, migrate);

// schedule leaderboard
cron.schedule("0 * * * *", updateLeadboardRanks);
// cron.schedule("0 0 * * *", updateDailyQuest);

export default router;
