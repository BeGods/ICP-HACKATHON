import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  connectTonWallet,
  disconnectTonWallet,
} from "../controllers/user.controllers";
import express from "express";

const router = express.Router();

router.post("/user/connectTon", authMiddleware, connectTonWallet);
router.post("/user/disconnectTon", authMiddleware, disconnectTonWallet);

export default router;
