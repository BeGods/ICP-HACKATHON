import { gameItems } from "../../utils/constants/gameItems";
import milestones from "../../common/models/milestones.models";
import mongoose from "mongoose";
import ranks from "../../common/models/ranks.models";

interface itemInterface {
  itemId?: string;
  isComplete?: boolean;
  fragmentId?: number;
  _id?: mongoose.Types.ObjectId;
  updatedAt?: Date;
}

export const generateDailyRwrd = async (userId) => {
  try {
    const userMilestones = await milestones.findOne({ userId: userId });

    const claimedItems = [
      ...(userMilestones?.bank?.vault ?? []),
      ...(userMilestones?.bag ?? []),
    ].reduce((acc, item) => {
      const existingItem = acc.find((obj) => obj?.itemId === item?.itemId);
      if (existingItem) {
        existingItem?.fragments.push(item.fragmentId);
      } else {
        acc.push({
          itemId: item.itemId,
          fragments: [item.fragmentId],
          isComplete: item.isComplete,
          updatedAt: item.updatedAt,
        });
      }
      return acc;
    }, []);

    const completedItemIds =
      claimedItems
        ?.filter(
          (item) =>
            item.isComplete === true ||
            item.fragments.length ===
              gameItems?.find((gameItem) => gameItem.id === item.itemId)
                ?.fragments.length
        )
        .map((item) => item.itemId) ?? [];

    const filteredClaimedItems =
      gameItems?.filter(
        (item) =>
          !userMilestones?.claimedRoRItems?.includes(item.id) &&
          !completedItemIds?.includes(item.id) &&
          item.id.includes("artifact")
      ) ?? [];

    // random item
    const randomGenItem =
      filteredClaimedItems[
        Math.floor(Math.random() * filteredClaimedItems.length)
      ];

    let genRewardObj = null;
    let itemAddedToBag: itemInterface = {};

    // if random item exists
    if (randomGenItem) {
      const alreadyClaimedItem = claimedItems.find(
        (item) => item.itemId === randomGenItem.id
      );

      let randomGenFragntIdx;

      if (alreadyClaimedItem) {
        // missing frags
        const missingFragments = randomGenItem.fragments.filter(
          (item) => !alreadyClaimedItem.fragments.includes(item)
        );

        randomGenFragntIdx =
          missingFragments[Math.floor(Math.random() * missingFragments.length)];
      } else {
        randomGenFragntIdx = Math.floor(
          Math.random() * randomGenItem.fragments.length
        );
      }

      genRewardObj = {
        itemId: randomGenItem.id,
        fragmentId: randomGenFragntIdx,
        isComplete: randomGenItem.fragments.length === 1,
      };

      let updatedBag = await milestones.findOneAndUpdate(
        { userId: userId },
        {
          $push: { bag: genRewardObj },
        },
        { new: true }
      );

      itemAddedToBag = updatedBag.bag.find(
        (item) =>
          item.itemId === genRewardObj.itemId &&
          item.fragmentId === genRewardObj.fragmentId
      );
    } else {
      itemAddedToBag = null;
    }

    return itemAddedToBag;
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
  //   matchStage = { ...matchStage, overallRank: { $gte: 334, $lte: 666 } }; // Bronze
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
