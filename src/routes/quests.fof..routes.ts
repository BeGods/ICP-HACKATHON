import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  claimOrbOnShare,
  claimQuest,
  claimQuestShare,
  claimSocialQuest,
  createQuest,
} from "../controllers/quests.fof.controllers";
import {
  verifyCompletedQuest,
  verifyValidQuest,
  verifyValidShareClaim,
} from "../middlewares/quests.fof.middlewares";
const router = express.Router();

// quests
router.post("/quests/create", authMiddleware, createQuest);
router.post("/quests/claim", authMiddleware, verifyValidQuest, claimQuest);

// other social quests
router.post(
  "/quests/social",
  authMiddleware,
  verifyValidQuest,
  claimSocialQuest
);

// extra orb reward
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

// lost quests
// router.get("/quests/lost", authMiddleware, unClaimedQuests);
// router.post(
//   "/quests/claim/lost",
//   authMiddleware,
//   verifyValidLostQuest,
//   claimLostQuest
// );

export default router;
