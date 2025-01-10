import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  claimQuestRwrd,
  claimQuest,
  claimQuestInfoRwrd,
  claimTask,
} from "../controllers/quests.fof.controllers";
import {
  verifyCompletedQuest,
  verifyValidQuest,
  verifyValidShareClaim,
} from "../middlewares/quests.fof.middlewares";
const router = express.Router();

// quests
router.post("/quests/claim", authMiddleware, verifyValidQuest, claimQuest);

// other social quests
router.post("/quests/social", authMiddleware, verifyValidQuest, claimTask);

// extra orb reward
router.post(
  "/quests/claim/share",
  authMiddleware,
  verifyCompletedQuest,
  claimQuestRwrd
);

// share quest
router.post(
  "/quests/share",
  authMiddleware,
  verifyValidShareClaim,
  claimQuestInfoRwrd
);

export default router;
