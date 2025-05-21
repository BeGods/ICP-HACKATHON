import ranks from "../../common/models/ranks.models";
import milestones from "../../common/models/milestones.models";
import userMythologies from "../../common/models/mythologies.models";
import { OrbsTransactions } from "../../common/models/transactions.models";
import mongoose from "mongoose";
import User from "../../common/models/user.models";

export const getLeaderboardSnapshot = async () => {
  try {
    const pipeline = [
      {
        $unwind: {
          path: "$mythologies",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$userId",
          mythologyOrbsData: {
            $push: {
              name: "$mythologies.name",
              orbs: "$mythologies.orbs",
            },
          },
          totalMythologyOrbs: {
            $sum: {
              $ifNull: ["$mythologies.orbs", 0],
            },
          },
          blackOrbs: { $first: { $ifNull: ["$blackOrbs", 0] } },
          multiColorOrbs: { $first: { $ifNull: ["$multiColorOrbs", 0] } },
          gobcoin: { $first: { $ifNull: ["$gobcoin", 0] } },
          modifiedBlackOrbs: {
            $first: {
              $multiply: [{ $ifNull: ["$blackOrbs", 0] }, 1000],
            },
          },
          modifiedMultiColorOrbs: {
            $first: {
              $multiply: [{ $ifNull: ["$multiColorOrbs", 0] }, 2],
            },
          },
        },
      },
      {
        $addFields: {
          totalOrbs: {
            $add: [
              "$totalMythologyOrbs",
              "$modifiedBlackOrbs",
              "$modifiedMultiColorOrbs",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $sort: { totalOrbs: -1 as -1 },
      },
      {
        $lookup: {
          from: "ranks",
          localField: "_id",
          foreignField: "userId",
          as: "rankDetails",
        },
      },
      {
        $addFields: {
          prevRank: {
            $ifNull: [{ $arrayElemAt: ["$rankDetails.orbRank", 0] }, null],
          },
        },
      },
      {
        $project: {
          userId: "$_id",
          telegramId: "$userDetails.telegramId",
          telegramUsername: "$userDetails.telegramUsername",
          profileImage: "$userDetails.profile.avatarUrl",
          directReferralCount: "$userDetails.directReferralCount",
          country: "$userDetails.country",
          blackOrbs: 1,
          multiColorOrbs: 1,
          gobcoin: 1,
          totalOrbs: 1,
          mythologyOrbsData: 1,
          squadOwner: "$userDetails.squadOwner",
          prevRank: 1,
          finishedAt: {
            $ifNull: ["$userDetails.gameCompletedAt.fof", null],
          },
        },
      },
    ];

    const leaderboard = await userMythologies
      .aggregate(pipeline)
      .allowDiskUse(true)
      .exec();

    return leaderboard;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLeaderboardRanks = async (
  userRank = 1000,
  page = 0,
  limit = 100
) => {
  let skip = page * limit;
  let matchStage: Record<string, any> = { totalOrbs: { $lt: 999999 } };
  let fetchAll = false;

  if (userRank <= 12) {
    matchStage = { ...matchStage, orbRank: { $lte: 12 } }; // Gold
    fetchAll = true;
  } else if (userRank <= 99) {
    matchStage = { ...matchStage, orbRank: { $gte: 13, $lte: 99 } }; // Silver
    fetchAll = true;
  } else if (userRank <= 333) {
    matchStage = { ...matchStage, orbRank: { $gte: 100, $lte: 333 } }; // Bronze
  } else {
    matchStage = { ...matchStage, orbRank: { $gte: 334, $lte: 999 } }; // Wood
  }

  // else if (userRank <= 666) {
  //   matchStage = { ...matchStage, orbRank: { $gte: 334, $lte: 666 } }; // Bronze
  // }

  if (fetchAll) skip = 0;

  try {
    let ranksFilter = [
      { $match: matchStage },
      { $sort: { orbRank: 1 as 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
          _id: 0,
          userId: 0,
        },
      },
    ];

    let pipelineObj = {
      $facet: {
        active: ranksFilter,
        finished: [
          { $match: { totalOrbs: { $gte: 999999 } } },
          { $sort: { fofCompletedAt: 1 as 1 } },
          {
            $project: {
              __v: 0,
              createdAt: 0,
              updatedAt: 0,
              _id: 0,
              userId: 0,
            },
          },
        ],
      },
    };

    const pipeline = [pipelineObj];

    const results = await ranks.aggregate(pipeline).allowDiskUse(true).exec();

    return results;
  } catch (error) {
    throw new Error(error);
  }
};

export const getRandomValue = () => {
  const valuesWithProbabilities = [
    { value: "blackOrb", probability: 1 / 3 },
    { value: "booster", probability: 1 / 3 },
    { value: "mythOrb", probability: 1 / 3 },
  ];

  // const valuesWithProbabilities = [
  //   { value: "blackOrb", probability: 0.125 },
  //   { value: "quest", probability: 0.125 },
  //   { value: "booster", probability: 0.25 },
  //   { value: "mythOrb", probability: 0.5 },
  // ];
  const random = Math.random();
  let cumulativeProbability = 0;

  for (const item of valuesWithProbabilities) {
    cumulativeProbability += item.probability;

    if (random < cumulativeProbability) {
      return item.value;
    }
  }

  // fallback
  return valuesWithProbabilities[valuesWithProbabilities.length - 1].value;
};

// Bonus rewards
export const claimBonusOrb = async (reward, userId) => {
  try {
    if (reward === "blackOrb") {
      await userMythologies.findOneAndUpdate(
        { userId: userId },
        {
          $inc: { blackOrbs: 1 },
        },
        { new: true }
      );

      const newOrbsTransaction = new OrbsTransactions({
        userId: userId,
        source: "bonus",
        orbs: { black: 1 },
      });
      await newOrbsTransaction.save();
      const result = {
        type: "blackOrb",
      };

      return result;
    } else {
      const mythologies = ["Greek", "Celtic", "Norse", "Egyptian"];
      const randomMythOrb = mythologies[Math.floor(Math.random() * 4)];

      await userMythologies.findOneAndUpdate(
        { userId: userId, "mythologies.name": randomMythOrb },
        {
          $inc: { "mythologies.$.orbs": 1 },
        },
        { new: true }
      );

      const newOrbsTransaction = new OrbsTransactions({
        userId: userId,
        source: "bonus",
        orbs: { [randomMythOrb]: 1 },
      });
      await newOrbsTransaction.save();

      const result = {
        type: "mythOrb",
        mythology: randomMythOrb,
      };

      return result;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const claimBonusBooster = async (userId) => {
  try {
    const boosters = ["automata", "minion"];
    const mythologies = ["Greek", "Celtic", "Norse", "Egyptian"];
    const randomMyth = mythologies[Math.floor(Math.random() * 4)];
    const randomBooster = boosters[Math.floor(Math.random() * 2)];
    let boosterUpdatedData;

    const userMyth = await userMythologies.findOne({ userId: userId });
    const filteredMyth = userMyth.mythologies.find(
      (mythology) => mythology.name == randomMyth
    );

    if (randomBooster === "minion") {
      const updateValue = filteredMyth.boosters.shardslvl >= 99 ? 0 : 2;
      const result = await userMythologies.findOneAndUpdate(
        { userId, "mythologies.name": randomMyth },
        {
          $inc: { "mythologies.$.boosters.shardslvl": updateValue },
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
    } else {
      const updateValue = filteredMyth.boosters.automatalvl >= 99 ? 0 : 2;
      const result = await userMythologies.findOneAndUpdate(
        { userId, "mythologies.name": randomMyth },
        {
          $inc: { "mythologies.$.boosters.automatalvl": updateValue },
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
    }

    return {
      type: randomBooster,
      mythology: randomMyth,
      boosterUpdatedData: boosterUpdatedData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const claimBonusQuest = async (userId) => {
  try {
    const pipeline = [
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }, // Ensure the pipeline is scoped to the user
      },
      {
        $lookup: {
          from: "quests",
          let: { userId: "$userId" },
          pipeline: [
            {
              $lookup: {
                from: "milestones",
                let: { questId: "$_id", userId: "$$userId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", "$$userId"] },
                          { $in: ["$$questId", "$claimedQuests.taskId"] },
                        ],
                      },
                    },
                  },
                  {
                    $addFields: {
                      matchedClaimedQuest: {
                        $filter: {
                          input: "$claimedQuests",
                          as: "task",
                          cond: {
                            $eq: ["$$task.taskId", "$$questId"],
                          },
                        },
                      },
                    },
                  },
                  {
                    $addFields: {
                      isClaimed: {
                        $gt: [{ $size: "$matchedClaimedQuest" }, 0],
                      },
                    },
                  },
                ],
                as: "claimedQuestData",
              },
            },
            {
              $addFields: {
                isQuestClaimed: {
                  $cond: [
                    { $gt: [{ $size: "$claimedQuestData" }, 0] },
                    { $arrayElemAt: ["$claimedQuestData.isClaimed", 0] },
                    false,
                  ],
                },
              },
            },
            {
              $project: {
                claimedQuestData: 0,
                updatedAt: 0,
                createdAt: 0,
                __v: 0,
              },
            },
          ],
          as: "allQuests",
        },
      },
      {
        $addFields: {
          quests: {
            $filter: {
              input: "$allQuests",
              as: "quest",
              cond: {
                $and: [
                  { $eq: ["$$quest.status", "Active"] },
                  { $eq: ["$$quest.isQuestClaimed", false] },
                  { $eq: [{ $ifNull: ["$$quest.secret", null] }, null] },
                ],
              },
            },
          },
        },
      },
      { $project: { allQuests: 0 } },
    ];

    const quests = await milestones
      .aggregate(pipeline)
      .allowDiskUse(true)
      .exec();

    const unClaimedActiveQuests = quests[0].quests.filter(
      (item) => item.mythology !== "Other"
    );

    const randomQuest =
      unClaimedActiveQuests[
        Math.floor(Math.random() * unClaimedActiveQuests.length)
      ];

    if (randomQuest) {
      await userMythologies.findOneAndUpdate(
        { userId: userId, "mythologies.name": randomQuest.mythology },
        {
          $inc: { "mythologies.$.faith": 1, "mythologies.$.energyLimit": 1000 },
        }
      );

      await milestones.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            claimedQuests: {
              taskId: new mongoose.Types.ObjectId(randomQuest._id),
            },
          },
        },
        {
          new: true,
        }
      );

      randomQuest.isQuestClaimed = true;

      const result = {
        type: "quest",
        quest: randomQuest,
      };
      return result;
    } else {
      const result = await claimBonusOrb("mythOrb", userId);
      return result;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const checkBonus = async (user) => {
  try {
    const dailyBonusClaimed = user.bonus.fof.dailyBonusClaimedAt;
    const nowUtc = new Date();

    const startOfTodayUtc = new Date(
      Date.UTC(
        nowUtc.getUTCFullYear(),
        nowUtc.getUTCMonth(),
        nowUtc.getUTCDate(),
        0,
        0,
        0
      )
    );

    const endOfTodayUtc = new Date(
      Date.UTC(
        nowUtc.getUTCFullYear(),
        nowUtc.getUTCMonth(),
        nowUtc.getUTCDate(),
        23,
        59,
        59
      )
    );
    const validClaim =
      dailyBonusClaimed >= startOfTodayUtc &&
      dailyBonusClaimed <= endOfTodayUtc;

    if (validClaim) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("Bonus Error:", error);
    throw new Error(error.message);
  }
};

export const updatePartnersInLastHr = async (userMilestones) => {
  try {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const timeElapsed = now - userMilestones.rewards.lastResetAt;

    if (userMilestones.rewards.lastResetAt === 0 || timeElapsed > oneHour) {
      userMilestones.updateOne({
        $set: {
          "rewards.rewardsInLastHr": [],
          "rewards.lastResetAt": now,
        },
      });
    }

    return userMilestones;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const sortRanksByCountry = async (users) => {
  try {
    const usersByCountry = {};

    users.forEach((user) => {
      if (user.country) {
        const key = user.country;
        if (!usersByCountry[key]) {
          usersByCountry[key] = [];
        }
        usersByCountry[key].push(user);
      }
    });

    Object.keys(usersByCountry).forEach((country) => {
      const squadUsers = usersByCountry[country];
      squadUsers.sort((a, b) => b.totalOrbs - a.totalOrbs);
      squadUsers.forEach((user, index) => {
        user.countryRank = index + 1;
      });
    });

    return usersByCountry;
  } catch (error) {
    throw new Error(error);
  }
};

export const sortRanksByGobcoin = async (users) => {
  try {
    const usersByCoin = {};

    users
      .map((user, index) => ({
        ...user,
        coinRank: index + 1,
      }))
      .sort((a, b) => b.gobcoin - a.gobcoin);
    return usersByCoin;
  } catch (error) {
    throw new Error(error);
  }
};

export const sortRanksByCoin = async (users) => {
  try {
    const usersByCoin = {};

    users.forEach((user) => {
      if (user.country) {
        const key = user.country;
        if (!usersByCoin[key]) {
          usersByCoin[key] = [];
        }
        usersByCoin[key].push(user);
      }
    });

    Object.keys(usersByCoin).forEach((country) => {
      const squadUsers = usersByCoin[country];
      squadUsers.sort((a, b) => b.totalOrbs - a.totalOrbs);
      squadUsers.forEach((user, index) => {
        user.countryRank = index + 1;
      });
    });

    return usersByCoin;
  } catch (error) {
    throw new Error(error);
  }
};

export const bulkUpdateBetResult = async (users) => {
  try {
    // update all user docs and reset bet

    const betResetUsers = users.map((user) => {
      const prediction = user.userBetAt[0];
      const previousRank = parseInt(user.userBetAt.slice(1), 10);
      let updateValue = "-1";

      if (prediction === "-" && user.orbRank > previousRank) {
        updateValue = "+1";
      } else if (prediction === "+" && user.orbRank < previousRank) {
        updateValue = "+1";
      }

      return {
        updateOne: {
          filter: { _id: user.userId },
          update: {
            $set: {
              userBetAt: null,
              "bonus.fof.extraBlackOrb": updateValue,
            },
          },
          upsert: true,
        },
      };
    });

    await User.bulkWrite([...betResetUsers]);

    const rewardedUsers = users.map((user) => {
      const prediction = user.userBetAt[0];
      const previousRank = parseInt(user.userBetAt.slice(1), 10);
      let updateValue = -1;

      if (prediction === "-" && user.orbRank > previousRank) {
        updateValue = 1;
      } else if (prediction === "+" && user.orbRank < previousRank) {
        updateValue = 1;
      }

      return {
        updateOne: {
          filter: { userId: user.userId },
          update: {
            $inc: {
              blackOrbs: updateValue,
            },
          },
          upsert: true,
        },
      };
    });

    await userMythologies.bulkWrite([...rewardedUsers]);
  } catch (error) {
    throw new Error(error);
  }
};

export const bulkUpdateFoFComplete = async (users) => {
  try {
    // update all user docs and reset bet
    const fofUnmarkedUsers = users.map((user) => {
      return {
        updateOne: {
          filter: { _id: user.userId },
          update: {
            $set: {
              gameCompletedAt: {
                fof: new Date(),
                hasClaimedFoFRwrd: false,
              },
            },
          },
          upsert: true,
        },
      };
    });

    await User.bulkWrite([...fofUnmarkedUsers]);
  } catch (error) {
    throw new Error(error);
  }
};
