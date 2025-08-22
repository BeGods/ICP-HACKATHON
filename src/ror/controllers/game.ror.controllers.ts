import {
  checkIfMealSkipped,
  claimDragon,
  fetchGameData,
  fillDefaultMythAndVault,
  filterFetchedItem,
  genRandomMythItem,
  genRandomUNDWItem,
  updateDailySession,
  updateDigSessionData,
  updatePotionTrade,
} from "../services/game.ror.services";
import userMythologies from "../../common/models/mythologies.models";
import {
  defaultVault,
  mythElementNamesLowerCase,
  myths,
} from "../../utils/constants/variables";
import { isVaultActive } from "../../helpers/general.helpers";
import {
  checkIsUnderworldActive,
  hasTwelveHoursElapsed,
} from "../../helpers/game.helpers";
import {
  CoinsTransactions,
  ItemsTransactions,
} from "../../common/models/transactions.models";
import ranks from "../../common/models/ranks.models";
import Stats from "../../common/models/Stats.models";
import { itemInterface } from "../../ts/models.interfaces";
import { checkBonus } from "../services/general.ror.services";

export const getGameStats = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const data = await fetchGameData(userId, true);

    let userGameData = data.userGameData?.[0];
    let myth = data.userMythologies?.[0];

    // bag
    const bagData =
      userGameData?.bag
        ?.map(({ updatedAt, ...itemWithoutUpdatedAt }) => itemWithoutUpdatedAt)
        ?.slice(0, 9) ?? [];

    // fill default if missing
    const { userMyth, updatedVault } = await fillDefaultMythAndVault(
      userId,
      myth?.mythologies ?? [],
      userGameData
    );
    myth.mythologies = userMyth;
    userGameData.vault = updatedVault;

    // check if rest is actucve
    const isRestActive = isVaultActive(userGameData.restExpiresAt);

    // daily session updates
    if (
      !userGameData.gameHrStartAt ||
      hasTwelveHoursElapsed(userGameData.gameHrStartAt)
    ) {
      const { updatedStats, thiefStole } = await updateDailySession(
        userId,
        userGameData,
        isRestActive,
        bagData
      );
      userGameData = updatedStats;
      if (thiefStole) {
        myth.showThief = true;
      }
    }

    // rorStats
    Object.assign(myth, {
      isThiefActive: userGameData.isThiefActive ?? false,
      sessionStartAt: userGameData.gameHrStartAt ?? 0,
      isRestActive,
      digLvl: await checkIfMealSkipped(userId, userGameData),
      competelvl: userGameData.competelvl ?? 0,
      dailyQuota: userGameData.dailyGameQuota ?? 0,
      gobcoin: myth.gobcoin ?? 0,
    });

    // rank data
    let userRank = await ranks.findOne({ userId });
    if (!userRank) {
      const totalUsers = await Stats.findOne({ statId: "ror" });
      userRank = { coinRank: totalUsers?.totalUsers && 0 } as any;
    }

    const memberData = {
      coinRank: userRank?.coinRank ?? 0,
      gobcoin: userRank?.totalGobcoin ?? 0,
      referRank: userRank?.referRank ?? 0,
      countryRank: userRank?.countryRank ?? 0,
    };

    // tasks
    const tasks = data.quests.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // daily bonus
    const isEligibleToClaim = await checkBonus(userGameData);

    // userdata
    const userData = {
      username: user.telegramUsername,
      tonAddress: user.tonAddress,
      kaiaAddress: user.kaiaAddress,
      isPremium: user.isPremium,
      avatarUrl: user.profile.avatarUrl
        ? user.telegramId
          ? `https://media.publit.io/file/UserAvatars/${user.profile.avatarUrl}.jpg`
          : user.profile.avatarUrl
        : null,
      directReferralCount: user.directReferralCount,
      premiumReferralCount: user.premiumReferralCount,
      referralCode: user.referralCode,
      country: user.country ?? "NA",
      isEligibleToClaim,
      showFinishRwrd:
        user.gameCompletedAt.hasClaimedFoFRwrd === false &&
        user.gameCompletedAt.fof,
      streak: {
        isStreakActive: false,
        streakCount: 0,
        lastMythClaimed: "Celtic",
      },
      joiningBonus: userGameData.joiningBonus ?? false,
      stakeOn: user.userBetAt ? user.userBetAt[0] : null,
      ...memberData,
    };

    res.status(200).json({
      user: userData,
      stats: myth,
      bank: {
        isVaultActive: isVaultActive(userGameData?.vaultExpiryAt ?? 0),
        vault: userGameData?.vault ?? defaultVault,
      },
      claimedItems: userGameData?.claimedRoRItems ?? [],
      bag: bagData,
      quests: tasks,
      builder: userGameData?.buildStage ?? [],
      pouch: userGameData?.pouch ?? [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const startSession = async (req, res) => {
  const userGameData = req.userGameData;
  const { isInside } = req.query;

  try {
    await userGameData.updateOne({
      $set: {
        lastSessionStartTime: Date.now(),
      },
      $inc: {
        dailyGameQuota: isInside ? -2 : -1,
      },
    });

    res.status(200).json({ message: "Session started successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const generateSessionReward = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const { battleData, mythology, isInside, userGameData } = req.body;

  // cal. results
  const competelvl = req.competelvl;
  const noOfWinsFromBattle = battleData.filter(
    (item) => item.status === 1
  ).length;

  try {
    const isUnderworld = checkIsUnderworldActive(
      isInside,
      userGameData,
      mythology,
      userGameData?.pouch ?? []
    );

    const rewardlvl = isUnderworld
      ? noOfWinsFromBattle + 1
      : noOfWinsFromBattle;
    const { claimedItems, filteredNotClaimedItems } = filterFetchedItem(
      userGameData,
      mythology,
      rewardlvl,
      isUnderworld
    );

    const totalUNWLoss =
      userGameData?.undeworldLostCount ?? 0 + (3 - noOfWinsFromBattle);

    // call dragon
    if (isUnderworld && totalUNWLoss > 5) {
      await claimDragon(user, competelvl, userGameData);

      res.status(200).json({
        reward: { isDragon: true, mythology: mythology },
      });

      return;
    }

    let rewardItem = null;
    let addedBagItem: itemInterface = {};

    if (isUnderworld) {
      // generate random reward
      const { randomGenItem, itemAddedToBag } = await genRandomUNDWItem(
        userGameData,
        filteredNotClaimedItems,
        userGameData.appearedUnderworldChars ?? []
      );

      rewardItem = randomGenItem;
      addedBagItem = itemAddedToBag;
    } else {
      const { randomGenItem, itemAddedToBag } = await genRandomMythItem(
        filteredNotClaimedItems,
        claimedItems,
        userGameData
      );
      rewardItem = randomGenItem;
      addedBagItem = itemAddedToBag;
    }

    // cal. shards
    const shardUpdateVal = isUnderworld ? 1 : 100;
    let updatedShards = (3 - noOfWinsFromBattle) * shardUpdateVal;
    if (!rewardItem) {
      updatedShards += noOfWinsFromBattle * shardUpdateVal;
    }
    const randomShard = Math.floor(Math.random() * 2);

    // update session data & shards
    await updateDigSessionData(
      randomShard,
      totalUNWLoss,
      competelvl,
      isUnderworld,
      updatedShards,
      mythology,
      user,
      userGameData
    );

    // new item transaction if item
    if (rewardItem && !addedBagItem.isChar) {
      const newItemTransaction = new ItemsTransactions({
        userId: userId,
        underworld: isUnderworld,
        shards: updatedShards,
        item: rewardItem.id,
      });
      await newItemTransaction.save();
    }

    const undeworldShards = ["whiteShards", "blackShards"];
    const randomUnderworldShard = undeworldShards[randomShard];
    const updatedShardType = isUnderworld ? randomUnderworldShard : mythology;

    res.status(200).json({
      reward: {
        fragment: addedBagItem,
        shards: updatedShards,
        shardType: updatedShardType,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const transferToVault = async (req, res) => {
  const userGameData = req.userGameData;
  const vault = userGameData?.vault ?? [];
  const itemsToTransfer = req.itemsToTransfer;

  // classify items by mythology
  const itemsByMythology = itemsToTransfer?.reduce((acc, item) => {
    const mythology = item.itemId.includes("potion")
      ? mythElementNamesLowerCase[item.itemId?.split(".")[1]]
      : item.itemId?.split(".")[0];

    if (!acc[mythology]) acc[mythology] = [];
    acc[mythology].push({
      _id: item._id,
      itemId: item.itemId,
      fragmentId: item.fragmentId,
      isComplete: item.isComplete,
      updatedAt: new Date(),
    });

    return acc;
  }, {});

  // align it with the valut arrau
  for (const [mythology, items] of Object.entries(itemsByMythology)) {
    const existingVault = vault.find((v) => v.name === mythology);

    if (existingVault) {
      existingVault.items.push(...(items as []));
    } else {
      vault.push({
        name: mythology,
        items: items,
      });
    }
  }

  userGameData.vault = vault;

  // update
  try {
    await userGameData.updateOne({
      $pull: {
        bag: { _id: { $in: itemsToTransfer } },
      },
      $set: {
        vault: userGameData.vault,
      },
    });

    res.status(200).json({ message: "Item successfully tranfered to vault." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const transferToBag = async (req, res) => {
  const userGameData = req.userGameData;
  const itemsToTransfer = req.itemsToTransfer;

  try {
    const vault = userGameData.vault;

    for (const vaultEntry of vault) {
      vaultEntry.items = vaultEntry.items.filter(
        (item) => !itemsToTransfer.some((id) => id.equals(item._id))
      );
    }

    await userGameData.updateOne({
      $set: {
        vault: vault,
      },
      $push: {
        bag: {
          $each: itemsToTransfer.map((item) => ({
            _id: item._id,
            itemId: item.itemId,
            fragmentId: item.fragmentId,
            isComplete: item.isComplete,
            updatedAt: new Date(),
          })),
        },
      },
    });

    res.status(200).json({ message: "Item successfully tranfered to bag." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const activateVault = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const userMythologies = req.userMythologies;
  const userGameData = req.userGameData;
  const deductValue = req.deductValue;
  const expiryDays = req.expiryDays;

  try {
    await userGameData.updateOne({
      $set: { vaultExpiryAt: Date.now() + expiryDays },
    });
    await userMythologies.updateOne({
      $inc: { gobcoin: -deductValue },
    });

    if (deductValue !== 0) {
      const newCoinTransaction = new CoinsTransactions({
        userId: userId,
        source: "blacksmith",
        coins: -deductValue,
      });
      await newCoinTransaction.save();
    }

    res.status(200).json({ message: "Vault activated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const activateMeal = async (req, res) => {
  const userMythData = req.userMythologies;
  const userId = userMythData._id;
  const { userGameData, deductValue, expiryDays } = req;

  const now = Date.now();
  const lastRest = userGameData.restExpiresAt || 0;
  const currentSwipePower = userGameData.digLvl || 1;

  let updatedSwipePower = currentSwipePower;

  // if (lastRest !== 0 && now > lastRest + 2 * expiryDays) {
  //   updatedSwipePower = Math.max(updatedSwipePower - 1, 1);
  // } else {
  //   updatedSwipePower += 1;
  // }

  if (lastRest === 0 || now < lastRest + 2 * expiryDays) {
    updatedSwipePower += 1;
  }

  try {
    await userGameData.updateOne({
      $set: {
        restExpiresAt: Date.now() + expiryDays,
        digLvl: updatedSwipePower,
      },
    });
    await userMythologies.updateOne({
      $inc: { gobcoin: -deductValue },
    });

    if (deductValue !== 0) {
      const newCoinTransaction = new CoinsTransactions({
        userId: userId,
        source: "blacksmith",
        coins: -deductValue,
      });
      await newCoinTransaction.save();
    }
    res.status(200).json({ message: "Rest activated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const joinFragments = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const { payMethod } = req.body;
  const userMythData = req.userMythologies;
  const userGameData = req.userGameData;
  const noOfJoins = req.noOfJoins;
  const userMyth = req.userMyth;
  let itemObj = req.itemObj;

  try {
    itemObj.fragmentId = 0;
    itemObj.isComplete = true;

    if (payMethod === 0) {
      await userMythData.updateOne({
        $inc: { gobcoin: -noOfJoins },
      });
    } else {
      await userMythologies.findOneAndUpdate(
        { userId, "mythologies.name": userMyth.name },
        {
          $inc: { "mythologies.$.orbs": -noOfJoins },
        }
      );
    }

    const updatedBag = userGameData.bag?.filter(
      (item) => item.itemId !== itemObj.itemId
    );

    const hrs = noOfJoins;
    const expiresAt = Date.now() + hrs * 60 * 60 * 1000;

    const itemToBuild = {
      _id: itemObj._id,
      itemId: itemObj.itemId,
      exp: expiresAt,
    };

    await userGameData.updateOne({
      $set: { bag: updatedBag },
      $push: {
        buildStage: itemToBuild,
      },
    });

    const newCoinTransaction = new CoinsTransactions({
      userId: userId,
      source: "blacksmith",
      coins: -noOfJoins,
    });
    await newCoinTransaction.save();

    res.status(200).json({ message: "Blacksmith started build successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimCompleteRelic = async (req, res) => {
  const { itemId } = req.body;
  const userGameData = req.userGameData;

  let itemObj = {
    itemId: itemId,
    fragmentId: 0,
    isComplete: true,
  };

  try {
    await userGameData.updateOne({
      $pull: {
        buildStage: { itemId: itemId },
      },
      $push: {
        bag: itemObj,
      },
    });

    res.status(200).json({ message: "Item built successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const tradeFragments = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const userMythologies = req.userMythologies;
  const userGameData = req.userGameData;
  const itemObj = req.itemObj;
  const { itemId, isPouch, isVault } = req.body;
  let incVal = 0;
  const ignoredItems = [
    // "starter00",
    "underworld.artifact.treasure01",
    "underworld.artifact.treasure02",
    "treasure01",
  ];

  // 1 fragment  = 1 gobcoin
  // if complete item then 1 extra

  try {
    if (isPouch) {
      await userGameData.updateOne({
        $pull: {
          pouch: itemId,
        },
      });
      incVal = itemObj.coins;
    } else if (isVault) {
      const vault = userGameData.vault;

      for (const vaultEntry of vault) {
        vaultEntry.items = vaultEntry.items.filter(
          (item) => !itemId?.includes(item._id)
        );
      }

      await userGameData.updateOne({
        $set: {
          vault: vault,
        },
      });
    } else if (
      /starter0[3-9]/?.test(itemId) ||
      itemId?.includes("common01") ||
      ignoredItems.some((ignore) => itemId.includes(ignore))
    ) {
      await userGameData.updateOne({
        $pull: {
          bag: { _id: itemId },
        },
      });
      incVal = itemObj.coins;
    } else if (itemObj.isComplete) {
      await userGameData.updateOne({
        $push: {
          claimedRoRItems: itemObj.id,
        },
        $pull: {
          bag: { _id: itemId },
        },
      });
      incVal = itemObj.coins;
    } else {
      await userGameData.updateOne({
        $pull: {
          bag: { _id: itemId },
        },
      });
      incVal = 1;
    }

    await userMythologies.updateOne({
      $inc: { gobcoin: incVal },
    });

    const newCoinTransaction = new CoinsTransactions({
      userId: userId,
      source: "trade",
      coins: itemObj.coins,
    });
    await newCoinTransaction.save();

    res.status(200).json({ message: "Item traded successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const tradeShardsToPotion = async (req, res) => {
  try {
    const { potionType, user, userGameData } = req;
    const { type } = req.body;

    // activate thief
    if (!userGameData?.isThiefActive) {
      await userGameData.updateOne({
        $set: {
          isThiefActive: true,
        },
      });
    }

    // deduct shards
    await updatePotionTrade(
      potionType.element,
      potionType.mythology,
      potionType.typeCode,
      user._id
    );

    // give potion
    const genRewardObj = {
      itemId: type,
      fragmentId: 0,
      isComplete: true,
    };
    await userGameData.updateOne(
      {
        $push: { pouch: genRewardObj.itemId },
      },
      { new: true }
    );

    // new item transaction
    const newItemTransaction = new ItemsTransactions({
      userId: user._id,
      underworld: false,
      shards: 0,
      item: type,
    });
    await newItemTransaction.save();

    res.status(200).json({ message: "Potion addded to your bag." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const tradeShardsToCoin = async (req, res) => {
  try {
    const { type } = req.body;
    const userMythology = req.userMythology;

    if (type == "black") {
      await userMythology.updateOne({
        $inc: {
          blackShards: -1,
          gobcoin: 1,
        },
      });
    } else if (type == "white") {
      await userMythology.updateOne({
        $inc: {
          whiteShards: -1,
          gobcoin: 1,
        },
      });
    } else if (myths.includes(type)) {
      await userMythology.updateOne(
        { "mythologies.name": type },
        {
          $inc: {
            "mythologies.$.shards": -100,
            gobcoin: 1,
          },
        }
      );
    }

    res.status(200).json({ message: "Shards converted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const useItemAbility = async (req, res) => {
  const { itemId } = req.body;
  const { type, userGameData } = req;

  try {
    if (type === "boots") {
      await userGameData.updateOne({
        $inc: {
          dailyGameQuota: 1,
        },
        $pull: {
          pouch: itemId,
        },
      });
    } else if (type == "map" || type == "statue") {
      await userGameData.updateOne({
        $inc: {
          competelvl: -5,
        },
        $pull: {
          pouch: itemId,
        },
      });
    }

    res.status(200).json({ message: "Item claimed successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimArtifact = async (req, res) => {
  const { userGameData, deductValue, itemId, user, type } = req;
  const userId = user._id;

  try {
    await userGameData.updateOne({
      $push: {
        pouch: itemId,
      },
    });

    if (deductValue !== 0) {
      await userMythologies.updateOne({
        $inc: {
          gobcoin: -deductValue,
        },
      });
    }

    if (deductValue !== 0) {
      const newCoinTransaction = new CoinsTransactions({
        userId: userId,
        source: type,
        coins: 1,
      });
      await newCoinTransaction.save();
    }

    res.status(200).json({ message: "Artifact claimed successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
