import mongoose, { Schema, model, Document } from "mongoose";

export interface IRank extends Document {
  telegramUsername: string;
  totalOrbs: string;
  profile: {
    avatarUrl: String;
  };
}

const rankSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    telegramUsername: { type: String, unique: true, sparse: true },
    profile: {
      avatarUrl: { type: String },
    },
    totalOrbs: Number,
  },
  { timestamps: true }
);

const ranks = model("Ranks", rankSchema);

export default ranks;
