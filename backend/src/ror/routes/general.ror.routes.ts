import express from "express";
import { authMiddleware } from "../../common/middlewares/auth.middlewares";
import { validDailyBonusReq } from "../middlewares/general.ror.middlewares";
import { claimDailyBonus } from "../controllers/general.ror.controllers";
const router = express.Router();

router.get("/bonus/daily", authMiddleware, validDailyBonusReq, claimDailyBonus);

export default router;
