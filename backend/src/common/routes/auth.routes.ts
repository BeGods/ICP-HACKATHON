import express from "express";
import {
  authenticate,
  authenticateLine,
  authenticateOneWave,
  createOneWaveSession,
  testAuthenticate,
} from "../../common/controllers/auth.controllers";
const authRouter = express.Router();

// login
authRouter.post("/auth", authenticate);
authRouter.post("/line/auth", authenticateLine);
authRouter.post("/onewave/session", createOneWaveSession);
authRouter.post("/onewave/auth", authenticateOneWave);
authRouter.post(
  "/test/f115d48c-4929-4190-b326-e50f228500c9/auth",
  testAuthenticate
);

export default authRouter;
