import partners from "../models/partners.models";
import quest from "../models/quests.models";
import Stats from "../models/Stats.models";
import User from "../models/user.models";
import axios from "axios";
import { Request, Response } from "express";
import { IQuest, IStats } from "../../ts/models.interfaces";
import rewards from "../models/rewards.models";
import mongoose from "mongoose";
import { getDailyActiveUsers } from "../services/admin.services";
import { Referral } from "../models/referral.models";
import { RewardsTransactions } from "../models/transactions.models";

// get
// test server
export const ping = async (req: Request, res: Response): Promise<void> => {
  try {
    res.send("Server is runnnig fine.");
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getAdminUpdates = async (req, res) => {
  try {
    const stats = await Stats.find();
    const userCounts = stats.map((stat) => stat.totalUsers);
    const { dailyActive, weeklyActive, monthlyActive, dailyNewUsers } =
      await getDailyActiveUsers();

    const data = {
      totalUsers: userCounts[4],
      newUsers: dailyNewUsers,
      tgUsers: userCounts[1],
      dapp: userCounts[2],
      onewave: userCounts[3],
      fof: userCounts[0],
      ror: userCounts[5],
      dailyActive: dailyActive,
      weeklyActive: weeklyActive,
      monthlyActive: monthlyActive,
    };

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// update
export const updateDailyQuest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currentDate = new Date();
    const previousDate = new Date(currentDate);

    previousDate.setUTCDate(previousDate.getUTCDate() - 1);
    const previousDayStart = new Date(
      Date.UTC(
        previousDate.getUTCFullYear(),
        previousDate.getUTCMonth(),
        previousDate.getUTCDate()
      )
    );
    const previousDayEnd = new Date(
      Date.UTC(
        previousDate.getUTCFullYear(),
        previousDate.getUTCMonth(),
        previousDate.getUTCDate() + 1
      )
    );

    // inactive previous quests
    await quest.updateMany(
      {
        createdAt: {
          $gte: previousDayStart,
          $lt: previousDayEnd,
        },
      },
      { $set: { status: "Inactive" } }
    );

    // curr date in given date format
    const currentDayKey =
      currentDate.toISOString().slice(8, 10) +
      "-" +
      currentDate.toISOString().slice(5, 7) +
      "-" +
      currentDate.toISOString().slice(2, 4);

    const fetchedQuests = await axios.get(
      "https://begods.github.io/public-assets/quests.json"
    );
    const dailyQuests = fetchedQuests.data;

    // fetch quest of the day
    const questForToday = dailyQuests[currentDayKey];
    if (questForToday) {
      const questWithCreatedAt = new quest({
        ...questForToday,
        createdAt: new Date(),
      });

      await questWithCreatedAt.save();

      console.log("Daily quests updated.");
    } else {
      console.log("No quests available for today.");
      res.status(404).json({ message: "No quests available for today." });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update daily quest.",
      error: error.message,
    });
  }
};

// create
export const createPartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { data } = req.body;

    const newPartner = new partners(data);

    await newPartner.save();
    res.status(201).json({ message: "Partner added successfully." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create partner.",
      error: error.message,
    });
  }
};

// create
export const createReward = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { data } = req.body;

    const newReward = new rewards(data);

    await newReward.save();
    res.status(201).json({ message: "Reward added successfully." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create partner.",
      error: error.message,
    });
  }
};

export const verifyPayment = async (req, res): Promise<void> => {
  try {
    const { paymentDetails, paymentId, status } = req;

    if (status) {
      await paymentDetails.updateOne({
        $set: {
          status: "success",
          paymentId: paymentId,
        },
      });
    } else {
      // refund
      await User.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(paymentDetails.userId),
        },
        {
          $inc: {
            [`holdings.${paymentDetails?.currency?.toLowerCase()}`]:
              paymentDetails?.amount,
          },
        }
      );
    }

    res.status(201).json({ message: "Payment status updated successfully." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create partner.",
      error: error.message,
    });
  }
};

