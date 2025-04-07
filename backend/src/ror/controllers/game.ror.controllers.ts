import { gameItems } from "../../utils/constants/gameItems";
import milestones from "../../common/models/milestones.models";
import { fetchGameData } from "../services/game.ror.services";
import userMythologies from "../../common/models/mythologies.models";
import { defaultMythologies } from "../../utils/constants/variables";
import { isVaultActive } from "../../helpers/general.helpers";
import { hasTwelveHoursElapsed } from "../../helpers/game.helpers";
import { ItemsTransactions } from "../../common/models/transactions.models";
import mongoose from "mongoose";
import ranks from "../../common/models/ranks.models";
import Stats from "../../common/models/Stats.models";
import { checkBonus } from "../services/general.ror.services";

interface itemInterface {
  itemId?: string;
  isComplete?: boolean;
  fragmentId?: number;
  _id?: mongoose.Types.ObjectId;
  updatedAt?: Date;
}

export const getGameStats = async (req, res) => {
  try {
    let user = req.user;
    const userId = user._id;
    const userGameData = await fetchGameData(userId);

    // bag data
    const bagData =
      userGameData.userMilestones[0].bag
        ?.map(({ updatedAt, ...itemWithoutUpdatedAt }) => itemWithoutUpdatedAt)
        ?.slice(0, 12) ?? [];

    // add battle stats
    userGameData.userMythologies[0].competelvl = user.gameSession.competelvl;
    userGameData.userMythologies[0].dailyQuota =
      user.gameSession.dailyGameQuota;
    userGameData.userMythologies[0].gobcoin =
      userGameData.userMythologies[0].gobcoin ?? 0;

    // add default mythologies
    const isMythAbsent =
      userGameData.userMythologies[0].mythologies.length === 0;

    // new user
    if (isMythAbsent) {
      await userMythologies.findOneAndUpdate(
        { userId: userId },
        { $set: { mythologies: defaultMythologies } }
      );
    }

    // reset game session
    if (hasTwelveHoursElapsed(user.gameSession.gameHrStartAt)) {
      await user.updateOne(
        {
          $set: {
            "gameSession.dailyGameQuota": 12,
            "gameSession.gameHrStartAt": Date.now(),
            "gameSession.underWorldActiveAt": 0,
          },
        },
        { new: true }
      );
      user.gameSession.dailyGameQuota = 12;
      user.gameSession.gameHrStartAt = Date.now();
      user.gameSession.underWorldActiveAt = 0;
    }

    userGameData.userMythologies[0].isUnderWorldActive =
      user.gameSession?.underWorldActiveAt != 0 ? true : false;
    userGameData.userMythologies[0].isRestActive = isVaultActive(
      user.gameSession?.restExpiresAt
    );

    let userRank = await ranks.findOne({ userId: req.user._id });
    if (!userRank) {
      const totalUsers = await Stats.findOne({ statId: "fof" });
      userRank = { coinRank: totalUsers?.totalUsers && 0 } as any;
    }

    const memberData = {
      coinRank: userRank?.coinRank,
      gobcoin: userRank?.totalGobcoin,
    };

    const isEligibleToClaim = await checkBonus(user);

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
        vault: userGameData.userMilestones[0].bank?.vault ?? [],
      },
      bag: bagData,
      quests: tasks,
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

  try {
    await user.updateOne({
      $set: {
        "gameSession.lastSessionStartTime": Date.now(),
      },
      $inc: {
        "gameSession.dailyGameQuota": -1,
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
  const isUnderworld = user.gameSession.underWorldActiveAt !== 0;
  const competelvl = req.competelvl;
  const { battleData, mythology } = req.body;

  try {
    const userClaimedRewards = await milestones.findOne({ userId });
    const userMythlogyData = await userMythologies.findOne({ userId });
    const noOfWinsFromBattle = battleData.filter(
      (item) => item.status === 1
    ).length;

    const rewardlvl = isUnderworld
      ? noOfWinsFromBattle + 1
      : noOfWinsFromBattle;

    // combine bag and vault items
    const claimedItems = [
      ...(userClaimedRewards?.bank?.vault ?? []),
      ...(userClaimedRewards?.bag ?? []),
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

    // Remove completed items && filter based on mythology
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

    // filter items not claimed yet & L1, L2, L3
    const filteredClaimedItems =
      gameItems?.filter(
        (item) =>
          !userClaimedRewards?.claimedRoRItems?.includes(item.id) &&
          !completedItemIds?.includes(item.id) &&
          item.id?.includes("relic") &&
          item.id?.includes(mythology.toLowerCase()) &&
          item.fragments.length === rewardlvl
      ) ?? [];

    // rnadom item
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
    }

    let updatedShards = (3 - noOfWinsFromBattle) * 100;

    if (!randomGenItem) {
      updatedShards += noOfWinsFromBattle * 100;
    }

    await user.updateOne({
      $set: {
        "gameSession.lastSessionStartTime": 0,
        "gameSession.competelvl": competelvl,
      },
    });

    // shards/orb update
    if (isUnderworld) {
      // underworld
      userMythlogyData.blackOrbs += Math.floor(
        (userMythlogyData.blackShards + updatedShards) / 1000
      );
      userMythlogyData.blackShards =
        (userMythlogyData.blackShards + updatedShards) % 1000;

      await userMythologies.updateOne(
        { userId },
        {
          $set: {
            blackShards: userMythlogyData.blackShards,
            blackOrbs: userMythlogyData.blackOrbs,
          },
        }
      );
    } else {
      // mythology
      let mythData = userMythlogyData.mythologies.find(
        (myth) => myth.name == mythology
      );

      mythData.orbs += Math.floor((mythData.shards + updatedShards) / 1000);
      mythData.shards = (mythData.shards + updatedShards) % 1000;

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

    if (randomGenItem) {
      // new item transaction
      const newItemTransaction = new ItemsTransactions({
        userId: userId,
        underworld: isUnderworld,
        shards: updatedShards,
        item: randomGenItem.id,
      });
      await newItemTransaction.save();
    }

    res.status(200).json({
      reward: [{ fragment: itemAddedToBag }, { shards: updatedShards }],
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
  const itemsToTransfer = req.itemsToTransfer;

  try {
    await userClaimedRewards.updateOne({
      $pull: {
        bag: { _id: { $in: itemsToTransfer } },
      },
      $push: {
        "bank.vault": {
          $each: itemsToTransfer.map((item) => ({
            _id: item._id,
            itemId: item.itemId,
            fragmentId: item.fragmentId,
            isComplete: item.isComplete,
          })),
        },
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
  const itemsToTransfer = req.itemToTransfer;

  try {
    await userClaimedRewards.updateOne({
      $pull: {
        "bank.vault": { _id: { $in: itemsToTransfer } },
      },
      $push: {
        bag: {
          $each: itemsToTransfer.map((item) => ({
            _id: item._id,
            itemId: item.itemId,
            fragmentId: item.fragmentId,
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

export const activateInside = async (req, res) => {
  const user = req.user;

  try {
    await user.updateOne({
      $set: {
        "gameSession.underWorldActiveAt": Date.now(),
      },
      $inc: {
        "gameSession.dailyGameQuota": -1,
      },
    });
    res.status(200).json({ message: "Underworld activated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const deActivateInside = async (req, res) => {
  const user = req.user;

  try {
    await user.updateOne({
      $set: {
        "gameSession.underWorldActiveAt": 0,
      },
      $inc: {
        "gameSession.dailyGameQuota": -1,
      },
    });
    res.status(200).json({ message: "Underworld deActivated successfully." });
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

    const updatedBag = userMilestones.bag.filter(
      (item) => item.itemId !== itemObj.itemId
    );

    updatedBag.push(itemObj);
    console.log(itemObj);

    await userMilestones.updateOne({
      $set: { bag: updatedBag },
    });

    res.status(200).json({ message: "Relic claimed successfully." });
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
      incVal = itemObj.fragments.length + 1;
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

export const giveCoins = async (req, res) => {
  const user = req.user;

  try {
    await userMythologies.findOneAndUpdate(
      { userId: user._id },
      { $inc: { gobcoin: 10 } }
    );

    res.status(200).json({ message: "Coins added successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
