import mongoose, { Document } from "mongoose";

// orbs transaction
export interface IOrbsTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  orbs: Object;
  source:
    | "conversion"
    | "quests"
    | "boosters"
    | "share"
    | "alchemist"
    | "automata"
    | "bonus"
    | "burst"
    | "moon"
    | "voucher"
    | "multiAutomata"
    | "multiBurst"
    | "join"
    | "stake";
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICoinTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  coins: number;
  source:
    | "blacksmith"
    | "join"
    | "stake"
    | "voucher"
    | "moon"
    | "share"
    | "bonus"
    | "daily";
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
// stars transaction
export interface IStarTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  paymentId: string;
  transcationId: string;
  status: "pending" | "success" | "failed" | "rewarded";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPaymentLogs extends Document {
  userId: mongoose.Types.ObjectId;
  transactionId: string;
  paymentId: string;
  reward: string;
  walletAddress?: string;
  paymentType: string;
  status: "pending" | "success" | "failed" | "rewarded";
  transferType: "send" | "recieve";
  amount: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// shard transaction
export interface IShardsTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  shards: number;
  source: "game" | "burst" | "daily";
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// reward transaction
export interface IRewardTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  rewardId: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IItemTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  underworld: boolean;
  shards: number;
  item: string;
  createdAt?: Date;
  updatedAt?: Date;
}
