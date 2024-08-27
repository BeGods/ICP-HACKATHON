import User from "../models/user.models";
import ranks from "../models/ranks.models";
import {
  claimBonusBooster,
  claimBonusOrb,
  claimBonusQuest,
  getLeaderboardSnapshot,
  getRandomValue,
} from "../services/general.services";
import Stats from "../models/Stats.models";
import { Team } from "../models/referral.models";
import mongoose from "mongoose";
import milestones from "../models/milestones.models";

export const ping = async (req, res) => {
  try {
    res.send("Server is runnnig fine.");
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getLeaderboard = async (req, res) => {
  const user = req.user;

  try {
    const overallLeaderboard = await ranks
      .find()
      .sort({ totalOrbs: -1 })
      .limit(100)
      .select("-__v -createdAt -updatedAt");

    const squadOwner = user?.squadOwner ? user?.squadOwner : user._id;

    const squadLeaderboard = await ranks
      .find({ squadOwner: squadOwner })
      .sort({ totalOrbs: -1 })
      .limit(100)
      .select("-__v -createdAt -updatedAt");

    res.status(200).json({
      leaderboard: overallLeaderboard,
      squad: squadLeaderboard.sort((a, b) => a.squadRank - b.squadRank),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateRanks = async (req, res) => {
  try {
    const leaderboard = await getLeaderboardSnapshot();

    // calculate squad totalsorbs
    const squadPipeline = [
      {
        $group: {
          _id: "$squadOwner",
          totalOrbs: { $sum: "$totalOrbs" },
        },
      },
      {
        $sort: { totalOrbs: -1 as -1 },
      },
    ];

    const squadOrbs = await ranks
      .aggregate(squadPipeline)
      .allowDiskUse(true)
      .exec();

    // Map to get squad ranks
    // const squadRankMap = new Map();
    // squadOrbs.forEach((squad, index) => {
    //   if (squad._id) {
    //     // Ensure the _id (parentReferrerId) is not null
    //     squadRankMap.set(squad._id.toString(), index + 1);
    //   }
    // });

    // Calculate overall rank based on totalOrbs
    const sortedUsers = leaderboard
      .map((user, index) => ({ ...user, overallRank: index + 1 }))
      .sort((a, b) => b.totalOrbs - a.totalOrbs);

    const usersBySquad = {};

    sortedUsers.forEach((user) => {
      if (user.squadOwner) {
        const parentId = user.squadOwner.toString();
        if (!usersBySquad[parentId]) {
          usersBySquad[parentId] = [];
        }
        usersBySquad[parentId].push(user);
      }
    });

    // Calculate ranks within each squad
    Object.keys(usersBySquad).forEach((squadId) => {
      const squadUsers = usersBySquad[squadId];
      squadUsers.sort((a, b) => b.totalOrbs - a.totalOrbs);
      squadUsers.forEach((user, index) => {
        user.squadRank = index + 1;
      });
    });

    // Prepare bulk operations for updating ranks
    const bulkOps = sortedUsers.map((user) => {
      let squadRank = 0;
      if (user.squadOwner) {
        const parentId = user.squadOwner.toString();
        squadRank = usersBySquad[parentId]
          ? usersBySquad[parentId].find(
              (u) => u.userId.toString() === user.userId.toString()
            ).squadRank
          : 1;
      }

      return {
        updateOne: {
          filter: { userId: user.userId },
          update: {
            $set: {
              userId: user.userId,
              telegramUsername: user.telegramUsername,
              profileImage: user.profileImage,
              totalOrbs: user.totalOrbs,
              squadOwner: user.squadOwner,
              overallRank: user.overallRank,
              squadRank: squadRank,
            },
          },
          upsert: true,
        },
      };
    });

    await ranks.bulkWrite(bulkOps);

    // Prepare bulk operations for teams
    const teamBulkOps = squadOrbs.map((squad) => ({
      updateOne: {
        filter: { owner: squad._id },
        update: {
          $set: { totalOrbs: squad.totalOrbs },
        },
        upsert: true,
      },
    }));

    await Team.bulkWrite(teamBulkOps);

    const totalUsers = await User.countDocuments({});
    await Stats.findOneAndUpdate(
      { statId: "fof" },
      { $set: { totalUsers: totalUsers } },
      { upsert: true }
    );
    console.log("Leaderboard updated");
  } catch (error) {
    console.error("Error during updateRanks:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const userId = req.user;
    const { updatedValue } = req.body;

    await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { announcements: updatedValue } }
    );

    res.status(200).json({ message: "Announcements updated successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const generateRandomBonus = async (req, res) => {
  try {
    // testRandomValues();
    const result = getRandomValue();
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimDailyBonus = async (req, res) => {
  try {
    const user = req.user;

    const result = getRandomValue();
    const currTimeInUTC = new Date();
    let bonusReward;

    await User.findOneAndUpdate(
      { _id: user._id },
      { dailyBonusClaimedAt: currTimeInUTC }
    );

    if (result === "blackOrb") {
      bonusReward = await claimBonusOrb(result, user._id);
    } else if (result === "mythOrb") {
      bonusReward = await claimBonusOrb(result, user._id);
    } else if (result === "booster") {
      bonusReward = await claimBonusBooster(user._id);
    } else if (result === "quest") {
      bonusReward = await claimBonusQuest(user._id);
    }

    res.status(200).json({ reward: bonusReward });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// export const checkBonus = async (req, res) => {
//   try {
//     const user = req.user;
//     const dailyBonusClaimed = user.dailyBonusClaimedAt;
//     const nowUtc = new Date();

//     const startOfTodayUtc = new Date(
//       Date.UTC(
//         nowUtc.getUTCFullYear(),
//         nowUtc.getUTCMonth(),
//         nowUtc.getUTCDate(),
//         0,
//         0,
//         0
//       )
//     );

//     const endOfTodayUtc = new Date(
//       Date.UTC(
//         nowUtc.getUTCFullYear(),
//         nowUtc.getUTCMonth(),
//         nowUtc.getUTCDate(),
//         23,
//         59,
//         59
//       )
//     );
//     const validClaim =
//       dailyBonusClaimed >= startOfTodayUtc &&
//       dailyBonusClaimed <= endOfTodayUtc;

//     if (validClaim) {
//       res.status(201).json({ isEligibleToClaim: false });
//     } else {
//       res.status(200).json({ isEligibleToClaim: true });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };

export const test = async (req, res) => {
  try {
    const user = req.user;

    const pipeline = [
      {
        $lookup: {
          from: "quests",
          pipeline: [
            {
              $lookup: {
                from: "milestones",
                let: {
                  questId: "$_id",
                  userId: new mongoose.Types.ObjectId(user._id),
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ["$userId", "$$userId"] }],
                      },
                    },
                  },
                  {
                    $project: {
                      claimedQuest: {
                        $filter: {
                          input: "$claimedQuests",
                          as: "cq",
                          cond: { $eq: ["$$cq.taskId", "$$questId"] },
                        },
                      },
                    },
                  },
                ],
                as: "milestoneData",
              },
            },
            {
              $addFields: {
                isCompleted: {
                  $cond: {
                    if: { $gt: [{ $size: "$milestoneData.claimedQuest" }, 0] },
                    then: true,
                    else: false,
                  },
                },
                isQuestClaimed: {
                  $cond: {
                    if: {
                      $and: [
                        { $gt: [{ $size: "$milestoneData.claimedQuest" }, 0] },
                        {
                          $arrayElemAt: [
                            "$milestoneData.claimedQuest.questClaimed",
                            0,
                          ],
                        },
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
            },
            {
              $sort: { createdAt: -1 as -1 },
            },
            {
              $project: {
                milestoneData: 0,
                updatedAt: 0,
                createdAt: 0,
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
                $and: [
                  { $eq: ["$$quest.status", "Active"] },
                  {
                    $eq: [{ $ifNull: ["$$quest.secret", null] }, null],
                  },
                  { $eq: ["$$quest.isQuestClaimed", false] },
                ],
              },
            },
          },
        },
      },
      { $project: { allQuests: 0 } },
    ];

    const data = await milestones.aggregate(pipeline).exec();

    res.status(200).json({ data: data[0].quests });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const getUsers = async (req, res) => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getLeaderboard = async (req, res) => {
//   try {
//     const leaderboard = await ranks
//       .find()
//       .sort({ totalOrbs: -1 })
//       .limit(100)
//       .select("-__v -createdAt -updatedAt");

//     res.status(200).json({
//       leaderboard,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };
