import mongoose from "mongoose";
import milestones from "../../common/models/milestones.models";
import userMythologies from "../../common/models/mythologies.models";
import { gameItems } from "../../utils/constants/gameItems";
import { IUserMyths } from "../../ts/models.interfaces";
import {
  parsePotionType,
  validatePotionType,
} from "../services/game.ror.services";
import { mythElementNamesLowerCase } from "../../utils/constants/variables";

export const validateSessionsStart = async (req, res, next) => {
  const user = req.user;

  try {
    // check daily quota
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

    // validate daily quota
    if (user.gameSession.dailyQuota === 0) {
      throw new Error("Invalid session. Please try again.");
    }

    // validate session duration
    // if (sessionDuration > 60000 || sessionDuration < 25000) {
    //   throw new Error("Invalid session. Please try again.");
    // }

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
      !userClaimedRewards.bank.vaultExpiryAt ||
      userClaimedRewards.bank.vaultExpiryAt <= 0 ||
      Date.now() >= userClaimedRewards.bank?.vaultExpiryAt + thereDaysFromDate
    ) {
      throw Error("Transfer failed. Please activate the vault.");
    }

    const itemIdsObject = itemIds.map((id) => new mongoose.Types.ObjectId(id));

    const existingItemsInBag = userClaimedRewards.bag?.filter((itemId) =>
      itemIdsObject.some((item) => item.equals(itemId._id))
    );

    // chek if iten exists inside bag
    if (existingItemsInBag.length == 0) {
      throw Error("Invalid itemId. Item does not exists in the bag.");
    }

    // check space in vault
    for (let item of existingItemsInBag) {
      const mythology = item.itemId.includes("potion")
        ? mythElementNamesLowerCase[item.itemId?.split(".")[1]]
        : item.itemId?.split(".")[0];
      const targetVault = userClaimedRewards.bank.vault.find(
        (v) => v.name === mythology
      );

      if (!targetVault) {
        throw Error(`Vault for mythology '${mythology}' not found.`);
      }

      if (targetVault.items.length >= 27) {
        throw Error(
          `Insufficient space in the '${mythology}' vault. Try again later.`
        );
      }
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

    // check if active
    if (
      !userClaimedRewards.bank.vaultExpiryAt ||
      userClaimedRewards.bank.vaultExpiryAt <= 0 ||
      Date.now() >= userClaimedRewards.bank?.vaultExpiryAt + thereDaysFromDate
    ) {
      throw Error("Transfer failed. Please activate the vault.");
    }

    // check if there is enough space in bag
    if (userClaimedRewards.bag?.length >= 9) {
      throw Error("Insufficient space inside vault. Try again later");
    }

    // flatten and get all items in one array
    const allItems = userClaimedRewards.bank.vault.flatMap(
      (vaultEntry) => vaultEntry.items || []
    );

    const existingItemsInVault = allItems.filter((item) =>
      itemIdsObject.some((id) => id.equals(item._id))
    );

    // if any id missing then throw eorror
    if (existingItemsInVault.length !== itemIdsObject.length) {
      throw Error("Invalid Items. Some itemIds do not exist in the vault.");
    }

    req.userClaimedRewards = userClaimedRewards;
    req.itemsToTransfer = existingItemsInVault;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const isValidVaultReq = async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const { isMulti } = req.query;
  const deductValue = Boolean(isMulti) ? 5 : 1;

  try {
    const userClaimedRewards = await milestones.findOne({ userId });
    const userMythologyData = await userMythologies.findOne({ userId });

    if (Date.now() < userClaimedRewards.bank?.vaultExpiryAt) {
      throw new Error("Vault is already active. Please try again later.");
    }

    if (userMythologyData?.gobcoin < deductValue) {
      throw new Error("Insufficient gobcoins to complete this transaction.");
    }

    req.deductValue = deductValue;
    req.expiryDays = 5 * 24 * 60 * 60 * 1000;
    req.userMilestones = userClaimedRewards;
    req.userMythologies = userMythologyData;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const isValidRestReq = async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const { isMulti } = req.query;
  const expiryDays = Boolean(isMulti) ? 7 : 1;
  const deductValue = Boolean(isMulti) ? 5 : 1;

  try {
    const userMythologyData = await userMythologies.findOne({ userId });
    if (Date.now() < user.gameSession?.restExpiresAt) {
      throw new Error("Rest is already active. Please try again later.");
    }

    if (userMythologyData?.gobcoin < deductValue) {
      throw new Error("Insufficient gobcoins to complete this transaction.");
    }

    req.deductValue = deductValue;
    req.expiryDays = expiryDays * 24 * 60 * 60 * 1000;
    req.userMythologies = userMythologyData;
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
    const existingItemsInBag = userClaimedRewards.bag?.filter((obj) =>
      itemIdsObject.some((id) => obj._id.equals(id))
    );

    const itemsWithSameId = existingItemsInBag?.filter(
      (item) => item.itemId === existingItemsInBag[0].itemId
    );

    // if activate
    // if (!user.gameSession.isBlackSmithActive) {
    //   throw new Error("Blacksmith is inactive. Please activate.");
    // }

    // space in builder
    if (userClaimedRewards?.buildStage?.length >= 3) {
      throw new Error("Builder is occupied. Free up space.");
    }

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

export const validateCompleteItem = async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const { itemId } = req.body;

  try {
    const userClaimedRewards = await milestones.findOne({ userId });

    const existingItemInBuild = userClaimedRewards.buildStage?.find(
      (obj) => obj.itemId == itemId
    );

    // check if item exists in build
    if (!existingItemInBuild) {
      throw new Error("Inavlid Item. Please provide correct item.");
    }

    // check if item already completed
    if (userClaimedRewards.claimedRoRItems.includes(itemId)) {
      throw new Error("Item has been already traded.");
    }

    // validate expiry
    const hasBuildCompleted = Date.now() >= existingItemInBuild.exp;

    if (!hasBuildCompleted) {
      throw new Error("Item is still building.");
    }

    req.userMilestones = userClaimedRewards;
    req.itemObj = existingItemInBuild;
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

    const existingItemInBag = userClaimedRewards.bag?.find((obj) =>
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

export const validateTradePotion = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type } = req.body;
    const { element, mythology, typeCode } = parsePotionType(type);
    // 240px-potion.earth.A01

    // user bag data
    const userClaimedRewards = await milestones.findOne({ userId });

    // check if there is space in bag
    if (userClaimedRewards.bag.length >= 9) {
      throw Error("Insufficient space inside vault. Try again later");
    }

    // user myth data
    const userMythology = (await userMythologies.findOne({
      userId: userId,
    })) as IUserMyths;

    if (userMythology?.gobcoin < 1) {
      throw new Error("Insufficient gobcoins to complete this transaction.");
    }

    if (!userMythology) {
      throw Error("Invalid game data. Mythologies data not found.");
    }

    // validate shards bal.
    await validatePotionType(element, mythology, typeCode, userMythology);

    req.potionType = { element, mythology, typeCode };
    req.userMythology = userMythology;
    req.milestones = userClaimedRewards;
    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
};

export const validItemAbility = async (req, res, next) => {
  const { itemId } = req.body;
  const { user } = req;

  const ITEM_TYPE_MAP = {
    "artifact.starter01": "statue",
    "artifact.starter02": "boots",
    "artifact.common03": "map",
    "artifact.treasure02": "sun.amulet",
    "artifact.treasure03": "moon.amulet",
  };

  try {
    const matchedType = Object.entries(ITEM_TYPE_MAP).find(([key]) =>
      itemId.includes(key)
    );

    if (!matchedType) {
      return res.status(400).json({ message: "Invalid itemId." });
    }

    const [_, type] = matchedType;

    const userMilestones = await milestones.findOne({ userId: user._id });

    if (!userMilestones) {
      return res
        .status(404)
        .json({ message: "Milestones not found for user." });
    }

    const itemInBag = userMilestones?.pouch?.includes(itemId);

    if (!itemInBag) {
      return res.status(404).json({ message: "Item not found in pouch." });
    }

    req.userMilestones = userMilestones;
    req.type = type;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const validBlksmthReq = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;

    const userMythData = await userMythologies.findOne({ userId });

    // validate coins
    if (userMythData?.gobcoin < 1) {
      throw new Error("Insufficient gobcoins to complete this transaction.");
    }

    // validate blacksmith
    if (user?.isBlackSmithActive === true) {
      throw new Error("Invalid request. Blacksmith is already active.");
    }

    req.userMythData = userMythData;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const validLibrnReq = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;

    const userMythData = await userMythologies.findOne({ userId });

    // validate coins
    if (userMythData?.gobcoin < 1) {
      throw new Error("Insufficient gobcoins to complete this transaction.");
    }

    // validate blacksmith
    if (user?.isLibrnActive === true) {
      throw new Error("Invalid request. Blacksmith is already active.");
    }

    req.userMythData = userMythData;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const validArtifactClaim = async (req, res, next) => {
  const { itemId } = req.body;
  const { user } = req;

  const artifactType = [
    "artifact.starter01",
    "artifact.starter02",
    "artifact.common03",
    "artifact.starter10",
  ];

  try {
    const matchedType = artifactType.some((itm) => itemId.includes(itm));

    if (!matchedType) {
      return res.status(400).json({ message: "Invalid itemId." });
    }

    const userMilestones = await milestones.findOne({ userId: user._id });
    const userMythData = await userMythologies.findOne({ userId: user._id });

    if (!userMilestones) {
      return res
        .status(404)
        .json({ message: "Milestones not found for user." });
    }

    const itemInBag = userMilestones?.pouch?.includes(itemId);

    if (itemInBag) {
      return res.status(404).json({ message: "Artifact is already claimed." });
    }

    if (userMythData.gobcoin < 1) {
      return res.status(400).json({ message: "Insufficient gobcoins." });
    }

    req.userMilestones = userMilestones;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
