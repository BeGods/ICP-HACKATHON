import { updateLeadboardRanks } from "../../fof/controllers/general.fof.controllers";
import cron from "node-cron";
import express from "express";
import config from "../../config/config";
import { adminMiddleware } from "../middlewares/auth.middlewares";
import {
  blacklistAndCleanupUsers,
  createPartner,
  createQuest,
  createReward,
  fetchPayouts,
  getAdminUpdates,
  getAllReferralsById,
  getBlacklistedUserRewardCollected,
  getPlayedUserCount,
  getUserIdsByReferral,
  ping,
  verifyPayment,
} from "../controllers/admin.controllers";
import { validatePayment } from "../middlewares/admin.middlewares";
const router = express.Router();

// ping
router.get("/ping", ping);

// get total routes
router.get(`/${config.security.ADMIN_KEY}/updates`, getAdminUpdates);

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
router.post(
  "/payments/verify",
  adminMiddleware,
  validatePayment,
  verifyPayment
);
router.post(
  `/admin${config.security.ADMIN_KEY}/blacklist`,
  adminMiddleware,
  blacklistAndCleanupUsers
);

router.get(`/admin/pending`, adminMiddleware, fetchPayouts);
router.post(
  "/admin/played",
  adminMiddleware,
  getBlacklistedUserRewardCollected
);

router.post(
  "/admin/blacklistedRewards",
  adminMiddleware,
  blacklistAndCleanupUsers
);

// migrate db
// router.get(`/${config.security.ADMIN_KEY}/migrate`, migrate);

// schedule leaderboard
cron.schedule("0 * * * *", updateLeadboardRanks);
// cron.schedule("0 0 * * *", updateDailyQuest);

export default router;
