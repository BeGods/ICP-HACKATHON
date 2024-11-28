import mongoose from "mongoose";
import {
  calculateAutomataEarnings,
  calculateEnergy,
  getPhaseByDate,
} from "../utils/helpers/game.helpers";
import userMythologies from "../models/mythologies.models";
import config from "../config/config";
const axios = require("axios");

export const fetchUserGameStats = async (userId) => {
  try {
    // Aggregate pipeline
    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "usermythologies",
          localField: "userId",
          foreignField: "userId",
          as: "userMythologies",
        },
      },
      {
        $lookup: {
          from: "quests",
          let: { userId: "$userId" },
          pipeline: [
            {
              $lookup: {
                from: "milestones",
                let: { questId: "$_id", userId: "$$userId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", "$$userId"] },
                          { $in: ["$$questId", "$claimedQuests.taskId"] },
                        ],
                      },
                    },
                  },
                ],
                as: "milestones",
              },
            },
            {
              $addFields: {
                isQuestClaimed: {
                  $cond: {
                    if: { $gt: [{ $size: "$milestones" }, 0] },
                    then: true,
                    else: false,
                  },
                },
              },
            },
            {
              $lookup: {
                from: "milestones",
                let: { questId: "$_id", userId: "$$userId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", "$$userId"] },
                          { $in: ["$$questId", "$sharedQuests"] },
                        ],
                      },
                    },
                  },
                ],
                as: "sharedMilestones",
              },
            },
            {
              $addFields: {
                isShared: {
                  $cond: {
                    if: { $gt: [{ $size: "$sharedMilestones" }, 0] },
                    then: true,
                    else: false,
                  },
                },
              },
            },
            {
              $lookup: {
                from: "milestones",
                let: { questId: "$_id", userId: "$$userId" },
                pipeline: [
                  {
                    $unwind: "$claimedQuests",
                  },
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", "$$userId"] },
                          { $eq: ["$$questId", "$claimedQuests.taskId"] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      orbClaimed: "$claimedQuests.orbClaimed",
                      questClaimed: "$claimedQuests.questClaimed",
                      isKeyClaimed: "$claimedQuests.isKeyClaimed",
                    },
                  },
                ],
                as: "claimedQuestData",
              },
            },
            {
              $addFields: {
                isOrbClaimed: {
                  $arrayElemAt: ["$claimedQuestData.orbClaimed", 0],
                },
                isKeyClaimed: {
                  $arrayElemAt: ["$claimedQuestData.isKeyClaimed", 0],
                },
              },
            },
            { $sort: { createdAt: -1 as -1 } },
            {
              $project: {
                milestones: 0,
                sharedMilestones: 0,
                claimedQuestData: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: "allQuests",
        },
      },
      {
        $addFields: {
          quests: "$allQuests",
        },
      },
      { $project: { allQuests: 0 } },
    ];

    // Execute the aggregation pipeline
    const userGameStats = await userMythologies.aggregate(pipeline);

    return userGameStats;
  } catch (error) {
    throw new Error("There was a problem fetching user data.");
  }
};

