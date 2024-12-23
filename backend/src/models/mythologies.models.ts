import mongoose, { Schema, model, Document } from "mongoose";

//? rethink on active status
interface IBooster {
  shardslvl: number;
  automatalvl: number;
  burstlvl: number;
  shardsLastClaimedAt: number;
  isShardsClaimActive: boolean;
  isAutomataActive: boolean;
  automataLastClaimedAt: number;
  automataStartTime: number;
  isBurstActiveToClaim: boolean;
  isBurstActive: boolean;
  burstActiveAt: number;
}
export interface IMyth extends Document {
  name: string;
  orbs: number;
  shards: number;
  tapSessionStartTime?: number;
  lastTapAcitivityTime: number;
  energy: number;
  energyLimit: number;
  faith: number;
  isEligibleForBurst: boolean;
  boosters?: IBooster;
  claimedCards?: [];
}

export interface IUserMyths extends Document {
  mythologies: IMyth[];
  multiColorOrbs: number;
  lastMoonClaimAt: number;
  autoPay: {
    isAutomataAutoPayEnabled: boolean;
    isBurstAutoPayEnabled: boolean;
    burstAutoPayExpiration: number;
    automataAutoPayExpiration: number;
  };
}

const mythologySchema = new Schema({
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
  },
  // claimedCards: {
  //   type: Array,
  //   default: [],
  // },
});

const userMythologySchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      unique: true,
      required: true,
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
    autoPay: {
      isAutomataAutoPayEnabled: {
        type: Boolean,
        default: false,
      },
      isBurstAutoPayEnabled: {
        type: Boolean,
        default: false,
      },
      automataAutoPayExpiration: {
        type: Number,
        default: 0,
      },
      burstAutoPayExpiration: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

userMythologySchema.index({ userId: 1 }, { unique: true });

// mythologySchema.pre("save", (next) => {
//   if (this.isNew && this.energy === undefined) {
//     this.energy = 1000;
//   }
//   next();
// });

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
