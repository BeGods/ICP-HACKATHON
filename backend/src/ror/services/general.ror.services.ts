import { gameItems } from "../../utils/constants/gameItems";
import milestones from "../../common/models/milestones.models";
import mongoose from "mongoose";
import ranks from "../../common/models/ranks.models";
import userMythologies from "../../common/models/mythologies.models";
import { ItemsTransactions } from "../../common/models/transactions.models";

export const generateDailyRwrd = async (userId) => {
  try {
    const userMilestones = await milestones.findOne({ userId: userId });
    const pouchItems = userMilestones?.pouch ?? [];
    const ignoredItems = [
      "starter00",
      "treasure03",
      "treasure02",
      "treasure01",
    ];

    const filteredClaimedItems =
      gameItems?.filter(
        (item) =>
          !userMilestones?.claimedRoRItems?.includes(item.id) &&
          !pouchItems?.includes(item.id) &&
          item.id.includes("artifact") &&
          !ignoredItems.some((ignore) => item.id.includes(ignore))
      ) ?? [];

    // random reward
    const randomGenItem =
      filteredClaimedItems[
        Math.floor(Math.random() * filteredClaimedItems.length)
      ];

    let genRewardObj = null;

    if (randomGenItem) {
      const itemId = randomGenItem.id;
      let coins = 0;
      let updateField = null;

      if (/common0[1-4]/.test(itemId)) {
        // gold coin
        coins = 2;
        updateField = "claimedRoRItems";
      } else if (/common0[5-9]/.test(itemId)) {
        // silver coin
        coins = 1;
        updateField = "claimedRoRItems";
      } else {
        // other
        updateField = "pouch";
      }

      if (coins > 0) {
        await userMythologies.findOneAndUpdate(
          { userId },
          { $inc: { gobcoin: coins } }
        );
      }

      await milestones.findOneAndUpdate(
        { userId },
        { $push: { [updateField]: itemId } },
        { new: true }
      );

      genRewardObj = itemId;
    }

    // trans maintain
    if (genRewardObj) {
      const newItemTransaction = new ItemsTransactions({
        userId: userId,
        underworld: false,
        shards: 0,
        item: genRewardObj,
      });
      await newItemTransaction.save();
    }

    return genRewardObj;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getLeaderboardRanks = async (
  userRank = 1000,
  page = 0,
  limit = 100
) => {
  let skip = page * limit;
  let matchStage: Record<string, any> = { totalGobcoin: { $lt: 999999 } };
  let fetchAll = false;

  if (userRank <= 12) {
    matchStage = { ...matchStage, coinRank: { $lte: 12 } }; // Gold
    fetchAll = true;
  } else if (userRank <= 99) {
    matchStage = { ...matchStage, coinRank: { $gte: 13, $lte: 99 } }; // Silver
    fetchAll = true;
  } else if (userRank <= 333) {
    matchStage = { ...matchStage, coinRank: { $gte: 100, $lte: 333 } }; // Bronze
  } else {
    matchStage = { ...matchStage, coinRank: { $gte: 334, $lte: 999 } }; // Wood
  }

  // else if (userRank <= 666) {
  //   matchStage = { ...matchStage, orbRank: { $gte: 334, $lte: 666 } }; // Bronze
  // }

  if (fetchAll) skip = 0;

  try {
    let ranksFilter = [
      { $match: matchStage },
      { $sort: { coinRank: 1 as 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
          _id: 0,
          userId: 0,
        },
      },
    ];

    let pipelineObj = {
      $facet: {
        active: ranksFilter,
        finished: [
          { $match: { totalGobcoin: { $gte: 999999 } } },
          { $sort: { rorCompletedAt: 1 as 1 } },
          {
            $project: {
              __v: 0,
              createdAt: 0,
              updatedAt: 0,
              _id: 0,
              userId: 0,
            },
          },
        ],
      },
    };

    const pipeline = [pipelineObj];

    const results = await ranks.aggregate(pipeline).allowDiskUse(true).exec();

    return results;
  } catch (error) {
    throw new Error(error);
  }
};

export const checkBonus = async (user) => {
  try {
    const dailyBonusClaimed = user.bonus?.ror.dailyBonusClaimedAt;
    const nowUtc = new Date();

    const startOfTodayUtc = new Date(
      Date.UTC(
        nowUtc.getUTCFullYear(),
        nowUtc.getUTCMonth(),
        nowUtc.getUTCDate(),
        0,
        0,
        0
      )
    );

    const endOfTodayUtc = new Date(
      Date.UTC(
        nowUtc.getUTCFullYear(),
        nowUtc.getUTCMonth(),
        nowUtc.getUTCDate(),
        23,
        59,
        59
      )
    );
    const validClaim =
      dailyBonusClaimed >= startOfTodayUtc &&
      dailyBonusClaimed <= endOfTodayUtc;

    if (validClaim) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
