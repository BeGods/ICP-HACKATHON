import mongoose, { Schema, model, Document } from "mongoose";

export interface IClaimedQuest {
  taskId: mongoose.Types.ObjectId;
  questClaimed: boolean;
  isKeyClaimed: boolean;
  orbClaimed: boolean;
  completedAt: Date;
}

export interface IClaimedReward {
  partnerId: string;
  type: string;
  isClaimed: boolean;
  claimedAt: Date;
  tokensCollected: number;
}

export interface IRewards {
  rewardsInLastHr: string[];
  updatedAt: number;
  lastResetAt: number;
  claimedRewards: IClaimedReward[];
}

export interface IMilestone extends Document {
  userId: mongoose.Types.ObjectId;
  claimedQuests: IClaimedQuest[];
  sharedQuests: mongoose.Types.ObjectId[];
  rewards: IRewards;
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
      isKeyClaimed: {
        type: Boolean,
        default: false,
      },
      orbClaimed: {
        type: Boolean,
        default: false,
      },
      completedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  sharedQuests: {
    type: [Schema.Types.ObjectId],
    ref: "Quests",
  },
  rewards: {
    rewardsInLastHr: {
      type: [String],
      default: [],
    },
    updatedAt: {
      type: Number,
      default: 0,
    },
    lastResetAt: {
      type: Number,
      default: 0,
    },
    claimedRewards: [
      {
        partnerId: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        isClaimed: {
          type: Boolean,
          default: false,
        },
        couponCode: {
          type: String,
          default: "",
        },
        claimedAt: {
          type: Date,
          default: Date.now,
        },
        tokensCollected: {
          type: Number,
          default: 0,
          validate: {
            validator: function (value: number) {
              return value <= 12;
            },
            message: "tokensCollected cannot be more than 12.",
          },
        },
      },
    ],
  },
});

const milestones = model<IMilestone>("Milestones", milestoneSchema);

export default milestones;
