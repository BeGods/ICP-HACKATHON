import rateLimit from "express-rate-limit";
import { PaymentLogs } from "../models/transactions.models";
import { getClientIP } from "../../utils/morgan/ua";

export const validatePayment = async (req, res, next) => {
  try {
    let { paymentId, status, transactionId } = req.body.data;

    // check if payment exists
    const paymentDetails = await PaymentLogs.findOne({
      transactionId: transactionId,
      status: "pending",
    });

    if (!paymentDetails) {
      throw new Error("Invalid paymentId.");
    }

    // check if trsanaction id exists
    if (status === true && !paymentId) {
      throw new Error("Invalid transactionId.");
    }

    req.paymentDetails = paymentDetails;
    req.paymentId = paymentId;
    req.status = status;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to validate  payment.",
      error: error.message,
    });
  }
};

export const authLimiter = rateLimit({
  windowMs: 3 * 60 * 60 * 1000, // 3 hours
  max: 3,
  handler: (req, res) => {
    const realIp = getClientIP(req);
    console.warn(`⚠️ Rate limit hit for IP: ${realIp} on /wallet/auth`);
    res.status(429).json({
      message: "Too many login attempts from this IP. Try again after 3 hours.",
    });
  },
  keyGenerator: (req) => {
    return getClientIP(req);
  },
  standardHeaders: true,
  legacyHeaders: false,
});
