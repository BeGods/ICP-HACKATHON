import mongoose from "mongoose";
import {
  calculateEnergy,
  getPhaseByDate,
  hasBeenFourDaysSinceClaimedUTC,
} from "../../helpers/game.helpers";
import userMythologies from "../../common/models/mythologies.models";
import milestones from "../../common/models/milestones.models";
import { defaultMythologies } from "../../utils/constants/variables";
import User from "../../common/models/user.models";
import { checkPlaysuperExpiry } from "../../common/services/playsuper.services";
import {
  getAutomataStartTimes,
  getShortestStartTime,
  checkAutomataStatus,
  validateBooster,
  validateBurst,
} from "../../helpers/booster.helpers";
import { IMyth, IUser, IUserMyths } from "../../ts/models.interfaces";
import {
  determineStreak,
  validStreakReward,
} from "../../helpers/streak.helpers";

export const aggregateGameStats = async (userId) => {
  try {
    // Aggregate pipeline
    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "usermythologies",
          localField: "userId",
          foreignField: "userId",
          as: "userMythologies",
        },
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
                ],
                as: "milestones",
              },
            },
            {
              $addFields: {
                isQuestClaimed: {
                  $cond: {
                    if: { $gt: [{ $size: "$milestones" }, 0] },
                    then: true,
                    else: false,
                  },
                },
              },
            },
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
                          { $in: ["$$questId", "$sharedQuests"] },
                        ],
                      },
                    },
                  },
                ],
                as: "sharedMilestones",
              },
            },
            {
              $addFields: {
                isShared: {
                  $cond: {
                    if: { $gt: [{ $size: "$sharedMilestones" }, 0] },
                    then: true,
                    else: false,
                  },
                },
              },
            },
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
                  {
                    $project: {
                      orbClaimed: "$claimedQuests.orbClaimed",
                      questClaimed: "$claimedQuests.questClaimed",
                      isKeyClaimed: "$claimedQuests.isKeyClaimed",
                    },
                  },
                ],
                as: "claimedQuestData",
              },
            },
            {
              $addFields: {
                isOrbClaimed: {
                  $arrayElemAt: ["$claimedQuestData.orbClaimed", 0],
                },
                isKeyClaimed: {
                  $arrayElemAt: ["$claimedQuestData.isKeyClaimed", 0],
                },
              },
            },
            { $sort: { createdAt: -1 as -1 } },
            {
              $project: {
                milestones: 0,
                sharedMilestones: 0,
                claimedQuestData: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: "allQuests",
        },
      },
      {
        $addFields: {
          quests: "$allQuests",
        },
      },
      { $project: { allQuests: 0 } },
    ];

    // Execute the aggregation pipeline
    const result = await userMythologies.aggregate(pipeline);

    return result;
  } catch (error) {
    throw new Error("There was a problem fetching user data.");
  }
};

export const validateRatValues = (boosterData) => {
  try {
    boosterData.rats = boosterData.rats ?? {};

    boosterData.rats.lastClaimedThreshold =
      boosterData.rats.lastClaimedThreshold ?? 0;
    boosterData.rats.count = boosterData.rats.count ?? 0;

    const ratCount = boosterData.rats.count;
    const ratLastThreshold = boosterData.rats.lastClaimedThreshold;

    if (boosterData.automatalvl > ratLastThreshold + 10 && ratCount === 0) {
      boosterData.rats.lastClaimedThreshold += 10;
      boosterData.rats.count = boosterData.rats.lastClaimedThreshold / 10;
    }

    return boosterData;
  } catch (error) {
    console.error("Error validating rat:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const updateMythologies = (mythologies, user) => {
  try {
    let updatedBlackOrb = 0;

    let blackOrbPhaseBonus = 1;
    const currPhase = getPhaseByDate(new Date());

    if (currPhase === 4) {
      blackOrbPhaseBonus = 2;
    }

    const updatedMythologyData = mythologies.map((mythology) => {
      const restoredEnergy = calculateEnergy(
        Date.now(),
        mythology.lastTapAcitivityTime,
        mythology.energy,
        mythology.energyLimit
      );

      // Validate boosters
      mythology.boosters = validateBooster(mythology.boosters);
      mythology.boosters = checkAutomataStatus(mythology, user);
      mythology.boosters = validateRatValues(mythology.boosters);

      if (
        !mythology.boosters.isBurstActiveToClaim &&
        mythology.boosters.burstActiveAt != 0
      ) {
        mythology = validateBurst(mythology);
      }

      mythology.energy = restoredEnergy;
      mythology.lastTapAcitivityTime = Date.now();

      if (mythology.shards >= 1000) {
        mythology.orbs += Math.floor(mythology.shards / 1000);
        mythology.shards = mythology.shards % 1000;
      }

      if (mythology.orbs >= 1000) {
        updatedBlackOrb +=
          Math.floor(mythology.orbs / 1000) * blackOrbPhaseBonus;
        mythology.orbs = mythology.orbs % 1000;
        mythology.boosters.isBurstActive = true;
      }

      return mythology;
    });

    return {
      data: updatedMythologyData,
      updatedBlackOrb: updatedBlackOrb,
    };
  } catch (error) {
    console.log(error);
    throw new Error("There was a problem updating mythologies");
  }
};

export const aggregateConvStats = async (userId) => {
  try {
    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "usermythologies",
          localField: "userId",
          foreignField: "userId",
          as: "userMythologies",
        },
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
                ],
                as: "milestones",
              },
            },
            {
              $addFields: {
                isCompleted: {
                  $cond: {
                    if: { $gt: [{ $size: "$milestones" }, 0] },
                    then: true,
                    else: false,
                  },
                },
              },
            },
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
                  {
                    $project: {
                      orbClaimed: "$claimedQuests.orbClaimed",
                      questClaimed: "$claimedQuests.questClaimed",
                      isKeyClaimed: "$claimedQuests.isKeyClaimed",
                    },
                  },
                ],
                as: "claimedQuestData",
              },
            },
            {
              $addFields: {
                isOrbClaimed: {
                  $arrayElemAt: ["$claimedQuestData.orbClaimed", 0],
                },
                isQuestClaimed: {
                  $arrayElemAt: ["$claimedQuestData.questClaimed", 0],
                },
                isKeyClaimed: {
                  $arrayElemAt: ["$claimedQuestData.isKeyClaimed", 0],
                },
              },
            },
            { $sort: { createdAt: -1 as -1 } },
            {
              $project: {
                milestones: 0,
                sharedMilestones: 0,
                claimedQuestData: 0,
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
                $or: [
                  { $eq: ["$$quest.status", "Active"] },
                  { $eq: ["$$quest.isQuestClaimed", true] },
                ],
              },
            },
          },
        },
      },
      { $project: { allQuests: 0 } },
    ];

    // Execute the aggregation pipeline
    const data = await userMythologies.aggregate(pipeline);
    return data;
  } catch (error) {}
};

