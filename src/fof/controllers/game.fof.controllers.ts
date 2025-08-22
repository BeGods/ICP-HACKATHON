import {
  calculateEnergy,
  getPhaseByDate,
  hasBeenFourDaysSinceClaimedUTC,
} from "../../helpers/game.helpers";
import userMythologies from "../../common/models/mythologies.models";
import {
  OrbsTransactions,
  ShardsTransactions,
} from "../../common/models/transactions.models";
import {
  aggregateGameStats,
  checkStreakIsActive,
  filterDataByMyth,
  updateSessionData,
  updateBubbleData,
  updateMythologyData,
  updateUserData,
} from "../services/game.fof.services";
import ranks from "../../common/models/ranks.models";
import Stats from "../../common/models/Stats.models";
import { checkBonus } from "../services/general.fof.services";
import { mythOrder } from "../../utils/constants/variables";
import { decryptHash } from "../../helpers/crypt.helpers";
import { filterAllQuests } from "../../helpers/quests.helpers";
import {
  checkAutomataStatus,
  validateBooster,
} from "../../helpers/booster.helpers";
import { IMyth, IUserMyths } from "../../ts/models.interfaces";
import { validStreakReward } from "../../helpers/streak.helpers";
import { IUserData } from "../../ts/objects.interfaces";
import { fofGameData } from "../../common/models/game.model";

// start tap session
export const startGameSession = async (req, res) => {
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

    res.status(200).json({ message: "Session started." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to start session.",
      error: error.message,
    });
  }
};

// claim tap session
export const updateGameSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;
    let { taps, minionTaps, mythologyName, bubbleSession } = await decryptHash(
      req.body.data
    );
    const userGameData = await fofGameData.findOne({ userId: userId });
    const streakMultipier = validStreakReward(
      "alchemist",
      userGameData.streak.count,
      userGameData.streak.claimedAt,
      userGameData.streak.lastMythClaimed == mythologyName
    );

    // get mythDta
    const { mythData, userMythology } = await filterDataByMyth(
      mythologyName,
      userId
    );

    // check if session is valid
    if (mythData.tapSessionStartTime < mythData.lastTapAcitivityTime) {
      return res
        .status(400)
        .json({ message: "Invalid session. Session not started." });
    }

    const { updatedMythData, blackOrbs, updatedShards } =
      await updateSessionData(
        mythData,
        userMythology,
        taps,
        minionTaps,
        streakMultipier
      );

    // return status and update User
    const updatedUserMythology = await userMythologies.findOneAndUpdate(
      { userId: userId, "mythologies.name": mythologyName },
      {
        $set: {
          "mythologies.$": updatedMythData,
        },
        $inc: {
          blackOrbs: blackOrbs,
        },
      },
      { new: true }
    );

    if (bubbleSession && bubbleSession.holdDuration >= 2) {
      await updateBubbleData(userId, bubbleSession);
    }

    // maintain transaction
    const newShardTransaction = new ShardsTransactions({
      userId: userId,
      source: "game",
      shards: updatedShards,
    });
    await newShardTransaction.save();

    if (!updatedUserMythology) {
      return res.status(500).json({ message: "Failed to update mythology." });
    }

    res.status(200).json({ message: "Session data claimed successfully." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update game session.",
      error: error.message,
    });
  }
};

