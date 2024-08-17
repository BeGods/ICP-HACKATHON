import userMythologies from "../models/mythologies.models";

export const getLeaderboardSnapshot = async () => {
  try {
    const pipeline = [
      {
        $unwind: {
          path: "$mythologies",
          preserveNullAndEmptyArrays: true, // This ensures that if a user has no mythologies, they still get included in the aggregation
        },
      },
      {
        $group: {
          _id: "$userId",
          totalOrbs: {
            $sum: {
              $ifNull: ["$mythologies.orbs", 0],
            },
          },
          multiColorOrbs: {
            $first: {
              $ifNull: ["$multiColorOrbs", 0],
            },
          },
          blackOrbs: {
            $first: {
              $ifNull: ["$blackOrbs", 0],
            },
          },
          whiteOrbs: {
            $first: {
              $ifNull: ["$whiteOrbs", 0],
            },
          },
        },
      },
      {
        $addFields: {
          totalOrbs: {
            $add: ["$totalOrbs", "$multiColorOrbs", "$blackOrbs", "$whiteOrbs"],
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
          profileImage: "$userDetails.profile.avatarUrl",
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
