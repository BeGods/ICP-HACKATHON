import {
  getTotalUsers,
  ping,
  updateRanks,
} from "../controllers/general.fof.controllers";
import { deactivateQuest } from "../controllers/quests.fof.controllers";
import cron from "node-cron";
import express from "express";
const router = express.Router();

// ping
router.get("/ping", ping);

// get total routes
router.get("/f115d48c-4929-4190-b326-e50f228500c7/totalUsers", getTotalUsers);

// manually update leaderboard
router.get("/f115d48c-4929-4190-b326-e50f228500c7/leaderboard", updateRanks);

// schedule quest
cron.schedule("0 * * * *", updateRanks);
router.get(
  "/f115d48c-4929-4190-b326-e50f228500c7/update/quest",
  deactivateQuest
);

export default router;