export const checkStreakIsActive = async (
  lastLoginAt: Date,
  streakLastClaimedAt: Date,
  streakCount: number
) => {
  try {
    if (!lastLoginAt) {
      return false;
    }

    const now = new Date();
    const lastLoginDate = new Date(lastLoginAt ?? new Date(0));
    const lastClaimedDate = new Date(streakLastClaimedAt ?? new Date(0));

    now.setUTCHours(0, 0, 0, 0);
    lastLoginDate.setUTCHours(0, 0, 0, 0);
    lastClaimedDate.setUTCHours(0, 0, 0, 0);

    const isConsecutiveDay = streakCount > 1;

    // is not claimed today
    const isNotClaimedToday = lastClaimedDate.getTime() !== now.getTime();

    return (
      isConsecutiveDay &&
      isNotClaimedToday &&
      determineStreak(streakCount) !== null
    );
  } catch (error) {
    console.error("Error checking streak activity:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const filterDataByMyth = async (mythologyName, userId) => {
  try {
    const userMythology = (await userMythologies.findOne({
      userId: userId,
    })) as IUserMyths;

    if (!userMythology) {
      throw Error("Invalid game data. Mythologies data not found.");
    }

    const mythData = userMythology.mythologies.find(
      (item) => item.name === mythologyName
    ) as IMyth;

    if (!mythData) {
      throw Error("Invalid game data. Mythology not found.");
    }

    return { mythData, userMythology };
  } catch (error) {
    throw Error(error);
  }
};

export const updateSessionData = async (
  mythData,
  userMythology,
  taps,
  minionTaps,
  streakMultipier
) => {
  try {
    let totalTaps = taps - minionTaps;

    // calculate energy
    const restoredEnergy = calculateEnergy(
      mythData.tapSessionStartTime,
      mythData.lastTapAcitivityTime,
      mythData.energy,
      mythData.energyLimit
    );

    // check if numberOfTaps are valid
    if (restoredEnergy < totalTaps) {
      totalTaps = restoredEnergy;
    }

    // update energy after tapping, shards, lastTapActivityTime
    const updatedEnergy = restoredEnergy - totalTaps;
    const shardslvl = Math.round(mythData.boosters.shardslvl * streakMultipier);
    let updatedShards = taps * shardslvl + minionTaps * shardslvl * 2;

    // update myth shards
    mythData.shards += updatedShards;

    // define flags
    let blackOrbs = 0;
    let blackOrbPhaseBonus = 1;
    const currPhase = getPhaseByDate(new Date());

    if (
      currPhase === 4 &&
      hasBeenFourDaysSinceClaimedUTC(userMythology.lastMoonClaimAt)
    ) {
      blackOrbPhaseBonus = 2;
    }

    // update shards
    if (mythData.shards >= 1000) {
      mythData.orbs += Math.floor(mythData.shards / 1000);
      mythData.shards = mythData.shards % 1000;
    }

    // update orbs
    if (mythData.orbs >= 1000) {
      mythData.boosters.isBurstActive = true;
      blackOrbs += Math.floor(mythData.orbs / 1000) * blackOrbPhaseBonus;
      mythData.orbs = mythData.orbs % 1000;
    }

    mythData.lastTapAcitivityTime = Date.now();
    mythData.energy = updatedEnergy;
    const updatedMythData = mythData;

    return { updatedMythData, blackOrbs, updatedShards };
  } catch (error) {
    throw Error("Failed to update session data.");
  }
};

export const updateBubbleData = async (userId, bubbleSession) => {
  try {
    const userMilestones = await milestones.findOne({ userId });

    // Find the first matching partner
    const partnerExists = userMilestones.rewards.claimedRewards.find(
      (item) => item.partnerId === bubbleSession.partnerId
    );

    const fiveMinutesInMs = 2 * 60 * 1000;

    if (
      partnerExists &&
      userMilestones.rewards.updatedAt <= Date.now() - fiveMinutesInMs
    ) {
      // if partner exists update tokensCollected
      if (partnerExists.tokensCollected < 12) {
        await milestones.findOneAndUpdate(
          {
            userId,
            "rewards.claimedRewards.partnerId": bubbleSession.partnerId,
          },
          {
            $set: { "rewards.updatedAt": bubbleSession.lastClaimedAt },
            $push: { "rewards.rewardsInLastHr": bubbleSession.partnerId },
            $inc: { "rewards.claimedRewards.$.tokensCollected": 1 },
          },
          {
            new: true,
          }
        );
      }
    } else {
      // add new partner
      await milestones.findOneAndUpdate(
        { userId },
        {
          $set: {
            "rewards.updatedAt": Date.now(),
          },
          $push: {
            "rewards.rewardsInLastHr": bubbleSession.partnerId,
            "rewards.claimedRewards": {
              partnerId: bubbleSession.partnerId,
              type: bubbleSession.type,
              isClaimed: false,
              tokensCollected: 1,
            },
          },
        },
        { new: true }
      );
    }
  } catch (error) {
    throw Error("Failed to update partner data.");
  }
};

export const updateMythologyData = async (
  userMythologiesData,
  userId,
  user
) => {
  try {
    const updatedData = updateMythologies(
      userMythologiesData.userMythologies[0].mythologies,
      user
    );
    const updatedMythologies = updatedData.data;
    let blackOrbs = updatedData.updatedBlackOrb;

    // add default myth is missing
    const existingNames = updatedMythologies.map((myth) => myth.name);
    const missingMythologies = defaultMythologies.filter(
      (defaultMyth) => !existingNames.includes(defaultMyth.name)
    );
    const completeMythologies = [...updatedMythologies, ...missingMythologies];

    // remove id
    completeMythologies.forEach((mythology) => {
      delete mythology._id;
    });

    const automataStateTimes = getAutomataStartTimes(completeMythologies);
    const isAutoAutomataActive = getShortestStartTime(automataStateTimes);

    // update latest data
    await userMythologies.updateOne(
      { userId },
      {
        $inc: { blackOrbs: blackOrbs },
        $set: { mythologies: completeMythologies },
      }
    );

    return { isAutoAutomataActive, completeMythologies };
  } catch (error) {
    throw Error("Failed to update mythologies data.");
  }
};

export const updateUserData = async (user, isEligibleToClaim) => {
  try {
    const hasPlaysuperExpired = await checkPlaysuperExpiry(user.playsuper);

    const updates: any = {};

    if (isEligibleToClaim) {
      updates["bonus.fof.exploitCount"] = 0;
    }

    if (!user.partOfGames || !Array.isArray(user.partOfGames)) {
      updates["partOfGames"] = ["fof"];
    } else if (!user.partOfGames.includes("fof")) {
      updates["partOfGames"] = [...user.partOfGames, "fof"];
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const lastLoginDate = user.lastLoginAt
      ? new Date(user.lastLoginAt)
      : new Date(0);
    lastLoginDate.setHours(0, 0, 0, 0);

    if (lastLoginDate.getTime() !== now.getTime()) {
      // check is a consecutive day
      const differenceInDays =
        (now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24);
      const isConsecutiveDay = differenceInDays === 1;

      // update streak count
      if (isConsecutiveDay) {
        updates["bonus.fof.streak.count"] =
          (user.bonus?.fof?.streak?.count ?? 0) + 1;
      } else {
        updates["bonus.fof.streak.count"] = 1;
      }

      updates["lastLoginAt"] = new Date();
    }

    if (user.playsuper?.isVerified && hasPlaysuperExpired) {
      // updates["playsuper.isVerified"] = false;
      // updates["playsuper.key"] = null;
      // updates["playsuper.createdAt"] = null;
    }

    let updatedUser;
    if (Object.keys(updates).length > 0) {
      updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: updates },
        { new: true }
      );
    }

    return updatedUser ?? user;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update user data.");
  }
};

// if (memberData.totalOrbs >= 999999 && !user?.gameCompletedAt?.fof) {
//   updates.gameCompletedAt = {
//     fof: new Date(),
//   };
// }
