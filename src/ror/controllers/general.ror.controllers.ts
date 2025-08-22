import userMythologies from "../../common/models/mythologies.models";
import {
  generateDailyRwrd,
  getLeaderboardRanks,
} from "../services/general.ror.services";
import User from "../../common/models/user.models";
import { CoinsTransactions } from "../../common/models/transactions.models";
import Stats from "../../common/models/Stats.models";

export const claimDailyBonus = async (req, res) => {
  const userId = req.user._id;
  const userGameData = req.userGameData;

  try {
    const currTimeInUTC = new Date();

    await userGameData.updateOne({
      $set: {
        dailyBonusClaimedAt: currTimeInUTC,
      },
    });

    let bonusReward = await generateDailyRwrd(userGameData, userId);

    if (!bonusReward) {
      bonusReward = "shards.aether02";

      await userMythologies.findOneAndUpdate(
        { userId: userId },
        { $inc: { blackShards: 100 } }
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
  const user = req.user;
  const requestPage = parseInt(page, 10) || 0;

  try {
    const overallLeaderboard = await getLeaderboardRanks(
      userRank,
      requestPage,
      100
    );

    res.status(200).json({
      // leaderboard: overallLeaderboard[0]?.active || [],
      // hallOfFame: overallLeaderboard[0]?.finished || [],
      // stakeOn: user.userBetAt ? user.userBetAt[0] : null,
      refer: overallLeaderboard[0]?.refer || [],
      leaderboard: overallLeaderboard[0]?.active || [],
      hallOfFame: overallLeaderboard[0]?.finished || [],
      stakeOn: user.userBetAt ? user.userBetAt[0] : null,
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
    const userGameData = req.userGameData;

    await userGameData.updateOne({ joiningBonus: true });

    await userMythologies.findOneAndUpdate(
      { userId: userId },
      { $inc: { gobcoin: 9 } }
    );

    const newCoinsTransaction = new CoinsTransactions({
      userId: userId,
      source: "join",
      coins: 9,
    });
    await newCoinsTransaction.save();

    await Stats.findOneAndUpdate(
      { statId: "ror" },
      { $inc: { totalUsers: 1 } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Joining bonus claimed successfully." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update join bonus.",
      error: error.message,
    });
  }
};
