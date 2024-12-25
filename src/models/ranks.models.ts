import mongoose, { Schema, model, Document } from "mongoose";

export interface IRank extends Document {
  telegramUsername: string;
  totalOrbs: string;
  rank: number;
  sqaudRank: number;
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
    overallRank: {
      type: Number,
      required: true,
      default: 1,
    },
    squadOwner: {
      type: mongoose.Schema.Types.ObjectId,
    },
    squadRank: {
      type: Number,
      default: 1,
      required: true,
    },
    countryRank: {
      type: Number,
      default: 1,
      required: true,
    },
    telegramUsername: { type: String, unique: true },
    profileImage: {
      type: String,
    },
    country: {
      type: String,
      default: "NA",
    },
    gameData: {
      type: Object,
      default: {},
    },
    totalOrbs: Number,
    fofCompletedAt: Date,
  },
  { timestamps: true }
);

const ranks = model("Ranks", rankSchema);

// rankSchema.index({ userId: 1 }, { unique: true });
// rankSchema.index({ parentReferrerId: 1 });

export default ranks;
