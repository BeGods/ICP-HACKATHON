import express from "express";
import { login, testLogin } from "../controllers/auth.controllers";
const router = express.Router();

router.post("/auth", login);
// router.post("/test/auth", testLogin);

export default router;
