import express from "express";
import { authMiddleware } from "../../common/middlewares/auth.middlewares";
import {
  getGameStats,
  updateCardDeck,
} from "../controllers/game.dod.controllers";
import {
  validateActivateGod,
  validateEquipRelic,
  validateExplore,
  validateResolveBattle,
  validateStartSession,
  validateUpdateDeck,
} from "../middlewares/game.dod.middlewares";
import {
  activateGod,
  equipRelic,
  resolveBattle,
  startSession,
  triggerExplore,
} from "../controllers/turns.dod.controllers";
const router = express.Router();

// stats
router.get("/game/stats", authMiddleware, getGameStats);
router.post("/game/deck", authMiddleware, validateUpdateDeck, updateCardDeck);

// start turn
router.get("/turns/start", authMiddleware, validateStartSession, startSession);

// activate god
router.post("/equip/god", authMiddleware, validateActivateGod, activateGod);
router.post("/equip/relic", authMiddleware, validateEquipRelic, equipRelic);

// battle resolve
router.post(
  "/battle/resolve",
  authMiddleware,
  validateResolveBattle,
  resolveBattle
);

router.get("/battle/explore", authMiddleware, validateExplore, triggerExplore);

// turns
// router.get(
//   "/game/turns/start",
//   authMiddleware,
//   validateStartSession,
//   startSession
// );
// router.get("/game/turns/end", authMiddleware, validateEndSession, endSession);

export default router;
