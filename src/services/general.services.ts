import userMythologies from "../models/mythologies.models";

export const getLeaderboardSnapshot = async () => {
  try {
    const pipeline = [
      {
        $unwind: "$mythologies",
      },
      {
        $group: {
          _id: "$userId",
          totalOrbs: { $sum: "$mythologies.orbs" },
          multiColorOrbs: { $first: "$multiColorOrbs" },
        },
      },
      {
        $addFields: {
          totalOrbs: { $add: ["$totalOrbs", "$multiColorOrbs"] },
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
