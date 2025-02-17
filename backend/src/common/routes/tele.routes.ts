import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  generateStarInvoice,
  verifyStarPayment,
} from "../controllers/stars.controllers";
const teleRouter = express.Router();

teleRouter.get("/stars/invoice", authMiddleware, generateStarInvoice);
teleRouter.post("/stars/verify", verifyStarPayment);

export default teleRouter;
