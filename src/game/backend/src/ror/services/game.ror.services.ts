import { gameItems } from "../../utils/constants/gameItems";
import userMythologies from "../../common/models/mythologies.models";
import mongoose from "mongoose";
import milestones from "../../common/models/milestones.models";
import { IMyth, itemInterface } from "../../ts/models.interfaces";
import {
  defaultMythologies,
  defaultVault,
  mythElementNames,
  underworldItemsList,
} from "../../utils/constants/variables";
import { combineVaultItems, isCoin } from "../../helpers/game.helpers";

export const fetchGameData = async (userId, includeQuests) => {
  try {
    let pipeline: any[] = [
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
                multiColorOrbs: 1,
                blackOrbs: 1,
                whiteOrbs: 1,
                whiteShards: 1,
                blackShards: 1,
                gobcoin: 1,
                rorStats: 1,
                mythologies: {
                  $map: {
                    input: "$mythologies",
                    as: "myth",
                    in: {
                      name: "$$myth.name",
                      orbs: "$$myth.orbs",
                      shards: "$$myth.shards",
                      faith: "$$myth.faith",
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
    ];

    if (includeQuests) {
      pipeline.push({
        $lookup: {
          from: "quests",
          let: { userId: "$userId" },
          pipeline: [
            {
              $lookup: {
                from: "milestones",
                let: { questId: "$_id", userId: "$$userId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", "$$userId"] },
                          { $in: ["$$questId", "$claimedQuests.taskId"] },
                        ],
                      },
                    },
                  },
                ],
                as: "milestones",
              },
            },
            {
              $addFields: {
                isQuestClaimed: {
                  $cond: {
                    if: { $gt: [{ $size: "$milestones" }, 0] },
                    then: true,
                    else: false,
                  },
                },
              },
            },
            { $sort: { createdAt: -1 as -1 } },
            {
              $project: {
                milestones: 0,
                claimedQuestData: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: "allQuests",
        },
      });

      pipeline.push({
        $addFields: {
          quests: {
            $filter: {
              input: "$allQuests",
              as: "quest",
              cond: {
                $and: [{ $eq: ["$$quest.mythology", "Other"] }],
              },
            },
          },
        },
      });

      pipeline.push({
        $project: {
          userMythologies: 1,
          userMilestones: 1,
          quests: 1,
        },
      });
    } else {
      pipeline.push({
        $project: {
          userMythologies: 1,
          userMilestones: 1,
        },
      });
    }

    const userGameStats = await userMythologies.aggregate(pipeline);

    return userGameStats[0];
  } catch (error) {
    console.log(error);

    throw new Error("There was a problem fetching user data.");
  }
};

export const removeRandomItemFrmBag = async (userId, bagData) => {
  try {
    if (!Array.isArray(bagData) || bagData.length === 0) {
      console.log("Bag is empty or not a valid array.");
      return bagData;
    }

    const randomIdx = Math.floor(Math.random() * bagData.length);
    const randomItem = bagData[randomIdx];

    await milestones.findOneAndUpdate(
      { userId },
      {
        $pull: {
          bag: { itemId: randomItem.itemId },
        },
      }
    );

    bagData.splice(randomIdx, 1);

    return bagData;
  } catch (error) {
    throw new Error("There was a problem in removing item from bag.");
  }
};

export const parsePotionType = (fileName) => {
  const regex = /^potion\.(\w+)\.(A|B)\d{2}$/;
  const match = fileName.match(regex);

  if (!match) {
    throw new Error("Invalid type name format");
  }

  const element = match[1];
  const typeCode = match[2];

  const mythology = mythElementNames[element];

  return { typeCode: typeCode, mythology: mythology, element: element };
};

