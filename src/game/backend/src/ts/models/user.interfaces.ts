import mongoose, { Document } from "mongoose";

// user
export interface IUser extends Document {
  xId?: string;
  telegramId?: string;
  stanId?: string;
  lineId?: string;
  oneWaveId?: string;
  telegramUsername?: string; // rename field
  name: string;
  isPremium?: boolean;
  holdings?: {
    kaia: number;
    usdt: number;
  };
  role: "user" | "admin" | "partner";
  directReferralCount: number;
  tonAddress: string;
  kaiaAddress: string;
  premiumReferralCount: number;
  mobileNumber: string;
  parentReferrerId?: mongoose.Types.ObjectId;
  squadOwner: mongoose.Types.ObjectId;
  referralCode: string;
  profile?: {
    avatarUrl: string;
    updateAt: Date;
  };
  country: string;
  lastLoginAt: Date;
  partOfGames: string[]; // delete field
  isBlacklisted?: boolean;
  isArchived?: Boolean;
  userBetAt: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// rank
export interface IRank extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  profileImage: string;
  orbRank: number;
  coinRank: number;
  referRank: number;
  prevOrbRank: number;
  prevCoinRank: number;
  countryRank: number;
  country: string;
  gameData: Object;
  directReferralCount: number;
  fofCompletedAt: Date;
  rorCompletedAt: Date;
  squadOwner?: mongoose.Types.ObjectId;
  totalOrbs: number;
  totalGobcoin: number;
  squadRank?: number;
  profile: {
    avatarUrl: String;
  };
  isArchived?: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// stats
export interface IStats extends Document {
  statId: string;
  totalUsers?: number;
  createdAt?: Date;
  updatededAt?: Date;
}

// referral
export interface IReferral extends Document {
  userId: mongoose.Types.ObjectId;
  directInvites: mongoose.Types.ObjectId[];
}

// team
export interface ITeam extends Document {
  owner: mongoose.Types.ObjectId;
  teamName: string;
  teamCode?: string;
  totalOrbs: number;
  members: mongoose.Types.ObjectId[];
}
