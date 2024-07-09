import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  telegramId?: string;
  telegramUsername?: string;
  isPremium?: boolean;
  role: "user" | "admin";
  directReferralCount: number;
  premiumReferralCount: number;
  parentReferrerId?: mongoose.Types.ObjectId;
  referralCode: string;
  profile?: {
    avatarUrl: string;
    updateAt: Date;
  };
  //TODO Profile image
  //TODO team
  //TODO myths
}
//* check if anyone part of it then only it is team

const userSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true },
  telegramUsername: { type: String, unique: true },
  isPremium: { type: Boolean },
  role: {
    type: String,
    enum: ["user", "admin", "partner"],
    default: "user",
  },
  tonAddress: {
    type: String,
    unique: true,
    required: false,
  },
  directReferralCount: {
    type: Number,
    default: 0,
  },
  premiumReferralCount: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    unique: true,
    required: true,
  },
  parentReferrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  profile: {
    avatarUrl: { type: String },
    updateAt: {
      type: Date,
      default: Date.now(),
    },
  },
});

const User = model<IUser>("User", userSchema);

export default User;
