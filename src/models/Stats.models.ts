import { Document } from "mongodb";
import { Schema, model } from "mongoose";

export interface IStats extends Document {
  statId: string;
  totalUsers?: number;
}

const StatsSchema: Schema<IStats> = new Schema<IStats>(
  {
    statId: String,
    totalUsers: Number,
  },
  { timestamps: true }
);

const Stats = model<IStats>("Stats", StatsSchema);
export default Stats;
