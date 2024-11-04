import { authMiddleware } from "../../middlewares/auth.middlewares";
import { getGameStats } from "../../controllers/ror/game.controllers";
import express from "express";
const router = express.Router();

router.get("/game/stats", authMiddleware, getGameStats);

export default router;
