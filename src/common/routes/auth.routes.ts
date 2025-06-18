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
} from "../../common/controllers/auth.controllers";
const authRouter = express.Router();

// login
authRouter.post("/auth/otp", generateOtp);
authRouter.get("/auth/logout", logoutUser);
authRouter.post("/auth/verify", authenticateOTP);
authRouter.post("/tele/auth", authenticateTg);
authRouter.post("/twitter/auth", authenticateTwitter);
authRouter.post("/line/auth", authenticateLine);
authRouter.post("/wallet/auth", authenticateKaiaAddr);
authRouter.get("/auth/refresh", generateRefreshToken);
authRouter.post("/onewave/session", createOneWaveSession);
authRouter.post("/onewave/auth", authenticateOneWave);
authRouter.post(
  "/test/f115d48c-4929-4190-b326-e50f228500c9/auth",
  testAuthenticate
);

export default authRouter;
