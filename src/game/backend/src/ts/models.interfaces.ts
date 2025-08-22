import mongoose, { Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  description: string;
  category: string;
  status: boolean;
  redirect?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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

export interface IMonetaryReward {
  rewardId: mongoose.Types.ObjectId;
  claimedAt: Date;
}

export interface IRewards {
  rewardsInLastHr: string[];
  updatedAt: number;
  lastResetAt: number;
  claimedRewards: IClaimedReward[];
  monetaryRewards: IMonetaryReward[];
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

export interface IMilestone extends Document {
  userId: mongoose.Types.ObjectId;
  claimedQuests: IClaimedQuest[];
  sharedQuests: mongoose.Types.ObjectId[];
  bag?: IInventory[];
  pouch?: string[];
  bank?: {
    vaultExpiryAt: number;
    vault: [{ name: string; items: IInventory[] }];
  };
  buildStage: IBuildStage[];
  appearedUnderworldChars?: string[];
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
  rorStats: {
    gameHrStartAt: number;
    dailyGameQuota: number;
    lastSessionStartTime: number;
    competelvl: number;
    restExpiresAt: number;
    isThiefActive: boolean;
    lastPenaltyAt: number;
    digLvl: number;
  };
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
  rorStats: {
    gameHrStartAt: number;
    dailyGameQuota: number;
    lastSessionStartTime: number;
    competelvl: number;
    restExpiresAt: number;
    isThiefActive: boolean;
    lastPenaltyAt: number;
    digLvl: number;
  };
}

// rewards
export interface IReward extends Document {
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  status: boolean;
  paymentType: ("KAIA" | "USDT" | "ICP" | "BEGODS" | "BNB")[];
  amount: number;
  redirect?: string;
  limit: number;
  game: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// voucher
export interface IVoucher extends Document {
  rewardId: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// monetary
export interface IMonetary extends Document {
  rewardId: string;
  status: "pending" | "success" | "failed" | "rewarded";
  transactionId?: string;
  processedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
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

// user
export interface IUser extends Document {
  xId?: string;
  telegramId?: string;
  stanId?: string;
  lineId?: string;
  principalId?: string;
  oneWaveId?: string;
  telegramUsername?: string;
  name: string;
  isPremium?: boolean;
  holdings?: {
    kaia: number;
    usdt: number;
  };
  role: "user" | "admin" | "partner";
  bonus: {
    fof: {
      extraBlackOrb: string;
      dailyBonusClaimedAt: Date;
      exploitCount: number;
      streak: {
        claimedAt: Date;
        count: number;
        lastMythClaimed: "Celtic" | "Egyptian" | "Greek" | "Norse";
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
  partOfGames: string[];
  gameCompletedAt: {
    fof: Date;
    hasClaimedFoFRwrd: boolean;
  };
  isBlacklisted?: boolean;
  isArchived?: Boolean;
  userBetAt: string;
  createdAt?: Date;
  updatedAt?: Date;
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

export interface itemInterface {
  itemId?: string;
  isComplete?: boolean;
  fragmentId?: number;
  _id?: mongoose.Types.ObjectId;
  isChar?: boolean;
  updatedAt?: Date;
}
