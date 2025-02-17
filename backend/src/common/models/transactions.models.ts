import { Schema, model } from "mongoose";
import {
  IItemTransactions,
  IOrbsTransactions,
  IRewardTransactions,
  IShardsTransactions,
  IStarTransactions,
} from "src/ts/models.interfaces";

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
        "star",
        "voucher",
        "multiAutomata",
        "multiBurst",
        "join",
        "stake",
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

const starsTransactionsSchema = new Schema<IStarTransactions>(
  {
    ...baseTransactionSchema,
    paymentId: String,
    transcationId: String,
    status: ["pending", "failed", "success", "rewarded"],
  },
  { timestamps: true }
);

const itemsTransactionsSchema = new Schema(
  {
    ...baseTransactionSchema,
    underworld: Boolean,
    shards: {
      type: Number,
      required: true,
      default: 0,
    },
    item: {
      type: String,
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

const ItemsTransactions = model<IItemTransactions>(
  "ItemsTransaction",
  itemsTransactionsSchema
);

const StarsTransactions = model<IStarTransactions>(
  "StarsTransaction",
  starsTransactionsSchema
);

const RewardsTransactions = model<IRewardTransactions>(
  "RewardsTransaction",
  rewardsTransactionsSchema
);

export {
  OrbsTransactions,
  ShardsTransactions,
  RewardsTransactions,
  StarsTransactions,
  ItemsTransactions,
};
