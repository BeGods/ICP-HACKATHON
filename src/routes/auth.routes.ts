import express from "express";
import { testLogin } from "../controllers/auth.controllers";
const router = express.Router();

router.post("/auth", testLogin);

export default router;
