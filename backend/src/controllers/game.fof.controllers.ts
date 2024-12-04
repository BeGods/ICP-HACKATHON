import {
  calculateEnergy,
  getAutomataStartTimes,
  getPhaseByDate,
  isWithinOneMinute,
} from "../utils/helpers/game.helpers";
import userMythologies, {
  IMyth,
  IUserMyths,
} from "../models/mythologies.models";
import {
  OrbsTransactions,
  ShardsTransactions,
} from "../models/transactions.models";
import {
  validateBooster,
  validateAutomata,
  updateMythologies,
  fetchUserGameStats,
  checkStreakIsActive,
} from "../services/game.fof.services";
import { checkPlaysuperExpiry } from "../services/playsuper.services";
import { defaultMythologies } from "../utils/constants/variables";
import { Document } from "mongodb";
import ranks from "../models/ranks.models";
import { Team } from "../models/referral.models";
import Stats from "../models/Stats.models";
import { checkBonus } from "../services/general.fof.services";
import { mythOrder } from "../utils/constants/variables";
import milestones from "../models/milestones.models";
import User, { IUser } from "../models/user.models";
import CryptoJs from "crypto-js";
import config from "../config/config";

export const startTapSession = async (req, res) => {
  try {
    const userId = req.user;
    const { mythologyName } = req.body;

    if (!mythologyName) {
      res.status(404).json({ message: "Invalid Mythology." });
    }

    const updatedMyth = {
      tapSessionStartTime: Date.now(),
    };

    // First, attempt to find and update the mythology
    let result = await userMythologies.findOneAndUpdate(
      { userId: userId, "mythologies.name": mythologyName },
      {
        $set: {
          "mythologies.$.tapSessionStartTime": updatedMyth.tapSessionStartTime,
        },
      },
      { new: true }
    );

    // If the mythology does not exist, insert a new mythology
    if (!result) {
      result = await userMythologies.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            mythologies: {
              name: mythologyName,
              tapSessionStartTime: updatedMyth.tapSessionStartTime,
              orbs: 0,
              lastTapAcitivityTime: Date.now(),
              shards: 0,
              energy: 1000,
              faith: 0,
              boosters: { shardslvl: 1 },
            },
          },
        },
        { new: true, upsert: true }
      );
    }

    res.status(200).json({ message: "Tap session has started." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimTapSession = async (req, res) => {
  try {
    const secretKey = config.security.HASH_KEY;
    const userId = req.user;
    const hashedData = req.body.data;
    const decryptedData = CryptoJs.AES.decrypt(hashedData, secretKey);
    let { taps, minionTaps, mythologyName, bubbleSession } = JSON.parse(
      decryptedData.toString(CryptoJs.enc.Utf8)
    );

    // get mythDta
    const userMythology = (await userMythologies.findOne({
      userId: userId,
    })) as IUserMyths;

    if (!userMythology) {
      return res.status(404).json({ message: "User mythology not found." });
    }

    const mythData = userMythology.mythologies.find(
      (item) => item.name === mythologyName
    ) as IMyth;

    if (!mythData) {
      return res.status(404).json({ message: "Mythology not found." });
    }

    // check if session is valid
    if (mythData.tapSessionStartTime < mythData.lastTapAcitivityTime) {
      return res.status(400).json({ message: "Tap session has not started." });
    }

    let totalTaps = taps - minionTaps;

    // calculate energy
    const restoredEnergy = calculateEnergy(
      mythData.tapSessionStartTime,
      mythData.lastTapAcitivityTime,
      mythData.energy,
      mythData.energyLimit
    );

    // check if numberOfTaps are valid
    if (restoredEnergy < totalTaps) {
      totalTaps = restoredEnergy;
    }

    // update energy after tapping, shards, lastTapActivityTime
    const updatedEnergy = restoredEnergy - totalTaps;
    let updatedShards =
      taps * mythData.boosters.shardslvl +
      minionTaps * mythData.boosters.shardslvl * 2;

    // update myth shards
    mythData.shards += updatedShards;

    // define flags
    let blackOrbs = 0;
    let blackOrbPhaseBonus = 1;
    const currPhase = getPhaseByDate(new Date());

    if (currPhase === 4) {
      blackOrbPhaseBonus = 2;
    }

    // update shards
    if (mythData.shards >= 1000) {
      mythData.orbs += Math.floor(mythData.shards / 1000);
      mythData.shards = mythData.shards % 1000;
    }

    // update orbs
    if (mythData.orbs >= 1000) {
      mythData.boosters.isBurstActive = true;
      blackOrbs += Math.floor(mythData.orbs / 1000) * blackOrbPhaseBonus;
      mythData.orbs = mythData.orbs % 1000;
    }

    mythData.lastTapAcitivityTime = Date.now();
    mythData.energy = updatedEnergy;

    // maintain transaction
    const newShardTransaction = new ShardsTransactions({
      userId: userId,
      source: "game",
      shards: updatedShards,
    });
    await newShardTransaction.save();

    // return status and update User
    const updatedUserMythology = await userMythologies.findOneAndUpdate(
      { userId: userId, "mythologies.name": mythologyName },
      {
        $set: {
          "mythologies.$": mythData,
        },
        $inc: {
          blackOrbs: blackOrbs,
        },
      },
      { new: true }
    );

    if (bubbleSession && bubbleSession.holdDuration >= 2) {
      const userMilestones = await milestones.findOne({ userId });

      // Find the first matching partner
      const partnerExists = userMilestones.rewards.claimedRewards.find(
        (item) => item.partnerId === bubbleSession.partnerId
      );

      const fiveMinutesInMs = 2 * 60 * 1000;

      if (
        partnerExists &&
        userMilestones.rewards.updatedAt <= Date.now() - fiveMinutesInMs
      ) {
        // if partner exists update tokensCollected
        if (partnerExists.tokensCollected < 12) {
          await milestones.findOneAndUpdate(
            {
              userId,
              "rewards.claimedRewards.partnerId": bubbleSession.partnerId,
            },
            {
              $set: { "rewards.updatedAt": bubbleSession.lastClaimedAt },
              $push: { "rewards.rewardsInLastHr": bubbleSession.partnerId },
              $inc: { "rewards.claimedRewards.$.tokensCollected": 1 },
            },
            {
              new: true,
            }
          );
        }
      } else {
        // add new partner
        await milestones.findOneAndUpdate(
          { userId },
          {
            $set: {
              "rewards.updatedAt": Date.now(),
            },
            $push: {
              "rewards.rewardsInLastHr": bubbleSession.partnerId,
              "rewards.claimedRewards": {
                partnerId: bubbleSession.partnerId,
                type: bubbleSession.type,
                isClaimed: false,
                tokensCollected: 1,
              },
            },
          },
          { new: true }
        );
      }
    }

    if (!updatedUserMythology) {
      return res.status(500).json({ message: "Failed to update mythology." });
    }

    res.status(200).json({ message: "Tap session shards claimed." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getGameStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;

    // Execute the aggregation pipeline
    const userGameStats = await fetchUserGameStats(userId);

    if (!userGameStats || userGameStats.length === 0) {
      return res.status(404).json({ message: "User game stats not found" });
    }

    const userMythologiesData = userGameStats[0];

    // Calculate and update energy for each mythology
    const updatedData = updateMythologies(
      userMythologiesData.userMythologies[0].mythologies
    );
    const updatedMythologies = updatedData.data;
    let blackOrbs = updatedData.updatedBlackOrb;

    // Add missing mythologies with default values
    const existingNames = updatedMythologies.map((myth) => myth.name);
    const missingMythologies = defaultMythologies.filter(
      (defaultMyth) => !existingNames.includes(defaultMyth.name)
    );
    const completeMythologies = [...updatedMythologies, ...missingMythologies];

    // Remove id from each mythology
    completeMythologies.forEach((mythology) => {
      delete mythology._id;
    });

    // update latest data
    await userMythologies.updateOne(
      { userId },
      {
        $inc: { blackOrbs: blackOrbs },
        $set: { mythologies: completeMythologies },
      }
    );

    // get ranks
    let userRank = await ranks.findOne({ userId: req.user._id });
    if (!userRank) {
      const totalUsers = (await Stats.find()) as any;
      userRank = { overallRank: totalUsers[0]?.totalUsers && 0 } as any;
    }

    const isEligibleToClaim = await checkBonus(user);
    const isStreakActive = await checkStreakIsActive(
      user.lastLoginAt || 0,
      user.bonus.fof.streakBonus.claimedAt
    );

    const hasPlaysuperExpired = await checkPlaysuperExpiry(user.playsuper);

    const updates: Partial<IUser> = {};

    if (isEligibleToClaim) {
      updates["bonus.fof.exploitCount"] = 0;
    }

    if (isStreakActive && !user.bonus.fof.streakBonus.isActive) {
      updates["bonus.fof.streakBonus.isActive"] = true;
    }

    // track daily login
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const lastLoginDate = new Date(user.lastLoginAt || 0);
    lastLoginDate.setHours(0, 0, 0, 0);

    // if not consecutive day - reset streak
    const differenceInDays =
      (now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24);

    if (differenceInDays > 1) {
      updates["bonus.fof.streakBonus.streakCount"] = 1;
    }

    if (lastLoginDate.getTime() !== now.getTime()) {
      updates["lastLoginAt"] = new Date();
    }

    if (user.playsuper.isVerified && hasPlaysuperExpired) {
      user.playsuper.isVerified = false;
      updates.playsuper = {
        isVerified: false,
        key: null,
        createdAt: null,
      };
    }

    if (Object.keys(updates).length > 0) {
      await User.findOneAndUpdate({ _id: req.user._id }, { $set: updates });
    }

    // get totalMembers
    const squadOwner = user.squadOwner ? user.squadOwner : userId;
    const members = await Team.findOne({ owner: squadOwner });
    const memberData = {
      overallRank: userRank?.overallRank ?? 0,
      squadRank: userRank?.squadRank ?? 0,
      totalOrbs: userRank?.totalOrbs ?? 0,
      squadCount: members?.members.length ?? 0,
      squadTotalOrbs: members?.totalOrbs ?? 0,
    };

    const userData = {
      telegramUsername: user.telegramUsername,
      tonAddress: user.tonAddress,
      isPremium: user.isPremium,
      avatarUrl: user.profile.avatarUrl,
      directReferralCount: user.directReferralCount,
      premiumReferralCount: user.premiumReferralCount,
      referralCode: user.referralCode,
      isEligibleToClaim: isEligibleToClaim,
      isStreakActive: isStreakActive,
      streakCount: user.bonus.fof.streakBonus.streakCount,
      joiningBonus: user.bonus.fof.joiningBonus,
      isPlaySuperVerified: user.playsuper.isVerified,
      country: user.country ?? "NA",
      ...memberData,
    };

    const otherQuest = userMythologiesData.quests
      .filter((item) => item.mythology === "Other")
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    const quests = userMythologiesData.quests
      .filter((item) => item.mythology !== "Other")
      .map((quest) => ({
        ...quest,
        isQuestClaimed:
          quest.isQuestClaimed !== undefined ? quest.isQuestClaimed : false,
      }));

    const completedQuests = quests.filter(
      (item) => item.isQuestClaimed === true && !item.isKeyClaimed
    );
    const towerKeys = completedQuests.map((item) => {
      const indexes = Object.keys(item.requiredOrbs)
        .map((myth) => {
          const index = mythOrder.indexOf(myth);
          const count = item.requiredOrbs[myth];

          return index.toString().repeat(count);
        })
        .join("");

      return indexes;
    });

    res.status(200).json({
      user: userData,
      stats: {
        multiColorOrbs: userMythologiesData.userMythologies[0].multiColorOrbs,
        blackOrbs: userMythologiesData.userMythologies[0].blackOrbs,
        whiteOrbs: userMythologiesData.userMythologies[0].whiteOrbs,
        isAutoPayActive:
          userMythologiesData.userMythologies[0].autoPay
            ?.isAutomataAutoPayEnabled ?? false,
        autoPayExpiry:
          userMythologiesData.userMythologies[0].autoPay
            ?.automataAutoPayExpiration ?? 0,
        mythologies: completeMythologies.sort(
          (a, b) => mythOrder.indexOf(a.name) - mythOrder.indexOf(b.name)
        ),
      },
      quests: quests,
      extraQuests: otherQuest,
      towerKeys: towerKeys,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimShardsBooster = async (req, res) => {
  try {
    const userId = req.user;

    const userMyth = req.userMyth;

    userMyth.boosters.shardslvl += 1;
    userMyth.boosters.isShardsClaimActive = false;
    userMyth.boosters.shardsLastClaimedAt = Date.now();

    const updatedMythData = (await userMythologies
      .findOneAndUpdate(
        { userId, "mythologies.name": userMyth.name },
        { $inc: { multiColorOrbs: -1 }, $set: { "mythologies.$": userMyth } },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt")) as Document;

    const updatedBoosterData = updatedMythData.mythologies.filter(
      (item) => item.name === userMyth.name
    )[0].boosters;

    // maintain transaction
    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "boosters",
      orbs: { MultiOrb: 1 },
    });
    await newOrbsTransaction.save();

    res.status(200).json({
      message: "Booster claimed successfully.",
      updatedBooster: updatedBoosterData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimAutomata = async (req, res) => {
  try {
    const { user, userMyth, mythData } = req;
    const now = Date.now();
    let enableAutoPay = mythData.autoPay;

    userMyth.boosters.automatalvl += 1;
    userMyth.boosters.isAutomataActive = true;
    userMyth.boosters.automataLastClaimedAt = now;
    userMyth.boosters.automataStartTime = now;

    if (!mythData.autoPay.isAutomataAutoPayEnabled) {
      const automataStartTimes = getAutomataStartTimes(mythData.mythologies);

      automataStartTimes.push(now);
      if (isWithinOneMinute(automataStartTimes)) {
        enableAutoPay.isAutomataAutoPayEnabled = true;
      }
    }

    if (enableAutoPay.automataAutoPayExpiration <= now) {
      enableAutoPay.automataAutoPayExpiration = now;
    }

    const updatedMythData = await userMythologies
      .findOneAndUpdate(
        { userId: user, "mythologies.name": userMyth.name },
        {
          $inc: { multiColorOrbs: -1 },
          $set: {
            "mythologies.$": userMyth,
            "autoPay.isAutomataAutoPayEnabled":
              enableAutoPay.isAutomataAutoPayEnabled,
            "autoPay.automataAutoPayExpiration": now,
          },
        },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt -_id");

    const updatedBoosterData = updatedMythData.mythologies.find(
      (item) => item.name === userMyth.name
    ).boosters;

    await new OrbsTransactions({
      userId: user,
      source: "automata",
      orbs: { MultiOrb: 1 },
    }).save();

    res.status(200).json({
      message: "Automata claimed successfully.",
      updatedBooster: updatedBoosterData,
    });
  } catch (error) {
    console.error("Claim automata error:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimAutoAutomata = async (req, res) => {
  try {
    const { user, mythData } = req;
    const now = Date.now();

    mythData.mythologies.forEach((mythology) => {
      mythology.boosters.automatalvl += 1;
      mythology.boosters.isAutomataActive = true;
      mythology.boosters.automataLastClaimedAt = now;
      mythology.boosters.automataStartTime = now;
    });

    await userMythologies
      .findOneAndUpdate(
        { userId: user._id },
        {
          $inc: { multiColorOrbs: -3 },
          $set: {
            mythologies: mythData.mythologies,
            "autoPay.automataAutoPayExpiration": now,
          },
        },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt -_id");

    await new OrbsTransactions({
      userId: user,
      source: "automata",
      orbs: { MulitOrb: 3 },
    }).save();

    res.status(200).json({
      message: "Automata claimed successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimBurst = async (req, res) => {
  try {
    const userId = req.user._id;
    const userMyth = req.userMyth;

    userMyth.boosters.burstlvl += 1;
    userMyth.boosters.isBurstActive = true;
    userMyth.boosters.isBurstActiveToClaim = false;
    userMyth.boosters.burstActiveAt = Date.now();

    const updatedMythData = (await userMythologies
      .findOneAndUpdate(
        { userId, "mythologies.name": userMyth.name },
        { $inc: { multiColorOrbs: -3 }, $set: { "mythologies.$": userMyth } },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt _id")) as Document;

    const updatedBoosterData = updatedMythData.mythologies.filter(
      (item) => item.name === userMyth.name
    )[0].boosters;

    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "burst",
      orbs: { MulitOrb: 3 },
    });

    await newOrbsTransaction.save();

    res.status(200).json({
      message: "Burst claimed successfully.",
      updatedBooster: updatedBoosterData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const convertOrbs = async (req, res) => {
  try {
    const userId = req.user._id;
    const userMyth = req.userMyth;
    const isValidKey = req.isValidKey;
    const { mythologyName, convertedOrbs } = req.body;
    const currPhase = getPhaseByDate(new Date());
    let blackOrbPhaseBonus = 1;
    let phaseBonus = 1;

    if (mythOrder[currPhase] === mythologyName) {
      phaseBonus = 2;
    } else if (currPhase === 4) {
      blackOrbPhaseBonus = 2;
    }

    let updatedMultiOrbs = (convertedOrbs / (isValidKey ? 1 : 2)) * phaseBonus;
    let blackOrbs = 0;

    if (userMyth.multiColorOrbs + updatedMultiOrbs >= 500) {
      blackOrbs += Math.floor(updatedMultiOrbs / 500) * blackOrbPhaseBonus;
      updatedMultiOrbs = updatedMultiOrbs % 500;
    }

    await userMythologies.updateOne(
      { userId: userId, "mythologies.name": mythologyName },
      {
        $inc: {
          blackOrbs: blackOrbs,
          multiColorOrbs: updatedMultiOrbs,
          "mythologies.$.orbs": -1 * convertedOrbs,
        },
      }
    );

    if (isValidKey) {
      await milestones.findOneAndUpdate(
        {
          userId: userId,
          "claimedQuests.taskId": isValidKey,
        },
        { $set: { "claimedQuests.$.isKeyClaimed": true } }
      );
    }

    // maintain transaction
    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "conversion",
      orbs: { [mythologyName]: convertedOrbs },
    });
    await newOrbsTransaction.save();

    res.status(200).json({ message: "Orbs converted successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimStarBonus = async (req, res) => {
  try {
    const userId = req.user._id;
    const userMyth = req.userMyth;
    const { session } = req.body;

    const holdTimeInSession =
      Math.round(session / 10) > 9 ? 9 : Math.round(session / 10);

    const updatedOrbs = holdTimeInSession * userMyth.boosters.burstlvl;

    userMyth.boosters.isBurstActive = false;
    userMyth.orbs += updatedOrbs;

    if (userMyth.isEligibleForBurst === true) {
      await userMythologies.findOneAndUpdate(
        { userId: userId, "mythologies.name": userMyth.name },
        {
          $set: { "mythologies.$": userMyth },
        }
      );
    } else {
      userMyth.boosters.isBurstActiveToClaim = true;
      userMyth.isEligibleForBurst = true;
      userMyth.boosters.burstActiveAt = Date.now();

      await userMythologies.findOneAndUpdate(
        { userId: userId, "mythologies.name": userMyth.name },
        {
          $set: { "mythologies.$": userMyth },
        }
      );
    }

    res.status(200).json({ message: "Star bonus claimed" });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateGameData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mythologyName } = req.query;

    const userMythologiesData = (await userMythologies.findOne({
      userId,
    })) as IUserMyths;

    let blackOrbs = 0;
    const updatedMythology = userMythologiesData.mythologies.map(
      (mythology) => {
        if (mythology.name === mythologyName) {
          const restoredEnergy = calculateEnergy(
            Date.now(),
            mythology.lastTapAcitivityTime,
            mythology.energy,
            mythology.energyLimit
          );

          // Validate boosters
          mythology.boosters = validateBooster(mythology.boosters);
          if (mythology.boosters.isAutomataActive) {
            mythology = validateAutomata(mythology);
          }
          mythology.energy = restoredEnergy;
          mythology.lastTapAcitivityTime = Date.now();

          if (mythology.shards >= 1000) {
            mythology.orbs += Math.floor(mythology.shards / 1000);
            mythology.shards = mythology.shards % 1000;
          }

          if (mythology.orbs >= 1000) {
            blackOrbs += Math.floor(mythology.orbs / 1000);
            mythology.orbs = mythology.orbs % 1000;
            mythology.boosters.isBurstActive = true;
            mythology.boosters.burstActiveAt = Date.now();
          }
        }

        return mythology;
      }
    );

    let requestedMyth = updatedMythology.find(
      (item) => item.name === mythologyName
    ) as IMyth;

    await userMythologies.findOneAndUpdate(
      { userId: userId, "mythologies.name": mythologyName },
      {
        $set: { "mythologies.$": requestedMyth },
        $inc: { blackOrbs: blackOrbs },
      }
    );

    res.status(200).json({ message: "Mythology Updated Successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
