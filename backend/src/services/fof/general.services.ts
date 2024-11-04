import milestones from "../../models/milestones.models";
import userMythologies from "../../models/mythologies.models";
import { OrbsTransactions } from "../../models/transactions.models";
import mongoose from "mongoose";

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
          totalMythologyOrbs: {
            $sum: {
              $ifNull: ["$mythologies.orbs", 0],
            },
          },
          blackOrbs: {
            $first: {
              $multiply: [{ $ifNull: ["$blackOrbs", 0] }, 1000],
            },
          },
          multiColorOrbs: {
            $first: {
              $multiply: [{ $ifNull: ["$multiColorOrbs", 0] }, 2],
            },
          },
        },
      },
      {
        $addFields: {
          totalOrbs: {
            $add: ["$totalMythologyOrbs", "$blackOrbs", "$multiColorOrbs"],
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
        $project: {
          userId: "$_id",
          telegramUsername: "$userDetails.telegramUsername",
          profileImage: "$userDetails.profile.avatarUrl", // Adjusted this line
          totalOrbs: 1,
          squadOwner: "$userDetails.squadOwner",
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

export const getRandomValue = () => {
  const valuesWithProbabilities = [
    { value: "blackOrb", probability: 0.125 },
    { value: "quest", probability: 0.125 },
    { value: "booster", probability: 0.25 },
    { value: "mythOrb", probability: 0.5 },
  ];
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
        orbs: { randomMythOrb: 1 },
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

    if (randomBooster === "minion") {
      const result = await userMythologies.findOneAndUpdate(
        { userId, "mythologies.name": randomMyth },
        {
          $inc: { "mythologies.$.boosters.shardslvl": 1 },
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
      const result = await userMythologies.findOneAndUpdate(
        { userId, "mythologies.name": randomMyth },
        {
          $inc: { "mythologies.$.boosters.automatalvl": 1 },
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
                    $unwind: "$claimedQuests",
                  },
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", "$$userId"] },
                          { $eq: ["$$questId", "$claimedQuests.taskId"] },
                        ],
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
                  $cond: {
                    if: { $gt: [{ $size: "$claimedQuestData" }, 0] },
                    then: true,
                    else: false,
                  },
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

    const quests = await milestones.aggregate(pipeline).exec();

    const unClaimedActiveQuests = quests[0].quests.filter(
      (item) => item.mythology !== "Other"
    );

    console.log(unClaimedActiveQuests);

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
    const dailyBonusClaimed = user.dailyBonusClaimedAt;
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
    throw new Error(error.message);
  }
};

export const updatePartnersInLastHr = async (userMilestones) => {
  try {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const timeElapsed = now - userMilestones.rewards.lastResetAt;

    if (userMilestones.rewards.lastResetAt === 0 || timeElapsed > oneHour) {
      userMilestones.rewards.rewardsInLastHr = [];
      userMilestones.rewards.lastResetAt = now;
      await userMilestones.save();
    }

    return userMilestones;
  } catch (error) {
    throw new Error(error.message);
  }
};
