import userMythologies from "../../common/models/mythologies.models";
import {
  generateDrawPool,
  generateExplorePool,
} from "../helpers/random.helpers";
import {
  drawLocation,
  drawPlayerCards,
  handleBattle,
  handleBattleEnd,
  handleEncounterBattle,
  handleUpdateDrawnRwrds,
} from "../services/game.dod.services";
import {
  fetchCharDetails,
  fetchRelicDetails,
  handleSignMathOpr,
  updateTurnEnd,
} from "../helpers/game.helpers";
import {
  elements,
  elemMythNames,
  myths,
} from "../../utils/constants/variables";

// start turn
export const startSession = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const userGameData = req.userGameData;

    // draw user cards
    const pool = generateDrawPool(
      userGameData.user.characterCardDeck,
      userGameData.user.avatarType
    );

    //TODO: manage extra drawn card speartyely
    let { playerDrawnCards, playerUpdatedCycle } = await drawPlayerCards(
      userGameData,
      pool,
      false
    );

    // update rewards
    await handleUpdateDrawnRwrds(userId, playerDrawnCards);

    // extra case just incase an avatar already tehre --remove then
    playerDrawnCards = playerDrawnCards.filter(
      (crd) => !crd.cardId.includes("C09")
    );

    // add avatar to user drawn
    const avatarDetails = userGameData.user.characterCardDeck.find((crd) =>
      crd.cardId.includes("C09")
    );

    playerDrawnCards.push({
      cardId: avatarDetails.cardId,
      isCurrentlyInHand: true,
      attack: avatarDetails.attack,
      defense: avatarDetails.defense,
    });

    // draw locations
    let { location, locationUpdatedCycle } = await drawLocation(userGameData);

    console.log(playerUpdatedCycle);

    // update
    await userGameData.updateOne({
      $inc: {
        currentTurn: 1,
      },
      $set: {
        gamePhase: "drawn",
        "user.drawnCards": playerDrawnCards,
        cardCycle: playerUpdatedCycle,
        locationCycle: locationUpdatedCycle,
      },
    });

    res.status(200).json({
      location: location,
      drawnCards: playerDrawnCards,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to claim alchemist.",
      error: error.message,
    });
  }
};

// end turn
//! Maybe make this a service and attach with explore/resolve
export const endSession = async (req, res) => {
  try {
    const userGameData = req.userGameData;

    await userGameData.updateOne({
      $set: {
        gamePhase: "idle",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to claim alchemist.",
      error: error.message,
    });
  }
};

// activate gods
export const activateGod = async (req, res) => {
  try {
    const { userGameData, userMythData, charDetails } = req;
    const { payMethod } = req.body;
    let updatedUserGameData = userGameData;
    const user = req.user;

    if (!charDetails) {
      return res.status(400).json({ message: "Character details missing" });
    }

    // deduct payment
    if (payMethod === 0) {
      await userMythData.updateOne({
        $inc: { gobcoin: -charDetails.coinBal },
      });
    } else if (payMethod === 1) {
      await userMythData.updateOne(
        { userId: user._id, "mythologies.name": charDetails.orbBal.type },
        { $inc: { "mythologies.$.orbs": -charDetails.orbBal.amount } }
      );
    } else if (payMethod === 2) {
      await userMythData.updateOne(
        { userId: user._id, "mythologies.name": charDetails.orbBal.type },
        { $inc: { "mythologies.$.faith": -1 } }
      );
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // actiavte
    updatedUserGameData.user.drawnCards =
      updatedUserGameData.user.drawnCards.map((itm) => {
        return itm.cardId === charDetails.cardId
          ? { ...itm, isCurrentlyInHand: true }
          : itm;
      });

    // update
    await userGameData.updateOne({
      $set: {
        gamePhase: "battle",
        "user.drawnCards": updatedUserGameData.user.drawnCards,
      },
    });

    // remove _id
    updatedUserGameData.user.drawnCards =
      updatedUserGameData.user.drawnCards.map(({ _id, ...rest }) => rest);

    res.status(200).json({ message: "God activated successully!" });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to activate god",
      error: error.message,
    });
  }
};

