import mongoose, { Document } from "mongoose";
import {
  IBuildStage,
  IClaimedQuest,
  IInventory,
} from "./collections.interfaces";

export interface IBaseGameData {
  userId: mongoose.Types.ObjectId;
  dailyBonusClaimedAt: Date;
  extraBlackOrb: string; // rename field
  exploitCount: number; // rename field
  streak: {
    claimedAt: Date;
    count: number;
    lastMythClaimed: "Celtic" | "Egyptian" | "Greek" | "Norse";
  };
  joiningBonus: boolean;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// fofGameData
// Game 1 - FOF -- delete one of the fields not being used
export interface IFOFData extends IBaseGameData {
  lastMoonClaimAt: number; // rename field
  isAutomataAutoPayEnabled: boolean; // rename field
  isBurstAutoPayEnabled: boolean; // rename field
  burstAutoPayExpiration: number; // rename field
  claimedQuests: IClaimedQuest[];
  sharedQuests: mongoose.Types.ObjectId[];
}

// rorGameData
// Game 2 - ROR
export interface IRORData extends IBaseGameData {
  gameHrStartAt: number;
  dailyGameQuota: number;
  lastSessionStartTime: number;
  competelvl: number;
  restExpiresAt: number;
  isThiefActive: boolean;
  lastPenaltyAt: number;
  undeworldLostCount: number;
  lastMealPenaltyAt: number;
  digLvl: number;
  pouch?: string[];
  vaultExpiryAt: number; // rename field
  appearedUnderworldChars?: string[]; // rename field
  claimedRoRItems?: string[]; // rename field
  bag?: IInventory[];
  vault: { name: string; items: IInventory[] }[];
  buildStage: IBuildStage[]; // rename field
}

// drawnCards: {
//   type: [
//     {
//       cardId: String,
//       attachmentId: String,
//       isCurrentlyInHand: Boolean,
//     },
//   ],
//   default: [],
// },

// dodGameData
// Game 3 - DOD
export interface IDODData extends IBaseGameData {
  gamePhase: "idle" | "drawn" | "battle" | "finished" | "explore" | "encounter";
  currentTurn: number;
  currentBattleGround: number;
  numOfBattlesWon: number;

  user?: {
    avatarType:
      | "celtic.char.C09_male"
      | "celtic.char.C09_female"
      | "egyptian.char.C09_male"
      | "egyptian.char.C09_female"
      | "greek.char.C09_male"
      | "greek.char.C09_female"
      | "norse.char.C09_male"
      | "norse.char.C09_female";
    characterCardDeck: [
      {
        cardId: string;
        attack: string;
        defense: boolean;
      }
    ];
    drawnCards: [
      {
        cardId: string;
        attachmentId: string;
        isCurrentlyInHand: boolean;
        attack?: string;
        defense?: boolean;
      }
    ];
  };

  bot?: {
    avatarType:
      | "celtic.char.C09_male"
      | "celtic.char.C09_female"
      | "egyptian.char.C09_male"
      | "egyptian.char.C09_female"
      | "greek.char.C09_male"
      | "greek.char.C09_female"
      | "norse.char.C09_male"
      | "norse.char.C09_female";
    characterCardDeck: [
      {
        cardId: string;
        attack: string;
        defense: boolean;
      }
    ];
    drawnCards: [
      {
        cardId: string;
        attachmentId: string;
        isCurrentlyInHand: boolean;
        attack?: string;
        defense?: boolean;
      }
    ];
  };

  cardCycle: {
    currentCycle: number;
    cardsUsedInCycle: number;
    seed: string;
    drawnIdxs: {
      cycle: number;
      index: number;
    };
  };

  locationCycle: {
    currentCycle: number;
    cardsUsedInCycle: number;
    seed: string;
  };
  exploreCardLog: string[];

  battleHistory?: Array<{
    turnNumber: number;
    battleStats: Array<{
      cardId: string;
      attachmentId: string;
      attack: number;
      defense: number;
    }>;
    roundWinner: "user" | "bot" | "draw";
  }>;

  claimedQuests: IClaimedQuest[];
  sharedQuests: mongoose.Types.ObjectId[];
}

// =======================STATS===========================

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

// userGameStats
export interface IUserMyths extends Document {
  userId: mongoose.Types.ObjectId;
  mythologies: IMyth[];
  multiColorOrbs: number;
  blackOrbs: number;
  whiteOrbs: number;
  blackShards: number;
  whiteShards: number;
  gobcoin: number;
}

export interface DoDGameHistory extends Document {
  userId: mongoose.Types.ObjectId;
  totalTurns: number;
  userBattleWins: number;
  botBattleWins: number;
  userAvatarType: "celtic" | "egyptian" | "greek" | "norse";
  characterCardDeck: string[];
  turnsHistory: {
    turnNumber: number;
    battleStats: {
      char: string;
      weapon: string;
      attack: number;
      defense: number;
    }[];
    roundWinner: "user" | "bot" | "draw";
  }[];
  createdAt: Date;
  updatedAt: Date;
}
