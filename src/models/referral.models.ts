import mongoose, { Schema, model, Document } from "mongoose";

interface IReferral extends Document {
  userId: mongoose.Types.ObjectId;
  directInvites: mongoose.Types.ObjectId[];
}

const referralSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ref",
    required: true,
  },
  directInvites: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

const Referral = model<IReferral>("Referral", referralSchema);
