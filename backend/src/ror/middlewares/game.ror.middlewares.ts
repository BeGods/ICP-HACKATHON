import mongoose from "mongoose";
import milestones from "../../common/models/milestones.models";
import userMythologies from "../../common/models/mythologies.models";
import { gameItems } from "../../utils/constants/gameItems";

export const validateSessionsStart = async (req, res, next) => {
  const user = req.user;

  try {
    //! check daily quota
    if (user.gameSession.dailyGameQuota <= 0) {
      throw new Error("Invalid Session. Daily quota is exausted");
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const validateSessionReward = async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const { battleData } = req.body;

  // 1 - win
  // 0 - loss

  try {
    const userClaimedRewards = await milestones.findOne({ userId });

    const sessionDuration = Date.now() - user.gameSession.lastSessionStartTime;

    // validate session duration|| sessionDuration < 25000
    if (sessionDuration > 60000) {
      throw new Error("Invalid session. Please try again.");
    }

    // validate battle
    let competelvl = user.gameSession.competelvl;
    battleData.forEach((round, index) => {
      const isWin = round.swipes >= competelvl && round.status === 1;
      const isLoss = round.swipes < competelvl && round.status === 0;

      if (isWin) {
        competelvl = Math.min(40, competelvl + 5);
      } else if (isLoss) {
        competelvl = Math.max(5, competelvl - 5);
      } else {
        throw new Error(`Invalid battle data at round ${index + 1}`);
      }
    });

    if ((userClaimedRewards?.bag?.length ?? 0) >= 9) {
      // check if bag is full
      throw new Error("Bag is full. Please create some space.");
    }

    req.competelvl = competelvl;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const validTransferToVault = async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const { itemIds } = req.body;
  const thereDaysFromDate = 3 * 24 * 60 * 60 * 1000;

  try {
    const userClaimedRewards = await milestones.findOne({ userId });

    if (
      !userClaimedRewards.bank.lastVaultInstallmentAt ||
      userClaimedRewards.bank.lastVaultInstallmentAt <= 0 ||
      Date.now() >=
        userClaimedRewards.bank?.lastVaultInstallmentAt + thereDaysFromDate
    ) {
      throw Error("Transfer failed. Please activate the vault.");
    }

    // check if there is enough space in vault
    if (userClaimedRewards.bank.vault.length >= 36) {
      throw Error("Insufficient space inside vault. Try again later");
    }

    const itemIdsObject = itemIds.map((id) => new mongoose.Types.ObjectId(id));

    const existingItemsInBag = userClaimedRewards.bag.filter((itemId) =>
      itemIdsObject.some((item) => item.equals(itemId._id))
    );

    // chek if iten exists inside bag
    if (existingItemsInBag.length == 0) {
      throw Error("Invalid itemId. Item does not exists in the bag.");
    }

    req.userClaimedRewards = userClaimedRewards;
    req.itemsToTransfer = existingItemsInBag;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const validTransferToBag = async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const { itemIds } = req.body;
  const thereDaysFromDate = 3 * 24 * 60 * 60 * 1000;

  try {
    const userClaimedRewards = await milestones.findOne({ userId });
    const itemIdsObject = itemIds.map((id) => new mongoose.Types.ObjectId(id));

    if (
      !userClaimedRewards.bank.lastVaultInstallmentAt ||
      userClaimedRewards.bank.lastVaultInstallmentAt <= 0 ||
      Date.now() >=
        userClaimedRewards.bank?.lastVaultInstallmentAt + thereDaysFromDate
    ) {
      throw Error("Transfer failed. Please activate the vault.");
    }

    // check if there is enough space in bag
    if (userClaimedRewards.bag.length >= 9) {
      throw Error("Insufficient space inside vault. Try again later");
    }

    const existingItemsInVault = userClaimedRewards.bank.vault.filter((obj) =>
      itemIdsObject.some((id) => obj._id.equals(id))
    );

    //check if iten exists inside bag
    if (existingItemsInVault.length == 0) {
      throw Error("Invalid Items. Please add valid itemIds.");
    }

    req.userClaimedRewards = userClaimedRewards;
    req.itemToTransfer = existingItemsInVault;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const isValidVaultReq = async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const thereDaysFromDate = 3 * 24 * 60 * 60 * 1000;

  try {
    const userClaimedRewards = await milestones.findOne({ userId });
    const userMythologyData = await userMythologies.findOne({ userId });

    if (
      Date.now() <
      userClaimedRewards.bank?.lastVaultInstallmentAt + thereDaysFromDate
    ) {
      throw new Error("Vault is already active. Please try again later.");
    }

    if (userMythologyData?.gobcoin < 3) {
      throw new Error("Insufficient gobcoins to complete this transaction.");
    }

    req.userMilestones = userClaimedRewards;
    req.userMythologies = userMythologyData;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const isValidInsideReq = async (req, res, next) => {
  const user = req.user;

  try {
    if (user.gameSession.underWorldActiveAt !== 0) {
      throw new Error("Underworld is already active. Try again later.");
    } else if (user.gameSession.dailyGameQuota < 1) {
      throw new Error("You don't have sufficient quota to activate.");
    } else if (user.gameSession.dailyGameQuota >= 5) {
      throw new Error(
        "You need more rounds to unlock the Underworld. Try again later."
      );
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const isValidOutsideReq = async (req, res, next) => {
  const user = req.user;

  try {
    if (user.gameSession.dailyGameQuota < 1) {
      throw new Error("You don't have sufficient quota to deactivate.");
    } else if (user.gameSession.underWorldActiveAt == 0) {
      throw new Error("Underworld is inactive.");
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const validateJoinFrgmnt = async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const { itemIds, payMethod } = req.body;

  // 0 - gobcoin
  // 1 - orbs

  try {
    const userClaimedRewards = await milestones.findOne({ userId });
    const userMythologyData = await userMythologies.findOne({ userId });

    const itemIdsObject = itemIds.map((id) => new mongoose.Types.ObjectId(id));
    const existingItemsInBag = userClaimedRewards.bag.filter((obj) =>
      itemIdsObject.some((id) => obj._id.equals(id))
    );

    const itemsWithSameId = existingItemsInBag.filter(
      (item) => item.itemId === existingItemsInBag[0].itemId
    );

    // check if bag is empty
    if (itemsWithSameId.length === 0) {
      throw new Error("Please provide valid items.");
    }

    const isCompleteItem = itemsWithSameId.find(
      (item) => item.isComplete === true
    );

    // check if item already completed
    if (isCompleteItem) {
      throw new Error("Invalid request. Item already completed.");
    }

    const gameItemObj = gameItems.find(
      (item) => item.id === itemsWithSameId[0].itemId
    );

    // check if all pieces are collected
    if (gameItemObj.fragments.length !== itemsWithSameId.length) {
      throw new Error("Please provide all fragments of the item.");
    }

    const userMyth = userMythologyData.mythologies.find(
      (item) => item.name === gameItemObj.orbs
    );

    if (payMethod === 0) {
      // check number of gobcoins to join
      if (userMythologyData.gobcoin < gameItemObj.fragments.length - 1) {
        throw new Error("Insufficient goboins to join fragments.");
      }
    } else {
      // check number of gobcoins to join
      if (userMyth.orbs < gameItemObj.fragments.length - 1) {
        throw new Error("Insufficient orbs to join fragments.");
      }
    }

    req.userMilestones = userClaimedRewards;
    req.userMythologies = userMythologyData;
    req.userMyth = userMyth;
    req.itemObj = itemsWithSameId[0];
    req.noOfJoins = gameItemObj.fragments.length - 1;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const validateTradeFragment = async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const { itemId } = req.body;

  try {
    const userClaimedRewards = await milestones.findOne({ userId });
    const userMythologyData = await userMythologies.findOne({ userId });

    const existingItemInBag = userClaimedRewards.bag.find((obj) =>
      obj._id.equals(new mongoose.Types.ObjectId(itemId))
    );

    // check if item exists in bag
    if (!existingItemInBag) {
      throw new Error("Inavlid Item. Please provide correct item.");
    }

    const gameItemObj = gameItems.find(
      (item) => item.id === existingItemInBag.itemId
    );

    // check if item already completed
    if (userClaimedRewards.claimedRoRItems.includes(gameItemObj.id)) {
      throw new Error("Item has been already traded.");
    }

    req.userMilestones = userClaimedRewards;
    req.userMythologies = userMythologyData;
    req.itemObj = {
      ...gameItemObj,
      isComplete: existingItemInBag.isComplete,
    };
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