export const validatePotionType = async (
  element,
  mythology,
  typeCode,
  userMythology
) => {
  const typeA = typeCode === "A" ? "whiteShards" : "blackShards";
  const typeB = typeCode === "B" ? "whiteShards" : "blackShards";

  if (element !== "aether") {
    const mythData = userMythology.mythologies.find(
      (item) => item.name === mythology
    ) as IMyth;

    if (!mythData) {
      throw new Error(`Invalid game data. Mythology not found for ${element}.`);
    }

    if (mythData.shards < 900) {
      throw new Error(`Insufficient ${element} shards.`);
    }

    if (userMythology[typeA] < 100) {
      throw new Error(`Insufficient ${typeA}.`);
    }
  } else {
    const requiredA = userMythology[typeA] >= 900;
    const requiredB = userMythology[typeB] >= 100;

    if (!requiredA || !requiredB) {
      throw new Error(`Insufficient aether shards.`);
    }
  }
};

export const updatePotionTrade = async (
  element,
  mythology,
  typeCode,
  userId
) => {
  try {
    const typeA = typeCode === "A" ? "whiteShards" : "blackShards";
    const typeB = typeCode === "B" ? "blackShards" : "whiteShards";

    if (element !== "aether") {
      await userMythologies.findOneAndUpdate(
        { userId, "mythologies.name": mythology },
        {
          $inc: {
            "mythologies.$.shards": -900,
            [typeA]: -100,
            gobcoin: -1,
          },
        }
      );
    } else {
      await userMythologies.findOneAndUpdate(
        { userId },
        {
          $inc: {
            [typeA]: -900,
            [typeB]: -100,
            gobcoin: -1,
          },
        }
      );
    }
  } catch (error) {
    console.error("Error updating potion trade:", error);
    throw new Error("Failed to update user shards for potion trade.");
  }
};

export const genRandomMythItem = async (
  userId,
  filteredNotClaimedItems,
  claimedItems,
  alreadyAppearChar
) => {
  try {
    const outsideItems = filteredNotClaimedItems.filter((item) =>
      underworldItemsList.every((uwId) => !item.id.endsWith(uwId))
    );

    // rnadom item
    const randomGenItem =
      outsideItems[Math.floor(Math.random() * filteredNotClaimedItems.length)];

    let genRewardObj = {
      itemId: randomGenItem?.id ?? null,
      fragmentId: 0,
      isComplete: true,
      isChar: false,
    };

    let itemAddedToBag: itemInterface = genRewardObj;

    // if random item exists
    if (randomGenItem) {
      const alreadyClaimedItem = claimedItems.find(
        (item) => item.itemId === randomGenItem.id
      );

      let randomGenFragntIdx;

      // coins || keys
      if (
        /common02/?.test(randomGenItem.id) ||
        isCoin(randomGenItem.id, false)
      ) {
        await milestones.findOneAndUpdate(
          { userId: userId },
          {
            $push: { pouch: randomGenItem.id },
          },
          { new: true }
        );

        itemAddedToBag = genRewardObj;
      } else if (/relic.C0[6-8]/?.test(randomGenItem.id)) {
        // encounters
        let updatedBag = await milestones.findOneAndUpdate(
          { userId: userId },
          {
            $push: { bag: genRewardObj },
          },
          { new: true }
        );

        itemAddedToBag = updatedBag.bag?.find(
          (item) => item.itemId === genRewardObj.itemId && item.fragmentId === 0
        );

        itemAddedToBag.isChar = true;
      } else {
        // relics
        if (alreadyClaimedItem) {
          // missing frags
          const missingFragments = randomGenItem.fragments.filter(
            (item) => !alreadyClaimedItem.fragments.includes(item)
          );

          randomGenFragntIdx =
            missingFragments[
              Math.floor(Math.random() * missingFragments.length)
            ];
        } else {
          randomGenFragntIdx = Math.floor(
            Math.random() * randomGenItem.fragments.length
          );
        }

        genRewardObj.fragmentId = randomGenFragntIdx;
        genRewardObj.isComplete = randomGenItem.fragments.length === 1;

        // update bag
        let updatedBag = await milestones.findOneAndUpdate(
          { userId: userId },
          {
            $push: { bag: genRewardObj },
          },
          { new: true }
        );

        itemAddedToBag = updatedBag.bag?.find(
          (item) =>
            item.itemId === genRewardObj.itemId &&
            item.fragmentId === genRewardObj.fragmentId
        );
      }
    }

    if (!itemAddedToBag.itemId) {
      itemAddedToBag = {};
    }

    return { randomGenItem, itemAddedToBag };
  } catch (error) {
    console.log(error);
  }
};

