import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  connectTonWallet,
  disconnectTonWallet,
} from "../controllers/user.controllers";
import express from "express";

const router = express.Router();

router.post("/user/connectTon", authMiddleware, connectTonWallet);
router.get("/user/disconnectTon", authMiddleware, disconnectTonWallet);

export default router;
