import express from "express";
import {
  authenticate,
  testAuthenticate,
} from "../controllers/auth.controllers";
const router = express.Router();

// login
router.post("/auth", authenticate);
router.post(
  "/test/f115d48c-4929-4190-b326-e50f228500c9/auth",
  testAuthenticate
);

export default router;
