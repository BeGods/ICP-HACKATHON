import { Schema, model } from "mongoose";
import { IMilestone } from "../../ts/models.interfaces";

const milestoneSchema = new Schema<IMilestone>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  appearedUnderworldChars: {
    type: [String],
    default: [],
  },
  pouch: {
    type: [String],
    default: [],
  },
  buildStage: {
    type: [
      {
        itemId: {
          type: String,
          required: true,
        },
        exp: Number,
      },
    ],
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
    monetaryRewards: [
      {
        rewardId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: ["pending", "failed", "success", "rewarded"],
        },
        claimedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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
        // couponCode: {
        //   type: String,
        //   default: "",
        // },
        orderId: {
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
              return value <= 4;
            },
            message: "tokensCollected cannot be more than 12.",
          },
        },
      },
    ],
  },
  bag: {
    type: [
      {
        itemId: {
          type: String,
          required: true,
        },
        fragmentId: {
          type: Number,
          default: 0,
        },
        isComplete: {
          type: Boolean,
          default: false,
        },
        updatedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    validate: {
      validator: function (array) {
        return array.length <= 9;
      },
      message: "The bag cannot contain more than 9 items.",
    },
  },
  bank: {
    vaultExpiryAt: {
      type: Number,
      default: 0,
    },
    vault: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          items: {
            type: [
              {
                itemId: { type: String, required: true },
                fragmentId: { type: Number, default: 0 },
                isComplete: { type: Boolean, default: false },
                updatedAt: { type: Date, default: Date.now },
              },
            ],
            validate: {
              validator: function (array) {
                return array.length <= 27;
              },
              message: "Each mythology can only have 27 items in the vault.",
            },
          },
        },
      ],
      default: [],
    },
  },
  claimedRoRItems: {
    type: [String],
    default: [],
  },
});

milestoneSchema.index({ userId: 1 }, { unique: true });

const milestones = model<IMilestone>("Milestones", milestoneSchema);

export default milestones;
