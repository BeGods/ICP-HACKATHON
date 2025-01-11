import { gameItems } from "../../utils/constants/gameItems";
import milestones from "../../common/models/milestones.models";
import { fetchGameData } from "../services/game.ror.services";
import userMythologies from "../../common/models/mythologies.models";
import { defaultMythologies } from "../../utils/constants/variables";

export const getGameStats = async (req, res) => {
  const user = req.user;
  const userId = user._id;

  try {
    const userGameData = await fetchGameData(userId);

    // bag data
    const bagData = userGameData.userMilestones[0].bag
      .map(({ updatedAt, ...itemWithoutUpdatedAt }) => itemWithoutUpdatedAt)
      .slice(0, 12);

    // add battle stats
    userGameData.userMythologies[0].competelvl =
      user.relicGameSession.competelvl;
    userGameData.userMythologies[0].dailyQuota =
      user.relicGameSession.dailyGameQuota;

    // add default mythologies
    const isMythAbsent =
      userGameData.userMythologies[0].mythologies.length === 0;

    if (isMythAbsent) {
      await userMythologies.findOneAndUpdate(
        { userId: userId },
        { $set: { mythologies: defaultMythologies } }
      );
    }

    const userData = {
      telegramUsername: user.telegramUsername,
      tonAddress: user.tonAddress,
      isPremium: user.isPremium,
      avatarUrl: user.profile.avatarUrl,
      directReferralCount: user.directReferralCount,
      premiumReferralCount: user.premiumReferralCount,
      referralCode: user.referralCode,
    };

    res.status(200).json({
      user: userData,
      stats: userGameData.userMythologies[0],
      bank: userGameData.userMilestones[0].bank,
      bag: bagData,
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
      $set: { "relicGameSession.lastSessionStartTime": Date.now() },
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
  const competelvl = req.competelvl;
  const { battleData, mythology } = req.body;

  //! add validation where if all rewards for  a mythology are exhaused give shards
  //! fix missing fragments no working correctly

  try {
    const userClaimedRewards = await milestones.findOne({ userId });

    const noOfWinsFromBattle = battleData.filter(
      (item) => item.status === 1
    ).length;

    // combine bag and vault items
    const claimedItems = [
      ...(userClaimedRewards.bank.vault ?? []),
      ...(userClaimedRewards.bag ?? []),
    ].reduce((acc, item) => {
      const existingItem = acc.find((obj) => obj.itemId === item.itemId);
      if (existingItem) {
        existingItem.fragments.push(item.fragmentId);
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

    // remove completed items &&  items whose all pieces are collected &&  filter based on mythology
    const completedItemIds = claimedItems
      .filter(
        (item) =>
          (item.isComplete === true ||
            item.fragments.length ===
              gameItems.find((gameItem) => gameItem.id === item.itemId)
                ?.fragments.length) &&
          item.itemId.includes(mythology.toLowerCase())
      )
      .map((item) => {
        return item.itemId;
      });

    // filters and gives items which are not claimed yet & L1,L2,L3
    const filteredClaimedItems = gameItems.filter(
      (item) =>
        !userClaimedRewards.claimedRoRItems.includes(item.id) &&
        !completedItemIds.includes(item.id) &&
        item.id.includes(mythology.toLowerCase()) &&
        item.fragments.length === noOfWinsFromBattle
    );

    // gives randomItem
    const randomGenItem =
      filteredClaimedItems[
        Math.floor(Math.random() * filteredClaimedItems.length)
      ];

    let genRewardObj;

    // check if randomItem exists
    if (randomGenItem) {
      // check already exists
      const alreadyClaimedItem = claimedItems.find(
        (item) => item.itemId === randomGenItem.id
      );

      let randomGenFragntIdx;

      if (alreadyClaimedItem) {
        // missing fragments
        const missingFragments = randomGenItem.fragments.filter(
          (item) => !alreadyClaimedItem.fragments.includes(item)
        );

        randomGenFragntIdx =
          randomGenItem.fragments[
            Math.floor(Math.random() * missingFragments.length)
          ];
      } else {
        randomGenFragntIdx = Math.floor(
          Math.random() * randomGenItem.fragments.length
        );
      }

      genRewardObj = {
        itemId: randomGenItem.id,
        fragmentId: randomGenFragntIdx,
        isComplete: randomGenItem.fragments.length === 1 ? true : false,
      };

      await userClaimedRewards.updateOne({
        $push: { bag: genRewardObj },
      });
    }

    // fallback shards
    console.log(noOfWinsFromBattle);

    const updatedShards = (!genRewardObj ? 3 : 3 - noOfWinsFromBattle) * 100;

    await user.updateOne({
      $set: {
        "relicGameSession.lastSessionStartTime": 0,
        "relicGameSession.competelvl": competelvl,
      },
      $inc: {
        "relicGameSession.dailyGameQuota": -1,
      },
    });

    await userMythologies.findOneAndUpdate(
      {
        userId,
        "mythologies.name": mythology,
      },
      { $inc: { "mythologies.$.shards": updatedShards } }
    );

    res.status(200).json({
      reward: [genRewardObj ?? {}, { shards: updatedShards }],
    });
  } catch (error) {
    console.log(error);
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

export const activateVault = async (req, res) => {
  const userMythologies = req.userMythologies;
  const userMilestones = req.userMilestones;

  try {
    await userMilestones.updateOne({
      $set: { "bank.lastVaultInstallmentAt": Date.now() },
    });
    await userMythologies.updateOne({
      $inc: { gobcoin: -3 },
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
