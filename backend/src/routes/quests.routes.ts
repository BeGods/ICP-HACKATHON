import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  claimOrbOnShare,
  claimQuest,
  claimQuestShare,
  createQuest,
  unClaimedQuests,
} from "../controllers/quests.controllers";
import {
  verifyCompletedQuest,
  verifyValidQuest,
  verifyValidShareClaim,
} from "../middlewares/quests.middlewares";
const router = express.Router();

router.get("/quests/lost", authMiddleware, unClaimedQuests);
router.post("/quests/create", authMiddleware, createQuest);
router.post("/quests/claim", authMiddleware, verifyValidQuest, claimQuest);
router.post(
  "/quests/claim/share",
  authMiddleware,
  verifyCompletedQuest,
  claimOrbOnShare
);
router.post(
  "/quests/share",
  authMiddleware,
  verifyValidShareClaim,
  claimQuestShare
);

export default router;
