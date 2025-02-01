import User from "../../common/models/user.models";
import ranks from "../../common/models/ranks.models";
import {
  bulkUpdateBetResult,
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
import { fetchPlaySuperRewards } from "../../common/services/playsuper.services";
import milestones from "../../common/models/milestones.models";
import partners from "../../common/models/partners.models";
import { validCountries } from "../../utils/constants/variables";
import { OrbsTransactions } from "../../common/models/transactions.models";

// leaderboard
export const getLeaderboard = async (req, res) => {
  const { page, filter } = req.query;
  const user = req.user;

  const requestPage = page || 0;
  try {
    const overallLeaderboard = await getLeaderboardRanks(
      requestPage,
      100,
      filter
    );

    res.status(200).json({
      leaderboard: overallLeaderboard[0].active,
      hallOfFame: overallLeaderboard[0].finished,
      stakeOn: user.userBetAt ? user.userBetAt[0] : null,
    });
  } catch (error) {
    console.log(error);

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

    const fofFinishedUsers = leaderboard.filter(
      (user) => user.totalOrbs > 999999
    );
    const fofActiveUsers = leaderboard.filter(
      (user) => user.totalOrbs <= 999999
    );
    const rorFinishedUsers = leaderboard.filter(
      (user) => user.gobcoin > 999999
    );
    const rorActiveUsers = leaderboard.filter((user) => user.gobcoin <= 999999);

    // overall rank
    const fofSortedUsers = fofActiveUsers
      .map((user, index) => ({
        ...user,
        orbRank: index + 1,
      }))
      .sort((a, b) => b.totalOrbs - a.totalOrbs);

    const rorSortedUsers = rorActiveUsers
      .map((user, index) => ({
        ...user,
        coinRank: index + 1,
      }))
      .sort((a, b) => b.gobcoin - a.gobcoin);

    const usersByCountry = await sortRanksByCountry(fofSortedUsers);

    // update ranks for active users
    const bulkOps = fofSortedUsers.map((user) => {
      let userCountryRank = 0;
      let userCoinRank = 0;
      if (user.country && user.country !== "NA") {
        const key = user.country;
        userCountryRank = usersByCountry[key]
          ? usersByCountry[key].find(
              (u) => u.userId.toString() === user.userId.toString()
            ).countryRank
          : 1;
      }

      userCoinRank = rorSortedUsers.find(
        (u) => u.userId.toString() === user.userId.toString()
      ).coinRank;

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
              orbRank: user.orbRank,
              coinRank: userCoinRank,
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
    const fofFinishedOps = fofFinishedUsers.map((user) => ({
      updateOne: {
        filter: { userId: user.userId },
        update: {
          $set: {
            fofCompletedAt: user.finishedAt,
            userId: user.userId,
            telegramUsername: user.telegramUsername,
            profileImage: user.profileImage,
            directReferralCount: user.directReferralCount,
            totalOrbs: user.totalOrbs,
            squadOwner: user.squadOwner,
            orbRank: 0,
            coinRank: user.coinRank,
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

    const rorFinishedOps = fofFinishedUsers.map((user) => ({
      updateOne: {
        filter: { userId: user.userId },
        update: {
          $set: {
            fofCompletedAt: user.finishedAt,
            userId: user.userId,
            telegramUsername: user.telegramUsername,
            profileImage: user.profileImage,
            directReferralCount: user.directReferralCount,
            totalOrbs: user.totalOrbs,
            squadOwner: user.squadOwner,
            orbRank: user.orbRank,
            coinRank: 0,
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

    // bulk operations
    await ranks.bulkWrite([...bulkOps, ...fofFinishedOps, ...rorFinishedOps]);

    const bettedUsers = fofSortedUsers.filter(
      (user) => user.totalOrbs <= 999999 && user.userBetAt
    );

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
    const playusperCred = req.user.playsuper;
    const { country } = req.query;

    const userMilestones = await milestones.findOne({ userId: userId });
    const activePartners = await partners.find().lean();
    const userRewards = userMilestones.rewards.claimedRewards;

    let playsuper = [];

    if (validCountries.includes(country)) {
      const playsuperRewards = await fetchPlaySuperRewards(
        country,
        "en",
        playusperCred
      );

      playsuper = playsuperRewards.map((reward) => {
        return {
          ...reward,
          partnerType: "playsuper",
        };
      });
    }

    const claimedRewards = userRewards
      .filter((item) => item.tokensCollected == 12)
      .map((item) => item.partnerId.toString());

    const filteredCustomRewards = activePartners
      .filter(
        (item) =>
          !claimedRewards.includes(item._id.toString()) && !item.isCharity
      )
      .map((item) => ({
        ...item,
        id: item._id,
      }));

    const availablePartners = [...filteredCustomRewards, ...playsuper];

    // if (availablePartners.length === 0) {
    user.save();
    res.status(200).json({ reward: "fdg" });
    return;
    // }

    // playsuper
    // const randomPartner = Math.floor(Math.random() * availablePartners.length);
    // const partnerExists = userRewards.find(
    //   (item) => item.partnerId == availablePartners[randomPartner].id.toString()
    // );

    // if (partnerExists) {
    //   await milestones.findOneAndUpdate(
    //     {
    //       userId,
    //       "rewards.claimedRewards.partnerId":
    //         availablePartners[randomPartner].id.toString(),
    //     },
    //     {
    //       $set: { "rewards.updatedAt": Date.now() },
    //       $inc: { "rewards.claimedRewards.$.tokensCollected": 1 },
    //     },
    //     {
    //       new: true,
    //     }
    //   );
    // } else {
    //   await userMilestones.updateOne(
    //     {
    //       $set: {
    //         "rewards.updatedAt": Date.now(),
    //       },
    //       $push: {
    //         "rewards.claimedRewards": {
    //           partnerId: availablePartners[randomPartner].id.toString(),
    //           type:
    //             availablePartners[randomPartner].partnerType == "playsuper"
    //               ? "playsuper"
    //               : "custom",
    //           isClaimed: false,
    //           tokensCollected: 1,
    //         },
    //       },
    //     },
    //     { new: true }
    //   );
    // }

    // res.status(200).json({
    //   reward: availablePartners[randomPartner],
    // });

    // user.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update streak bonus.",
      error: error.message,
    });
  }
};
