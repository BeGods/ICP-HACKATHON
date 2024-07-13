import express from "express";
import { authMiddleware } from "../middelwares/auth";
import {
  claimOrbOnShare,
  claimQuest,
  createQuest,
} from "../controllers/quests.controllers";
import { verifyCompletedQuest, verifyValidQuest } from "../middelwares/quests";
const router = express.Router();

router.post("/quests/create", authMiddleware, createQuest);
router.post("/quests/claim", authMiddleware, verifyValidQuest, claimQuest);
router.post(
  "/quests/share",
  authMiddleware,
  verifyCompletedQuest,
  claimOrbOnShare
);

export default router;
