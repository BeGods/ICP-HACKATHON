import mongoose, { Document } from "mongoose";

export interface IClaimedQuest {
  taskId: mongoose.Types.ObjectId;
  isKeyClaimed?: boolean;
  orbClaimed: boolean;
  completedAt: Date;
}

export interface IInventory {
  _id: mongoose.Types.ObjectId;
  itemId: string;
  isComplete: boolean;
  fragmentId: number;
  updatedAt: Date;
}

export interface IBuildStage {
  _id: mongoose.Types.ObjectId;
  itemId: string;
  exp: number;
}

export interface IClaimedVoucher {
  partnerId: string;
  type: string;
  isClaimed: boolean;
  claimedAt: Date;
  tokensCollected: number;
}

export interface ITokenReward {
  rewardId: mongoose.Types.ObjectId;
  claimedAt: Date;
}

export interface IVouchers {
  rewardsInLastHr: string[];
  updatedAt: number;
  lastResetAt: number;
  claimedVouchers: IClaimedVoucher[];
}

// userAchievements
export interface IMilestone extends Document {
  userId: mongoose.Types.ObjectId;
  claimedTasks: IClaimedQuest[];
  claimedTokenRewards: ITokenReward[];
  vouchers: IVouchers;
}
