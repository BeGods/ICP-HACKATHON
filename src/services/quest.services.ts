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
            userId: new mongoose.Types.ObjectId(userId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    {
                      $in: [
                        new mongoose.Types.ObjectId(questId),
                        "$claimedQuests.taskId",
                      ],
                    },
                  ],
                },
              },
            },
            {
              $addFields: {
                orbClaimed: {
                  $reduce: {
                    input: "$claimedQuests",
                    initialValue: false,
                    in: {
                      $cond: [
                        {
                          $and: [
                            {
                              $eq: [
                                "$$this.taskId",
                                new mongoose.Types.ObjectId(questId),
                              ],
                            },
                            "$$this.orbClaimed",
                          ],
                        },
                        true,
                        "$$value",
                      ],
                    },
                  },
                },
              },
            },
          ],
          as: "claimed",
        },
      },
      {
        $addFields: {
          isClaimed: { $gt: [{ $size: "$claimed" }, 0] },
        },
      },
      {
        $project: {
          taskId: "$_id",
          mythology: 1,
          requiredOrbs: 1,
          isClaimed: 1,
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
