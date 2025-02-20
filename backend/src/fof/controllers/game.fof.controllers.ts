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
import milestones from "../../common/models/milestones.models";
import { decryptHash } from "../../helpers/crypt.helpers";
import { filterAllQuests } from "../../helpers/quests.helpers";
import {
  checkAutomataStatus,
  validateBooster,
} from "../../helpers/booster.helpers";
import { IMyth, IUserMyths } from "../../ts/models.interfaces";

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
    const userId = req.user;
    let { taps, minionTaps, mythologyName, bubbleSession } = await decryptHash(
      req.body.data
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
      await updateSessionData(mythData, userMythology, taps, minionTaps);

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
    const user = req.user;

    // Execute the aggregation pipeline
    const userGameStats = await aggregateGameStats(userId);

    if (!userGameStats || userGameStats.length === 0) {
      return res.status(404).json({ message: "Failed to fetch user gamedata" });
    }

    // update mythologies data
    const userMythologiesData = userGameStats[0];
    const { completeMythologies, isAutoAutomataActive } =
      await updateMythologyData(userMythologiesData, userId);

    // get ranks
    let userRank = await ranks.findOne({ userId: req.user._id });
    if (!userRank) {
      const totalUsers = (await Stats.find()) as any;
      userRank = { overallRank: totalUsers[0]?.totalUsers && 0 } as any;
    }

    const isStreakActive = await checkStreakIsActive(
      user.lastLoginAt || 0,
      user.bonus.fof.streakBonus.claimedAt
    );
    // is sligible for gacha
    const isEligibleToClaim = await checkBonus(user);
    const memberData = {
      overallRank: userRank?.overallRank ?? 0,
      totalOrbs: userRank?.totalOrbs ?? 0,
    };

    // update userdata
    await updateUserData(user, memberData, isEligibleToClaim, isStreakActive);

    const userData = {
      telegramUsername: user.telegramUsername,
      tonAddress: user.tonAddress,
      isPremium: user.isPremium,
      avatarUrl: user.profile.avatarUrl,
      directReferralCount: user.directReferralCount,
      premiumReferralCount: user.premiumReferralCount,
      referralCode: user.referralCode,
      showFinishRwrd:
        user.gameCompletedAt.hasClaimedFoFRwrd === false &&
        user.gameCompletedAt.fof
          ? true
          : false,
      isEligibleToClaim: isEligibleToClaim,
      isStreakActive: isStreakActive,
      streakCount: user.bonus.fof.streakBonus.streakCount,
      joiningBonus: user.bonus.fof.joiningBonus,
      isPlaySuperVerified: user.playsuper.isVerified,
      stakeOn: user.userBetAt ? user.userBetAt[0] : null,
      stakeReward: user.bonus.fof.extraBlackOrb,
      country: user.country ?? "NA",
      ...memberData,
    };
    const gameData = {
      isMoonActive: userMythologiesData.userMythologies[0].lastMoonClaimAt
        ? hasBeenFourDaysSinceClaimedUTC(
            userMythologiesData.userMythologies[0].lastMoonClaimAt
          )
        : false,
      moonExpiresAt: userMythologiesData.userMythologies[0].lastMoonClaimAt,
      multiColorOrbs: userMythologiesData.userMythologies[0].multiColorOrbs,
      blackOrbs: userMythologiesData.userMythologies[0].blackOrbs,
      whiteOrbs: userMythologiesData.userMythologies[0].whiteOrbs,
      isEligibleToAutomataAuto:
        userMythologiesData.userMythologies[0].autoPay
          ?.isAutomataAutoPayEnabled ?? false,
      isAutomataAutoActive: isAutoAutomataActive,
      isBurstAutoPayActive:
        userMythologiesData.userMythologies[0].autoPay?.isBurstAutoPayEnabled ??
        false,
      autoPayBurstExpiry:
        userMythologiesData.userMythologies[0].autoPay
          ?.burstAutoPayExpiration ?? 0,

      mythologies: completeMythologies.sort(
        (a, b) => mythOrder.indexOf(a.name) - mythOrder.indexOf(b.name)
      ),
    };

    const { otherQuests, mythologyQuests, towerKeys } = await filterAllQuests(
      userMythologiesData.quests
    );

    res.status(200).json({
      user: userData,
      stats: gameData,
      quests: mythologyQuests,
      extraQuests: otherQuests,
      towerKeys: towerKeys,
    });
  } catch (error) {
    console.log(error);

    console.log(error.message);
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
            mythology = checkAutomataStatus(mythology);
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

// announcement functions
// export const claimAutomataReward = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = req.user;

//     await userMythologies
//       .findOneAndUpdate(
//         { userId: userId },
//         {
//           $set: {
//             "autoPay.isBurstAutoPayEnabled": true,
//             "autoPay.burstAutoPayExpiration": 0,
//           },
//         }
//       )
//       .select("-__v -createdAt -updatedAt -_id");

//     await user.updateOne({ announcements: 1 });

//     res.status(200).json({ message: "Reward claimed successfully." });
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };

// export const claimGachaReward = async (req, res) => {
//   try {
//     const user = req.user;

//     await user.updateOne({ "bonus.fof.dailyBonusClaimedAt": 0 });

//     res.status(200).json({
//       message: "Gacha claimed successfully.",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };
