import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  telegramId?: string;
  telegramUsername?: string;
  isPremium?: boolean;
  role: "user" | "admin";
  directReferralCount: number;
  tonAddress: string;
  premiumReferralCount: number;
  parentReferrerId?: mongoose.Types.ObjectId;
  referralCode: string;
  profile?: {
    avatarUrl: string;
    updateAt: Date;
  };
  announcements: number;
  //TODO Profile image
}
//* check if anyone part of it then only it is team

const userSchema = new Schema(
  {
    telegramId: { type: String, unique: true, sparse: true },
    telegramUsername: { type: String, unique: true, sparse: true },
    isPremium: { type: Boolean },
    role: {
      type: String,
      enum: ["user", "admin", "partner"],
      default: "user",
    },
    tonAddress: {
      type: String,
      unique: true,
      sparse: true,
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
      sparse: true,
    },
    profile: {
      avatarUrl: { type: String },
      updateAt: {
        type: Date,
        default: Date.now(),
      },
    },
    announcements: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
