import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  claimLostQuest,
  claimOrbOnShare,
  claimQuest,
  claimQuestShare,
  claimSocialQuest,
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

// quests
router.post("/quests/create", authMiddleware, createQuest);
router.post(
  "/quests/complete",
  authMiddleware,
  verifyValidQuest,
  completeQuest
);
router.post("/quests/claim", authMiddleware, verifyQuestClaim, claimQuest);

// lost quests
router.get("/quests/lost", authMiddleware, unClaimedQuests);
router.post(
  "/quests/claim/lost",
  authMiddleware,
  verifyValidLostQuest,
  claimLostQuest
);

// other social quests
router.post(
  "/quests/social",
  authMiddleware,
  verifyValidQuest,
  claimSocialQuest
);

// extra orb-reward
router.post(
  "/quests/claim/share",
  authMiddleware,
  verifyCompletedQuest,
  claimOrbOnShare
);

// share quest
router.post(
  "/quests/share",
  authMiddleware,
  verifyValidShareClaim,
  claimQuestShare
);

export default router;
