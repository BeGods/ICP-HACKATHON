import { updateLeadboardRanks } from "../../fof/controllers/general.fof.controllers";
import cron from "node-cron";
import express from "express";
import config from "../../config/config";
import { adminMiddleware } from "../middlewares/auth.middlewares";
import {
  updateBlacklistStatus,
  createPartner,
  createQuest,
  createReward,
  getAdminUpdates,
  getBlacklistedRwrds,
  ping,
  getUserIdsByRefer,
  getReferTreeOfUsers,
  getTrxById,
  getPendingWithdrawals,
  getAdminPayments,
  userIdByAddr,
  getAdId,
} from "../controllers/admin.controllers";
import { validateTrx } from "../middlewares/admin.middlewares";
const router = express.Router();

// ping
router.get("/ping", ping);

// get total routes
router.get(`/${config.security.ADMIN_KEY}/updates`, getAdminUpdates);
router.get("/ads/id", getAdId);

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
router.get("/admin/payments", getAdminPayments);
router.post("/admin/payments/verify", adminMiddleware, getTrxById);
router.get("/admin/payments/pending", adminMiddleware, getPendingWithdrawals);

// admin: blacklist
router.post(
  `/admin/${config.security.ADMIN_KEY}/blacklist`,
  adminMiddleware,
  updateBlacklistStatus
);
router.post(
  `/admin/${config.security.ADMIN_KEY}/blacklisted-rewards`,
  adminMiddleware,
  getBlacklistedRwrds
);
router.post(
  `/admin/${config.security.ADMIN_KEY}/refer-tree`,
  adminMiddleware,
  getReferTreeOfUsers
);
router.post(
  `/admin/${config.security.ADMIN_KEY}/idByrefer`,
  adminMiddleware,
  getUserIdsByRefer
);
router.post(
  `/admin/${config.security.ADMIN_KEY}/idByAddr`,
  adminMiddleware,
  getTrxById
);
// migrate db
// router.get(`/${config.security.ADMIN_KEY}/migrate`, migrate);

// cron.schedule("0 0 * * *", updateDailyQuest);

export default router;
