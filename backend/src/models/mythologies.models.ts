import mongoose, { Schema, model, Document } from "mongoose";

interface IBooster {
  shardslvl: number;
  shardsLastClaimedAt: number;
  isShardsClaimActive: boolean;
  isAutomataActive: boolean;
  automataLastClaimedAt: number;
  automataStartTime: number;
}
export interface IMyth extends Document {
  _id?: string;
  name: string;
  orbs: number;
  shards: number;
  tapSessionStartTime?: number;
  lastTapAcitivityTime: number;
  energy: number;
  energyLimit: number;
  faith: number;
  boosters?: IBooster;
  claimedCards?: [];
}

export interface IUserMyths extends Document {
  mythologies: IMyth[];
  multiColorOrbs: number;
}

const mythologySchema = new Schema({
  name: {
    type: String,
    enum: ["Celtic", "Egyptian", "Greek", "Norse"],
    required: true,
  },
  orbs: {
    type: Number,
    default: 0,
    required: true,
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
    shardslvl: {
      type: Number,
      default: 1,
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

const userMythologies = model<IUserMyths>(
  "UserMythologies",
  userMythologySchema
);

export default userMythologies;
