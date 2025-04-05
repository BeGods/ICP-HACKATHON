import express from "express";
import { authMiddleware } from "../../common/middlewares/auth.middlewares";
import {
  validDailyBonusReq,
  validJoinBonusReq,
} from "../middlewares/general.ror.middlewares";
import {
  claimDailyBonus,
  claimJoinBonus,
  getLeaderboard,
} from "../controllers/general.ror.controllers";
const router = express.Router();

router.get("/bonus/daily", authMiddleware, validDailyBonusReq, claimDailyBonus);
router.get("/bonus/join", authMiddleware, validJoinBonusReq, claimJoinBonus);
router.get("/leaderboard", authMiddleware, getLeaderboard);

export default router;
