import userMythologies from "../models/mythologies.models";
import ranks from "../models/ranks.models";

export const ping = async (req, res) => {
  try {
    res.send("Server is runnnig fine.");
  } catch (error) {
    console.log(error);
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await ranks
      .find()
      .sort({ totalOrbs: -1 })
      .limit(100)
      .select("-__v -createdAt -updatedAt");

    res.status(200).json({
      leaderboard,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateRanks = async (req, res) => {
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
        $limit: 100,
      },
      {
        $project: {
          userId: "$_id",
          telegramUsername: "$userDetails.telegramUsername",
          profileImage: "$userDetails.profile.avatarUrl",
          totalOrbs: 1,
        },
      },
    ];

    const leaderboard = await userMythologies.aggregate(pipeline).exec();

    const bulkOps = leaderboard.map((user) => ({
      updateOne: {
        filter: { userId: user.userId },
        update: { $set: user },
        upsert: true,
      },
    }));
    await ranks.bulkWrite(bulkOps);
    console.log("Updated");

    // maintain stats
  } catch (error) {
    console.log(error);
  }
};
