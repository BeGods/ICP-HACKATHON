import mongoose from "mongoose";
import { calculateAutomataEarnings } from "../utils/game";
import userMythologies from "../models/mythologies.models";

export const fetchUserStats = async (userId) => {
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
                  { $project: { "claimedQuests.taskId": 1 } },
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
          ],
          as: "quests",
        },
      },
      {
        $project: {
          user: "$",
          stats: "$userMythologies",
          quests: "$quests",
        },
      },
    ];

    const userGameStats = await userMythologies.aggregate(pipeline);

    return userGameStats;
  } catch (error) {
    throw new Error("There was a problem fetching user data.");
  }
};
0;
export const validateBooster = (boosters) => {
  try {
    const timeLapsed = Date.now() - boosters.shardsLastClaimedAt;

    if (timeLapsed >= 86400000) {
      // 24 hours
      boosters.isShardsClaimActive = true;
    }
    if (timeLapsed >= 172800000 || boosters.shardslvl === 7) {
      // 48 hours or level 7
      boosters.isShardsClaimActive = true;
      boosters.shardslvl = 1;
      boosters.shardsLastClaimedAt = 0;
    }

    return boosters;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};

export const validateAutomata = (gameData) => {
  try {
    const timeLapsed = Date.now() - gameData.boosters.automataStartTime;

    gameData.shards += calculateAutomataEarnings(
      gameData.boosters.automataLastClaimedAt,
      gameData.boosters.automatalvl
    );

    gameData.boosters.automataLastClaimedAt = Date.now();

    if (timeLapsed >= 86400000) {
      // 24 hours
      gameData.boosters.isAutomataActive = false;
      gameData.boosters.automataStartTime = 0;
      gameData.boosters.automataLastClaimedAt = 0;
    }

    if (timeLapsed >= 172800000 || gameData.boosters.automatalvl === 7) {
      // 48 hours or level 7
      gameData.boosters.isAutomataActive = false;
      gameData.boosters.automatalvl = 1;
      gameData.boosters.automataStartTime = 0;
      gameData.boosters.automataLastClaimedAt = 0;
    }

    return gameData;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};
