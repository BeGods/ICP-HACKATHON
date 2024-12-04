import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  connectTonWallet,
  disconnectTonWallet,
  updateCountry,
} from "../controllers/user.controllers";
import express from "express";

const router = express.Router();

router.post("/user/country", authMiddleware, updateCountry);
router.post("/user/connectTon", authMiddleware, connectTonWallet);
router.get("/user/disconnectTon", authMiddleware, disconnectTonWallet);

export default router;
