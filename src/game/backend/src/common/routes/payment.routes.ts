import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
  createDappInvoice,
  genStarInvoice,
  pullKaiaValue,
  verifyDappPayment,
  verifyStarPayment,
} from "../controllers/payment.controllers";
const paymentRouter = express.Router();

// telegram stars
paymentRouter.get("/tele/stars/invoice", authMiddleware, genStarInvoice);
paymentRouter.post("/stars/verify", verifyStarPayment);

// dapp payments
paymentRouter.get("/line/createPayment", authMiddleware, createDappInvoice);
paymentRouter.post("/line/paymentStatus", verifyDappPayment);

// fetch kaia
paymentRouter.get("/pull/kaia", authMiddleware, pullKaiaValue);

export default paymentRouter;
