import mongoose, { Schema, model, Document } from "mongoose";

export interface IMilestone extends Document {
  userId: mongoose.Types.ObjectId;
  claimedQuests: [];
  //   claimedCards: [];
}

const milestoneSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  claimedQuests: [
    {
      taskId: {
        type: Schema.Types.ObjectId,
        ref: "Quests",
      },
      orbClaimed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  //   claimedCards: {
  //     type: [Schema.Types.ObjectId],
  //     ref: "NFTs",
  //     default: [],
  //   },
});

const milestones = model("Milestones", milestoneSchema);

export default milestones;
