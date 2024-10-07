import { calculateEnergy } from "../utils/helpers/game.helpers";
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
} from "../services/game.services";
import { defaultMythologies } from "../utils/constants/variables";
import { Document } from "mongodb";
import ranks from "../models/ranks.models";
import { Team } from "../models/referral.models";
import Stats from "../models/Stats.models";
import { checkBonus } from "../services/general.services";
import { mythOrder } from "../utils/constants/variables";
import milestones from "../models/milestones.models";
import User from "../models/user.models";

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
    const userId = req.user;
    let { taps, minionTaps, mythologyName, bubbleSession } = req.body;

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

    // update shards
    if (mythData.shards >= 1000) {
      mythData.orbs += Math.floor(mythData.shards / 1000);
      mythData.shards = mythData.shards % 1000;
    }

    // update orbs
    if (mythData.orbs >= 1000) {
      mythData.boosters.isBurstActive = true;
      blackOrbs += Math.floor(mythData.orbs / 1000);
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
      //! Enable it
      const fiveMinutesInMs = 5 * 60 * 1000;

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

    if (isEligibleToClaim) {
      await User.findOneAndUpdate({ userId }, { $set: { exploitCount: 0 } });
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
      profile: user.profile,
      isPremium: user.isPremium,
      directReferralCount: user.directReferralCount,
      premiumReferralCount: user.premiumReferralCount,
      referralCode: user.referralCode,
      isEligibleToClaim: false,
      joiningBonus: user.joiningBonus,
      isPlaySuperVerified: user.playsuper.isVerified,
      ...memberData,
    };

    // const lostQuests = await unClaimedQuests(userId);

    const otherQuest = userMythologiesData.quests.filter(
      (item) => item.mythology === "Other"
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
        .map((myth) => mythOrder.indexOf(myth))
        .join("");

      return indexes;
    });

    res.status(200).json({
      user: userData,
      stats: {
        multiColorOrbs: userMythologiesData.userMythologies[0].multiColorOrbs,
        blackOrbs: userMythologiesData.userMythologies[0].blackOrbs,
        whiteOrbs: userMythologiesData.userMythologies[0].whiteOrbs,
        mythologies: completeMythologies.sort(
          (a, b) => mythOrder.indexOf(a.name) - mythOrder.indexOf(b.name)
        ),
      },
      quests: quests,
      extraQuests: otherQuest,
      towerKeys: towerKeys,
      // lostQuests: lostQuests,
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

    userMyth.boosters.shardsPaylvl += 1;
    userMyth.boosters.shardslvl = userMyth.boosters.shardsPaylvl;
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

    //!TODO: use select instead of doing this
    // const { _id, createdAt, updatedAt, __v, ...cleanedData } = updatedMythData;
    // cleanedData.mythologies = cleanedData.mythologies.map(
    //   ({ _id, ...rest }) => rest
    // );

    // delete cleanedData.userId;

    // maintain transaction
    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "boosters",
      orbs: { [userMyth.name]: 1 },
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
    const userId = req.user;
    const userMyth = req.userMyth;

    userMyth.boosters.automataPaylvl += 1;
    userMyth.boosters.automatalvl = userMyth.boosters.automataPaylvl;
    userMyth.boosters.isAutomataActive = true;
    userMyth.boosters.automataLastClaimedAt = Date.now();
    userMyth.boosters.automataStartTime = Date.now();

    const updatedMythData = (await userMythologies
      .findOneAndUpdate(
        { userId, "mythologies.name": userMyth.name },
        { $inc: { multiColorOrbs: -1 }, $set: { "mythologies.$": userMyth } },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt _id")) as Document;

    const updatedBoosterData = updatedMythData.mythologies.filter(
      (item) => item.name === userMyth.name
    )[0].boosters;

    // maintain transaction
    const newOrbsTransaction = new OrbsTransactions({
      userId: userId,
      source: "automata",
      orbs: { [userMyth.name]: 1 },
    });
    await newOrbsTransaction.save();

    res.status(200).json({
      message: "Automata claimed successfully.",
      updatedBooster: updatedBoosterData,
    });
  } catch (error) {
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
      orbs: { [userMyth.name]: 3 },
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

    let updatedMultiOrbs = convertedOrbs / (isValidKey ? 1 : 2);
    let blackOrbs = 0;

    if (userMyth.multiColorOrbs + updatedMultiOrbs >= 500) {
      blackOrbs += Math.floor(updatedMultiOrbs / 500);
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

    const multiplier =
      userMyth.burstlvl +
      (!userMyth.boosters.isShardsClaimActive
        ? userMyth.boosters.shardslvl
        : 0) +
      (userMyth.boosters.isAutomataActive ? userMyth.boosters.automatalvl : 0);

    const updatedShards = holdTimeInSession * 99 * multiplier;

    userMyth.boosters.isBurstActive = false;
    userMyth.shards += updatedShards;

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
      userMyth.burstActiveAt = Date.now();

      await userMythologies.findOneAndUpdate(
        { userId: userId, "mythologies.name": userMyth.name },
        {
          $set: { "mythologies.$": userMyth },
        }
      );
    }

    res.status(200).json({ message: "Star bonus claimed" });
  } catch (error) {
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
