import User from "../../common/models/user.models";
import ranks from "../../common/models/ranks.models";
import {
  bulkUpdateBetResult,
  bulkUpdateFoFComplete,
  claimBonusBooster,
  claimBonusOrb,
  claimBonusQuest,
  getLeaderboardRanks,
  getLeaderboardSnapshot,
  getRandomValue,
} from "../services/general.fof.services";
import Stats from "../../common/models/Stats.models";
import userMythologies from "../../common/models/mythologies.models";
import { OrbsTransactions } from "../../common/models/transactions.models";
import { determineStreak } from "../../helpers/streak.helpers";
import { updateTokenReward } from "../../common/services/reward.services";
import mongoose from "mongoose";

export const validateUserPlayed = async (req, res) => {
  try {
    const { telegramId } = req.query;
    const userPlayed = await User.findOne({ telegramId: telegramId });

    if (!telegramId) {
      res.status(200).json({ hasPlayed: false });
    }

    if (userPlayed) {
      res.status(200).json({ hasPlayed: true });
    } else {
      res.status(200).json({ hasPlayed: false });
    }
  } catch (error) {
    console.log(error);
  }
};

// leaderboard
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

export const updateLeadboardRanks = async () => {
  try {
    const leaderboard = await getLeaderboardSnapshot();

    // Segregate Users
    const fofFinishedUsers = leaderboard.filter(
      (user) => user.totalOrbs > 999999
    );
    const fofFinishedUserIds = fofFinishedUsers.map((user) =>
      user.userId.toString()
    );

    const rorFinishedUsers = leaderboard.filter((user) => user.gobcoin > 999);
    const rorFinishedUserIds = rorFinishedUsers.map((user) =>
      user.userId.toString()
    );

    const fofActiveUsers = leaderboard.filter(
      (user) => user.totalOrbs <= 999999
    );
    const rorActiveUsers = leaderboard.filter((user) => user.gobcoin <= 999);

    // calculate orbRank
    const sortedFofUsers = [...fofActiveUsers, ...rorFinishedUsers]
      .sort((a, b) => b.totalOrbs - a.totalOrbs)
      .map((user, index) => ({
        ...user,
        orbRank: fofFinishedUserIds.includes(user.userId.toString())
          ? 0
          : index + 1,
      }));

    // calculate coinRank
    const sortedRorUsers = [...rorActiveUsers, ...fofFinishedUsers]
      .sort((a, b) => b.gobcoin - a.gobcoin)
      .map((user, index) => ({
        ...user,
        coinRank: rorFinishedUserIds.includes(user.userId.toString())
          ? 0
          : index + 1,
      }));

    const allUsers = leaderboard.map((user) => {
      return {
        ...user,
        orbRank:
          sortedFofUsers.find(
            (u) => u.userId.toString() === user.userId.toString()
          )?.orbRank || 0,
        coinRank:
          sortedRorUsers.find(
            (u) => u.userId.toString() === user.userId.toString()
          )?.coinRank || 0,
      };
    });

    const bulkOps = allUsers.map((user) => ({
      updateOne: {
        filter: { userId: user.userId },
        update: {
          $set: {
            fofCompletedAt: user.finishedAt ?? new Date(),
            userId: user.userId,
            username: user.telegramUsername,
            profileImage: user.profileImage
              ? user.telegramId
                ? `https://media.publit.io/file/UserAvatars/${user.profileImage}.jpg`
                : user.profileImage
              : null,
            totalOrbs: user.totalOrbs,
            totalGobcoin: user.gobcoin,
            squadOwner: user.squadOwner,
            orbRank: user.orbRank,
            coinRank: user.coinRank,
            country: user.country ?? "NA",
            prevRank: user.prevRank,
            rorCompletedAt: user.finishedAt ?? new Date(),
            directReferralCount: user.directReferralCount,
            gameData: {
              ...user.mythologyOrbsData?.reduce((acc, obj) => {
                if (obj.name && obj.orbs !== undefined) {
                  acc[obj.name.toLowerCase()] = obj.orbs;
                }
                return acc;
              }, {}),
              blackOrbs: user.blackOrbs,
              multiColorOrbs: user.multiColorOrbs,
            },
            squadRank: 0,
          },
        },
        upsert: true,
      },
    }));

    // bulk update
    await ranks.bulkWrite(bulkOps);

    const bettedUsers = sortedFofUsers.filter(
      (user) => user.totalOrbs <= 999999 && user.userBetAt
    );
    const fofUnmarkedUsers = fofFinishedUsers.filter(
      (user) => !user.finishedAt
    );

    await bulkUpdateFoFComplete(fofUnmarkedUsers);
    await bulkUpdateBetResult(bettedUsers);

    console.log("Leaderboard updated successfully.");
  } catch (error) {
    console.error(error);
  }
};
// bet
export const addUserBet = async (req, res) => {
  const user = req.user;
  const status = req.body.status ? "+" : "-";

  try {
    const userRank = await ranks.findOne({
      userId: user._id,
    });
    await user.updateOne({
      $set: {
        userBetAt: status + userRank.orbRank,
      },
    });

    res.status(200).json({ message: "Your bet has been successfully placed." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update stake.",
      error: error.message,
    });
  }
};

