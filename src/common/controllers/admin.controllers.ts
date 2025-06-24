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
import {
  PaymentLogs,
  RewardsTransactions,
} from "../models/transactions.models";
import milestones from "../models/milestones.models";

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

export const getPendingWithdrawals = async (req, res) => {
  try {
    const pendingTrx = await PaymentLogs.find({
      reward: "withdraw",
      transferType: "send",
      status: "pending",
    }).select("userId amount currency");

    const userIds = pendingTrx.map((itm) => itm.userId);

    const users = await User.find({
      _id: { $in: userIds },
    }).select("_id telegramUsername kaiaAddress");

    const rewards = await milestones
      .find({
        userId: { $in: userIds },
      })
      .select("userId rewards");

    const userMap = new Map();
    users.forEach((user) => {
      userMap.set(user._id.toString(), user);
    });

    const rewardMap = new Map();
    rewards.forEach((rewardEntry) => {
      rewardMap.set(rewardEntry.userId.toString(), rewardEntry);
    });

    const rewardValues = [
      { id: "6854f8053caa936e11321a6f", amount: 1 },
      { id: "685111495e5f4cc871608299", amount: 0.3 },
      { id: "684deac96a2ad7c99d758973", amount: 0.3 },
      { id: "68586fc397c39c48458214a7", amount: 2 },
    ];

    // Convert rewardValues to a Map for fast lookup
    const rewardValueMap = new Map(rewardValues.map((r) => [r.id, r.amount]));

    const mergedData = pendingTrx.map((trx) => {
      const user = userMap.get(trx.userId.toString());
      const rewardEntry = rewardMap.get(trx.userId.toString());

      let totalClaimedRewardValue = 0;

      if (
        rewardEntry?.rewards?.monetaryRewards &&
        Array.isArray(rewardEntry.rewards.monetaryRewards)
      ) {
        for (const itm of rewardEntry.rewards.monetaryRewards) {
          const rewardId = itm.rewardId;
          const value = rewardValueMap.get(rewardId?.toString());
          if (value) totalClaimedRewardValue += value;
        }
      }

      const isRewardClaimed =
        Math.abs(totalClaimedRewardValue - trx.amount) < 0.0001;

      const userData = user ? user.toObject() : null;

      return {
        ...trx.toObject(),
        username: userData.telegramUsername,
        kaiaAddress: userData.kaiaAddress,
        isRewardClaimed,
        totalClaimedRewardValue,
      };
    });

    res.status(200).json({
      count: mergedData.length,
      data: mergedData.filter((itm) => itm.isRewardClaimed === false),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// blacklist
export const updateBlacklistStatus = async (req, res) => {
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

    const deleteResult = await PaymentLogs.deleteMany({
      userId: { $in: userIds },
    });

    // Step 4: Respond
    res.status(200).json({
      success: true,
      blacklistedCount: usersToBlacklist.length,
      joiningBonusUserIds,
      rewardTransactionDeletionCount,
      paymentLogsDeleted: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Error in blacklistAndCleanupUsers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBlacklistedRwrds = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "userIds are required" });
    }

    const ids = userIds.map((id) => new mongoose.Types.ObjectId(id));

    // Fetch reward transactions for these users
    const transactions = await RewardsTransactions.find({
      userId: { $in: ids },
    }).lean();

    // Group by rewardId
    const groupedByRewardId = {};

    for (const tx of transactions) {
      const rewardId = tx.rewardId?.toString();
      if (!rewardId) continue;

      if (!groupedByRewardId[rewardId]) {
        groupedByRewardId[rewardId] = [];
      }
      groupedByRewardId[rewardId].push(tx);
    }

    res.status(200).json({
      success: true,
      totalTransactions: transactions.length,
      rewardIds: Object.keys(groupedByRewardId),
      data: groupedByRewardId,
    });
  } catch (error) {
    console.error("Error in getBlacklistedUserRewardCollected:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getUserIdsByRefer = async (req, res) => {
  try {
    const { referralCodes } = req.body;

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

export const getReferTreeOfUsers = async (req, res) => {
  try {
    const userIds = [
      "6858d020755d12dc36187522",
      "6858d00c755d12dc3618701a",
      "6858cff6755d12dc361869d8",
      "6858d018755d12dc3618732f",
      "6858d022755d12dc361875fe",
      "6858d004755d12dc36186e1c",
      "6858d018755d12dc36187347",
      "6858d00e755d12dc361870be",
      "6858d00b755d12dc36186fbc",
      "6858d011755d12dc3618714f",
      "6858d022755d12dc361875ec",
      "6858cff7755d12dc36186a02",
      "6858d026755d12dc3618772c",
      "6858cffe755d12dc36186c55",
      "6858d033755d12dc36187a3e",
      "6858d00a755d12dc36186f84",
      "6858d01e755d12dc36187493",
      "6858d008755d12dc36186f31",
      "6858d015755d12dc361872b7",
      "6858d029755d12dc361877f0",
      "6858d024755d12dc36187681",
      "6858d013755d12dc36187208",
      "6858cfff755d12dc36186c99",
      "6858cfff755d12dc36186cd3",
      "6858d007755d12dc36186ec7",
      "6858d029755d12dc361877d0",
      "6858d01b755d12dc361873ff",
      "6858cff8755d12dc36186a3a",
      "6858d027755d12dc3618777b",
      "6858d02e755d12dc36187966",
      "6858d021755d12dc361875dd",
      "6858d020755d12dc3618756e",
      "6858d01d755d12dc3618745a",
      "6858d00d755d12dc3618705e",
      "6858cffd755d12dc36186c0c",
      "6858cff5755d12dc361869b8",
      "6858d006755d12dc36186ea0",
      "6858d002755d12dc36186d64",
      "6858d003755d12dc36186da5",
      "6858d013755d12dc36187214",
      "6858d016755d12dc361872c4",
      "6858cf93755d12dc361867fa",
      "6858d02f755d12dc36187984",
      "6858d02c755d12dc361878d9",
      "6858d011755d12dc36187166",
      "6858d015755d12dc361872a8",
      "6858d015755d12dc36187295",
      "6858d02e755d12dc3618793c",
      "6858d00b755d12dc36186fd0",
      "6858cff9755d12dc36186a9f",
      "6858cffb755d12dc36186b31",
      "6858d019755d12dc36187371",
      "6858d025755d12dc36187706",
      "6858d002755d12dc36186d9e",
      "6858d02a755d12dc36187810",
      "6858d005755d12dc36186e5d",
      "6858cffa755d12dc36186aee",
      "6858d01c755d12dc36187439",
      "6858d02e755d12dc3618795c",
      "6858d023755d12dc36187648",
      "6858d021755d12dc361875a2",
      "6858d030755d12dc361879e6",
      "6858d021755d12dc361875a8",
      "6858d027755d12dc3618776d",
      "6858d00e755d12dc36187086",
      "6858d001755d12dc36186d2d",
      "6858cffe755d12dc36186c7c",
      "6858cff4755d12dc361869a8",
      "6858d01b755d12dc361873ce",
      "6858d007755d12dc36186ee0",
      "6858d00b755d12dc36186fe4",
      "6858cffa755d12dc36186b10",
      "6858d003755d12dc36186db0",
      "6858cffe755d12dc36186c5a",
      "6858d010755d12dc3618712e",
      "6858d002755d12dc36186d86",
      "6858cffc755d12dc36186bd0",
      "6858d028755d12dc3618778d",
      "6858d01c755d12dc36187445",
      "6858d011755d12dc3618717a",
      "6858d017755d12dc361872fd",
      "6858d00f755d12dc361870e3",
      "6858d021755d12dc361875d3",
      "6858cffc755d12dc36186bc2",
      "6858d02b755d12dc3618787c",
      "6858cffc755d12dc36186bdc",
      "6858d004755d12dc36186e2a",
      "6858d02a755d12dc3618782b",
      "6858d008755d12dc36186f0a",
      "6858cffe755d12dc36186c4a",
      "6858d011755d12dc36187145",
      "6858cff7755d12dc36186a30",
      "6858d024755d12dc3618766b",
      "6858d00e755d12dc36187092",
      "6858d016755d12dc361872d5",
      "6858d00a755d12dc36186f62",
      "6858d002755d12dc36186d6d",
      "6858d025755d12dc361876f5",
      "6858d013755d12dc361871f2",
      "6858d00b755d12dc36186fef",
      "6858d02a755d12dc36187835",
      "6858cff9755d12dc36186aac",
      "6858cffb755d12dc36186b3e",
      "6858d01d755d12dc3618747b",
      "6858d01c755d12dc36187429",
      "6858d01e755d12dc36187499",
      "6858d02c755d12dc361878f2",
      "6858cff9755d12dc36186ab9",
      "6858d025755d12dc361876b7",
      "6858cff5755d12dc361869c4",
      "6858d015755d12dc36187298",
      "6858d00d755d12dc3618703c",
      "6858cff9755d12dc36186a8d",
      "6858d007755d12dc36186ed6",
      "6858cffb755d12dc36186ba2",
      "6858d011755d12dc36187170",
      "6858d001755d12dc36186d29",
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

    // res.status(200).send(compassQuery);
    res
      .status(200)
      .json({ count: Array.from(flatIds).length, data: Array.from(flatIds) });
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
