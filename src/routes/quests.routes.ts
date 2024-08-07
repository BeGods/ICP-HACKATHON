import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  claimLostQuest,
  claimOrbOnShare,
  claimQuest,
  claimQuestShare,
  completeQuest,
  createQuest,
  unClaimedQuests,
} from "../controllers/quests.controllers";
import {
  verifyCompletedQuest,
  verifyQuestClaim,
  verifyValidLostQuest,
  verifyValidQuest,
  verifyValidShareClaim,
} from "../middlewares/quests.middlewares";
const router = express.Router();

router.get("/quests/lost", authMiddleware, unClaimedQuests);
router.post("/quests/create", authMiddleware, createQuest);
router.post(
  "/quests/complete",
  authMiddleware,
  verifyValidQuest,
  completeQuest
);
router.post("/quests/claim", authMiddleware, verifyQuestClaim, claimQuest);
router.post(
  "/quests/claimLostQuest",
  authMiddleware,
  verifyValidLostQuest,
  claimLostQuest
);
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
