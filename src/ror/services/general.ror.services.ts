import { gameItems } from "../../utils/constants/gameItems";
import milestones from "../../common/models/milestones.models";
import mongoose from "mongoose";
import ranks from "../../common/models/ranks.models";
import userMythologies from "../../common/models/mythologies.models";
import {
  CoinsTransactions,
  ItemsTransactions,
} from "../../common/models/transactions.models";

export const generateDailyRwrd = async (userId) => {
  try {
    const userMilestones = await milestones.findOne({ userId: userId });
    const pouchItems = userMilestones?.pouch ?? [];
    const includeItems = ["common02", "common03", "starter01", "starter02"];
    const coins = ["coin 1", "coin 2"];
    let coin = 0;
    let reward: string;

    const filteredClaimedItems =
      gameItems?.filter(
        (item) =>
          item.id.includes("artifact") &&
          includeItems.some((ignore) => item.id.includes(ignore)) &&
          !pouchItems?.includes(item.id)
      ) ?? [];

    function pickByProbability(
      valuesWithProbabilities: { value: string; probability: number }[]
    ) {
      const rand = Math.random();
      let cumulative = 0;
      for (const item of valuesWithProbabilities) {
        cumulative += item.probability;
        if (rand <= cumulative) {
          return item.value;
        }
      }
      return valuesWithProbabilities[0]?.value ?? "coin 1";
    }

    if (filteredClaimedItems.length > 0) {
      // If items available, use 50% item, 25% coin 1, 25% coin 2
      const randomItem =
        filteredClaimedItems[
          Math.floor(Math.random() * filteredClaimedItems.length)
        ];
      reward = pickByProbability([
        { value: randomItem.id, probability: 0.5 },
        { value: coins[0], probability: 0.25 },
        { value: coins[1], probability: 0.25 },
      ]);
    } else {
      // If no items available, 50-50 coins
      reward = pickByProbability([
        { value: coins[0], probability: 0.5 },
        { value: coins[1], probability: 0.5 },
      ]);
    }

    if (reward) {
      const itemId = reward;
      // let updateField = null;

      if (reward === "coin 2") {
        // gold coin
        coin = 2;
        // updateField = "claimedRoRItems";
      } else if (reward === "coin 1") {
        // silver coin
        coin = 1;
        // updateField = "claimedRoRItems";
      } else {
        // other
        // updateField = "pouch";

        await milestones.findOneAndUpdate(
          { userId },
          { $push: { pouch: itemId } },
          { new: true }
        );
      }

      if (coin > 0) {
        await userMythologies.findOneAndUpdate(
          { userId },
          { $inc: { gobcoin: coin } }
        );
      }
    }

    // trans maintain
    if (reward.includes("coin")) {
      const newCoinsTransaction = new CoinsTransactions({
        userId: userId,
        source: "daily",
        coins: coin,
      });
      await newCoinsTransaction.save();
    } else {
      const newItemTransaction = new ItemsTransactions({
        userId: userId,
        underworld: false,
        shards: 0,
        item: reward,
      });
      await newItemTransaction.save();
    }

    return reward;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

// export const getLeaderboardRanks = async (
//   userRank = 1000,
//   page = 0,
//   limit = 100
// ) => {
//   let skip = page * limit;
//   let matchStage: Record<string, any> = { totalGobcoin: { $lt: 999999 } };
//   let fetchAll = false;

//   if (userRank <= 12) {
//     matchStage = { ...matchStage, coinRank: { $lte: 12 } }; // Gold
//     fetchAll = true;
//   } else if (userRank <= 99) {
//     matchStage = { ...matchStage, coinRank: { $gte: 13, $lte: 99 } }; // Silver
//     fetchAll = true;
//   } else if (userRank <= 333) {
//     matchStage = { ...matchStage, coinRank: { $gte: 100, $lte: 333 } }; // Bronze
//   } else {
//     matchStage = { ...matchStage, coinRank: { $gte: 334, $lte: 999 } }; // Wood
//   }

//   // else if (userRank <= 666) {
//   //   matchStage = { ...matchStage, orbRank: { $gte: 334, $lte: 666 } }; // Bronze
//   // }

//   if (fetchAll) skip = 0;

//   try {
//     let ranksFilter = [
//       { $match: matchStage },
//       { $sort: { coinRank: 1 as 1 } },
//       { $skip: skip },
//       { $limit: limit },
//       {
//         $project: {
//           __v: 0,
//           createdAt: 0,
//           updatedAt: 0,
//           _id: 0,
//           userId: 0,
//         },
//       },
//     ];

//     let pipelineObj = {
//       $facet: {
//         active: ranksFilter,
//         finished: [
//           { $match: { totalGobcoin: { $gte: 999999 } } },
//           { $sort: { rorCompletedAt: 1 as 1 } },
//           {
//             $project: {
//               __v: 0,
//               createdAt: 0,
//               updatedAt: 0,
//               _id: 0,
//               userId: 0,
//             },
//           },
//         ],
//       },
//     };

//     const pipeline = [pipelineObj];

//     const results = await ranks.aggregate(pipeline).allowDiskUse(true).exec();

//     return results;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

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
          { $match: { totalGobcoin: { $gte: 999 } } },
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
