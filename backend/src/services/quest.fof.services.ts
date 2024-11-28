import mongoose from "mongoose";
import quest from "../models/quests.models";

export const questAggregator = async (userId, questId) => {
  try {
    const pipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(questId) },
      },
      {
        $lookup: {
          from: "milestones",
          let: {
            questId: new mongoose.Types.ObjectId(questId),
            userId: userId,
          },
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
                questDetails: {
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
                isClaimed: { $gt: [{ $size: "$questDetails" }, 0] },
                orbClaimed: {
                  $cond: [
                    { $gt: [{ $size: "$questDetails" }, 0] },
                    { $arrayElemAt: ["$questDetails.orbClaimed", 0] },
                    false,
                  ],
                },
              },
            },
          ],
          as: "claimed",
        },
      },
      {
        $project: {
          taskId: "$_id",
          mythology: 1,
          requiredOrbs: 1,
          isClaimed: { $arrayElemAt: ["$claimed.isClaimed", 0] },
          orbClaimed: { $arrayElemAt: ["$claimed.orbClaimed", 0] },
          _id: 0,
        },
      },
    ];

    const [validQuest] = await quest.aggregate(pipeline);

    return validQuest;
  } catch (error) {
    throw Error(error);
  }
};

export const unClaimedQuests = async (userId) => {
  try {
    const pipeline = [
      {
        $match: {
          status: "Inactive",
        },
      },
      {
        $lookup: {
          from: "milestones",
          let: { questId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                    { $not: { $in: ["$$questId", "$claimedQuests.taskId"] } },
                  ],
                },
              },
            },
          ],
          as: "userMilestones",
        },
      },
      {
        $match: {
          userMilestones: { $size: 0 },
        },
      },
      {
        $sort: { createdAt: -1 as -1 },
      },
      {
        $project: {
          questName: 1,
          description: 1,
          type: 1,
          link: 1,
          mythology: 1,
          status: 1,
          requiredOrbs: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
        },
      },
    ];

    const lostQuests = await quest.aggregate(pipeline).exec();

    return lostQuests;
  } catch (error) {
    throw new Error("There was a problem fetching lost quests.");
  }
};