// equip relic for gods
export const equipRelic = async (req, res) => {
  try {
    const { payMethod } = req.body;
    const { user, userGameData, userMythData, charDetails, relicDetails } = req;
    let updatedCharDetails = userGameData.user.drawnCards.find(
      (crd) => crd.cardId == charDetails.cardId
    );

    if (!charDetails || !relicDetails) {
      return res
        .status(400)
        .json({ message: "Invalid character or relic passed" });
    }

    // take drawn character in hand
    let updatedDrawnCards = userGameData.user.drawnCards;

    // is on or off
    updatedCharDetails.attack = handleSignMathOpr(
      updatedCharDetails.attack,
      charDetails.myth === relicDetails.myth
        ? relicDetails.atk_on
        : relicDetails.atk_off
    );

    updatedCharDetails.defense = handleSignMathOpr(
      updatedCharDetails.defense,
      charDetails.myth === relicDetails.myth
        ? relicDetails.def_on
        : relicDetails.def_off
    );

    // bonus (weapon match)
    if (updatedCharDetails.weaponName === relicDetails.name) {
      updatedCharDetails.attack = handleSignMathOpr(
        updatedCharDetails.attack,
        relicDetails.atk_bonus
      );
      updatedCharDetails.defense = handleSignMathOpr(
        updatedCharDetails.defense,
        relicDetails.def_bonus
      );
    }

    // update weapon for character
    updatedDrawnCards = updatedDrawnCards.map((itm) => {
      if (itm.cardId === charDetails.cardId) {
        const obj = itm.toObject ? itm.toObject() : itm;
        return {
          ...obj,
          attachmentId: relicDetails.cardId,
          attack: updatedCharDetails.attack,
          defense: updatedCharDetails.defense,
        };
      }
      return itm;
    });

    // deduct payment
    if (payMethod === 0) {
      await userMythData.updateOne({
        $inc: { gobcoin: -relicDetails.coins },
      });
    } else if (payMethod === 1) {
      if (myths.includes(relicDetails.orbType)) {
        await userMythData.updateOne(
          { userId: user._id, "mythologies.name": relicDetails.orbType },
          { $inc: { "mythologies.$.orbs": -relicDetails.orbAmt } }
        );
      } else if (relicDetails.orbType === "white aether") {
        await userMythData.updateOne({
          $inc: { whiteOrbs: -relicDetails.orbAmt },
        });
      } else if (relicDetails.orbType === "black aether") {
        await userMythData.updateOne({
          $inc: { blackOrbs: -relicDetails.orbAmt },
        });
      } else {
        throw new Error("Invalid orb type for payment");
      }
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // remove the werapon from drawn cards once added
    updatedDrawnCards = updatedDrawnCards.filter(
      (itm) => itm.cardId !== relicDetails.cardId
    );

    // update currentHand
    await userGameData.updateOne({
      $set: {
        "user.drawnCards": updatedDrawnCards,
      },
    });

    // remove _id
    updatedDrawnCards = updatedDrawnCards.map(({ _id, ...rest }) => rest);

    //! [if not drawn already] -- how will I manage this?
    res.status(200).json({ updatedDrawnCards: updatedDrawnCards });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to claim alchemist.",
      error: error.message,
    });
  }
};

