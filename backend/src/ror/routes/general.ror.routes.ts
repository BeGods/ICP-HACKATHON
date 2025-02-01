import express from "express";
import { authMiddleware } from "../../common/middlewares/auth.middlewares";
import { validDailyBonusReq } from "../middlewares/general.ror.middlewares";
const router = express.Router();

router.get("/bonus/daily", authMiddleware, validDailyBonusReq);
