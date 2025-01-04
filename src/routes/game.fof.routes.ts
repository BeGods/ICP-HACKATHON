import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  startGameSession,
  claimGameSession,
  getGameStats,
  convertOrbs,
  updateGameData,
  updateRatData,
  claimStarRwrd,
} from "../controllers/game.fof.controllers";
import {
  validAutoAutomataReq,
  validateMultiBurst,
  validateAutomata,
  validateAlchemist,
  validateBurst,
  validateClaimMoon,
  validateOrbsConversion,
  validateRatClaim,
  validateStarClaim,
} from "../middlewares/game.fof.middlewares";
import express from "express";
import {
  claimAlchemist,
  claimAutomata,
  claimBurst,
  claimMoon,
  claimMultiAutomata,
  claimMultiBurst,
} from "../controllers/boosters.fof.controllers";
const router = express.Router();

// stats
router.get("/game/stats", authMiddleware, getGameStats);
router.get("/game/stats/update", authMiddleware, updateGameData);

// session
router.post("/game/startTapSession", authMiddleware, startGameSession);
router.post("/game/claimTapSession", authMiddleware, claimGameSession);
router.post("/game/burst", authMiddleware, validateStarClaim, claimStarRwrd);
router.post("/game/rat", authMiddleware, validateRatClaim, updateRatData);

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
  validateAlchemist,
  claimAlchemist
);
router.post("/booster/claim/burst", authMiddleware, validateBurst, claimBurst);
router.post(
  "/booster/claim/automata",
  authMiddleware,
  validateAutomata,
  claimAutomata
);
router.get(
  "/game/convert",
  authMiddleware,
  validateOrbsConversion,
  convertOrbs
);

// special boosters
router.post(
  "/booster/autoClaim/automata",
  authMiddleware,
  validAutoAutomataReq,
  claimMultiAutomata
);
router.post(
  "/booster/autoClaim/burst",
  authMiddleware,
  validateMultiBurst,
  claimMultiBurst
);
router.post(
  "/booster/claim/moon",
  authMiddleware,
  validateClaimMoon,
  claimMoon
);

// announcement specials
// router.get("/reward/claim", authMiddleware, claimAutomataReward);

export default router;
