import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  startTapSession,
  claimTapSession,
  getGameStats,
  claimShardsBooster,
  convertOrbs,
  claimAutomata,
} from "../controllers/game.controllers";
import express from "express";
import {
  validAutomataReq,
  validShardsBoosterReq,
  validateOrbsConversion,
} from "../middlewares/game.middlewares";
const router = express.Router();

router.get("/game/stats", authMiddleware, getGameStats);

// tapping session
router.get("/game/startTapSession", authMiddleware, startTapSession);
router.post("/game/claimTapSession", authMiddleware, claimTapSession);
router.post(
  "/game/convertOrbs",
  authMiddleware,
  validateOrbsConversion,
  convertOrbs
);

// boosters
router.post(
  "/booster/claimShards",
  authMiddleware,
  validShardsBoosterReq,
  claimShardsBooster
);
router.post(
  "/booster/claimAutomata",
  authMiddleware,
  validAutomataReq,
  claimAutomata
);

export default router;
