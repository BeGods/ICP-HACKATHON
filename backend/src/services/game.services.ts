import mongoose from "mongoose";
import {
  calculateAutomataEarnings,
  calculateEnergy,
} from "../utils/helpers/game.helpers";
import userMythologies from "../models/mythologies.models";
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
                createdAt: 0,
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
      boosters.shardslvl = 1;
    }
    if (timeLapsed >= 172800000 || boosters.shardslvl === 99) {
      // 48 hours or level 7
      boosters.isShardsClaimActive = true;
      boosters.shardslvl = 1;
      boosters.shardsPaylvl = 1;
      boosters.shardsLastClaimedAt = 0;
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
      gameData.boosters.automatalvl = 0;
      gameData.boosters.automataLastClaimedAt = 0;
    }

    if (timeLapsed >= 172800000 || gameData.boosters.automatalvl === 99) {
      // 48 hours or level 7
      gameData.boosters.isAutomataActive = false;
      gameData.boosters.automataPaylvl = 0;
      gameData.boosters.automatalvl = 0;
      gameData.boosters.automataStartTime = 0;
      gameData.boosters.automataLastClaimedAt = 0;
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
    }

    // if (timeLapsed >= 172800000 || gameData.boosters.burstlvl === 99) {
    //   // 48 hours or level 7
    //   gameData.boosters.burstlvl = 1;
    //   gameData.boosters.isBurstActiveToClaim = true;
    //   gameData.boosters.burstActiveAt = 0;
    //   gameData.boosters.isBurstActive = false;
    // }

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
        updatedBlackOrb += Math.floor(mythology.orbs / 1000);
        mythology.orbs = mythology.orbs % 1000;
        console.log("yes bro it was activated");
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

export const fetchPlaySuperRewards = async (
  country: string,
  lang: string,
  playsuperCred: { isVerified: boolean; token: string }
) => {
  try {
    const headers: { [key: string]: string } = {
      accept: "application/json",
      "x-language": lang,
      "x-api-key":
        "8fefe0eceb81735144601b8ce31dd640c37136b9706ccd1955de963cb9cad5ec",
    };

    if (playsuperCred?.isVerified) {
      headers.Authorization = `Bearer ${playsuperCred.token}`;
    }

    const result = await axios.get(`https://dev.playsuper.club/rewards`, {
      params: {
        coinId: "ee61658e-532b-4a69-a99a-6b5287bc54cf",
        country: country,
      },
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

export const getPlaysuperOtp = async (mobileNumber) => {
  try {
    await axios.post(
      "https://dev.playsuper.club/player/request-otp",
      { phone: `+91${mobileNumber}` },
      {
        headers: {
          accept: "application/json",
          "x-api-key":
            "8fefe0eceb81735144601b8ce31dd640c37136b9706ccd1955de963cb9cad5ec",
        },
      }
    );
  } catch (error) {
    // Log the error message and response data if available
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
      "https://dev.playsuper.club/player/resend-otp",
      { phone: mobileNumber },
      {
        headers: {
          accept: "application/json",
          "x-api-key":
            "8fefe0eceb81735144601b8ce31dd640c37136b9706ccd1955de963cb9cad5ec",
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
      "https://dev.playsuper.club/player/login",
      { phone: `+91${mobileNumber}`, otp: otp },
      {
        headers: {
          accept: "application/json",
          "x-api-key":
            "8fefe0eceb81735144601b8ce31dd640c37136b9706ccd1955de963cb9cad5ec",
        },
      }
    );

    return result;
  } catch (error) {
    throw new Error("Error in verifying otp from playsuper");
  }
};

const distributeCoins = async (authToken) => {
  try {
    const response = await axios.post(
      "https://dev.playsuper.club/coins/ee61658e-532b-4a69-a99a-6b5287bc54cf/distribute",
      {
        amount: 100,
      },
      {
        headers: {
          accept: "*/*",
          "x-api-key":
            "8fefe0eceb81735144601b8ce31dd640c37136b9706ccd1955de963cb9cad5ec",
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
  console.log(rewardId);

  try {
    const response = await axios.post(
      "https://dev.playsuper.club/rewards/purchase",
      {
        rewardId: rewardId,
        coinId: "ee61658e-532b-4a69-a99a-6b5287bc54cf",
      },
      {
        headers: {
          accept: "application/json",
          "x-api-key":
            "8fefe0eceb81735144601b8ce31dd640c37136b9706ccd1955de963cb9cad5ec",
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);

    return response.data;
  } catch (error) {
    // console.log("purchase err", error);

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
  }
};
