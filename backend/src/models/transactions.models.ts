import mongoose, { Schema, model, Document } from "mongoose";

export interface IOrbsTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  orbs: Object;
  source: string;
  date: Date;
}

export interface IShardsTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  shards: number;
  source: string;
  date: Date;
}

export interface IShardsTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  shards: number;
  source: string;
  date: Date;
}

export interface IRewardTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  rewardId: string;
  type: string;
}

const baseTransactionSchema = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
};

const orbsTransactionsSchema = new Schema<IOrbsTransactions>(
  {
    ...baseTransactionSchema,
    orbs: {
      type: Object,
      required: true,
      default: 0,
    },
    source: {
      type: String,
      enum: [
        "conversion",
        "quests",
        "boosters",
        "share",
        "alchemist",
        "automata",
        "bonus",
        "burst",
        "moon",
        "voucher",
        "multiAutomata",
        "multiBurst",
        "join",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const shardsTransactionsSchema = new Schema<IShardsTransactions>(
  {
    ...baseTransactionSchema,
    shards: {
      type: Number,
      required: true,
      default: 0,
    },
    source: {
      type: String,
      enum: ["game", "burst"],
      required: true,
    },
  },
  { timestamps: true }
);

const rewardsTransactionsSchema = new Schema(
  {
    ...baseTransactionSchema,
    rewardId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OrbsTransactions = model<IOrbsTransactions>(
  "OrbsTransaction",
  orbsTransactionsSchema
);
const ShardsTransactions = model<IShardsTransactions>(
  "ShardsTransaction",
  shardsTransactionsSchema
);

const RewardsTransactions = model<IRewardTransactions>(
  "RewardsTransaction",
  rewardsTransactionsSchema
);

export { OrbsTransactions, ShardsTransactions, RewardsTransactions };
