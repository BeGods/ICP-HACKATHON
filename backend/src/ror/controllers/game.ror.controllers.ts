import {
  claimDragon,
  fetchGameData,
  filterFetchedItem,
  genRandomMythItem,
  genRandomUNDWItem,
  removeRandomItemFrmBag,
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
import milestones from "../../common/models/milestones.models";

export const getGameStats = async (req, res) => {
  try {
    let user = req.user;
    const userId = user._id;
    const userGameData = await fetchGameData(userId, true);
    let thiefStole = false;

    // bag data
    let bagData =
      userGameData.userMilestones[0].bag
        ?.map(({ updatedAt, ...itemWithoutUpdatedAt }) => itemWithoutUpdatedAt)
        ?.slice(0, 9) ?? [];
    let vaultData =
      combineVaultItems(userGameData.userMilestones[0].bank?.vault)
        ?.map(({ updatedAt, ...itemWithoutUpdatedAt }) => itemWithoutUpdatedAt)
        ?.slice(0, 27) ?? [];

    // add battle stats
    userGameData.userMythologies[0].competelvl = user.gameSession.competelvl;
    userGameData.userMythologies[0].dailyQuota =
      user.gameSession.dailyGameQuota;
    userGameData.userMythologies[0].gobcoin =
      userGameData.userMythologies[0].gobcoin ?? 0;

    // add default mythologies
    const isMythAbsent =
      userGameData.userMythologies[0].mythologies.length === 0;
    const isVaultAbsent =
      userGameData.userMilestones[0].bank.vault.length === 0;

    // new user
    if (isMythAbsent) {
      userGameData.userMythologies[0].mythologies = defaultMythologies;
      await userMythologies.findOneAndUpdate(
        { userId: userId },
        { $set: { mythologies: defaultMythologies } }
      );
    }

    if (isVaultAbsent) {
      userGameData.userMilestones[0].bank.vault = defaultVault;
      await milestones.findOneAndUpdate(
        { userId: userId },
        { $set: { "bank.vault": defaultVault } }
      );
    }

    // check rest
    const isRestActive = isVaultActive(user.gameSession?.restExpiresAt);

    // reset game session
    if (hasTwelveHoursElapsed(user.gameSession.gameHrStartAt)) {
      // thief: steal item
      if (user.gameSession.isThiefActive && !isRestActive) {
        thiefStole = true;

        bagData = await removeRandomItemFrmBag(user._id, bagData);
      }

      // update session details
      await user.updateOne(
        {
          $set: {
            "gameSession.dailyGameQuota": 12,
            "gameSession.gameHrStartAt": Date.now(),
          },
        },
        { new: true }
      );
      user.gameSession.dailyGameQuota = 12;
      user.gameSession.gameHrStartAt = Date.now();
    }

    if (thiefStole) {
      userGameData.userMythologies[0].showThief = true;
    }

    userGameData.userMythologies[0].isThiefActive =
      user.gameSession.isThiefActive;
    userGameData.userMythologies[0].sessionStartAt =
      user.gameSession?.gameHrStartAt;
    userGameData.userMythologies[0].isRestActive = isRestActive;

    let userRank = await ranks.findOne({ userId: req.user._id });
    if (!userRank) {
      const totalUsers = await Stats.findOne({ statId: "ror" });
      userRank = { coinRank: totalUsers?.totalUsers && 0 } as any;
    }

    const isEligibleToClaim = await checkBonus(user);

    const memberData = {
      coinRank: userRank?.coinRank ?? 0,
      gobcoin: userRank?.totalGobcoin ?? 0,
    };

    // is eligible to claim, streak, joining bonus
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
      isEligibleToClaim: isEligibleToClaim,
      showFinishRwrd:
        user.gameCompletedAt.hasClaimedFoFRwrd === false &&
        user.gameCompletedAt.fof
          ? true
          : false,
      streak: {
        isStreakActive: false,
        streakCount: 0,
        lastMythClaimed: "Celtic",
      },
      joiningBonus: user.bonus.ror.joiningBonus,
      isPlaySuperVerified: user.playsuper.isVerified,
      stakeOn: user.userBetAt ? user.userBetAt[0] : null,
      ...memberData,
    };

    const tasks = userGameData.quests.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    res.status(200).json({
      user: userData,
      stats: userGameData.userMythologies[0],
      bank: {
        isVaultActive: isVaultActive(
          userGameData.userMilestones[0]?.bank?.vaultExpiryAt ?? 0
        ),
        vault: userGameData.userMilestones[0]?.bank?.vault ?? defaultVault,
      },
      claimedItems: userGameData.userMilestones[0]?.claimedRoRItems ?? [],
      bag: bagData,
      quests: tasks,
      builder: userGameData.userMilestones[0]?.buildStage ?? [],
      pouch: userGameData.userMilestones[0]?.pouch ?? [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const startSession = async (req, res) => {
  const user = req.user;
  const { isInside } = req.query;

  try {
    await user.updateOne({
      $set: {
        "gameSession.lastSessionStartTime": Date.now(),
      },
      $inc: {
        "gameSession.dailyGameQuota": isInside ? -2 : -1,
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
    const userClaimedRewards = userGameData.userMilestones[0];

    const isUnderworld = checkIsUnderworldActive(
      isInside,
      user.gameSession,
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
      user.gameSession.undeworldLostCount + (3 - noOfWinsFromBattle);

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
        claimedItems
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
      user
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

export const activateRest = async (req, res) => {
  const userMythologies = req.userMythologies;
  const user = req.user;
  const deductValue = req.deductValue;
  const expiryDays = req.expiryDays;

  try {
    await user.updateOne({
      $set: { "gameSession.restExpiresAt": Date.now() + expiryDays },
    });
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

  // 1 fragment  = 1 gobcoin
  // if complete item then 1 extra

  try {
    if (itemObj.isComplete) {
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
    const { potionType, milestones, user } = req;
    const { type } = req.body;

    // activate thief
    if (!user.gameSession.isThiefActive) {
      await user.updateOne({
        $set: {
          "gameSession.isThiefActive": true,
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

  try {
    if (type === "boots") {
      await user.updateOne({
        $inc: {
          "gameSession.dailyGameQuota": 1,
        },
      });
    } else if (type == "map" || type == "statue") {
      await user.updateOne({
        $inc: {
          "gameSession.competelvl": -5,
        },
      });
    } else {
      throw Error("Invalid item.");
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

  await user.updateOne({ $set: { "gameSession.isBlackSmithActive": true } });
  await userMythData.updateOne({ $inc: { gobcoins: -1 } });

  res.status(200).json({ message: "Blacksmith activated successfully." });
  try {
  } catch (error) {
    console.log(error);
  }
};

export const activateLibrarian = async (req, res) => {
  const { user, userMythData } = req;

  await user.updateOne({ $set: { "gameSession.isLibrnActive": true } });
  await userMythData.updateOne({ $inc: { gobcoins: -1 } });

  res.status(200).json({ message: "isLibrnActive activated successfully." });
  try {
  } catch (error) {
    console.log(error);
  }
};

export const activateGemologist = async (req, res) => {
  const { user, userMythData } = req;

  await user.updateOne({ $set: { "gameSession.isLibrnActive": true } });
  await userMythData.updateOne({ $inc: { gobcoins: -1 } });

  res.status(200).json({ message: "isLibrnActive activated successfully." });
  try {
  } catch (error) {
    console.log(error);
  }
};

export const claimArtifact = async (req, res) => {
  const { itemId } = req.body;
  const { userMilestones } = req;

  try {
    await userMilestones.updateOne({
      $push: {
        pouch: itemId,
      },
    });

    await userMythologies.updateOne({
      $inc: {
        gobcoin: -1,
      },
    });

    res.status(200).json({ message: "Artifact claimed successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
