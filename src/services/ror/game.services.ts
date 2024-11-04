import userMythologies from "../../models/mythologies.models";
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
                isVaultActive: 1,
                coins: 1,
                multiColorOrbs: 1,
                blackOrbs: 1,
                whiteOrbs: 1,
                angelCoin: 1,
                demonCoin: 1,
                mythologies: {
                  $map: {
                    input: "$mythologies",
                    as: "myth",
                    in: {
                      name: "$$myth.name",
                      orbs: "$$myth.orbs",
                      shards: "$$myth.shards",
                      faith: "$$myth.faith",
                      coin: "$$myth.coin",
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
        $project: {
          userMythologies: 1,
          userMilestones: 1,
          _id: 0,
        },
      },
    ];

    const userGameStats = await userMythologies.aggregate(pipeline);
    return userGameStats[0];
  } catch (error) {
    throw new Error("There was a problem fetching user data.");
  }
};
