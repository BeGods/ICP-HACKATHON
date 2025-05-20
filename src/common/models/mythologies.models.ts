import { Schema, model } from "mongoose";
import { IMyth, IUserMyths } from "../../ts/models.interfaces";

const mythologySchema = new Schema<IMyth>({
  name: {
    type: String,
    enum: ["Greek", "Celtic", "Norse", "Egyptian"],
    required: true,
  },
  orbs: {
    type: Number,
    default: 0,
    required: true,
  },
  isEligibleForBurst: {
    type: Boolean,
    default: false,
  },
  tapSessionStartTime: {
    type: Number,
    default: 0,
  },
  lastTapAcitivityTime: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  shards: {
    type: Number,
    default: 0,
    required: true,
  },
  energy: {
    type: Number,
    default: 1000,
    required: true,
  },
  energyLimit: {
    type: Number,
    default: 1000,
    required: true,
  },
  faith: {
    type: Number,
    default: 0,
    required: true,
  },
  boosters: {
    automatalvl: {
      type: Number,
      default: 0,
      min: 0,
      max: 99,
    },
    shardslvl: {
      type: Number,
      default: 1,
      min: 0,
      max: 99,
    },
    burstlvl: {
      type: Number,
      default: 1,
      min: 0,
      max: 99,
    },
    shardsLastClaimedAt: {
      type: Number,
      default: 0,
    },
    isShardsClaimActive: {
      type: Boolean,
      default: true,
    },
    automataLastClaimedAt: {
      type: Number,
      default: 0,
    },
    isAutomataActive: {
      type: Boolean,
      default: false,
    },
    automataStartTime: {
      type: Number,
      default: 0,
    },
    isBurstActive: {
      type: Boolean,
      default: 0,
    },
    isBurstActiveToClaim: {
      type: Boolean,
      default: false,
    },
    burstActiveAt: {
      type: Number,
      default: 0,
    },
    rats: {
      type: Object,
      default: {
        count: 0,
        lastClaimedThreshold: 0,
      },
    },
  },
});

const userMythologySchema = new Schema<IUserMyths>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    mythologies: {
      type: [mythologySchema],
      sparse: true,
      default: [],
      validate: {
        validator: (mythologies: IMyth[]) => {
          const names = mythologies.map((myth) => myth.name);
          return new Set(names).size === names.length;
        },
        message: "Each mythology must be unique.",
      },
    },
    lastMoonClaimAt: {
      type: Number,
      default: 0,
    },
    multiColorOrbs: {
      type: Number,
      default: 0,
      required: true,
    },
    blackOrbs: {
      type: Number,
      default: 0,
      required: true,
    },
    whiteOrbs: {
      type: Number,
      default: 0,
      required: true,
    },
    blackShards: {
      type: Number,
      default: 0,
      required: true,
    },
    whiteShards: {
      type: Number,
      default: 0,
      required: true,
    },
    gobcoin: {
      type: Number,
      default: 0,
      required: true,
    },
    autoPay: {
      isAutomataAutoPayEnabled: {
        type: Boolean,
        default: true,
      },
      isBurstAutoPayEnabled: {
        type: Boolean,
        default: false,
      },
      burstAutoPayExpiration: {
        type: Number,
        default: 0,
      },
    },
    rorStats: {
      isThiefActive: {
        type: Boolean,
        default: false,
      },
      gameHrStartAt: {
        type: Number,
        default: () => new Date().setHours(9, 0, 0, 0),
      },
      dailyGameQuota: {
        type: Number,
        default: 12,
      },
      lastSessionStartTime: {
        type: Number,
        default: 0,
      },
      competelvl: {
        type: Number,
        default: 15,
      },
      restExpiresAt: Number,
      undeworldLostCount: {
        type: Number,
        default: 0,
      },
      digLvl: {
        type: Number,
        default: 1,
      },
      lastMealPenaltyAt: Number,
    },
  },
  { timestamps: true }
);

userMythologySchema.index({ userId: 1 }, { unique: true });

mythologySchema.pre("save", function (next) {
  this.boosters.automatalvl = Math.min(this.boosters.automatalvl, 99);
  this.boosters.shardslvl = Math.min(this.boosters.shardslvl, 99);
  this.boosters.burstlvl = Math.min(this.boosters.burstlvl, 99);
  next();
});

const userMythologies = model<IUserMyths>(
  "UserMythologies",
  userMythologySchema
);

export default userMythologies;
