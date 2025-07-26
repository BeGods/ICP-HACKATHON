import partners from "../models/partners.models";
import quest from "../models/quests.models";
import Stats from "../models/Stats.models";
import User from "../models/user.models";
import axios from "axios";
import { Request, Response } from "express";
import { IQuest, IStats } from "../../ts/models.interfaces";
import rewards from "../models/rewards.models";
import mongoose from "mongoose";
import { fetchAdminStats } from "../services/admin.services";
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
    const {
      dailyActive,
      weeklyActive,
      monthlyActive,
      dailyNewUsers,
      hourlyActive,
      hourlyNewUsers,
    } = await fetchAdminStats();

    const data = {
      totalUsers: userCounts[4],
      newUsers: dailyNewUsers,
      hourlyNewUsers: hourlyNewUsers,
      tgUsers: userCounts[1],
      line: userCounts[2],
      dapp: userCounts[6],
      onewave: userCounts[3],
      fof: userCounts[0],
      ror: userCounts[5],
      dailyActive: dailyActive,
      weeklyActive: weeklyActive,
      monthlyActive: monthlyActive,
      hourlyActive: hourlyActive,
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
      currency: "USDT",
    }).select("userId amount currency");

    const userIds = pendingTrx.map((itm) => itm.userId);

    const [users, rewards, paidTrxs, referrals] = await Promise.all([
      User.find({ _id: { $in: userIds } }).select(
        "_id telegramUsername kaiaAddress bonus isBlacklisted directReferralCount lineId"
      ),
      milestones.find({ userId: { $in: userIds } }).select("userId rewards"),
      PaymentLogs.aggregate([
        {
          $match: {
            userId: { $in: userIds },
            status: "success",
            transferType: "send",
            reward: "withdraw",
          },
        },
        {
          $group: {
            _id: "$userId",
            totalPaid: { $sum: "$amount" },
          },
        },
      ]),
      Referral.find({ userId: { $in: userIds } }).select(
        "userId directInvites"
      ),
    ]);

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    const rewardMap = new Map(rewards.map((r) => [r.userId.toString(), r]));
    const paidMap = new Map(
      paidTrxs.map((p) => [p._id.toString(), p.totalPaid])
    );
    const referralMap = new Map(
      referrals.map((r) => [r.userId.toString(), r.directInvites])
    );

    const allReferralIds = referrals.flatMap((r) => r.directInvites || []);
    const referredUsers = await User.find({
      _id: { $in: allReferralIds },
    }).select("_id bonus");

    const referredUserMap = new Map(
      referredUsers.map((u) => [u._id.toString(), u])
    );

    const rewardValues = [
      { id: "6854f8053caa936e11321a6f", amount: 1 },
      { id: "685111495e5f4cc871608299", amount: 0.3 },
      { id: "684deac96a2ad7c99d758973", amount: 0.3 },
      { id: "68586fc397c39c48458214a7", amount: 2 },
    ];

    const rewardValueMap = new Map(rewardValues.map((r) => [r.id, r.amount]));

    const mergedData = pendingTrx.map((trx) => {
      const userId = trx.userId.toString();
      const user = userMap.get(userId);
      const rewardEntry = rewardMap.get(userId);
      const alreadyPaid = paidMap.get(userId) || 0;

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

      const netRewardAvailable = totalClaimedRewardValue - alreadyPaid;
      const isRewardClaimed =
        Math.abs(netRewardAvailable - trx.amount) < 0.0001;

      const bonus = user?.bonus?.fof;
      const isJoinClaimed = !!bonus?.joiningBonus;
      const isDailyClaimed =
        bonus?.dailyBonusClaimedAt &&
        new Date(bonus.dailyBonusClaimedAt).getFullYear() === 2025;

      // ➕ Referral join/daily bonus count
      const directInvites = referralMap.get(userId) || [];
      let referredJoinBonus = 0;
      let referredDailyBonus = 0;

      for (const inviteId of directInvites) {
        const referred = referredUserMap.get(inviteId.toString());
        const referredBonus = referred?.bonus?.fof;

        if (referredBonus?.joiningBonus) referredJoinBonus++;
        if (
          referredBonus?.dailyBonusClaimedAt &&
          new Date(referredBonus.dailyBonusClaimedAt).getFullYear() === 2025
        )
          referredDailyBonus++;
      }

      return {
        ...trx.toObject(),
        username: user?.telegramUsername,
        kaiaAddress: user?.kaiaAddress,
        refers: user?.directReferralCount,
        totalClaimedRewardValue,
        alreadyPaid,
        netRewardAvailable,
        isRewardClaimed,
        isJoinClaimed,
        isDailyClaimed,
        isBlacklisted: user?.isBlacklisted ?? false,
        referredJoinBonus,
        referredDailyBonus,
        lineId: user?.lineId,
      };
    });

    const claimed = mergedData.filter(
      (itm) =>
        itm.isRewardClaimed &&
        !itm.isBlacklisted &&
        itm.referredJoinBonus > 0 &&
        itm.kaiaAddress &&
        !itm.username?.includes("AVATAR") &&
        !itm.username?.startsWith("dp") &&
        itm.lineId
    );

    res.status(200).json({
      count: claimed.length,
      data: claimed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getAdminPayments = async (req, res) => {
  try {
    const {
      isRewardClaimed,
      isBlacklisted,
      minReferredJoinBonus,
      minReferredDailyBonus,
      usernameIncludes,
      hasLineId,
      hasTelegramUsername,
      status = "pending",
      currency,
    } = req.query;

    const currencyFilter = currency ? { currency } : {};
    const statusFilter = status
      ? { status }
      : { status: { $in: ["pending", "success"] } };

    const pendingTrx = await PaymentLogs.find({
      reward: "withdraw",
      transferType: "send",
      ...statusFilter,
      ...currencyFilter,
    }).select("userId amount currency status");

    const userIds = pendingTrx.map((itm) => itm.userId);

    const [users, rewards, paidTrxs, referrals] = await Promise.all([
      User.find({ _id: { $in: userIds } }).select(
        "_id telegramUsername kaiaAddress bonus isBlacklisted directReferralCount lineId referralCode"
      ),
      milestones.find({ userId: { $in: userIds } }).select("userId rewards"),
      PaymentLogs.aggregate([
        {
          $match: {
            userId: { $in: userIds },
            status: "success",
            transferType: "send",
            reward: "withdraw",
          },
        },
        {
          $group: {
            _id: "$userId",
            totalPaid: { $sum: "$amount" },
          },
        },
      ]),
      Referral.find({ userId: { $in: userIds } }).select(
        "userId directInvites"
      ),
    ]);

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    const rewardMap = new Map(rewards.map((r) => [r.userId.toString(), r]));
    const paidMap = new Map(
      paidTrxs.map((p) => [p._id.toString(), p.totalPaid])
    );
    const referralMap = new Map(
      referrals.map((r) => [r.userId.toString(), r.directInvites])
    );

    const allReferralIds = referrals.flatMap((r) => r.directInvites || []);
    const referredUsers = await User.find({
      _id: { $in: allReferralIds },
    }).select("_id bonus");

    const referredUserMap = new Map(
      referredUsers.map((u) => [u._id.toString(), u])
    );

    const rewardValues = [
      { id: "6854f8053caa936e11321a6f", amount: 1 },
      { id: "685111495e5f4cc871608299", amount: 0.3 },
      { id: "684deac96a2ad7c99d758973", amount: 0.3 },
      { id: "68586fc397c39c48458214a7", amount: 2 },
    ];

    const rewardValueMap = new Map(rewardValues.map((r) => [r.id, r.amount]));

    const mergedData = pendingTrx.map((trx) => {
      const userId = trx.userId.toString();
      const user = userMap.get(userId);
      const rewardEntry = rewardMap.get(userId);
      const alreadyPaid = paidMap.get(userId) || 0;

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

      const netRewardAvailable = totalClaimedRewardValue - alreadyPaid;
      const isRewardClaimedCalc =
        Math.abs(netRewardAvailable - trx.amount) < 0.0001;

      const bonus = user?.bonus?.fof;
      const isJoinClaimed = !!bonus?.joiningBonus;
      const isDailyClaimed =
        bonus?.dailyBonusClaimedAt &&
        new Date(bonus.dailyBonusClaimedAt).getFullYear() === 2025;

      const directInvites = referralMap.get(userId) || [];
      let referredJoinBonus = 0;
      let referredDailyBonus = 0;

      for (const inviteId of directInvites) {
        const referred = referredUserMap.get(inviteId.toString());
        const referredBonus = referred?.bonus?.fof;

        if (referredBonus?.joiningBonus) referredJoinBonus++;
        if (
          referredBonus?.dailyBonusClaimedAt &&
          new Date(referredBonus.dailyBonusClaimedAt).getFullYear() === 2025
        )
          referredDailyBonus++;
      }

      return {
        ...trx.toObject(),
        username: user?.telegramUsername,
        kaiaAddress: user?.kaiaAddress,
        refers: user?.directReferralCount,
        referralCode: user?.referralCode,
        totalClaimedRewardValue,
        alreadyPaid,
        netRewardAvailable,
        isRewardClaimed: isRewardClaimedCalc,
        isJoinClaimed,
        isDailyClaimed,
        isBlacklisted: user?.isBlacklisted ?? false,
        referredJoinBonus,
        referredDailyBonus,
        lineId: user?.lineId,
      };
    });

    const filtered = mergedData.filter((itm) => {
      if (
        isRewardClaimed !== undefined &&
        itm.isRewardClaimed !== (isRewardClaimed === "yes")
      )
        return false;

      if (
        isBlacklisted !== undefined &&
        itm.isBlacklisted !== (isBlacklisted === "yes")
      )
        return false;

      if (
        minReferredJoinBonus !== undefined &&
        itm.referredJoinBonus < Number(minReferredJoinBonus)
      )
        return false;

      if (
        minReferredDailyBonus !== undefined &&
        itm.referredDailyBonus < Number(minReferredDailyBonus)
      )
        return false;

      if (
        usernameIncludes &&
        !itm.username?.toLowerCase().includes(usernameIncludes.toLowerCase())
      )
        return false;

      if (hasLineId === "yes" && !itm.lineId) return false;
      if (hasLineId === "no" && itm.lineId) return false;

      if (hasTelegramUsername === "yes" && !itm.username) return false;
      if (hasTelegramUsername === "no" && itm.username) return false;

      return true;
    });

    res.status(200).json({
      count: filtered.length,
      data: filtered,
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

    const users = await User.find({ _id: { $in: userIds } }).lean();

    const joiningBonusUserIds = [];
    const dailyBonusUserIds = [];
    const usersToBlacklist = [];

    for (const user of users) {
      const bonus = user.bonus?.fof;

      if (!user.isBlacklisted) {
        usersToBlacklist.push({
          updateOne: {
            filter: { _id: user._id },
            update: { $set: { isBlacklisted: true } },
          },
        });

        if (bonus?.joiningBonus === true) {
          joiningBonusUserIds.push(user._id.toString());
        }

        if (
          bonus?.dailyBonusClaimedAt &&
          new Date(bonus.dailyBonusClaimedAt).getFullYear() === 2025
        ) {
          dailyBonusUserIds.push(user._id.toString());
        }
      }
    }

    if (usersToBlacklist.length > 0) {
      await User.bulkWrite(usersToBlacklist);
    }

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

    // Step 4: Delete payment logs
    const deleteResult = await PaymentLogs.deleteMany({
      userId: { $in: userIds },
    });

    // Step 5: Respond
    res.status(200).json({
      success: true,
      blacklistedCount: usersToBlacklist.length,
      joiningBonusUserIds,
      dailyBonusUserIds,
      rewardTransactionDeletionCount,
      paymentLogsDeleted: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Error in updateBlacklistStatus:", error);
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
    const rootUserIds = ["685acee52a243da9916ff8db"].map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const referrals = await Referral.find({
      userId: { $in: rootUserIds },
    }).select("userId directInvites");

    const flatIds = new Set<string>();

    referrals.forEach((ref) => {
      flatIds.add(ref.userId.toString());
      (ref.directInvites as mongoose.Types.ObjectId[]).forEach((inviteId) => {
        flatIds.add(inviteId.toString());
      });
    });

    const userIds = Array.from(flatIds).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const users = await User.find({ _id: { $in: userIds } }).select(
      "_id telegramUsername bonus"
    );

    const result = users.map((user) => {
      const bonus = user?.bonus?.fof;
      const isJoinClaimed = !!bonus?.joiningBonus;
      const isDailyClaimed =
        bonus?.dailyBonusClaimedAt &&
        new Date(bonus.dailyBonusClaimedAt).getFullYear() === 2025;

      return {
        userId: user._id.toString(),
        telegramUsername: user.telegramUsername,
        isJoinClaimed,
        isDailyClaimed,
      };
    });

    res.status(200).json({
      count: result.length,
      ids: result.map((itm) => itm.userId),
      users: result,
    });
  } catch (error) {
    console.error("Error in getReferTreeOfUsers:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const userIdByAddr = async (req, res) => {
  try {
    const { allAddress } = req.body;

    const users = await User.find({
      kaiaAddress: { $in: allAddress },
    }).select("_id telegramUsername kaiaAddress");

    const userMap = new Map(
      users.map((user) => [user.kaiaAddress.toLowerCase(), user])
    );

    const orderedUsers = allAddress.map(
      (addr) => userMap.get(addr.toLowerCase()) || null
    );

    res.status(200).json({
      success: true,
      length: orderedUsers.filter(Boolean).length,
      users: orderedUsers.filter(Boolean),
    });
  } catch (error) {
    console.error("Error in userIdByAddr:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getTrxById = async (req, res) => {
  try {
    const { userData } = req.body;

    let updated = 0;
    let notFound = 0;
    let updatedTrxs = [];

    for (const { userId, amount, paymentId, kaiaAddress } of userData) {
      const trx = await PaymentLogs.findOneAndUpdate(
        {
          userId: new mongoose.Types.ObjectId(userId),
          walletAddress: kaiaAddress,
          status: "pending",
          amount: amount,
          transferType: "send",
        },
        {
          $set: {
            paymentId: paymentId,
            status: "success",
          },
        },
        {
          new: true,
        }
      );

      if (trx) {
        updated += 1;
        updatedTrxs.push(trx);
      } else {
        notFound += 1;
      }
    }

    res.status(200).json({
      success: true,
      givenCount: userData.length,
      updatedCount: updated,
      notFoundCount: notFound,
      updatedTrxs,
    });
  } catch (error) {
    console.error("Error in getTrxById:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const updateWalletAddr = async (req, res) => {
  try {
    const pendingTrx = await PaymentLogs.find({
      reward: "withdraw",
      transferType: "send",
    }).select("userId amount currency");

    const userIds = [
      ...new Set(pendingTrx.map((trx) => trx.userId.toString())),
    ];

    const users = await User.find({ _id: { $in: userIds } }).select(
      "kaiaAddress"
    );

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user.kaiaAddress;
    });

    const updatedTrx = pendingTrx.map((trx) => {
      const kaiaAddress = userMap[trx.userId.toString()] || null;
      return {
        ...trx.toObject(),
        walletAddress: kaiaAddress,
      };
    });

    await Promise.all(
      pendingTrx.map(async (trx) => {
        const kaiaAddress = userMap[trx.userId.toString()];
        if (kaiaAddress) {
          trx.walletAddress = kaiaAddress;
          await trx.save();
        }
      })
    );

    res.status(200).json({ success: true, data: updatedTrx });
  } catch (error) {
    console.error("Error in updateWalletAddr:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getAdId = async (req, res) => {
  try {
    const generateRandomToken = (length) => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    };

    const token = generateRandomToken(171);

    res.json({
      data: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPayments = async (req, res) => {};

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
