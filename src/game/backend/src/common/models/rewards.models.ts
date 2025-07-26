import { Schema, model } from "mongoose";
import { IReward } from "../../ts/models.interfaces";

export const rewardsSchema = new Schema<IReward>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, default: "gameplay" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: Boolean, default: true },
    paymentType: {
      type: [String],
      required: true,
      enum: ["KAIA", "USDT", "ICP", "BEGODS", "BNB", "STARS"],
    },
    amount: { type: Number, required: true, default: 0 },
    redirect: { type: String },
    game: {
      type: String,
      required: true,
      enum: ["FOF", "DOD", "ROR", "ALL"],
    },
    limit: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const rewards = model<IReward>("Rewards", rewardsSchema);

export default rewards;