// resolve battle
export const resolveBattle = async (req, res) => {
  try {
    const userId = req.user._id;
    const userGameData = req.userGameData;
    const { cardId } = req.body;

    // draw bot cards
    const pool = generateDrawPool(
      userGameData.bot.characterCardDeck,
      userGameData.bot.avatarType
    );

    let { playerDrawnCards } = await drawPlayerCards(userGameData, pool, true);

    // append avatar celtic.char.C09_male
    let avatarCardDetails = userGameData.bot.characterCardDeck.find((itm) =>
      itm.cardId?.includes("C09")
    );

    if (avatarCardDetails) {
      avatarCardDetails.isCurrentlyInHand = true;
      playerDrawnCards.push(avatarCardDetails);
    } else {
      console.log("Avatar card with 'C09' not found in characterCardDeck");
    }

    // handle battle
    let {
      updatedUserGameData,
      result,
      userCard,
      botCard,
      orbRewards,
      updatedXP,
    } = await handleBattle(userId, userGameData, cardId, playerDrawnCards);

    // handle end battle condition & explore trigger
    updatedUserGameData = await handleBattleEnd(updatedUserGameData);

    // update
    await userGameData.updateOne({
      $set: {
        gamePhase: updatedUserGameData.gamePhase,
        currentBattleGround: updatedUserGameData.currentBattleGround,
        battleHistory: updatedUserGameData.battleHistory,
        "user.drawnCards": updatedUserGameData.user.drawnCards,
        "bot.drawnCards": updatedUserGameData.bot.drawnCards,
      },
      $inc: {
        numOfBattlesWon: result == 1 ? 1 : 0,
      },
    });

    // cleanup battle history
    updatedUserGameData.battleHistory =
      updatedUserGameData.battleHistory.filter(
        (btl) => btl.turnNumber == updatedUserGameData.currentTurn
      );

    updatedUserGameData.battleHistory = updatedUserGameData.battleHistory.map(
      ({ _id, timestamp, turnNumber, battleStats, ...rest }) => ({
        ...rest,
        battleStats: battleStats?.map(({ _id, ...statRest }) => statRest) || [],
      })
    );

    //TODO: clearnup and do cetrn tings on frontend
    res.status(200).json({
      result: result,
      user: userCard,
      bot: botCard,
      orbRewards: orbRewards,
      updatedXP: updatedXP,
      updatedBattle: updatedUserGameData.battleHistory,
      drawnCards: updatedUserGameData.user.drawnCards,
      gamePhase: updatedUserGameData.gamePhase,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to claim alchemist.",
      error: error.message,
    });
  }
};

// enable explore
export const triggerExplore = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const userGameData = req.userGameData;
    let randomItem = await generateExplorePool(
      userGameData.exploreCardLog,
      userGameData.user.avatarType
    );
    let details: any = {};
    let finalGameData = userGameData;

    // update
    if (randomItem.includes("char")) {
      const { encounterCard, result, updatedGameData, userCard } =
        await handleEncounterBattle(randomItem, userGameData);

      console.log("result", result);

      // cleanup battle history
      updatedGameData.battleHistory = updatedGameData.battleHistory.filter(
        (btl) => btl.turnNumber == updatedGameData.currentTurn
      );

      updatedGameData.battleHistory = updatedGameData.battleHistory.map(
        ({ _id, timestamp, turnNumber, battleStats, ...rest }) => ({
          ...rest,
          battleStats:
            battleStats?.map(({ _id, ...statRest }) => statRest) || [],
        })
      );

      details.result = result;
      details.updatedBattle = updatedGameData.battleHistory;
      details.bot = encounterCard;
      details.user = userCard;
      details.gamePhase = "idle";
      finalGameData = updatedGameData;
    } else {
      if (randomItem.includes("shard")) {
        if (randomItem.includes("aether02")) {
          await userMythologies.findOneAndUpdate(
            { userId },
            { $inc: { blackShards: 100 } }
          );
        } else if (randomItem.includes("aether01")) {
          await userMythologies.findOneAndUpdate(
            { userId },
            { $inc: { whiteOrbs: 100 } }
          );
        } else if (elements.includes(randomItem.split(".")[0])) {
          const myth = elemMythNames[randomItem.split(".")[0]];
          await userMythologies.findOneAndUpdate(
            { userId, "mythologies.name": myth },
            { $inc: { "mythologies.$.shards": 100 } }
          );
        } else {
          throw Error("Invalid shard type");
        }
      } else {
        const relicDetails = fetchRelicDetails(randomItem);
        await userMythologies.findOneAndUpdate({
          $inc: {
            gobcoin: relicDetails.coins,
          },
        });
      }

      details = {
        cardId: randomItem,
        attachmentId: null,
        attack: 0,
        defense: 0,
      };
    }

    finalGameData = updateTurnEnd(finalGameData);

    // await userGameData.updateOne({
    //   $set: {
    //     gamePhase: gamePhase,
    //     currentBattleGround: finalGameData.currentBattleGround,
    //     battleHistory: finalGameData.battleHistory,
    //     "user.drawnCards": finalGameData.user.drawnCards,
    //     "bot.drawnCards": finalGameData.bot.drawnCards,
    //   },
    //   $push: {
    //     exploreCardLog: randomItem,
    //   },
    //   $inc: {
    //     numOfBattlesWon: details.result == 1 ? 1 : 0,
    //   },
    // });

    res.status(200).json(details);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to claim alchemist.",
      error: error.message,
    });
  }
};
