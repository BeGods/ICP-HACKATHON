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

const baseTransactionSchema = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
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
      enum: ["conversion", "quests", "boosters", "share"],
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
      enum: ["game"],
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

export { OrbsTransactions, ShardsTransactions };
