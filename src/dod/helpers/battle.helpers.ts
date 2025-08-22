import { myths } from "../../utils/constants/variables";
import userMythologies from "../../common/models/mythologies.models";
import { OrbsTransactions } from "../../common/models/transactions.models";

export const disableCard = (drawnCards, cardId) => {
  const updatedDrawnCrds = drawnCards.filter((c) => c.cardId !== cardId);

  return updatedDrawnCrds;
};

export const updateCardStats = (player, card, turn) => {
  let updatedXP: any = {};

  player.characterCardDeck = player.characterCardDeck.map((crd) => {
    if (crd.cardId !== card.cardId) return crd;

    if (card.cardId.includes("C09")) {
      updatedXP = { attack: 1, defense: 1 };
      return { ...crd, attack: crd.attack + 1, defense: crd.defense + 1 };
    }

    if (turn % 2 === 0) {
      updatedXP = { defense: 1 };
      return { ...crd, defense: crd.defense + 1 };
    }

    updatedXP = { attack: 1 };
    return { ...crd, attack: crd.attack + 1 };
  });

  player.drawnCards = player.drawnCards.map((crd) => {
    if (crd.cardId !== card.cardId) return crd;

    if (card.cardId.includes("C09")) {
      return { ...crd, attack: crd.attack + 1, defense: crd.defense + 1 };
    }

    return turn % 2 === 0
      ? { ...crd, defense: crd.defense + 1 }
      : { ...crd, attack: crd.attack + 1 };
  });

  return updatedXP;
};

export const rewardOrbs = async (userId, orbBal) => {
  if (!orbBal || typeof orbBal !== "object") {
    console.warn("rewardOrbs called with invalid orbBal:", orbBal);
    return;
  }

  const orbTrx: any = {};

  for (const [myth, amt] of Object.entries(orbBal)) {
    if (myth === "black aether") {
      await userMythologies.findOneAndUpdate(
        { userId },
        { $inc: { blackOrbs: amt } }
      );
      orbTrx.BlackOrbs = amt;
    } else if (myth === "white aether") {
      await userMythologies.findOneAndUpdate(
        { userId },
        { $inc: { whiteOrbs: amt } }
      );
      orbTrx.WhiteOrbs = amt;
    } else if (myths.includes(myth)) {
      await userMythologies.findOneAndUpdate(
        { userId, "mythologies.name": myth },
        { $inc: { "mythologies.$.orbs": amt } }
      );
      const capName = myth.charAt(0).toUpperCase() + myth.slice(1);
      orbTrx[`${capName}Orbs`] = amt;
    } else {
      throw Error("Invalid orb type");
    }
  }

  const newOrbTransaction = new OrbsTransactions({
    userId,
    source: "battle",
    orbs: orbTrx,
  });
  await newOrbTransaction.save();
};

export const applyBattleOutcome = async (
  result,
  userId,
  gameData,
  userCard,
  botCard,
  orbBal
) => {
  let updatedXP: any = {};

  if (result === 1) {
    // user won

    updatedXP = await updateCardStats(
      gameData.user,
      userCard,
      gameData.currentTurn
    );

    // update orbs
    await rewardOrbs(userId, orbBal);
  } else if (result === 2) {
    // bot won

    gameData.user.drawnCards = disableCard(
      gameData.user.drawnCards,
      userCard.cardId
    );

    await updateCardStats(gameData.bot, botCard, gameData.currentTurn);
  } else {
    // draw

    gameData.user.drawnCards = disableCard(
      gameData.user.drawnCards,
      userCard.cardId
    );

    gameData.bot.drawnCards = disableCard(
      gameData.bot.drawnCards,
      botCard.cardId
    );
  }

  return { updatedXP: updatedXP, gameData: gameData };
};
