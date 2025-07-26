import { Schema, model } from "mongoose";
import { IQuest } from "../../ts/models.interfaces";

const questSchema = new Schema<IQuest>(
  {
    questName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "default",
    },
    link: {
      type: [String],
    },
    mythology: {
      type: String,
      enum: ["Celtic", "Egyptian", "Greek", "Norse", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      required: true,
    },
    requiredOrbs: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const quest = model<IQuest>("Quests", questSchema);

export default quest;