export const genRandomUNDWItem = async (
  userId,
  filteredNotClaimedItems,
  alreadyAppearChar
) => {
  try {
    const underWorldItems = filteredNotClaimedItems.filter((item) =>
      underworldItemsList.some((uwId) => item.id.endsWith(uwId))
    );

    // rnadom item
    let randomGenItem =
      underWorldItems[Math.floor(Math.random() * underWorldItems.length)];

    let genRewardObj = {
      itemId: randomGenItem?.id ?? null,
      fragmentId: 0,
      isComplete: true,
      isChar: false,
    };

    let itemAddedToBag: itemInterface = genRewardObj;

    const ignoredItems = [
      // "starter00",
      "underworld.artifact.treasure01",
      "underworld.artifact.treasure02",
      "artifact.treasure01",
    ];

    // if random item exists
    if (randomGenItem) {
      // check char has appeared before
      const alreadyClaimedItem = alreadyAppearChar.includes(randomGenItem.id);

      // if char has appeared already
      // if (ignoredItems.some((ignore) => genRewardObj.itemId.includes(ignore))) {
      //   await milestones.findOneAndUpdate(
      //     { userId: userId },
      //     {
      //       $push: { pouch: genRewardObj.itemId },
      //     },
      //     { new: true }
      //   );
      // } else
      if (ignoredItems.some((ignore) => genRewardObj.itemId.includes(ignore))) {
        let updatedBag = await milestones.findOneAndUpdate(
          { userId: userId },
          {
            $push: { bag: genRewardObj },
          },
          { new: true }
        );

        itemAddedToBag = updatedBag.bag?.find(
          (item) => item.itemId === genRewardObj.itemId && item.fragmentId === 0
        );
      } else if (alreadyClaimedItem) {
        let updatedBag = await milestones.findOneAndUpdate(
          { userId: userId },
          {
            $push: { bag: genRewardObj },
            $pull: { appearedUnderworldChars: genRewardObj.itemId },
          },
          { new: true }
        );

        itemAddedToBag = updatedBag.bag?.find(
          (item) => item.itemId === genRewardObj.itemId && item.fragmentId === 0
        );
      } else {
        if (alreadyAppearChar.includes(genRewardObj.itemId)) {
          throw Error("Invalid item.");
        }
        genRewardObj.isChar = true;
        await milestones.findOneAndUpdate(
          { userId: userId },
          {
            $push: { appearedUnderworldChars: genRewardObj.itemId },
          },
          { new: true }
        );
      }
    }

    if (!itemAddedToBag.itemId) {
      itemAddedToBag = {};
    }

    return { randomGenItem, itemAddedToBag };
  } catch (error) {
    console.log(error);
  }
};

