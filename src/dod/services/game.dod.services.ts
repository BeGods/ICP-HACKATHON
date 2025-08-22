import mongoose from "mongoose";
import userMythologies from "../../common/models/mythologies.models";
import { dodGameData } from "../../common/models/game.model";
import {
  drawCardsAtPositions,
  drawCardsFromArray,
} from "../helpers/shuffle.helpers";
import {
  calBattleResult,
  drawBotCard,
  fetchCharDetails,
  fetchRelicDetails,
  handleSignMathOpr,
  updateTurnEnd,
} from "../helpers/game.helpers";
import { generatRandomAvatar } from "../helpers/random.helpers";
import { defaultMythologies, locations } from "../../utils/constants/variables";
import { applyBattleOutcome } from "../helpers/battle.helpers";
import { ShardsTransactions } from "../../common/models/transactions.models";
import relics from "../../assets/relics.json";

export const fillDefaultDoD = async (user) => {
  try {
    const userGameData = new dodGameData({
      userId: user._id,
      user: { avatarType: generatRandomAvatar() },
      bot: { avatarType: generatRandomAvatar() },
    });

    await userGameData.save();
    return userGameData.toObject();
  } catch (error) {
    console.error("Error in fillDefaultDoD:", error);
    throw error;
  }
};

export const fetchGameStats = async (userId, includeQuests) => {
  try {
    let pipeline: any[] = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "usermythologies",
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
            {
              $project: {
                _id: 0,
                multiColorOrbs: 1,
                blackOrbs: 1,
                whiteOrbs: 1,
                whiteShards: 1,
                blackShards: 1,
                gobcoin: 1,
                mythologies: {
                  $map: {
                    input: {
                      $ifNull: ["$mythologies", []],
                    },
                    as: "myth",
                    in: {
                      name: "$$myth.name",
                      orbs: "$$myth.orbs",
                      shards: "$$myth.shards",
                      faith: "$$myth.faith",
                    },
                  },
                },
              },
            },
          ],
          as: "userMythologies",
        },
      },
      {
        $lookup: {
          from: "dodgamedatas",
          localField: "userId",
          foreignField: "userId",
          as: "userGameData",
        },
      },
    ];

    if (includeQuests) {
      pipeline.push({
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
            { $sort: { createdAt: -1 as -1 } },
            {
              $project: {
                milestones: 0,
                claimedQuestData: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: "allQuests",
        },
      });

      pipeline.push({
        $addFields: {
          quests: {
            $filter: {
              input: "$allQuests",
              as: "quest",
              cond: {
                $and: [{ $eq: ["$$quest.mythology", "Other"] }],
              },
            },
          },
        },
      });

      pipeline.push({
        $project: {
          userMythologies: 1,
          userMilestones: 1,
          userGameData: 1,
          quests: 1,
        },
      });
    } else {
      pipeline.push({
        $project: {
          userMythologies: 1,
          userMilestones: 1,
          userGameData: 1,
        },
      });
    }

    const userGameStats = await userMythologies.aggregate(pipeline);
    let result = userGameStats[0];

    // cleanup
    if (result?.userMythologies) {
      result.userMythologies = result.userMythologies.map((item) => {
        const { userId, createdAt, updatedAt, __v, ...rest } = item;
        return rest;
      });
    }

    if (result?.userGameData) {
      result.userGameData = result.userGameData.map((item) => {
        const { _id, userId, createdAt, updatedAt, __v, ...rest } = item;
        return rest;
      });
    }

    return result;
  } catch (error) {
    console.error("Error validating rat:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const drawPlayerCards = async (userGameData, pool, isBot) => {
  try {
    let updatedDrawnCards;
    let updatedCycle;

    if (isBot) {
      updatedDrawnCards = drawCardsAtPositions(
        pool,
        userGameData.cardCycle.drawnIdxs
      );
    } else {
      let { drawnCards, drawnIdxs, cycle } = drawCardsFromArray(
        pool,
        userGameData.cardCycle,
        5
      );

      updatedDrawnCards = drawnCards;
      updatedCycle = cycle;
      updatedCycle.drawnIdxs = drawnIdxs;

      // condition to draw card again
      const drawAgainCount = updatedDrawnCards.filter((itm) =>
        itm.cardId.includes("shard")
      ).length;

      // draw extra cards
      if (drawAgainCount > 0) {
        const {
          drawnCards: extraCards,
          drawnIdxs: extraIdxs,
          cycle: extraCycle,
        } = drawCardsFromArray(pool, updatedCycle, drawAgainCount);

        updatedDrawnCards.push(...extraCards);

        // sync cycle
        updatedCycle.currentCycle = extraCycle.currentCycle;
        updatedCycle.cardsUsedInCycle = extraCycle.cardsUsedInCycle;
        updatedCycle.drawnIdxs = [...updatedCycle.drawnIdxs, ...extraIdxs];
      }
    }

    // incase after drawing extra cards there are more than 5 cards including avatar then what
    let relevantCards = updatedDrawnCards.filter(
      (crd) =>
        crd.cardId.includes("char") ||
        crd.cardId.includes("relic") ||
        crd.cardId.includes("quest")
    );

    if (relevantCards.length > 4) {
      // remove extras until 4 remain
      while (relevantCards.length > 4) {
        const questIndex = relevantCards.findIndex((crd) =>
          crd.cardId.includes("quest")
        );
        const relicIndex = relevantCards.findIndex((crd) =>
          crd.cardId.includes("relic")
        );
        const charIndex = relevantCards.findIndex((crd) =>
          crd.cardId.includes("char")
        );

        if (questIndex !== -1) {
          relevantCards.splice(questIndex, 1);
        } else if (relicIndex !== -1) {
          relevantCards.splice(relicIndex, 1);
        } else if (charIndex !== -1) {
          relevantCards.splice(charIndex, 1);
        } else {
          break;
        }
      }

      // grab the rest
      const nonRelevantCards = updatedDrawnCards.filter(
        (crd) =>
          !crd.cardId.includes("char") &&
          !crd.cardId.includes("relic") &&
          !crd.cardId.includes("quest")
      );

      // merge both sets
      updatedDrawnCards = [...relevantCards, ...nonRelevantCards];

      // shuffle so they’re not ordered
      for (let i = updatedDrawnCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [updatedDrawnCards[i], updatedDrawnCards[j]] = [
          updatedDrawnCards[j],
          updatedDrawnCards[i],
        ];
      }
    }

    return {
      playerDrawnCards: updatedDrawnCards,
      playerUpdatedCycle: updatedCycle,
    };
  } catch (error) {
    console.log(error);

    console.error("Error validating rat:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const handleUpdateDrawnRwrds = async (userId, drawnCards) => {
  try {
    for (const crd of drawnCards) {
      if (crd.cardId.includes("common") || crd.cardId.includes("starter")) {
        const parts = crd.cardId.split(".");
        const type = parts[1];
        const code = parts[2];

        if (relics[type]?.[code]) {
          await userMythologies.findOneAndUpdate(
            { userId },
            { $inc: { gobcoin: relics[type][code].coins } }
          );
        }
      } else if (crd.cardId.includes("shard")) {
        const shardType = crd.cardId.split(".")[1];
        let transaction = null;

        if (shardType === "aether01") {
          await userMythologies.findOneAndUpdate(
            { userId },
            { $inc: { whiteShards: 100 } }
          );
          transaction = { userId, source: "daily", coins: 100, type: "white" };
        } else if (shardType === "aether02") {
          await userMythologies.findOneAndUpdate(
            { userId },
            { $inc: { blackShards: 100 } }
          );
          transaction = { userId, source: "daily", coins: 100, type: "black" };
        } else {
          const mythologyMap = {
            earth01: "Celtic",
            air01: "Egyptian",
            water01: "Norse",
            fire01: "Greek",
          };
          const mythologyName = mythologyMap[shardType];
          if (mythologyName) {
            await userMythologies.findOneAndUpdate(
              { userId, "mythologies.name": mythologyName },
              { $inc: { "mythologies.$.shards": 100 } }
            );
            transaction = {
              userId,
              source: "daily",
              coins: 100,
              type: mythologyName,
            };
          }
        }

        if (transaction) {
          const newShardsTransaction = new ShardsTransactions(transaction);
          await newShardsTransaction.save();
        }
      }
    }
  } catch (error) {
    console.error("Error updating drawn rewards:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const drawLocation = async (userGameData) => {
  try {
    let { drawnCards, cycle } = await drawCardsFromArray(
      locations,
      userGameData.locationCycle,
      1
    );

    return { location: drawnCards[0], locationUpdatedCycle: cycle };
  } catch (error) {
    console.error("Error validating rat:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

//TODO: test handle for explore encounter
// only miantin card deck at the end of game
export const handleBattle = async (
  userId,
  userGameData,
  userCardId,
  botDrawnCards
) => {
  try {
    let updatedUserGameData = userGameData;
    let userCard = userGameData.user.drawnCards.find(
      (itm) => itm.cardId == userCardId
    );

    let { botCard, updatedBotDrawnCards, orbBal } = drawBotCard(
      userGameData,
      botDrawnCards
    );

    // userCard v/s botCard
    const result = calBattleResult(userCard, botCard);

    updatedUserGameData.bot.drawnCards = updatedBotDrawnCards;
    const { updatedXP, gameData } = await applyBattleOutcome(
      result,
      userId,
      updatedUserGameData,
      userCard,
      botCard,
      orbBal
    );

    updatedUserGameData = gameData;

    // update battle history
    updatedUserGameData.battleHistory.push({
      turnNumber: updatedUserGameData.currentTurn,
      battleStats: [
        {
          cardId: userCard.cardId,
          attachmentId: userCard.attachmentId,
          attack: userCard.attack,
          defense: userCard.defense,
        },
        {
          cardId: botCard.cardId,
          attachmentId: botCard.attachmentId,
          attack: botCard.attack,
          defense: botCard.defense,
        },
      ],
      roundWinner: result == 1 ? "user" : result == 2 ? "bot" : "draw",
    });

    // const updatedBotCard = Object.fromEntries(
    //   Object.entries(botCard).filter(([key]) => key !== "_id")
    // );

    // console.log(userCard);

    // const updatedUserCard = Object.fromEntries(
    //   Object.entries(userCard).filter(([key]) => key !== "_id")
    // );

    return {
      updatedUserGameData: updatedUserGameData,
      result: result,
      userCard: userCard,
      botCard: botCard,
      orbRewards: orbBal,
      updatedXP: updatedXP,
    };
  } catch (error) {
    console.error("Error validating handle battle:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const handleBattleEnd = async (userGameData) => {
  try {
    let updatedUserGameData = userGameData;
    updatedUserGameData.currentBattleGround += 1;

    // num of battles won
    const numOfBattlesUserWon = userGameData?.battleHistory
      ? userGameData.battleHistory.filter(
          (btl) =>
            btl.turnNumber === userGameData.currentTurn &&
            btl.roundWinner === "user"
        ).length
      : 0;

    // cards drawn by user
    const numOfUserCardsLeft = userGameData?.user.drawnCards.filter((crd) =>
      crd.cardId.includes("char")
    );
    // cards drawn by bot
    const numOfBotCardsLeft = userGameData?.bot.drawnCards.filter((crd) =>
      crd.cardId.includes("char")
    );

    // enable explore
    if (numOfBattlesUserWon == 3 && userGameData.currentBattleGround == 3) {
      updatedUserGameData.gamePhase = "explore";
    }

    // if last turn and havent won all battles
    const turnEndLostCond =
      numOfBattlesUserWon !== 3 && updatedUserGameData.currentBattleGround == 3;

    // if gods exhausted
    const godsExhaustedCond =
      numOfUserCardsLeft.length == 0 || numOfBotCardsLeft.length === 0;
    // or encounter battle
    // const encounterCondn = updatedUserGameData.gamePhase == "encounter";

    if (turnEndLostCond || godsExhaustedCond) {
      // reset turn data
      updatedUserGameData = updateTurnEnd(updatedUserGameData);
    }
    return updatedUserGameData;
  } catch (error) {
    console.error("Error validating handle battle end:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const handleEncounterBattle = async (randomItem, userGameData) => {
  try {
    const relicDetails = fetchRelicDetails(randomItem);
    const charDetails = fetchCharDetails(randomItem);

    console.log(charDetails, relicDetails);

    const encounterCard = {
      cardId: charDetails.cardId,
      attachmentId: relicDetails.cardId,
      attack: handleSignMathOpr(charDetails.atk, relicDetails.atk_bonus),
      defense: handleSignMathOpr(charDetails.def, relicDetails.def_bonus),
    };

    // best card
    const userCard = userGameData.user.drawnCards
      .filter((c) => c.cardId.includes("char") && c.isCurrentlyInHand == true)
      .reduce(
        (best, curr) =>
          curr.attack > (best?.attack ?? -Infinity) ? curr : best,
        null
      );

    console.log(userCard, encounterCard);

    if (!userCard) {
      throw new Error("No character cards available in drawnCards");
    }

    const result = calBattleResult(userCard, encounterCard);

    console.log(result);

    userGameData.battleHistory.push({
      turnNumber: userGameData.currentTurn,
      battleStats: [
        {
          cardId: userCard.cardId,
          attachmentId: userCard.attachmentId,
          attack: userCard.attack,
          defense: userCard.defense,
        },
        {
          cardId: encounterCard.cardId,
          attachmentId: encounterCard.attachmentId,
          attack: encounterCard.attack,
          defense: encounterCard.defense,
        },
      ],
      roundWinner: result == 1 ? "user" : result == 2 ? "encounter" : "draw",
    });

    if (result == 1) {
      //TODO: tame the character
    }

    const updatedGameData = userGameData;

    console.log("=======so far all good=======");

    return { result, updatedGameData, userCard, encounterCard };
  } catch (error) {
    console.error("Error validating rat:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const fillDefaultMythData = async (userId, userMythData) => {
  try {
    const existingNames = userMythData.mythologies?.map((myth) => myth.name);
    const missingMythologies = defaultMythologies.filter(
      (defaultMyth) => !existingNames?.includes(defaultMyth.name)
    );
    const completeMythologies = [
      ...(userMythData.mythologies || []),
      ...missingMythologies,
    ];

    completeMythologies.forEach((mythology) => {
      delete mythology._id;
    });

    userMythData.mythologies = completeMythologies;

    const updatedMythData = await userMythologies.findOneAndUpdate(
      { userId: userId },
      { $set: { mythologies: completeMythologies } },
      { new: true }
    );

    updatedMythData.mythologies.forEach((mythology) => {
      delete mythology._id;
    });

    return updatedMythData;
  } catch (error) {
    console.log(error);
  }
};
