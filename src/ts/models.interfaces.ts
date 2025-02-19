import mongoose, { Document } from "mongoose";

//  milestones
export interface IClaimedQuest {
  taskId: mongoose.Types.ObjectId;
  isKeyClaimed: boolean;
  orbClaimed: boolean;
  completedAt: Date;
}

export interface IClaimedReward {
  partnerId: string;
  type: string;
  isClaimed: boolean;
  claimedAt: Date;
  tokensCollected: number;
}

export interface IRewards {
  rewardsInLastHr: string[];
  updatedAt: number;
  lastResetAt: number;
  claimedRewards: IClaimedReward[];
}

export interface IInventory {
  _id: mongoose.Types.ObjectId;
  itemId: string;
  isComplete: boolean;
  fragmentId: number;
  updatedAt: Date;
}

export interface IMilestone extends Document {
  userId: mongoose.Types.ObjectId;
  claimedQuests: IClaimedQuest[];
  sharedQuests: mongoose.Types.ObjectId[];
  bag?: IInventory[];
  bank?: {
    vaultExpiryAt: number;
    vault: IInventory[];
  };
  claimedRoRItems?: string[];
  rewards: IRewards;
}

// quest
export interface IQuest extends Document {
  questName: string;
  description: string;
  type: string;
  link?: string[];
  mythology: "Celtic" | "Egyptian" | "Greek" | "Norse" | "Other";
  status: "Active" | "Inactive";
  requiredOrbs: Record<string, number>;
  createdAt?: Date;
  updatedAt?: Date;
}

// user mythologies
export interface IBooster {
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
  rats: {
    count: number;
    lastClaimedThreshold: number;
  };
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
}

export interface IUserMyths extends Document {
  userId: mongoose.Types.ObjectId;
  mythologies: IMyth[];
  multiColorOrbs: number;
  blackOrbs: number;
  whiteOrbs: number;
  blackShards: number;
  whiteShards: number;
  gobcoin: number;
  lastMoonClaimAt: number;
  autoPay: {
    isAutomataAutoPayEnabled: boolean;
    isBurstAutoPayEnabled: boolean;
    burstAutoPayExpiration: number;
  };
}

// partner
export interface IPartner extends Document {
  name: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  status: boolean;
  brandName: string;
  isCharity?: boolean;
  metadata: {
    brandName: string;
    howToRedeem: string;
    brandCategory: string;
    campaignTitle: string;
    campaignDetails: string;
    campaignSubTitle: string;
    expiryOfTheCoupon: Date;
    campaignCoverImage: string;
    termsAndConditions: string;
    brandRedirectionLink?: string;
    campaignAssets: {
      bannerView: string;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// rank
export interface IRank extends Document {
  userId: mongoose.Types.ObjectId;
  telegramUsername: string;
  profileImage: string;
  orbRank: number;
  coinRank: number;
  prevOrbRank: number;
  prevCoinRank: number;
  countryRank: number;
  country: string;
  gameData: Object;
  directReferralCount: number;
  fofCompletedAt: Date;
  squadOwner?: mongoose.Types.ObjectId;
  totalOrbs: number;
  totalGobcoin: number;
  squadRank?: number;
  profile: {
    avatarUrl: String;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// user
export interface IUser extends Document {
  telegramId?: string;
  lineId?: string;
  lineName?: string;
  telegramUsername?: string;
  name: string;
  isPremium?: boolean;
  role: "user" | "admin" | "partner";
  bonus: {
    fof: {
      extraBlackOrb: string;
      dailyBonusClaimedAt: Date;
      exploitCount: number;
      streakBonus: {
        isActive: boolean;
        claimedAt: number;
        streakCount: number;
      };
      joiningBonus: boolean;
    };
    ror: {
      dailyBonusClaimedAt: Date;
      streakBonus: {
        isActive: boolean;
        claimedAt: number;
        streakCount: number;
      };
      joiningBonus: boolean;
    };
  };
  directReferralCount: number;
  tonAddress: string;
  premiumReferralCount: number;
  phoneNumber: string;
  gameSession: {
    gameHrStartAt: number;
    dailyGameQuota: number;
    lastSessionStartTime: number;
    competelvl: number;
    underWorldActiveAt: number;
    restExpiresAt: number;
  };
  parentReferrerId?: mongoose.Types.ObjectId;
  squadOwner: mongoose.Types.ObjectId;
  referralCode: string;
  profile?: {
    avatarUrl: string;
    updateAt: Date;
  };
  playsuper?: {
    isVerified: boolean;
    key: string;
    createdAt: Date;
  };
  announcements: number;
  country: string;
  lastLoginAt: Date;
  partOfGames: string[];
  gameCompletedAt: {
    fof: Date;
  };
  userBetAt: string;
}

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
// stars transaction
export interface IStarTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  paymentId: string;
  transcationId: string;
  status: "pending" | "success" | "failed" | "rewarded";
  createdAt?: Date;
  updatedAt?: Date;
}

// shard transaction
export interface IShardsTransactions extends Document {
  userId: mongoose.Types.ObjectId;
  shards: number;
  source: "game" | "burst";
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
