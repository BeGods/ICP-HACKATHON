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
  sortRanksByCountry,
} from "../services/general.fof.services";
import Stats from "../../common/models/Stats.models";
import userMythologies from "../../common/models/mythologies.models";
import { OrbsTransactions } from "../../common/models/transactions.models";
import { determineStreak } from "../../helpers/streak.helpers";

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

// update leaderboard
export const updateLeadboardRanks = async (req, res) => {
  try {
    const leaderboard = await getLeaderboardSnapshot();

    const finishedUsers = leaderboard.filter((user) => user.totalOrbs > 999999);
    const activeUsers = leaderboard.filter((user) => user.totalOrbs <= 999999);

    // overall rank
    const sortedUsers = activeUsers
      .map((user, index) => ({
        ...user,
        overallRank: index + 1,
      }))
      .sort((a, b) => b.totalOrbs - a.totalOrbs);

    const usersByCountry = await sortRanksByCountry(sortedUsers);

    // update ranks for active users
    const bulkOps = sortedUsers.map((user) => {
      let userCountryRank = 0;
      if (user.country && user.country !== "NA") {
        const key = user.country;
        userCountryRank = usersByCountry[key]
          ? usersByCountry[key].find(
              (u) => u.userId.toString() === user.userId.toString()
            ).countryRank
          : 1;
      }

      return {
        updateOne: {
          filter: { userId: user.userId },
          update: {
            $set: {
              userId: user.userId,
              telegramUsername: user.telegramUsername,
              profileImage: user.profileImage,
              totalOrbs: user.totalOrbs,
              squadOwner: user.squadOwner,
              overallRank: user.overallRank,
              directReferralCount: user.directReferralCount,
              country: user.country ?? "NA",
              countryRank: userCountryRank,
              prevRank: user.prevRank,
              gameData: {
                ...user.mythologyOrbsData.reduce((acc, obj) => {
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
      };
    });

    // update ranks for finished users
    const finishedOps = finishedUsers.map((user) => ({
      updateOne: {
        filter: { userId: user.userId },
        update: {
          $set: {
            fofCompletedAt: user.finishedAt ?? new Date(),
            userId: user.userId,
            telegramUsername: user.telegramUsername,
            profileImage: user.profileImage,
            directReferralCount: user.directReferralCount,
            totalOrbs: user.totalOrbs,
            squadOwner: user.squadOwner,
            overallRank: 0,
            country: user.country ?? "NA",
            countryRank: 0,
            gameData: {
              ...user.mythologyOrbsData.reduce((acc, obj) => {
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

    // Perform bulkWrite operations
    await ranks.bulkWrite([...bulkOps, ...finishedOps]);

    const bettedUsers = sortedUsers.filter(
      (user) => user.totalOrbs <= 999999 && user.userBetAt
    );
    const fofUnmarkedUsers = finishedUsers.filter((user) => !user.finishedAt);

    await bulkUpdateFoFComplete(fofUnmarkedUsers);
    await bulkUpdateBetResult(bettedUsers);

    const totalUsers = await User.countDocuments({});
    await Stats.findOneAndUpdate(
      { statId: "fof" },
      { $set: { totalUsers: totalUsers } },
      { upsert: true }
    );

    console.log("Leaderboard updated successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update leaderboard.",
      error: error.message,
    });
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
        userBetAt: status + userRank.overallRank,
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
    const userId = req.user._id;

    await User.findOneAndUpdate(
      { _id: userId },
      { "bonus.fof.joiningBonus": true }
    );

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
