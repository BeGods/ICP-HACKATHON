import {
  checkIfMealSkipped,
  claimDragon,
  fetchGameData,
  fillDefaultMythAndVault,
  filterFetchedItem,
  genRandomMythItem,
  genRandomUNDWItem,
  removeRandomItemFrmBag,
  updateDailySession,
  updateDigSessionData,
  updatePotionTrade,
} from "../services/game.ror.services";
import userMythologies from "../../common/models/mythologies.models";
import {
  defaultMythologies,
  defaultVault,
  mythElementNamesLowerCase,
} from "../../utils/constants/variables";
import { isVaultActive } from "../../helpers/general.helpers";
import {
  checkIsUnderworldActive,
  combineVaultItems,
  hasTwelveHoursElapsed,
} from "../../helpers/game.helpers";
import { ItemsTransactions } from "../../common/models/transactions.models";
import ranks from "../../common/models/ranks.models";
import Stats from "../../common/models/Stats.models";
import { itemInterface } from "../../ts/models.interfaces";
import { checkBonus } from "../services/general.ror.services";

export const getGameStats = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const userGameData = await fetchGameData(userId, true);
    const myth = userGameData.userMythologies?.[0];
    const milestone = userGameData.userMilestones?.[0];
    let rorStats = myth?.rorStats ?? {};

    // bag
    const bagData =
      milestone?.bag
        ?.map(({ updatedAt, ...itemWithoutUpdatedAt }) => itemWithoutUpdatedAt)
        ?.slice(0, 9) ?? [];

    // fill default if missing
    const { userMyth, userVault } = await fillDefaultMythAndVault(
      userId,
      myth?.mythologies ?? [],
      milestone?.bank?.vault ?? {}
    );
    myth.mythologies = userMyth;
    milestone.bank.vault = userVault;

    // check if rest is actucve
    const isRestActive = isVaultActive(rorStats.restExpiresAt);

    // daily session updates
    if (
      !rorStats.gameHrStartAt ||
      hasTwelveHoursElapsed(rorStats.gameHrStartAt)
    ) {
      const { updatedStats, thiefStole } = await updateDailySession(
        userId,
        rorStats,
        isRestActive,
        bagData
      );
      rorStats = updatedStats;
      if (thiefStole) {
        myth.showThief = true;
      }
    }

    // rorStats
    Object.assign(myth, {
      isThiefActive: rorStats.isThiefActive ?? false,
      sessionStartAt: rorStats.gameHrStartAt ?? 0,
      isRestActive,
      digLvl: await checkIfMealSkipped(userId, rorStats),
      competelvl: rorStats.competelvl ?? 0,
      dailyQuota: rorStats.dailyGameQuota ?? 0,
      gobcoin: myth.gobcoin ?? 0,
    });
    delete myth.rorStats;

    // rank data
    let userRank = await ranks.findOne({ userId });
    if (!userRank) {
      const totalUsers = await Stats.findOne({ statId: "ror" });
      userRank = { coinRank: totalUsers?.totalUsers && 0 } as any;
    }
    const memberData = {
      coinRank: userRank?.coinRank ?? 0,
      gobcoin: userRank?.totalGobcoin ?? 0,
    };

    // tasks
    const tasks = userGameData.quests.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // daily bonus
    const isEligibleToClaim = await checkBonus(user);

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
      joiningBonus: user.bonus?.ror?.joiningBonus ?? false,
      stakeOn: user.userBetAt ? user.userBetAt[0] : null,
      ...memberData,
    };

    res.status(200).json({
      user: userData,
      stats: myth,
      bank: {
        isVaultActive: isVaultActive(milestone?.bank?.vaultExpiryAt ?? 0),
        vault: milestone?.bank?.vault ?? defaultVault,
      },
      claimedItems: milestone?.claimedRoRItems ?? [],
      bag: bagData,
      quests: tasks,
      builder: milestone?.buildStage ?? [],
      pouch: milestone?.pouch ?? [],
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
  const userMythData = req.userMythData;
  const { isInside } = req.query;

  try {
    await userMythData.updateOne({
      $set: {
        "rorStats.lastSessionStartTime": Date.now(),
      },
      $inc: {
        "rorStats.dailyGameQuota": isInside ? -2 : -1,
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
  const { battleData, mythology, isInside } = req.body;

  // cal. results
  const competelvl = req.competelvl;
  const noOfWinsFromBattle = battleData.filter(
    (item) => item.status === 1
  ).length;

  try {
    // fetch & filter
    const userGameData = await fetchGameData(userId, false);
    const userMythlogyData = userGameData.userMythologies[0];
    const rorStats = userMythlogyData.rorStats ?? {};
    const userClaimedRewards = userGameData.userMilestones[0];

    const isUnderworld = checkIsUnderworldActive(
      isInside,
      rorStats,
      mythology,
      userClaimedRewards?.pouch ?? []
    );

    const rewardlvl = isUnderworld
      ? noOfWinsFromBattle + 1
      : noOfWinsFromBattle;
    const { claimedItems, filteredNotClaimedItems } = filterFetchedItem(
      userClaimedRewards,
      mythology,
      rewardlvl,
      isUnderworld
    );

    const totalUNWLoss =
      rorStats?.undeworldLostCount ?? 0 + (3 - noOfWinsFromBattle);

    // call dragon
    if (isUnderworld && totalUNWLoss > 5) {
      await claimDragon(user, competelvl, userClaimedRewards.bag);

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
        userId,
        filteredNotClaimedItems,
        userClaimedRewards.appearedUnderworldChars ?? []
      );

      rewardItem = randomGenItem;
      addedBagItem = itemAddedToBag;
    } else {
      const { randomGenItem, itemAddedToBag } = await genRandomMythItem(
        userId,
        filteredNotClaimedItems,
        claimedItems,
        userClaimedRewards.appearedUnderworldChars ?? []
      );
      rewardItem = randomGenItem;
      addedBagItem = itemAddedToBag;
    }

    // cal. shards
    let updatedShards = (3 - noOfWinsFromBattle) * 100;
    if (!rewardItem) {
      updatedShards += noOfWinsFromBattle * 100;
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
      userMythlogyData,
      user,
      rorStats
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
  const userClaimedRewards = req.userClaimedRewards;
  const vault = userClaimedRewards.bank?.vault ?? [];
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

  userClaimedRewards.bank.vault = vault;

  // update
  try {
    await userClaimedRewards.updateOne({
      $pull: {
        bag: { _id: { $in: itemsToTransfer } },
      },
      $set: {
        "bank.vault": userClaimedRewards.bank.vault,
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
  const userClaimedRewards = req.userClaimedRewards;
  const itemsToTransfer = req.itemsToTransfer;

  try {
    const vault = userClaimedRewards.bank.vault;

    for (const vaultEntry of vault) {
      vaultEntry.items = vaultEntry.items.filter(
        (item) => !itemsToTransfer.some((id) => id.equals(item._id))
      );
    }

    await userClaimedRewards.updateOne({
      $set: {
        "bank.vault": vault,
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
  const userMythologies = req.userMythologies;
  const userMilestones = req.userMilestones;
  const deductValue = req.deductValue;
  const expiryDays = req.expiryDays;

  try {
    await userMilestones.updateOne({
      $set: { "bank.vaultExpiryAt": Date.now() + expiryDays },
    });
    await userMythologies.updateOne({
      $inc: { gobcoin: -deductValue },
    });
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
  const rorStats = userMythData.rorStats ?? {};
  const deductValue = req.deductValue;
  const expiryDays = req.expiryDays;
  const userId = userMythData._id;

  const now = Date.now();
  const lastRest = rorStats.restExpiresAt || 0;
  const currentSwipePower = rorStats.digLvl || 1;

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
    await userMythologies.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          "rorStats.restExpiresAt": Date.now() + expiryDays,
          "rorStats.digLvl": updatedSwipePower,
        },
      }
    );
    await userMythologies.updateOne({
      $inc: { gobcoin: -deductValue },
    });
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
  const userMilestones = req.userMilestones;
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

    const updatedBag = userMilestones.bag?.filter(
      (item) => item.itemId !== itemObj.itemId
    );

    const hrs = noOfJoins;
    const expiresAt = Date.now() + hrs * 60 * 60 * 1000;

    const itemToBuild = {
      _id: itemObj._id,
      itemId: itemObj.itemId,
      exp: expiresAt,
    };

    await userMilestones.updateOne({
      $set: { bag: updatedBag },
      $push: {
        buildStage: itemToBuild,
      },
    });

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
  const userMilestones = req.userMilestones;

  let itemObj = {
    itemId: itemId,
    fragmentId: 0,
    isComplete: true,
  };

  try {
    await userMilestones.updateOne({
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
  const userMythologies = req.userMythologies;
  const userMilestones = req.userMilestones;
  const itemObj = req.itemObj;
  const { itemId } = req.body;
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
    if (
      /starter0[3-9]/?.test(itemId) ||
      itemId?.includes("common01") ||
      ignoredItems.some((ignore) => itemId.includes(ignore))
    ) {
      await userMilestones.updateOne({
        $pull: {
          bag: { _id: itemId },
        },
      });
      incVal = itemObj.coins;
    } else if (itemObj.isComplete) {
      await userMilestones.updateOne({
        $push: {
          claimedRoRItems: itemObj.id,
        },
        $pull: {
          bag: { _id: itemId },
        },
      });
      incVal = itemObj.coins;
    } else {
      await userMilestones.updateOne({
        $pull: {
          bag: { _id: itemId },
        },
      });
      incVal = 1;
    }

    await userMythologies.updateOne({
      $inc: { gobcoin: incVal },
    });

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
    const { potionType, milestones, user, userMythology } = req;
    const rorStats = userMythology ?? {};
    const { type } = req.body;

    // activate thief
    if (!rorStats?.isThiefActive) {
      await userMythology.updateOne({
        $set: {
          "rorStats.isThiefActive": true,
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
    await milestones.updateOne(
      {
        $push: { bag: genRewardObj },
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

export const useItemAbility = async (req, res) => {
  const { itemId } = req.body;
  const { type, user, userMilestones } = req;
  const userId = user._id;

  try {
    if (type === "boots") {
      await userMythologies.findOneAndUpdate(
        { userId: userId },
        {
          $inc: {
            "rorStats.dailyGameQuota": 1,
          },
        }
      );
    } else if (type == "map" || type == "statue") {
      await user.findOneAndUpdate(
        { userId: userId },
        {
          $inc: {
            "rorStats.competelvl": -5,
          },
        }
      );
    }

    await userMilestones.updateOne({
      $pull: {
        pouch: itemId,
      },
    });

    res.status(200).json({ message: "Item claimed successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const activateBlackSmith = async (req, res) => {
  const { user, userMythData } = req;

  await userMythData.updateOne({
    $inc: { gobcoins: -1 },
    $set: { "rorStats.isBlackSmithActive": true },
  });

  res.status(200).json({ message: "Blacksmith activated successfully." });
  try {
  } catch (error) {
    console.log(error);
  }
};

export const activateLibrarian = async (req, res) => {
  const { user, userMythData } = req;

  await userMythData.updateOne({
    $inc: { gobcoins: -1 },
    $set: { "rorStats.isLibrnActive": true },
  });

  res.status(200).json({ message: "isLibrnActive activated successfully." });
  try {
  } catch (error) {
    console.log(error);
  }
};

export const activateGemologist = async (req, res) => {
  const { user, userMythData } = req;

  await userMythData.updateOne({
    $inc: { gobcoins: -1 },
    $set: { "rorStats.isLibrnActive": true },
  });

  res.status(200).json({ message: "isLibrnActive activated successfully." });
  try {
  } catch (error) {
    console.log(error);
  }
};

export const claimArtifact = async (req, res) => {
  const { userMilestones, deductValue, itemId } = req;

  try {
    await userMilestones.updateOne({
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

    res.status(200).json({ message: "Artifact claimed successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