// stats
export const getGameStats = async (req, res) => {
  try {
    const userId = req.user._id;
    let user = req.user;

    // fetch quests, game data
    const userGameStats = await aggregateGameStats(userId);

    if (!userGameStats || userGameStats.length === 0) {
      return res.status(404).json({ message: "Failed to fetch user gamedata" });
    }

    // update mythologies data
    let userMythologiesData = userGameStats.userMythologies[0];
    let userQuests = userGameStats.quests;
    let userGameData = userGameStats.userGameData[0];
    const { completeMythologies, isAutoAutomataActive } =
      await updateMythologyData(userId, userMythologiesData, userGameData);

    // get ranks
    let userRank = await ranks.findOne({ userId: req.user._id });
    if (!userRank) {
      const totalUsers = await Stats.findOne({ statId: "fof" });
      userRank = { orbRank: totalUsers?.totalUsers && 0 } as any;
    }

    // is sligible for gacha
    const isEligibleToClaim = await checkBonus(userGameData);
    const memberData = {
      orbRank: userRank?.orbRank ?? 0,
      referRank: userRank?.referRank ?? 0,
      totalOrbs: userRank?.totalOrbs ?? 0,
      countryRank: userRank?.countryRank ?? 0,
    };

    // update userdata
    let { updatedGameData, updatedUser } = await updateUserData(
      user,
      isEligibleToClaim,
      userGameData
    );
    userGameData = updatedGameData;
    user = updatedUser;

    // flag only to show the claim screen
    const isStreakActive = await checkStreakIsActive(
      user.lastLoginAt,
      userGameData.streak.claimedAt,
      userGameData.streak.count
    );

    let userData: IUserData = {
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
      showFinishRwrd:
        user.gameCompletedAt.hasClaimedFoFRwrd === false &&
        user.gameCompletedAt.fof
          ? true
          : false,
      isEligibleToClaim: isEligibleToClaim,
      streak: {
        isStreakActive: isStreakActive,
        streakCount: userGameData.streak.count,
        lastMythClaimed: userGameData.streak.lastMythClaimed,
      },
      joiningBonus: userGameData.joiningBonus,
      stakeOn: user.userBetAt ? user.userBetAt[0] : null,
      stakeReward: userGameData.extraBlackOrb,
      country: user.country ?? "NA",
      holdings: user.holdings ?? { stars: 0, usdt: 0, kaia: 0 },
      ...memberData,
    };

    if (user.oneWaveId) {
      userData.isOneWaveUser = true;
    }
    const gameData = {
      isMoonActive: userGameData.lastMoonClaimAt
        ? hasBeenFourDaysSinceClaimedUTC(userGameData.lastMoonClaimAt)
        : false,
      moonExpiresAt: userGameData.lastMoonClaimAt,
      multiColorOrbs: userMythologiesData.multiColorOrbs,
      blackOrbs: userMythologiesData.blackOrbs,
      whiteOrbs: userMythologiesData.whiteOrbs,
      isEligibleToAutomataAuto: userGameData?.isAutomataAutoPayEnabled ?? false,
      isAutomataAutoActive: isAutoAutomataActive,
      isBurstAutoPayActive: userGameData?.isBurstAutoPayEnabled ?? false,
      autoPayBurstExpiry: userGameData?.burstAutoPayExpiration ?? 0,
      mythologies: completeMythologies.sort(
        (a, b) => mythOrder.indexOf(a.name) - mythOrder.indexOf(b.name)
      ),
    };

    const { otherQuests, mythologyQuests, towerKeys } =
      filterAllQuests(userQuests);

    res.status(200).json({
      user: userData,
      stats: gameData,
      quests: mythologyQuests,
      extraQuests: otherQuests,
      towerKeys: towerKeys,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch game data.",
      error: error.message,
    });
  }
};

// orb conversion
export const convertOrbs = async (req, res) => {
  try {
    const userId = req.user._id;
    const userMyth = req.userMyth;
    const isValidKey = req.isValidKey;
    const { mythologyName, convertedOrbs } = req.body;
    const currPhase = getPhaseByDate(new Date());
    let blackOrbPhaseBonus = 1;
    let phaseBonus = 1;

    if (!hasBeenFourDaysSinceClaimedUTC(Date.now())) {
      blackOrbPhaseBonus = 1;
      phaseBonus = 1;
    } else if (mythOrder[currPhase] === mythologyName) {
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
      await fofGameData.findOneAndUpdate(
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
      message: "Failed to convert orbs.",
      error: error.message,
    });
  }
};

// refresh stats
export const updateGameData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mythologyName } = req.query;
    const userGameData = req.fofGameData;

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
            mythology = checkAutomataStatus(mythology, userGameData);
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
      message: "Failed to update game data.",
      error: error.message,
    });
  }
};

// update rat
export const updateRatData = async (req, res) => {
  try {
    const userId = req.user._id;
    const userMyth = req.userMyth;
    const { deduct } = req.body;

    userMyth.boosters.rats.count -= 1;

    if (deduct) {
      userMyth.boosters.automatalvl -= 1;
    }

    await userMythologies.findOneAndUpdate(
      { userId: userId, "mythologies.name": userMyth.name },
      {
        $set: { "mythologies.$": userMyth },
      }
    );

    res.status(200).json({
      message: "Rat claimed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update rat data.",
      error: error.message,
    });
  }
};

// update star status
export const updateStarStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;
    const userMyth = req.userMyth;
    const { session } = req.body;
    const userGameData = await fofGameData.findOne({ userId: userId });
    const streakMultipier = validStreakReward(
      "burst",
      userGameData.streak.count,
      userGameData.streak.claimedAt,
      userGameData.streak.lastMythClaimed == userMyth.name
    );

    const holdTimeInSession =
      Math.round(session / 10) > 9 ? 9 : Math.round(session / 10);

    const burstlvl = Math.round(userMyth.boosters.burstlvl * streakMultipier);

    const updatedOrbs = holdTimeInSession * burstlvl;

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

    const newOrbTransaction = new OrbsTransactions({
      userId: userId,
      source: "star",
      orbs: {
        [userMyth.name]: updatedOrbs,
      },
    });
    await newOrbTransaction.save();

    res.status(200).json({ message: "Star bonus claimed" });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update star status.",
      error: error.message,
    });
  }
};
