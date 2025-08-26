import { Schema, model } from "mongoose";
import { IDODData, IFOFData, IRORData } from "src/ts/models/game.interfaces";

const baseGameDataSchema: Record<string, any> = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dailyBonusClaimedAt: {
    type: Date,
    default: 0,
  },
  extraBlackOrb: {
    type: String,
  },
  exploitCount: {
    type: Number,
    default: 0,
  },
  streak: {
    claimedAt: {
      type: Date,
    },
    count: {
      type: Number,
      default: 0,
    },
    lastMythClaimed: {
      type: String,
      enum: ["Greek", "Celtic", "Norse", "Egyptian"],
    },
  },
  joiningBonus: { type: Boolean, default: false },
  completedAt: {
    type: Date,
  },
};

const fofGameDataSchema = new Schema<IFOFData>(
  {
    ...baseGameDataSchema,
    lastMoonClaimAt: {
      type: Number,
      default: 0,
    },
    isAutomataAutoPayEnabled: {
      type: Boolean,
      default: true,
    },
    isBurstAutoPayEnabled: {
      type: Boolean,
      default: false,
    },
    burstAutoPayExpiration: {
      type: Number,
      default: 0,
    },
    mintedPackets: {
      type: [String],
      default: [],
    },
    claimedQuests: [
      {
        taskId: {
          type: Schema.Types.ObjectId,
          ref: "Quests",
        },
        isKeyClaimed: {
          type: Boolean,
          default: false,
        },
        orbClaimed: {
          type: Boolean,
          default: false,
        },
        completedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    sharedQuests: {
      type: [Schema.Types.ObjectId],
      ref: "Quests",
    },
  },
  { timestamps: true }
);

const rorGameDataSchema = new Schema<IRORData>(
  {
    ...baseGameDataSchema,
    isThiefActive: {
      type: Boolean,
      default: false,
    },
    gameHrStartAt: {
      type: Number,
      default: () => new Date().setHours(9, 0, 0, 0),
    },
    dailyGameQuota: {
      type: Number,
      default: 12,
    },
    lastSessionStartTime: {
      type: Number,
      default: 0,
    },
    competelvl: {
      type: Number,
      default: 15,
    },
    restExpiresAt: Number,
    undeworldLostCount: {
      type: Number,
      default: 0,
    },
    digLvl: {
      type: Number,
      default: 0,
    },
    lastMealPenaltyAt: Number,
    bag: {
      type: [
        {
          itemId: {
            type: String,
            required: true,
          },
          fragmentId: {
            type: Number,
            default: 0,
          },
          isComplete: {
            type: Boolean,
            default: false,
          },
          updatedAt: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
      validate: {
        validator: function (array) {
          return array.length <= 9;
        },
        message: "The bag cannot contain more than 9 items.",
      },
    },
    vaultExpiryAt: {
      type: Number,
      default: 0,
    },
    vault: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          items: {
            type: [
              {
                itemId: { type: String, required: true },
                fragmentId: { type: Number, default: 0 },
                isComplete: { type: Boolean, default: false },
                updatedAt: { type: Date, default: Date.now },
              },
            ],
            validate: {
              validator: function (array) {
                return array.length <= 27;
              },
              message: "Each mythology can only have 27 items in the vault.",
            },
          },
        },
      ],
      default: [],
    },
    claimedRoRItems: {
      type: [String],
      default: [],
    },
    appearedUnderworldChars: {
      type: [String],
      default: [],
    },
    pouch: {
      type: [String],
      default: [],
    },
    buildStage: {
      type: [
        {
          itemId: {
            type: String,
            required: true,
          },
          exp: Number,
        },
      ],
    },
  },
  { timestamps: true }
);

const dodGameDataSchema = new Schema<IDODData>(
  {
    ...baseGameDataSchema,
    // stats
    gamePhase: {
      type: String,
      enum: ["idle", "drawn", "battle", "ended", "explore", "encounter"],
      default: "idle",
    },
    currentTurn: {
      type: Number,
      default: 0,
    },
    currentBattleGround: {
      type: Number,
      default: 0,
    },
    numOfBattlesWon: {
      type: Number,
      default: 0,
    },

    // user data
    user: {
      avatarType: {
        type: String,
        enum: [
          "celtic.char.C09_male",
          "celtic.char.C09_female",
          "egyptian.char.C09_male",
          "egyptian.char.C09_female",
          "greek.char.C09_male",
          "greek.char.C09_female",
          "norse.char.C09_male",
          "norse.char.C09_female",
        ],
      },
      characterCardDeck: {
        type: [
          {
            cardId: String,
            attack: Number,
            defense: Number,
          },
        ],
        default: [],
      },
      drawnCards: {
        type: [
          {
            cardId: String,
            attachmentId: String,
            isCurrentlyInHand: Boolean,
            attack: Number,
            defense: Number,
          },
        ],
        default: [],
      },
    },

    // bot data
    bot: {
      avatarType: {
        type: String,
        enum: [
          "celtic.char.C09_male",
          "celtic.char.C09_female",
          "egyptian.char.C09_male",
          "egyptian.char.C09_female",
          "greek.char.C09_male",
          "greek.char.C09_female",
          "norse.char.C09_male",
          "norse.char.C09_female",
        ],
      },
      characterCardDeck: {
        type: [
          {
            cardId: String,
            attack: Number,
            defense: Number,
          },
        ],
        default: [],
      },
      drawnCards: {
        type: [
          {
            cardId: String,
            attachmentId: String,
            isCurrentlyInHand: Boolean,
          },
        ],
        default: [],
      },
    },

    // explored encounters
    exploreCardLog: {
      type: [String],
      default: [],
    },

    // location cycles
    locationCycle: {
      currentCycle: { type: Number, default: 0 },
      cardsUsedInCycle: { type: Number, default: 0 },
      seed: {
        type: String,
        default: () => require("crypto").randomBytes(16).toString("hex"),
      },
    },

    // shuffle cards for user-bot
    cardCycle: {
      currentCycle: { type: Number, default: 0 },
      cardsUsedInCycle: { type: Number, default: 0 },
      seed: {
        type: String,
        default: () => require("crypto").randomBytes(16).toString("hex"),
      },
      drawnIdxs: [Number],
    },

    // battle history

    battleHistory: [
      {
        turnNumber: { type: Number, required: true },
        battleStats: [
          // 0: user, 1:  bot
          {
            cardId: { type: String, required: true },
            attachmentId: { type: String, required: true },
            attack: { type: Number, min: 0, required: true },
            defense: { type: Number, min: 0, required: true },
          },
        ],
        roundWinner: {
          type: String,
          enum: ["user", "bot", "encounter", "draw"],
          required: true,
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // quests
    claimedQuests: [
      {
        taskId: {
          type: Schema.Types.ObjectId,
          ref: "Quests",
        },
        isKeyClaimed: {
          type: Boolean,
          default: false,
        },
        orbClaimed: {
          type: Boolean,
          default: false,
        },
        completedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    sharedQuests: {
      type: [Schema.Types.ObjectId],
      ref: "Quests",
    },
  },
  {
    timestamps: true,
  }
);

const fofGameData = model<IFOFData>("fofGameData", fofGameDataSchema);
const rorGameData = model<IRORData>("rorGameData", rorGameDataSchema);
const dodGameData = model<IDODData>("dodGameData", dodGameDataSchema);

export { fofGameData, rorGameData, dodGameData };
