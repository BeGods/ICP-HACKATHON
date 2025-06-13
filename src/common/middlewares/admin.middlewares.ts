import { decryptHash } from "../../helpers/crypt.helpers";
import { PaymentLogs } from "../models/transactions.models";

export const validatePayment = async (req, res, next) => {
  try {
    let { paymentId, status, transactionId } = await decryptHash(req.body.data);

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
