import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  startTapSession,
  claimTapSession,
  getGameStats,
  claimShardsBooster,
  convertOrbs,
  claimAutomata,
  claimStarBonus,
  updateGameData,
  claimBurst,
} from "../controllers/game.controllers";
import express from "express";
import {
  validAutomataReq,
  validShardsBoosterReq,
  validateBurstReq,
  validateOrbsConversion,
  validateStarClaim,
} from "../middlewares/game.middlewares";
const router = express.Router();

// stats
router.get("/game/stats", authMiddleware, getGameStats);
router.get("/game/stats/update", authMiddleware, updateGameData);

// tapping session
router.post("/game/startTapSession", authMiddleware, startTapSession);
router.post("/game/claimTapSession", authMiddleware, claimTapSession);
router.post("/game/burst", authMiddleware, validateStarClaim, claimStarBonus);

// tower conversion
router.post(
  "/game/convert",
  authMiddleware,
  validateOrbsConversion,
  convertOrbs
);

// boosters
router.post(
  "/booster/claim/minion",
  authMiddleware,
  validShardsBoosterReq,
  claimShardsBooster
);
router.post(
  "/booster/claim/burst",
  authMiddleware,
  validateBurstReq,
  claimBurst
);
router.post(
  "/booster/claim/automata",
  authMiddleware,
  validAutomataReq,
  claimAutomata
);

export default router;
