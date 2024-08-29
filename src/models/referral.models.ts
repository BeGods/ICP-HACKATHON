import mongoose, { Schema, model, Document } from "mongoose";

interface IReferral extends Document {
  userId: mongoose.Types.ObjectId;
  directInvites: mongoose.Types.ObjectId[];
}
interface ITeam extends Document {
  owner: mongoose.Types.ObjectId;
  teamName: string;
  teamCode: string;
  totalOrbs: number;
  members: mongoose.Types.ObjectId[];
}

const referralSchema = new Schema(
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

const teamSchema = new Schema({
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

// teamSchema.pre("save", (next) => {
//   this.teamName = this.teamCode ?? this.teamName;
//   next();
// });

const Referral = model<IReferral>("Referral", referralSchema);
const Team = model<ITeam>("Team", teamSchema);

export { Referral, Team };