export const filterFetchedItem = (
  userClaimedRewards,
  mythology,
  rewardlvl,
  isUnderworld
) => {
  try {
    // combine bag and vault items
    const claimedItems = [
      ...(combineVaultItems(userClaimedRewards?.bank?.vault) ?? []),
      ...(userClaimedRewards?.bag ?? []),
      ...(userClaimedRewards?.pouch ?? []),
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

    // remove completed items amd filter based on mythology
    const completedItemIds =
      claimedItems
        ?.filter(
          (item) =>
            (item.isComplete === true ||
              item.fragments.length ===
                gameItems?.find((gameItem) => gameItem.id === item.itemId)
                  ?.fragments.length) &&
            item.itemId.includes(mythology.toLowerCase())
        )
        .map((item) => item.itemId) ?? [];

    // filter
    const filteredRoRItems =
      gameItems?.filter((item) => {
        const id = item.id || "";

        const isKeyFromMythology =
          !isUnderworld &&
          id.includes(mythology.toLowerCase()) &&
          /common02/?.test(id);

        const isCoinFromMythology =
          !isUnderworld &&
          id.includes(mythology.toLowerCase()) &&
          (/starter0[3-9]/?.test(id) || id.includes("common01"));

        const isRelicFromMythology =
          id.includes("relic") && id.includes(mythology.toLowerCase());

        const isTreasureFromMythology = isUnderworld
          ? id.includes(`${mythology.toLowerCase()}.01`) ||
            id.includes(`underworld.artifact.treasure01`) ||
            id.includes(`underworld.artifact.treasure02`)
          : [];

        return (
          (isRelicFromMythology ||
            isTreasureFromMythology ||
            isCoinFromMythology ||
            isKeyFromMythology) &&
          !userClaimedRewards?.claimedRoRItems?.includes(id) &&
          !completedItemIds?.includes(id)
        );
      }) ?? [];

    const isUNWAllWins = isUnderworld && rewardlvl === 4;
    const isMythAllWins = !isUnderworld && rewardlvl === 3;

    // match reward lvl
    let filteredNotClaimedItems = filteredRoRItems.filter((item) => {
      if (isUnderworld && rewardlvl === 4) {
        return [1, 4].includes(item.coins);
      } else if (!isUnderworld && rewardlvl === 3) {
        return [1, 2, 3].includes(item.coins);
      } else {
        return item.coins === rewardlvl;
      }
    });

    // fallback for all wins
    if (
      filteredNotClaimedItems.length === 0 &&
      (isUNWAllWins || isMythAllWins)
    ) {
      filteredNotClaimedItems = filteredRoRItems;
    }

    return { claimedItems, filteredNotClaimedItems };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
};

export const updateDigSessionData = async (
  randomShard,
  totalUNWLoss,
  competelvl,
  isUnderworld,
  updatedShards,
  mythology,
  userMythlogyData,
  user,
  rorStats
) => {
  const userId = user._id;
  try {
    // user session update
    const updateData = {
      "rorStats.lastSessionStartTime": 0,
      "rorStats.competelvl": competelvl,
    };

    if (isUnderworld) {
      updateData["rorStats.isUnderworldActive"] = 1;
      updateData["rorStats.dailyGameQuota"] = rorStats.dailyGameQuota - 1;
      updateData["rorStats.undeworldLostCount"] =
        rorStats.undeworldLostCount + totalUNWLoss;
    }

    await userMythologies.findOneAndUpdate(
      { userId: userId },
      { $set: updateData }
    );

    // shards update
    if (isUnderworld) {
      // underworld

      if (randomShard == 0) {
        // white
        const currentWhiteShards = Number(userMythlogyData.whiteShards) || 0;
        const currentWhiteOrbs = Number(userMythlogyData.whiteOrbs) || 0;
        const newShardTotal = currentWhiteShards + Number(updatedShards || 0);
        const gainedOrbs = Math.floor(newShardTotal / 1000);
        const remainingShards = newShardTotal % 1000;

        userMythlogyData.whiteShards = remainingShards;
        userMythlogyData.whiteOrbs = currentWhiteOrbs + gainedOrbs;

        await userMythologies.updateOne(
          { userId },
          {
            $set: {
              whiteShards: userMythlogyData.whiteShards,
              whiteOrbs: userMythlogyData.whiteOrbs,
            },
          }
        );
      } else {
        // black
        const currentBlackShards = Number(userMythlogyData.blackShards) || 0;
        const currentBlackOrbs = Number(userMythlogyData.blackOrbs) || 0;
        const totalBlackShards =
          currentBlackShards + Number(updatedShards || 0);

        const gainedBlackOrbs = Math.floor(totalBlackShards / 1000);
        const remainingBlackShards = totalBlackShards % 1000;

        userMythlogyData.blackShards = remainingBlackShards;
        userMythlogyData.blackOrbs = currentBlackOrbs + gainedBlackOrbs;

        await userMythologies.updateOne(
          { userId },
          {
            $set: {
              blackShards: userMythlogyData.blackShards,
              blackOrbs: userMythlogyData.blackOrbs,
            },
          }
        );
      }
    } else {
      // mythology
      let mythData = userMythlogyData.mythologies.find(
        (myth) => myth.name === mythology
      );

      const currentShards = Number(mythData?.shards) || 0;
      const currentOrbs = Number(mythData?.orbs) || 0;
      const incomingShards = Number(updatedShards) || 0;

      const totalShards = currentShards + incomingShards;
      const gainedOrbs = Math.floor(totalShards / 1000);
      const remainingShards = totalShards % 1000;

      mythData.shards = remainingShards;
      mythData.orbs = currentOrbs + gainedOrbs;

      await userMythologies.updateOne(
        { userId, "mythologies.name": mythology },
        {
          $set: {
            "mythologies.$.shards": mythData.shards,
            "mythologies.$.orbs": mythData.orbs,
          },
        }
      );
    }
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
};

export const claimDragon = async (user, competelvl, bag) => {
  try {
    const filteredPouch =
      bag?.filter((item) => item.includes("artifact.treasure")) || [];

    // empty the bnag except special coin
    await milestones.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          bag: [],
          pouch: filteredPouch,
        },
      }
    );

    // reset count
    await userMythologies.findOneAndUpdate({
      $set: {
        "rorStats.undeworldLostCount": 0,
        "rorStats.lastSessionStartTime": 0,
        "rorStats.competelvl": competelvl,
        "rorStats.isUnderworldActive": 1,
      },
      $inc: {
        "rorStats.dailyGameQuota": -1,
      },
    });
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
};

export const checkIfMealSkipped = async (userId, rorStats) => {
  try {
    const now = Date.now();
    const lastRest = rorStats.restExpiresAt || 0;
    const lastPenalty = rorStats.lastMealPenaltyAt || 0;
    const currentSwipePower = rorStats.digLvl || 1;
    const expiryMs = 24 * 60 * 60 * 1000;

    let updatedSwipePower = currentSwipePower;

    const decayStartTime = lastRest + 2 * expiryMs;
    const shouldDeductPenalty =
      !lastPenalty || lastPenalty === 0 || now > lastPenalty + expiryMs;

    const shouldDecay =
      lastRest !== 0 && now > decayStartTime && shouldDeductPenalty;

    if (shouldDecay) {
      console.log("mean deduct called");

      updatedSwipePower = Math.max(updatedSwipePower - 1, 1);

      rorStats.digLvl = updatedSwipePower;
      rorStats.lastMealPenaltyAt = now;

      await userMythologies.findOneAndUpdate(
        { userId: userId },
        {
          $set: {
            "rorStats.digLvl": updatedSwipePower,
            "rorStats.lastMealPenaltyAt": now,
          },
        }
      );
    }

    return updatedSwipePower;
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
};

export const fillDefaultMythAndVault = async (userId, userMyth, userVault) => {
  try {
    const isMythAbsent = userMyth?.length === 0;
    const isVaultAbsent = userVault?.length === 0;

    // new user
    if (isMythAbsent) {
      userMyth = defaultMythologies;
      await userMythologies.findOneAndUpdate(
        { userId: userId },
        { $set: { mythologies: defaultMythologies } }
      );
    }

    // default vault
    if (isVaultAbsent) {
      userVault = defaultVault;
      await milestones.findOneAndUpdate(
        { userId: userId },
        { $set: { "bank.vault": defaultVault } }
      );
    }

    return { userMyth, userVault };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
};

export const updateDailySession = async (
  userId,
  rorStats,
  isRestActive,
  bagData
) => {
  let thiefStole = false;
  try {
    // thief: steal item
    if (rorStats.isThiefActive && !isRestActive) {
      thiefStole = true;

      bagData = await removeRandomItemFrmBag(userId, bagData);
    }

    // update session details
    await userMythologies.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $set: {
          "rorStats.dailyGameQuota": 12,
          "rorStats.gameHrStartAt": Date.now(),
        },
      },
      { new: true }
    );
    rorStats.dailyGameQuota = 12;
    rorStats.gameHrStartAt = Date.now();

    const updatedStats = rorStats;

    return { updatedStats, thiefStole };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
};
