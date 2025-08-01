import mongoose from "mongoose";
import milestones from "../../common/models/milestones.models";
import userMythologies from "../../common/models/mythologies.models";
import { gameItems } from "../../utils/constants/gameItems";
import { IUserMyths } from "../../ts/models.interfaces";
import {
  parsePotionType,
  validatePotionType,
} from "../services/game.ror.services";
import {
  mythElementNamesLowerCase,
  myths,
} from "../../utils/constants/variables";
import { decryptHash } from "../../helpers/crypt.helpers";
import config from "../../config/config";
import { combineVaultItems } from "../../helpers/game.helpers";

export const validateSessionsStart = async (req, res, next) => {
  const user = req.user;
  const userId = user._id;

  try {
    const userMythData = await userMythologies.findOne({ userId: userId });
    // check daily quota
    if (userMythData.rorStats.dailyGameQuota <= 0) {
      throw new Error("Invalid Session. Daily quota is exausted");
    }

    req.userMythData = userMythData;
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
    const userMythData = await userMythologies.findOne({ userId });
    const rorStats = userMythData.rorStats;
    const digLvl = rorStats.digLvl ?? 1;
    const userClaimedRewards = await milestones.findOne({ userId });
    const sessionDuration = Date.now() - (rorStats.lastSessionStartTime ?? 0);

    // validate daily quota
    if ((rorStats.dailyGameQuota ?? 0) === 0) {
      throw new Error("Invalid session. Please try again.");
    }

    // validate session duration
    if (sessionDuration > 60000 || sessionDuration < 25000) {
      throw new Error("Invalid session. Please try again.");
    }

    // validate battle
    let competelvl = rorStats.competelvl ?? 0;
    battleData.forEach((round, index) => {
      const isWin = round.swipes + digLvl >= competelvl && round.status === 1;
      const isLoss = round.swipes + digLvl < competelvl && round.status === 0;

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
  const deductValue = Boolean(isMulti) ? 5 : 4;

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

export const isValidMealReq = async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const { isMulti } = req.query;
  const expiryDays = Boolean(isMulti) ? 7 : 1;
  const deductValue = Boolean(isMulti) ? 5 : 1;

  try {
    const userMythologyData = await userMythologies.findOne({ userId });
    const rorStats = userMythologyData.rorStats;
    if (Date.now() < (rorStats?.restExpiresAt ?? 0)) {
      throw new Error("Rest is already active. Please try again later.");
    }

    if (userMythologyData?.gobcoin < deductValue) {
      throw new Error("Insufficient gobcoins to complete this transaction.");
    }

    req.deductValue = deductValue;
    req.expiryDays = 1 * 24 * 60 * 60 * 1000;
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
  const { itemId, isPouch, isVault } = req.body;

  try {
    const userClaimedRewards = await milestones.findOne({ userId });
    const userMythologyData = await userMythologies.findOne({ userId });
    let existingItem;

    if (isPouch) {
      existingItem = userClaimedRewards.pouch?.find((itm) =>
        itm?.includes(itemId)
      );
    } else {
      const combinedItems = [
        ...combineVaultItems(userClaimedRewards?.bank?.vault),
        ...userClaimedRewards.bag,
      ];
      existingItem = combinedItems.find((obj) =>
        obj._id.equals(new mongoose.Types.ObjectId(itemId))
      );
    }

    // check if item exists in bag
    if (!existingItem) {
      throw new Error("Inavlid Item. Please provide correct item.");
    }

    const gameItemObj = gameItems.find(
      (item) => item.id === (isPouch ? itemId : existingItem.itemId)
    );

    // check if item already completed
    if (userClaimedRewards.claimedRoRItems.includes(gameItemObj.id)) {
      throw new Error("Item has been already traded.");
    }

    req.userMilestones = userClaimedRewards;
    req.userMythologies = userMythologyData;
    req.isVault = isVault ?? false;
    req.itemObj = {
      ...gameItemObj,
      isComplete: isPouch ? true : existingItem.isComplete,
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

export const validateShardConv = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type } = req.body;

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

    if (type == "black") {
      if (userMythology.blackShards < 1) {
        throw Error("Insufficient shards for this conversion.");
      }
    } else if (type == "white") {
      if (userMythology.whiteShards < 1) {
        throw Error("Insufficient shards for this conversion.");
      }
    } else if (myths.includes(type)) {
      const currMyth = userMythology.mythologies.find(
        (itm) => itm.name?.toLowerCase() == type
      );

      if (currMyth.shards < 1000) {
        throw Error("Insufficient shards for this conversion.");
      }
    } else {
      throw Error("Invalid shard conversion type.");
    }

    req.userMythology = userMythology;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
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
    "artifact.common02": "key",
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
  const { user } = req;

  const { adId, itemId } = await decryptHash(req.body.data);

  const artifactType = [
    "artifact.starter01",
    "artifact.starter02",
    "artifact.common03",
    "artifact.common02",
    "artifact.starter10",
  ];

  const itemType = ["statue", "map", "boots", "key", "book"];

  // validate ad
  if (adId && String(adId) !== String(config.adsgram.AD_BOOSTER_ID)) {
    return res.status(400).json({ error: "Invalid ad request." });
  }

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
      return res.status(400).json({ message: "Artifact is already claimed." });
    }

    if (userMythData.gobcoin < 1) {
      return res.status(400).json({ message: "Insufficient gobcoins." });
    }

    if (adId) {
      req.deductValue = 0;
    } else {
      req.deductValue = -1;
    }

    const splitArray = itemId.split(".");
    const index = artifactType.indexOf(`${splitArray[1]}.${splitArray[2]}`);
    const type = index !== -1 ? itemType[index] : null;

    req.itemId = itemId;
    req.type = type;
    req.userMilestones = userMilestones;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