export const validateBooster = (boosters) => {
  try {
    const timeLapsed = Date.now() - boosters.shardsLastClaimedAt;

    if (timeLapsed >= 86400000) {
      // 24 hours
      boosters.isShardsClaimActive = true;
      boosters.shardsLastClaimedAt = 0;
    }
    if (boosters.shardslvl === 99) {
      // level 7
      boosters.shardslvl = 1;
    }

    return boosters;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};

export const validateAutomata = (gameData) => {
  try {
    const timeLapsed = Date.now() - gameData.boosters.automataStartTime;

    if (timeLapsed >= 86400000) {
      // 24 hours
      gameData.boosters.isAutomataActive = false;
      gameData.boosters.automataLastClaimedAt = 0;
      gameData.boosters.automataStartTime = 0;
    }

    if (gameData.boosters.automatalvl === 99) {
      // 48 hours or level 7
      gameData.boosters.automatalvl = 0;
    }

    if (gameData.boosters.isAutomataActive) {
      gameData.shards += calculateAutomataEarnings(
        gameData.boosters.automataLastClaimedAt,
        gameData.boosters.automatalvl
      );

      gameData.boosters.automataLastClaimedAt = Date.now();
    }

    return gameData;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};

export const validateBurst = (gameData) => {
  try {
    const timeLapsed = Date.now() - gameData.boosters.burstActiveAt;

    if (timeLapsed >= 86400000) {
      // 24 hours
      gameData.boosters.isBurstActiveToClaim = true;
      gameData.boosters.isBurstActive = false;
      gameData.boosters.burstActiveAt = 0;
    }

    if (gameData.boosters.burstlvl === 99) {
      // 48 hours or level 7
      gameData.boosters.burstlvl = 1;
    }

    return gameData;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};

export const disableActiveBurst = (mythology) => {
  try {
    const timeLapsed = Date.now() - mythology.burstActiveAt;

    const twelveHours = 12 * 60 * 60 * 1000;

    if (timeLapsed > twelveHours) {
      mythology.isBurstActive = false;
      mythology.burstActiveAt = false;
    }

    return mythology;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};

export const updateMythologies = (mythologies) => {
  try {
    let updatedBlackOrb = 0;

    let blackOrbPhaseBonus = 1;
    const currPhase = getPhaseByDate(new Date());

    if (currPhase === 4) {
      blackOrbPhaseBonus = 2;
    }

    const updatedMythologyData = mythologies.map((mythology) => {
      const restoredEnergy = calculateEnergy(
        Date.now(),
        mythology.lastTapAcitivityTime,
        mythology.energy,
        mythology.energyLimit
      );

      // Validate boosters
      mythology.boosters = validateBooster(mythology.boosters);

      mythology = validateAutomata(mythology);

      if (
        !mythology.boosters.isBurstActiveToClaim &&
        mythology.boosters.burstActiveAt != 0
      ) {
        mythology = validateBurst(mythology);
      }

      // validate burst timeout
      // if (mythology.isBurstActive && mythology.burstActiveAt != 0) {
      //   mythology = disableActiveBurst(mythology);
      // }
      mythology.energy = restoredEnergy;
      mythology.lastTapAcitivityTime = Date.now();

      if (mythology.shards >= 1000) {
        mythology.orbs += Math.floor(mythology.shards / 1000);
        mythology.shards = mythology.shards % 1000;
      }

      if (mythology.orbs >= 1000) {
        updatedBlackOrb +=
          Math.floor(mythology.orbs / 1000) * blackOrbPhaseBonus;
        mythology.orbs = mythology.orbs % 1000;
        mythology.boosters.isBurstActive = true;
      }

      return mythology;
    });

    return {
      data: updatedMythologyData,
      updatedBlackOrb: updatedBlackOrb,
    };
  } catch (error) {
    console.log(error);
    throw new Error("There was a problem updating mythologies");
  }
};

export const fetchUserData = async (userId) => {
  try {
    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "usermythologies",
          localField: "userId",
          foreignField: "userId",
          as: "userMythologies",
        },
      },
      {
        $lookup: {
          from: "quests",
          let: { userId: "$userId" },
          pipeline: [
            {
              $lookup: {
                from: "milestones",
                let: { questId: "$_id", userId: "$$userId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", "$$userId"] },
                          { $in: ["$$questId", "$claimedQuests.taskId"] },
                        ],
                      },
                    },
                  },
                ],
                as: "milestones",
              },
            },
            {
              $addFields: {
                isCompleted: {
                  $cond: {
                    if: { $gt: [{ $size: "$milestones" }, 0] },
                    then: true,
                    else: false,
                  },
                },
              },
            },
            {
              $lookup: {
                from: "milestones",
                let: { questId: "$_id", userId: "$$userId" },
                pipeline: [
                  {
                    $unwind: "$claimedQuests",
                  },
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", "$$userId"] },
                          { $eq: ["$$questId", "$claimedQuests.taskId"] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      orbClaimed: "$claimedQuests.orbClaimed",
                      questClaimed: "$claimedQuests.questClaimed",
                      isKeyClaimed: "$claimedQuests.isKeyClaimed",
                    },
                  },
                ],
                as: "claimedQuestData",
              },
            },
            {
              $addFields: {
                isOrbClaimed: {
                  $arrayElemAt: ["$claimedQuestData.orbClaimed", 0],
                },
                isQuestClaimed: {
                  $arrayElemAt: ["$claimedQuestData.questClaimed", 0],
                },
                isKeyClaimed: {
                  $arrayElemAt: ["$claimedQuestData.isKeyClaimed", 0],
                },
              },
            },
            { $sort: { createdAt: -1 as -1 } },
            {
              $project: {
                milestones: 0,
                sharedMilestones: 0,
                claimedQuestData: 0,
              },
            },
          ],
          as: "allQuests",
        },
      },
      {
        $addFields: {
          quests: {
            $filter: {
              input: "$allQuests",
              as: "quest",
              cond: {
                $or: [
                  { $eq: ["$$quest.status", "Active"] },
                  { $eq: ["$$quest.isQuestClaimed", true] },
                ],
              },
            },
          },
        },
      },
      { $project: { allQuests: 0 } },
    ];

    // Execute the aggregation pipeline
    const data = await userMythologies.aggregate(pipeline);
    return data;
  } catch (error) {}
};

// playsuper
export const getPlaysuperOtp = async (mobileNumber) => {
  try {
    await axios.post(
      `${config.playsuper.PS_API_URL}/player/request-otp`,
      { phone: `${mobileNumber}` },
      {
        headers: {
          accept: "application/json",
          "x-api-key": `${config.playsuper.PS_API_KEY}`,
        },
      }
    );
  } catch (error) {
    console.error("Error message:", error.message);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error:", error.message);
    }

    throw new Error("Error in fetching OTP from playsuper");
  }
};

