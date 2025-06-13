import { Schema, model } from "mongoose";
import {
  ICoinTransactions,
  IItemTransactions,
  IOrbsTransactions,
  IPaymentLogs,
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

const coinTransactionsSchema = new Schema<ICoinTransactions>(
  {
    ...baseTransactionSchema,
    coins: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: [
        "blacksmith",
        "trade",
        "join",
        "stake",
        "voucher",
        "moon",
        "share",
        "bonus",
        "daily",
        "quests",
        "statue",
        "map",
        "boots",
        "key",
        "book",
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
      enum: ["game", "burst", "daily"],
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
    status: {
      type: String,
      required: true,
      enum: ["pending", "failed", "success", "rewarded"],
    },
  },
  { timestamps: true }
);

const PaymentLogsSchema = new Schema<IPaymentLogs>(
  {
    ...baseTransactionSchema,
    paymentId: {
      type: String,
    },
    reward: String,
    status: {
      type: String,
      required: true,
      enum: ["pending", "failed", "success", "rewarded"],
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    transferType: {
      type: String,
      required: true,
      enum: ["send", "recieve"],
    },
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

const PaymentLogs = model<IPaymentLogs>("PaymentLogs", PaymentLogsSchema);

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

const CoinsTransactions = model<ICoinTransactions>(
  "CoinsTransaction",
  coinTransactionsSchema
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
  CoinsTransactions,
  StarsTransactions,
  ItemsTransactions,
  PaymentLogs,
};
