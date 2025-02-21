import mongoose, { Schema, model } from "mongoose";
import { IUser } from "../../ts/models.interfaces";

const userSchema = new Schema<IUser>(
  {
    telegramId: { type: String, unique: true, sparse: true },
    lineId: { type: String, unique: true, sparse: true },
    lineName: { type: String, sparse: true },
    telegramUsername: { type: String, sparse: true },
    isPremium: { type: Boolean },
    bonus: {
      fof: {
        extraBlackOrb: {
          type: String,
        },
        exploitCount: {
          type: Number,
          default: 0,
        },
        joiningBonus: { type: Boolean, default: false },
        streakBonus: {
          isActive: {
            type: Boolean,
            default: false,
          },
          claimedAt: {
            type: Number,
            default: 0,
          },
          streakCount: {
            type: Number,
            default: 0,
          },
        },
        dailyBonusClaimedAt: {
          type: Date,
          default: 0,
        },
      },
      ror: {
        joiningBonus: { type: Boolean, default: false },
        streakBonus: {
          isActive: {
            type: Boolean,
            default: false,
          },
          claimedAt: {
            type: Number,
            default: 0,
          },
          streakCount: {
            type: Number,
            default: 0,
          },
        },
        dailyBonusClaimedAt: {
          type: Date,
          default: 0,
        },
      },
    },
    gameSession: {
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
      underWorldActiveAt: Number,
    },
    phoneNumber: {
      type: String,
    },
    name: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "partner"],
      default: "user",
    },
    tonAddress: {
      type: String,
      unique: true,
      sparse: true,
    },
    directReferralCount: {
      type: Number,
      default: 0,
    },
    premiumReferralCount: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      unique: true,
      required: true,
    },
    parentReferrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      sparse: true,
    },
    squadOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      sparse: true,
    },
    profile: {
      avatarUrl: { type: String },
      updateAt: {
        type: Date,
        default: Date.now(),
      },
    },
    announcements: {
      type: Number,
      default: 0,
    },
    playsuper: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      key: String,
      createdAt: {
        type: Date,
      },
    },
    country: {
      type: String,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    partOfGames: {
      type: [String],
      default: [],
    },
    gameCompletedAt: {
      fof: Date,
      hasClaimedFoFRwrd: {
        type: Boolean,
        default: false,
      },
    },
    userBetAt: {
      type: String,
    },
  },

  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
