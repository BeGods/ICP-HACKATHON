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

router.get("/game/stats", authMiddleware, getGameStats);
router.get("/game/updateStats", authMiddleware, updateGameData);

// tapping session
router.post("/game/startTapSession", authMiddleware, startTapSession);
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
  "/booster/claimBurst",
  authMiddleware,
  validateBurstReq,
  claimBurst
);
router.post(
  "/game/claimBurst",
  authMiddleware,
  validateStarClaim,
  claimStarBonus
);
router.post(
  "/booster/claimAutomata",
  authMiddleware,
  validAutomataReq,
  claimAutomata
);

export default router;