export const createQuest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { questData }: { questData: Partial<IQuest> } = req.body;

    if (!questData) {
      throw new Error("Invalid quest data.");
    }

    const newQuest = new quest(questData);
    const newQuestCreated = await newQuest.save();

    res.status(200).json({ data: newQuestCreated });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create quest.",
      error: error.message,
    });
  }
};

export const blacklistAndCleanupUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "userIds are required" });
    }

    // Step 1: Fetch all users
    const users = await User.find({ _id: { $in: userIds } }).lean();

    const joiningBonusUserIds = [];
    const usersToBlacklist = [];

    for (const user of users) {
      if (!user.isBlacklisted) {
        usersToBlacklist.push({
          updateOne: {
            filter: { _id: user._id },
            update: { $set: { isBlacklisted: true } },
          },
        });

        if (user.bonus?.fof?.joiningBonus === true) {
          joiningBonusUserIds.push(user._id.toString());
        }
      }
    }

    // Bulk update users to isBlacklisted = true
    if (usersToBlacklist.length > 0) {
      await User.bulkWrite(usersToBlacklist);
    }

    // Step 2: Find all reward transactions for these users
    const transactions = await RewardsTransactions.find({
      userId: { $in: userIds },
    }).lean();

    const rewardTransactionDeletionCount = {};
    const transactionIdsToDelete = [];

    for (const tx of transactions) {
      const rewardId = tx.rewardId;
      rewardTransactionDeletionCount[rewardId] =
        (rewardTransactionDeletionCount[rewardId] || 0) + 1;
      transactionIdsToDelete.push(tx._id);
    }

    if (transactionIdsToDelete.length > 0) {
      await RewardsTransactions.deleteMany({
        _id: { $in: transactionIdsToDelete },
      });
    }

    // Step 3: Bulk increment rewards limit
    const rewardUpdates = Object.entries(rewardTransactionDeletionCount).map(
      ([rewardId, count]) => ({
        updateOne: {
          filter: { _id: rewardId },
          update: { $inc: { limit: count } },
        },
      })
    );

    if (rewardUpdates.length > 0) {
      await rewards.bulkWrite(rewardUpdates);
    }

    // Step 4: Respond
    res.status(200).json({
      success: true,
      blacklistedCount: usersToBlacklist.length,
      joiningBonusUserIds,
      rewardTransactionDeletionCount,
    });
  } catch (error) {
    console.error("Error in blacklistAndCleanupUsers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getPlayedUserCount = async (req, res) => {
  try {
    const { userIds } = req.body;

    const users = await User.find({
      _id: { $in: userIds },
    }).select("_id telegramUsername bonus.fof.joiningBonus");

    let joiningBonusTrue = 0;
    let joiningBonusFalse = 0;

    users.forEach((user) => {
      if (user?.bonus?.fof?.joiningBonus) {
        joiningBonusTrue++;
      } else {
        joiningBonusFalse++;
      }
    });

    res.status(200).json({
      success: true,
      total: users.length,
      joiningBonusTrue,
      joiningBonusFalse,
      users,
    });
  } catch (error) {
    console.error("Error in getPlayedUserCount:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getUserIdsByReferral = async (req, res) => {
  try {
    const referralCodes = [
      "FDGLINZJ2TIC",
      "FDGLINXYKA3N",
      "FDGLINWRPX85",
      "FDGLINRTNTKA",
      "FDGLINRM4V61",
      "FDGLINP5RZPZ",
      "FDGLINOS6WY3",
      "FDGLINNFAM1W",
      "FDGLINMXSIPK",
      "FDGLINLPET7H",
      "FDGLINLOCFLX",
      "FDGLINLCJ543",
      "FDGLINKEZRVM",
      "FDGLINJK4JJ9",
      "FDGLINIJO64I",
      "FDGLINGELYMK",
      "FDGLINFA4AIP",
      "FDGLIN8G2JB9",
      "FDGLIN5N9C5U",
      "FDGLINNP9AP8",
      "FDGLINZFBSDO",
    ];

    const users = await User.find({
      referralCode: { $in: referralCodes },
    }).select("_id");

    const userIds = users.map((user) => user._id.toString());

    res.status(200).json({
      success: true,
      length: userIds.length,
      users: userIds,
    });
  } catch (error) {
    console.error("Error in getUserIdsByReferral:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getAllReferralsById = async (req, res) => {
  try {
    const userIds = [
      "684cd23ba3c5867db5a6cc2d",
      "684cd23ba3c5867db5a6cc3f",
      "684cd23ba3c5867db5a6cc51",
      "684cd23ba3c5867db5a6cc64",
      "684cd23ba3c5867db5a6cc70",
      "684cd23ba3c5867db5a6cc87",
      "684cd23ba3c5867db5a6cc96",
      "684cd23ba3c5867db5a6cca8",
      "684cd23ba3c5867db5a6ccaf",
      "684cd23ba3c5867db5a6ccc5",
      "684cd23ba3c5867db5a6ccdf",
      "684cd23ca3c5867db5a6cd07",
      "684cd23ca3c5867db5a6cd1b",
      "684cd23ca3c5867db5a6cd20",
      "684cd23ca3c5867db5a6cd3d",
      "684cd23da3c5867db5a6cd4f",
      "684cd27aa3c5867db5a6cd61",
      "684cd27ba3c5867db5a6cd73",
      "684cd27ba3c5867db5a6cd85",
      "684cd27ca3c5867db5a6cd97",
      "684cd27da3c5867db5a6cda9",
      "684cd27da3c5867db5a6cdbb",
      "684cd27ea3c5867db5a6cdcd",
      "684cd27fa3c5867db5a6cddf",
      "684cd27fa3c5867db5a6cdf1",
      "684cd280a3c5867db5a6ce03",
      "684cd281a3c5867db5a6ce15",
      "684cd282a3c5867db5a6ce27",
      "684cd282a3c5867db5a6ce39",
      "684cd283a3c5867db5a6ce4b",
      "684ce0afa3c5867db5a6f69b",
      "684ce0b2a3c5867db5a6f6ad",
      "684ce0b3a3c5867db5a6f6bf",
      "684ce0b3a3c5867db5a6f6d1",
      "684ce0b3a3c5867db5a6f6ee",
      "684ce0b3a3c5867db5a6f70d",
      "684ce0b3a3c5867db5a6f71e",
      "684ce0b3a3c5867db5a6f733",
      "684ce0f1a3c5867db5a6f767",
      "684ce170a3c5867db5a6f7c3",
      "684ce170a3c5867db5a6f7cd",
      "684ce170a3c5867db5a6f7d4",
      "684ce171a3c5867db5a6f7f4",
      "684ce17aa3c5867db5a6f813",
      "684ce17aa3c5867db5a6f825",
      "684ce1afa3c5867db5a6f8e3",
      "684ce1b3a3c5867db5a6f8f5",
      "684ce1b7a3c5867db5a6f907",
      "684ce1baa3c5867db5a6f919",
      "684ce1c2a3c5867db5a6f966",
      "684ce1c3a3c5867db5a6f99d",
      "684ce1c4a3c5867db5a6f9af",
      "684ce1c5a3c5867db5a6f9c1",
      "684ce223a3c5867db5a6fa2b",
      "684ce224a3c5867db5a6fa3d",
      "684ce226a3c5867db5a6fa4f",
      "684ce228a3c5867db5a6fa61",
      "684ce229a3c5867db5a6fa73",
      "684ce22ba3c5867db5a6fa85",
      "684ce22da3c5867db5a6fa97",
      "684ceca9a3c5867db5a71845",
      "684cecaaa3c5867db5a71857",
      "684cecaba3c5867db5a71869",
      "684cecaca3c5867db5a7187b",
      "684cecada3c5867db5a7188d",
      "684cecaea3c5867db5a7189f",
      "684cecafa3c5867db5a718b1",
      "684cecb1a3c5867db5a718c3",
      "684cecb1a3c5867db5a718d5",
      "684cecb2a3c5867db5a718e7",
      "684cece6a3c5867db5a7196b",
      "684cece6a3c5867db5a71980",
      "684cece7a3c5867db5a71995",
      "684cece7a3c5867db5a7199f",
      "684cece7a3c5867db5a719b7",
      "684cecf3a3c5867db5a719de",
      "684cecf3a3c5867db5a719f0",
      "684cecf4a3c5867db5a71a01",
      "684cecf7a3c5867db5a71a14",
      "684cecf7a3c5867db5a71a1d",
      "684ced22a3c5867db5a71a7e",
      "684ced23a3c5867db5a71a90",
      "684ced24a3c5867db5a71aa2",
      "684ced3ba3c5867db5a71ab4",
      "684ced3ca3c5867db5a71ac6",
      "684ced3da3c5867db5a71ad8",
      "684ced3ea3c5867db5a71ae9",
      "684ced3fa3c5867db5a71afc",
      "684ced40a3c5867db5a71b0e",
      "684ced41a3c5867db5a71b1f",
    ].map((id) => new mongoose.Types.ObjectId(id));

    const referrals = await Referral.find({ userId: { $in: userIds } }).select(
      "userId directInvites"
    );

    const flatIds = new Set<string>();

    referrals.forEach((ref) => {
      flatIds.add(ref.userId.toString());

      (ref.directInvites as mongoose.Types.ObjectId[]).forEach((inviteId) => {
        flatIds.add(inviteId.toString());
      });
    });

    const compassQuery = `_id: { $in: [\n  ${Array.from(flatIds)
      .map((id) => `ObjectId("${id}")`)
      .join(",\n  ")}\n] }`;

    res.status(200).send(compassQuery);
    // res.status(200).json({ data: Array.from(flatIds) });
    // res.status(200).json({ data: Array.from(referrals) });
  } catch (error) {
    console.error("Error in getAllReferralsById:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// export const getAllReferralsById = async (req, res) => {
//   try {
//     const userIds = [
//       "685525357120df9189f80333",
//       "685526c17120df9189f813ff",
//       "68552d237120df9189f87f52",
//       "6855261f7120df9189f80d6b",
//       "68552bd27120df9189f86ae5",
//       "6855295b7120df9189f83a19",
//       "68552b647120df9189f86470",
//       "6855305e7120df9189f8d43d",
//       "6855309e7120df9189f8ddea",
//       "68552a7e7120df9189f857c0",
//       "68552e3e7120df9189f890a7",
//       "68552f487120df9189f8a6eb",
//       "6855272b7120df9189f81969",
//       "685526fa7120df9189f816c4",
//       "68552c307120df9189f870a8",
//       "685528b07120df9189f8300c",
//       "68552c0a7120df9189f86deb",
//       "68552ac17120df9189f85ad6",
//       "685526937120df9189f8118a",
//       "6855257e7120df9189f80770",
//       "685525177120df9189f801f0",
//       "68552ff27120df9189f8c131",
//       "6855287d7120df9189f82b66",
//       "68552f7a7120df9189f8ae25",
//       "68552c9d7120df9189f874d0",
//       "685527947120df9189f81fac",
//       "68552af77120df9189f85d8d",
//       "68552cc37120df9189f87775",
//       "685529257120df9189f8376d",
//       "68552eac7120df9189f89793",
//       "685529d07120df9189f847a6",
//       "68552e037120df9189f88d68",
//       "685528e97120df9189f83445",
//       "68552d5a7120df9189f882d6",
//       "68552f117120df9189f8a057",
//       "68552b9c7120df9189f867ea",
//       "6855310c7120df9189f8f1c9",
//       "68552e767120df9189f89386",
//       "685524ab7120df9189f7fd20",
//       "68552ee57120df9189f89b3c",
//       "685530d17120df9189f8e785",
//       "685525707120df9189f80631",
//       "68552a077120df9189f84bdf",
//       "68552fb27120df9189f8b659",
//       "68552ceb7120df9189f87b9e",
//       "685527657120df9189f81c9b",
//       "68552dcc7120df9189f8893b",
//       "68552b307120df9189f8613f",
//       "68552a427120df9189f84fcb",
//       "68552c687120df9189f873cf",
//       "685529a07120df9189f8449b",
//       "685526697120df9189f80fae",
//       "685527c97120df9189f8259b",
//       "68552d947120df9189f885c6",
//       "6855246f7120df9189f7fac0",
//       "6855261a7120df9189f80cef",
//       "685530247120df9189f8c980",
//       "685524de7120df9189f7ff85",
//       "685526127120df9189f80c1b",
//       "685524397120df9189f7f85a",
//     ].map((id) => new mongoose.Types.ObjectId(id));

//     const referrals = await Referral.find({ userId: { $in: userIds } }).select(
//       "userId directInvites"
//     );

//     const flatIds = new Set<string>();

//     referrals.forEach((ref) => {
//       flatIds.add(ref.userId.toString());

//       (ref.directInvites as mongoose.Types.ObjectId[]).forEach((inviteId) => {
//         flatIds.add(inviteId.toString());
//       });
//     });

//     const compassQuery = `_id: { $in: [\n  ${Array.from(flatIds)
//       .map((id) => `ObjectId("${id}")`)
//       .join(",\n  ")}\n] }`;

//     res.status(200).send(compassQuery);
//   } catch (error) {
//     console.error("Error in getAllReferralsById:", error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// };

// db migrate and shift fields from User to usermyth

// export async function migrate() {
//   const usersWithGameSession = await User.find({
//     gameSession: { $exists: true },
//   }).lean();

//   const bulkUserUpdates = [];
//   const bulkMythUpdates = [];

//   for (const user of usersWithGameSession) {
//     const userId = user._id;
//     const gameSession = user.gameSession;

//     if (!gameSession) continue;

//     const userMyths = await userMythologies.findOne({ userId });

//     if (!userMyths) {
//       continue;
//     }

//     const newRorStats = {
//       ...userMyths.rorStats,
//       ...gameSession,
//     };

//     bulkMythUpdates.push({
//       updateOne: {
//         filter: { userId },
//         update: { $set: { rorStats: newRorStats } },
//       },
//     });

//     bulkUserUpdates.push({
//       updateOne: {
//         filter: { _id: userId },
//         update: {
//           $unset: {
//             gameSession: "",
//             announcements: "",
//             playsuper: "",
//           },
//         },
//       },
//     });
//   }

//   // Run bulk writes
//   if (bulkMythUpdates.length > 0) {
//     await userMythologies.bulkWrite(bulkMythUpdates);
//     console.log(`✅ Updated rorStats for ${bulkMythUpdates.length} users`);
//   }

//   if (bulkUserUpdates.length > 0) {
//     await User.bulkWrite(bulkUserUpdates);
//     console.log(
//       `🧹 Cleaned fields in User model for ${bulkUserUpdates.length} users`
//     );
//   }

//   console.log("🎉 Migration complete.");
// }

// db migrations
// export const migrateDb = async (req: Request, res: Response): Promise<void> => {
//   try {
//     await User.updateMany({}, [
//       {
//         $set: {
//           bonus: {
//             fof: {
//               exploitCount: "$exploitCount",
//               joiningBonus: "$joiningBonus",
//               streakBonus: {
//                 isActive: false,
//                 claimedAt: 0,
//                 streakCount: 0,
//               },
//               dailyBonusClaimedAt: "$dailyBonusClaimedAt",
//             },
//           },
//         },
//       },
//       {
//         $unset: [
//           "exploitCount",
//           "joiningBonus",
//           "streakBonus",
//           "dailyBonusClaimedAt",
//         ],
//       },
//     ]);

//     res.status(200).json({ data: "done" });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };

// export const updateFileCode = async () => {
//   try {
//     const bulkOperations = updates.map(({ _id, fileId }) => {
//       return {
//         updateOne: {
//           filter: { _id },
//           update: { "profile.avatarUrl": fileId },
//         },
//       };
//     });

//     const result = await User.bulkWrite(bulkOperations);

//     console.log("Bulk update result:", result);
//   } catch (error) {
//     console.log();
//   }
// };
