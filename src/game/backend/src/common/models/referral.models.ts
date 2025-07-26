import mongoose, { Schema, model } from "mongoose";
import { IReferral, ITeam } from "../../ts/models.interfaces";

const referralSchema = new Schema<IReferral>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ref",
      required: true,
    },
    directInvites: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true }
);

const teamSchema = new Schema<ITeam>({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalOrbs: {
    type: Number,
    default: 0,
  },
  teamName: {
    type: String,
    unique: true,
    required: true,
  },
  // teamCode: {
  //   type: String,
  //   unique: true,
  //   required: true,
  // },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

const Referral = model<IReferral>("Referral", referralSchema);
const Team = model<ITeam>("Team", teamSchema);

referralSchema.index({ userId: 1 }, { unique: true });

export { Referral, Team };
