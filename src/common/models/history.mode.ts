import { Schema, model } from "mongoose";
import { DoDGameHistory } from "../../ts/models/game.interfaces";

const dodGameHistorySchema = new Schema<DoDGameHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalTurns: { type: Number, default: 0 },
    userBattleWins: { type: Number, default: 0 },
    botBattleWins: { type: Number, default: 0 },
    userAvatarType: {
      type: String,
      enum: ["celtic", "egyptian", "greek", "norse"],
    },
    characterCardDeck: {
      type: [String],
      default: [],
    },

    // 0: user & 1: bot
    turnsHistory: [
      {
        turnNumber: Number,
        battleStats: [
          {
            char: String,
            weapon: String,
            attack: Number,
            defense: Number,
          },
        ],
        roundWinner: {
          type: String,
          enum: ["user", "bot", "draw"],
        },
      },
    ],
  },
  { timestamps: true }
);

const DoDHistory = model<DoDGameHistory>(
  "DoDGameHistory",
  dodGameHistorySchema
);

export default DoDHistory;
