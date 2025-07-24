import { gameItems } from "../../utils/constants/gameItems";
import milestones from "../../common/models/milestones.models";
import mongoose from "mongoose";
import ranks from "../../common/models/ranks.models";
import userMythologies from "../../common/models/mythologies.models";
import {
  CoinsTransactions,
  ItemsTransactions,
  ShardsTransactions,
} from "../../common/models/transactions.models";

// function pickByProbability(
//   valuesWithProbabilities: { value: string; probability: number }[]
// ) {
//   const rand = Math.random();
//   let cumulative = 0;
//   for (const item of valuesWithProbabilities) {
//     cumulative += item.probability;
//     if (rand <= cumulative) {
//       return item.value;
//     }
//   }
//   return valuesWithProbabilities[0]?.value ?? "coin 1";
// }

// if (filteredClaimedItems.length > 0) {
//   // If items available, use 50% item, 25% coin 1, 25% coin 2
//   const randomItem =
//     filteredClaimedItems[
//       Math.floor(Math.random() * filteredClaimedItems.length)
//     ];
//   reward = pickByProbability([
//     { value: randomItem.id, probability: 0.5 },
//     { value: coins[0], probability: 0.25 },
//     { value: coins[1], probability: 0.25 },
//   ]);
// } else {
//   // If no items available, 50-50 coins
//   reward = pickByProbability([
//     { value: coins[0], probability: 0.5 },
//     { value: coins[1], probability: 0.5 },
//   ]);
// }

export const generateDailyRwrd = async (user, userId) => {
  try {
    const userMilestones = await milestones.findOne({ userId });
    const pouchItems = userMilestones?.pouch ?? [];

    const includeItems = [
      "coin 1",
      "coin 2",
      "meal",
      "starter02",
      "shard.earth01",
      "shard.air01",
      "shard.water01",
      "shard.fire01",
      "shard.aether01",
      "shard.aether02",
    ];

    let reward = "";
    let coin = 0;

    const filteredClaimedItems =
      gameItems?.filter(
        (item) =>
          item.id.includes("artifact.starter02") &&
          !pouchItems?.includes(item.id)
      ) ?? [];

    const randomReward =
      includeItems[Math.floor(Math.random() * includeItems.length)];

    if (randomReward === "starter02" && filteredClaimedItems.length > 0) {
      const selectedArtifact =
        filteredClaimedItems[
          Math.floor(Math.random() * filteredClaimedItems.length)
        ].id;

      reward = selectedArtifact;

      await milestones.findOneAndUpdate(
        { userId },
        { $push: { pouch: reward } },
        { new: true }
      );

      const newItemTransaction = new ItemsTransactions({
        userId,
        underworld: false,
        shards: 0,
        item: reward,
      });
      await newItemTransaction.save();

      return reward;
    }

    reward = randomReward;

    if (reward === "coin 2") {
      coin = 2;
      await userMythologies.findOneAndUpdate(
        { userId },
        { $inc: { gobcoin: coin } }
      );
    } else if (reward === "coin 1") {
      coin = 1;
      await userMythologies.findOneAndUpdate(
        { userId },
        { $inc: { gobcoin: coin } }
      );
    } else if (reward === "meal") {
      await userMythologies.updateOne(
        { userId: userId },
        {
          $set: {
            "rorStats.restExpiresAt": Date.now() + 1 * 24 * 60 * 60 * 1000,
          },
          $inc: {
            "rorStats.digLvl": 1,
          },
        }
      );
    } else if (reward.startsWith("shard.")) {
      const shardType = reward.split(".")[1];

      const mythologyMap = {
        earth01: "Celtic",
        air01: "Egyptian",
        water01: "Norse",
        fire01: "Greek",
      };

      if (shardType === "aether01") {
        await userMythologies.findOneAndUpdate(
          { userId },
          { $inc: { whiteShards: 100 } }
        );
      } else if (shardType === "aether02") {
        await userMythologies.findOneAndUpdate(
          { userId },
          { $inc: { blackShards: 100 } }
        );
      } else {
        const mythologyName = mythologyMap[shardType];
        if (mythologyName) {
          await userMythologies.findOneAndUpdate(
            { userId, "mythologies.name": mythologyName },
            { $inc: { "mythologies.$.shards": 100 } }
          );
        }
      }

      const newShardsTransaction = new ShardsTransactions({
        userId,
        source: "daily",
        coins: 100,
      });
      await newShardsTransaction.save();
    }

    if (reward.includes("coin")) {
      const newCoinsTransaction = new CoinsTransactions({
        userId,
        source: "daily",
        coins: coin,
      });
      await newCoinsTransaction.save();
    }

    if (
      !reward.includes("coin") &&
      !reward.includes("shard") &&
      reward !== "meal"
    ) {
      const newItemTransaction = new ItemsTransactions({
        userId,
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
        refer: [{ $sort: { directReferralCount: -1 as -1 } }, { $limit: 111 }],
        active: [
          { $match: { isArchived: { $exists: false } } },
          ...ranksFilter,
        ],
        finished: [
          { $match: { totalGobcoin: { $gte: 999 } } },
          { $sort: { rorCompletedAt: 1 as 1 } },
          { $limit: 111 },
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
