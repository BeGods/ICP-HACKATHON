import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  telegramId?: string;
  telegramUsername?: string;
  isPremium?: boolean;
  role: "user" | "admin" | "partner";
  directReferralCount: number;
  tonAddress: string;
  exploitCount: number;
  premiumReferralCount: number;
  gameSession: {
    gameHrStartAt: Number;
    dailyGameQuota: Number;
  };
  joiningBonus: boolean;
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
  dailyBonusClaimedAt: Date;
  announcements: number;
}

const userSchema = new Schema<IUser>(
  {
    telegramId: { type: String, unique: true, sparse: true },
    telegramUsername: { type: String, unique: true, sparse: true },
    isPremium: { type: Boolean },
    joiningBonus: { type: Boolean, default: false },
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
    exploitCount: {
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
    dailyBonusClaimedAt: {
      type: Date,
      default: 0,
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
