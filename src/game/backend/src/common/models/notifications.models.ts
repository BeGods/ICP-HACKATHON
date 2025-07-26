import { Schema, model } from "mongoose";
import { INotification, IReward } from "../../ts/models.interfaces";

export const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, default: "gameplay" },
    status: { type: Boolean, default: true },
    redirect: { type: String },
  },
  { timestamps: true }
);

const rewards = model<INotification>("Notifications", notificationSchema);

export default rewards;