// update stake status
export const updateBetRwrdStatus = async (req, res) => {
  const user = req.user;

  try {
    const newOrbsTransaction = new OrbsTransactions({
      userId: user._id,
      source: "stake",
      orbs: { BlackOrb: 1 },
    });
    await newOrbsTransaction.save();

    await user.updateOne({
      $set: {
        "bonus.fof.extraBlackOrb": null,
      },
    });

    res.status(200).json({ message: "Reward updated." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update stake reward status.",
      error: error.message,
    });
  }
};

// bonus
export const claimDailyBonus = async (req, res) => {
  try {
    const user = req.user;
    const isNotClaimedToday = req.isNotClaimedToday;

    const result = getRandomValue();
    const currTimeInUTC = new Date();
    let bonusReward;

    if (isNotClaimedToday) {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            "bonus.fof.dailyBonusClaimedAt": currTimeInUTC,
            "bonus.fof.exploitCount": 0,
          },
        }
      );
    } else {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            "bonus.fof.dailyBonusClaimedAt": currTimeInUTC,
          },
          $inc: { "bonus.fof.exploitCount": 1 },
        }
      );
    }

    if (result === "blackOrb") {
      bonusReward = await claimBonusOrb(result, user._id);
    } else if (result === "mythOrb") {
      bonusReward = await claimBonusOrb(result, user._id);
    } else if (result === "booster") {
      bonusReward = await claimBonusBooster(user._id);
    } else if (result === "quest") {
      bonusReward = await claimBonusQuest(user._id);
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

// bonus --gacha
export const claimJoinBonus = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user._id;

    await user.updateOne({ "bonus.fof.joiningBonus": true });

    if (user.parentReferrerId) {
      await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(user.parentReferrerId) },
        {
          $inc: {
            directReferralCount: 1,
          },
        }
      );
    }

    await userMythologies.findOneAndUpdate(
      { userId: userId, "mythologies.name": "Greek" },
      { $inc: { multiColorOrbs: 3, "mythologies.$.orbs": 2 } }
    );

    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "join",
      orbs: { MultiOrb: 3, Greek: 2 },
    });
    await newOrbsTransaction.save();

    // update usercount
    await Stats.findOneAndUpdate(
      { statId: "fof" },
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

// bonus --streak
export const claimStreakBonus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;

    // randomize myth
    const mythologies = ["Greek", "Celtic", "Norse", "Egyptian"];
    const randomMyth = mythologies[Math.floor(Math.random() * 4)];
    const streakReward = determineStreak(user.bonus.fof.streak.count);
    let boosterUpdatedData;

    if (streakReward && streakReward.reward === "alchemist") {
      const result = await userMythologies.findOneAndUpdate(
        { userId, "mythologies.name": randomMyth },
        {
          $set: {
            "mythologies.$.boosters.isShardsClaimActive": false,
            "mythologies.$.boosters.shardsLastClaimedAt": Date.now(),
          },
        },
        { new: true }
      );
      boosterUpdatedData = result.mythologies.filter(
        (item) => item.name === randomMyth
      )[0].boosters;
    } else if (streakReward && streakReward.reward === "automata") {
      const result = await userMythologies.findOneAndUpdate(
        { userId, "mythologies.name": randomMyth },
        {
          $set: {
            "mythologies.$.boosters.isAutomataActive": true,
            "mythologies.$.boosters.automataLastClaimedAt": Date.now(),
            "mythologies.$.boosters.automataStartTime": Date.now(),
          },
        },
        { new: true }
      );

      boosterUpdatedData = result.mythologies.filter(
        (item) => item.name === randomMyth
      )[0].boosters;
    } else if (streakReward && streakReward.reward === "burst") {
      const result = await userMythologies.findOneAndUpdate(
        { userId, "mythologies.name": randomMyth },
        {
          $set: {
            "mythologies.$.boosters.isBurstActive": true,
            "mythologies.$.boosters.burstActiveAt": Date.now(),
          },
        },
        { new: true }
      );

      boosterUpdatedData = result.mythologies.filter(
        (item) => item.name === randomMyth
      )[0].boosters;
    }

    user.bonus.fof.streak.lastMythClaimed = randomMyth;
    await user.save();
    await res
      .status(200)
      .json({ boosterUpdatedData: boosterUpdatedData, mythology: randomMyth });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update streak bonus.",
      error: error.message,
    });
  }
};

export const claimMsnReward = async (req, res) => {
  try {
    const reward = req.rewardDetails;
    const userMilestones = req.userMilestones;
    const user = req.user;
    const { paymentType } = req.body;

    await updateTokenReward(user, userMilestones, reward, paymentType);

    res.status(200).json({ message: "Reward claimed successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to claim reward",
      error: error.message,
    });
  }
};