export const resendPlaysuperOtp = async (mobileNumber) => {
  try {
    const result = await axios.post(
      `${config.playsuper.PS_API_URL}/player/resend-otp`,
      { phone: mobileNumber },
      {
        headers: {
          accept: "application/json",
          "x-api-key": `${config.playsuper.PS_API_KEY}`,
        },
      }
    );

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error in fetching otp from playsuper");
  }
};

export const verifyPlaysuperOtp = async (mobileNumber, otp) => {
  try {
    const result = await axios.post(
      `${config.playsuper.PS_API_URL}/player/login`,
      { phone: `${mobileNumber}`, otp: otp },
      {
        headers: {
          accept: "application/json",
          "x-api-key": `${config.playsuper.PS_API_KEY}`,
        },
      }
    );

    return result;
  } catch (error) {
    console.log(error);

    throw new Error("Error in verifying otp from playsuper");
  }
};

export const fetchPlaySuperRewards = async (
  country: string,
  lang: string,
  playsuperCred: { isVerified: boolean; key: string }
) => {
  try {
    const headers: { [key: string]: string } = {
      accept: "application/json",
      "x-language": lang,
      "x-api-key": `${config.playsuper.PS_API_KEY}`,
    };

    if (playsuperCred?.isVerified && playsuperCred) {
      headers.Authorization = `Bearer ${playsuperCred.key}`;
    }
    let url = `${config.playsuper.PS_API_URL}/rewards`;

    const params = {
      coinId: `${config.playsuper.PS_COIN_ID}`,
      ...(country && { country }),
    };

    const result = await axios.get(url, {
      params: params,
      headers: headers,
    });

    const rewards = result.data.data.data.map(
      ({ price, availableQuantity, organizationId, brandId, type, ...rest }) =>
        rest
    );

    return rewards;
  } catch (error) {
    console.log(error);
    throw new Error("Error in fetching rewards from playsuper");
  }
};

export const fetchPlaysuperOrders = async (lang, playsuperToken) => {
  try {
    if (!playsuperToken) {
      return [];
    }
    const headers: { [key: string]: string } = {
      accept: "application/json",
      "x-language": lang,
      "x-api-key": `${config.playsuper.PS_API_KEY}`,
      Authorization: `Bearer ${playsuperToken}`,
    };

    const result = await axios.get(
      `${config.playsuper.PS_API_URL}/player/orders`,
      {
        params: {
          limit: 25,
        },
        headers: headers,
      }
    );

    return result.data.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error in fetching rewards from playsuper");
  }
};

const distributeCoins = async (authToken) => {
  try {
    const response = await axios.post(
      `${config.playsuper.PS_API_URL}/coins/${config.playsuper.PS_COIN_ID}/distribute`,
      {
        amount: 100,
      },
      {
        headers: {
          accept: "*/*",
          "x-api-key": `${config.playsuper.PS_API_KEY}`,
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Distribute err", error);

    throw new Error(error.response ? error.response.data : error.message);
  }
};

const purchaseReward = async (rewardId, authToken) => {
  try {
    const response = await axios.post(
      `${config.playsuper.PS_API_URL}/rewards/purchase`,
      {
        rewardId: rewardId,
        coinId: `${config.playsuper.PS_COIN_ID}`,
      },
      {
        headers: {
          accept: "application/json",
          "x-api-key": `${config.playsuper.PS_API_KEY}`,
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("purchase err", error);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const claimPlaysuperReward = async (rewardId, authToken) => {
  try {
    await distributeCoins(authToken);
    const purchaseResponse = await purchaseReward(rewardId, authToken);

    return purchaseResponse;
  } catch (error) {
    console.error("Error in one of the requests:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const checkStreakIsActive = async (lastClaimedAt) => {
  try {
    if (lastClaimedAt === 0) {
      return true;
    }

    const now = new Date();
    const lastClaimedDate = new Date(lastClaimedAt);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let result = false;

    const lastClaimedMidnight = new Date(
      lastClaimedDate.getFullYear(),
      lastClaimedDate.getMonth(),
      lastClaimedDate.getDate()
    );

    // check if already claimed today
    if (lastClaimedMidnight.getTime() === today.getTime()) {
      return false;
    }

    // check if it was claimed yesterday
    if (
      lastClaimedMidnight.getTime() !== yesterday.getTime() &&
      yesterday.getTime() != 0
    ) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in one of the requests:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const checkPlaysuperExpiry = async (playsuperData) => {
  try {
    const createdDate = new Date(playsuperData.createdAt).getTime();
    const currentDate = new Date().getTime();
    const diffInMs = currentDate - createdDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays > 28;
  } catch (error) {
    console.error("Error", error.message);
    return false;
  }
};
