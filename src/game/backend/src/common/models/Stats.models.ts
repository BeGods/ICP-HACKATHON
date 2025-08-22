import { Schema, model } from "mongoose";
import { IStats } from "../../ts/models.interfaces";

const StatsSchema: Schema<IStats> = new Schema<IStats>(
  {
    statId: String,
    totalUsers: Number,
  },
  { timestamps: true }
);

const Stats = model<IStats>("Stats", StatsSchema);
StatsSchema.index({ statId: 1 }, { unique: true });

export default Stats;
