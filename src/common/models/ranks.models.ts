import mongoose, { Schema, model } from "mongoose";
import { IRank } from "../../ts/models.interfaces";

const rankSchema = new Schema<IRank>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orbRank: {
      type: Number,
      required: true,
      default: 1,
    },
    coinRank: {
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
    },
    countryRank: {
      type: Number,
      default: 1,
      required: true,
    },
    username: { type: String, unique: true },
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
    directReferralCount: {
      type: Number,
      default: 0,
    },
    totalOrbs: {
      type: Number,
      default: 0,
    },
    fofCompletedAt: Date,
    rorCompletedAt: Date,
    prevOrbRank: Number,
    prevCoinRank: Number,
    totalGobcoin: {
      type: Number,
      default: 0,
    },
    isArchived: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const ranks = model<IRank>("Ranks", rankSchema);

rankSchema.index({ userId: 1 }, { unique: true });

export default ranks;
