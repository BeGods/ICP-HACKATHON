import { authMiddleware } from "../middelwares/auth";
import {
  startTapSession,
  claimTapSession,
  getGameStats,
  claimShardsBooster,
} from "../controllers/game.controllers";
import express from "express";
import { validShardsBoosterReq } from "../middelwares/game";
const router = express.Router();

router.get("/game/stats", authMiddleware, getGameStats);

// tapping session
router.get("/game/startTapSession", authMiddleware, startTapSession);
router.post("/game/claimTapSession", authMiddleware, claimTapSession);

// boosters
router.post(
  "/booster/claimShards",
  authMiddleware,
  validShardsBoosterReq,
  claimShardsBooster
);

export default router;
