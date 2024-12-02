import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  telegramId?: string;
  telegramUsername?: string;
  name: string;
  isPremium?: boolean;
  role: "user" | "admin" | "partner";
  bonus: {
    fof: {
      dailyBonusClaimedAt: Date;
      exploitCount: number;
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
  lastLoginAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    telegramId: { type: String, unique: true, sparse: true },
    telegramUsername: { type: String, unique: true, sparse: true },
    isPremium: { type: Boolean },
    bonus: {
      fof: {
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
    },
    gameSession: {
      gameHrStartAt: {
        type: Number,
        default: () => new Date().setHours(9, 0, 0, 0),
      },
      dailyGameQuota: {
        type: Number,
        default: 0,
      },
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
    lastLoginAt: {
      type: Date,
      default: null, // Tracks the user's last login time
    },
  },

  { timestamps: true }
);

// userSchema.pre<IUser>("save", function (next) {
//   if (!this.squadOwner) {
//     this.squadOwner = this._id as mongoose.Types.ObjectId;
//   }
//   next();
// });

const User = model<IUser>("User", userSchema);

export default User;
