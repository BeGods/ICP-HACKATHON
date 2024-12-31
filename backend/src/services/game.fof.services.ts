import mongoose from "mongoose";
import {
  calculateAutomataEarnings,
  calculateEnergy,
  getPhaseByDate,
} from "../utils/helpers/game.helpers";
import userMythologies from "../models/mythologies.models";

export const fetchUserGameStats = async (userId) => {
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
    const userGameStats = await userMythologies.aggregate(pipeline);

    return userGameStats;
  } catch (error) {
    throw new Error("There was a problem fetching user data.");
  }
};

export const validateBooster = (boosters) => {
  try {
    const timeLapsed = Date.now() - boosters.shardsLastClaimedAt;

    if (timeLapsed >= 86400000) {
      // 24 hours
      boosters.isShardsClaimActive = true;
      boosters.shardsLastClaimedAt = 0;
    }
    if (boosters.shardslvl === 99) {
      // level 7
      boosters.shardslvl = 99;
    }

    return boosters;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};

export const validateAutomata = (gameData) => {
  try {
    const timeLapsed = Date.now() - gameData.boosters.automataStartTime;

    if (timeLapsed >= 86400000) {
      // 24 hours
      gameData.boosters.isAutomataActive = false;
      gameData.boosters.automataLastClaimedAt = 0;
      gameData.boosters.automataStartTime = 0;
    }

    if (gameData.boosters.automatalvl === 98) {
      // 48 hours or level 7
      gameData.boosters.automatalvl = 98;
    }

    if (gameData.boosters.isAutomataActive) {
      gameData.shards += calculateAutomataEarnings(
        gameData.boosters.automataLastClaimedAt,
        gameData.boosters.automatalvl
      );

      gameData.boosters.automataLastClaimedAt = Date.now();
    }

    return gameData;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};

export const validateBurst = (gameData) => {
  try {
    const timeLapsed = Date.now() - gameData.boosters.burstActiveAt;

    if (timeLapsed >= 86400000) {
      // 24 hours
      gameData.boosters.isBurstActiveToClaim = true;
      gameData.boosters.isBurstActive = false;
      gameData.boosters.burstActiveAt = 0;
    }

    if (gameData.boosters.burstlvl === 99) {
      // 48 hours or level 7
      gameData.boosters.burstlvl = 99;
    }

    return gameData;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};

export const disableActiveBurst = (mythology) => {
  try {
    const timeLapsed = Date.now() - mythology.burstActiveAt;

    const twelveHours = 12 * 60 * 60 * 1000;

    if (timeLapsed > twelveHours) {
      mythology.isBurstActive = false;
      mythology.burstActiveAt = false;
    }

    return mythology;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};

export const updateMythologies = (mythologies) => {
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
      mythology = validateAutomata(mythology);
      mythology.boosters = validateRatValues(mythology.boosters);

      if (
        !mythology.boosters.isBurstActiveToClaim &&
        mythology.boosters.burstActiveAt != 0
      ) {
        mythology = validateBurst(mythology);
      }

      // validate burst timeout
      // if (mythology.isBurstActive && mythology.burstActiveAt != 0) {
      //   mythology = disableActiveBurst(mythology);
      // }
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

export const fetchUserData = async (userId) => {
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
  lastLoginAt: number,
  streakLastClaimedAt: number
) => {
  try {
    if (!lastLoginAt || lastLoginAt === 0) {
      return false;
    }

    const now = new Date();
    const lastLoginDate = new Date(lastLoginAt);
    const lastClaimedDate = new Date(streakLastClaimedAt);

    now.setHours(0, 0, 0, 0);
    lastLoginDate.setHours(0, 0, 0, 0);
    lastClaimedDate.setHours(0, 0, 0, 0);

    // already claimed
    if (lastClaimedDate.getTime() === now.getTime()) {
      return false;
    }

    const differenceInDays =
      (now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24);

    if (differenceInDays === 1) {
      return true;
    }

    // Not a consecutive day
    return false;
  } catch (error) {
    console.error("Error checking streak activity:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
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
