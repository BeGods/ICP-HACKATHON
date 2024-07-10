import { authMiddleware } from "../middelwares/auth";
import {
  startTapSession,
  claimTapSession,
} from "../controllers/game.controllers";
import express from "express";
const router = express.Router();

router.get("/game/stats", authMiddleware);
// tapping session
router.get("/game/startTapSession", authMiddleware, startTapSession);
router.post("/game/claimTapSession", authMiddleware, claimTapSession);

export default router;
