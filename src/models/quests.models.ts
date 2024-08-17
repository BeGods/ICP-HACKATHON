import { Schema, model, Document } from "mongoose";

export interface IQuest extends Document {
  questName: string;
  description: string;
  type: string;
  link: string;
  mythology: string;
  status: string;
  requiredOrbs: Map<string, number>;
}

const questSchema = new Schema(
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
      type: String,
    },
    mythology: {
      type: String,
      enum: ["Celtic", "Egyptian", "Greek", "Norse", "Other"],
      required: true,
    },
    secret: {
      type: Boolean,
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

const quest = model("Quests", questSchema);

export default quest;
