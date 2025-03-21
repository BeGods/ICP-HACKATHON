import { gameItems } from "../../utils/constants/gameItems";
import userMythologies from "../../common/models/mythologies.models";
import mongoose from "mongoose";

export const fetchGameData = async (userId) => {
  try {
    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "usermythologies",
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
            {
              $project: {
                _id: 0,
                multiColorOrbs: 1,
                blackOrbs: 1,
                whiteOrbs: 1,
                whiteShards: 1,
                blackShards: 1,
                gobcoin: 1,
                mythologies: {
                  $map: {
                    input: "$mythologies",
                    as: "myth",
                    in: {
                      name: "$$myth.name",
                      orbs: "$$myth.orbs",
                      shards: "$$myth.shards",
                      faith: "$$myth.faith",
                    },
                  },
                },
              },
            },
          ],
          as: "userMythologies",
        },
      },
      {
        $lookup: {
          from: "milestones",
          localField: "userId",
          foreignField: "userId",
          as: "userMilestones",
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
            { $sort: { createdAt: -1 as -1 } },
            {
              $project: {
                milestones: 0,
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
          quests: {
            $filter: {
              input: "$allQuests",
              as: "quest",
              cond: {
                $and: [{ $eq: ["$$quest.mythology", "Other"] }],
              },
            },
          },
        },
      },
      {
        $project: {
          userMythologies: 1,
          userMilestones: 1,
          quests: 1,
        },
      },
    ];

    const userGameStats = await userMythologies.aggregate(pipeline);
    return userGameStats[0];
  } catch (error) {
    throw new Error("There was a problem fetching user data.");
  }
};
