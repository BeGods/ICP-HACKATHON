import { gameItems } from "../../utils/constants/gameItems";
import milestones from "../../common/models/milestones.models";
import mongoose from "mongoose";

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
