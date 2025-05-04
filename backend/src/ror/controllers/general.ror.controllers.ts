import userMythologies from "../../common/models/mythologies.models";
import {
  generateDailyRwrd,
  getLeaderboardRanks,
} from "../services/general.ror.services";
import User from "../../common/models/user.models";
import { CoinsTransactions } from "../../common/models/transactions.models";
import milestones from "../../common/models/milestones.models";

export const claimDailyBonus = async (req, res) => {
  const userId = req.user._id;
  const user = req.user;
  try {
    const currTimeInUTC = new Date();

    await user.updateOne({
      $set: {
        "bonus.ror.dailyBonusClaimedAt": currTimeInUTC,
      },
    });

    let bonusReward = await generateDailyRwrd(userId);

    if (!bonusReward) {
      bonusReward = "shards";

      await userMythologies.findOneAndUpdate(
        { userId: userId },
        { $inc: { blackShards: 10 } }
      );
    }

    res.status(200).json({ reward: bonusReward });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update daily bonus.",
      error: error.message,
    });
  }
};

export const getLeaderboard = async (req, res) => {
  const { page, userRank } = req.query;

  // const user = req.user;
  const requestPage = parseInt(page, 10) || 0;

  try {
    const overallLeaderboard = await getLeaderboardRanks(
      userRank,
      requestPage,
      100
    );

    res.status(200).json({
      leaderboard: overallLeaderboard[0]?.active || [],
      hallOfFame: overallLeaderboard[0]?.finished || [],
      // stakeOn: user.userBetAt ? user.userBetAt[0] : null,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);

    res.status(500).json({
      message: "Failed to fetch leaderboard",
      error: error.message,
    });
  }
};

export const claimJoinBonus = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findOneAndUpdate(
      { _id: userId },
      { "bonus.ror.joiningBonus": true }
    );

    await userMythologies.findOneAndUpdate(
      { userId: userId },
      { $inc: { gobcoin: 3 } }
    );

    await milestones.findOneAndUpdate(
      { userId: userId },

      {
        $set: { "bank.vaultExpiryAt": Date.now() + 5 * 24 * 60 * 60 * 1000 },
      }
    );

    const newCoinsTransaction = new CoinsTransactions({
      userId: userId,
      source: "join",
      coins: 3,
    });
    await newCoinsTransaction.save();

    res.status(200).json({ message: "Joining bonus claimed successfully." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update join bonus.",
      error: error.message,
    });
  }
};
