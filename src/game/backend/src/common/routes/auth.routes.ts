import express from "express";
import {
  authenticateKaiaAddr,
  authenticateLine,
  authenticateOneWave,
  authenticateOTP,
  authenticateTg,
  authenticateTwitter,
  createOneWaveSession,
  generateOtp,
  generateRefreshToken,
  logoutUser,
  testAuthenticate,
} from "../controllers/auth.controllers";
import { authLimiter } from "../middlewares/auth.middlewares";
const authRouter = express.Router();

// login
authRouter.post("/auth/otp", generateOtp);
authRouter.get("/auth/logout", logoutUser);
authRouter.post("/auth/verify", authenticateOTP);
authRouter.post("/tele/auth", authenticateTg);
authRouter.post("/twitter/auth", authenticateTwitter);
authRouter.post("/line/auth", authenticateLine);
authRouter.post("/wallet/auth", authLimiter, authenticateKaiaAddr);
authRouter.get("/auth/refresh", generateRefreshToken);
authRouter.post("/onewave/session", createOneWaveSession);
authRouter.post("/auth/onewave", authenticateOneWave);
authRouter.post(
  "/test/f115d48c-4929-4190-b326-e50f228500c9/auth",
  testAuthenticate
);

export default authRouter;
