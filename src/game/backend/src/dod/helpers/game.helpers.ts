import { gameItems } from "../../utils/constants/gameItems";
import { checkBonus } from "../../helpers/bonus.helpers";
import { fillDefaultDoD } from "../services/game.dod.services";
import characters from "../../assets/characters.json";
import relics from "../../assets/relics.json";
import { locations } from "../../utils/constants/variables";
import { dodGameData } from "../../common/models/game.model";
import { generatRandomAvatar } from "./random.helpers";

export const cleanDoDGameData = async (userGameData, user) => {
  let updatedGameData = userGameData;
  let updatedUserData = user;
  // fill gameData if absent
  if (!userGameData || userGameData === null || userGameData === undefined) {
    updatedGameData = await fillDefaultDoD(user);
  } else if (
    !userGameData.user.avatarType ||
    userGameData.user.avatarType === null ||
    userGameData.user.avatarType === undefined
  ) {
    const newUserAvatar = generatRandomAvatar();
    const newBotAvatar = generatRandomAvatar();

    updatedGameData.user.avatarType = newUserAvatar;
    updatedGameData.bot.avatarType = newBotAvatar;

    await dodGameData.findOneAndUpdate(
      {
        userId: user._id,
      },
      {
        $set: {
          "user.avatarType": generatRandomAvatar(),
          "bot.avatarType": generatRandomAvatar(),
        },
      },
      {
        new: true,
      }
    );
  }

  // return flags directly like joinBonus, dailyBonus
  const isDailyBonusActive = await checkBonus(updatedGameData);
  const isJoinBonusActive = updatedGameData.joiningBonus === false;

  // clearnup gameData
  if (updatedGameData) {
    updatedGameData.avatarType = updatedGameData.user.avatarType;
    updatedGameData.characterCardDeck = updatedGameData.user.characterCardDeck;
    updatedGameData.drawnCards = updatedGameData.user.drawnCards;

    // remove _id
    updatedGameData.drawnCards = updatedGameData.drawnCards.map(
      ({ _id, ...rest }) => rest
    );
    updatedGameData.characterCardDeck = updatedGameData.characterCardDeck.map(
      ({ _id, ...rest }) => rest
    );

    if (updatedGameData.gamePhase !== "idle") {
      updatedGameData.location =
        locations[updatedGameData.locationCycle.cardsUsedInCycle];
    }

    // cleanup battle history
    updatedGameData.battleHistory = updatedGameData.battleHistory.filter(
      (btl) => btl.turnNumber == updatedGameData.currentTurn
    );

    updatedGameData.battleHistory = updatedGameData.battleHistory.map(
      ({ _id, timestamp, turnNumber, battleStats, ...rest }) => ({
        ...rest,
        battleStats: battleStats?.map(({ _id, ...statRest }) => statRest) || [],
      })
    );

    const {
      userId,
      dailyBonusClaimedAt,
      joiningBonus,
      exploitCount,
      streak,
      locationCycle,
      bot,
      cardCycle,
      user,
      ...rest
    } = updatedGameData;

    if (rest.user) {
      const { cardCycle, ...userWithoutCardCycle } = rest.user;
      rest.user = userWithoutCardCycle;
    }

    if (rest.bot) {
      const { cardCycle, ...botWithoutCardCycle } = rest.bot;
      rest.bot = botWithoutCardCycle;
    }

    updatedGameData = rest;
  }

  // clearnup user
  if (user) {
    const plainUser = user.toObject ? user.toObject() : user;

    const {
      _id,
      __v,
      createdAt,
      updatedAt,
      bonus,
      gameCompletedAt,
      gameSession,
      playsuper,
      lastLoginAt,
      partOfGames,
      role,
      announcements,
      squadOwner,
      profile,
      telegramId,
      ...rest
    } = plainUser;

    updatedUserData = rest;
  }
  updatedGameData.isDailyBonusActive = isDailyBonusActive;
  updatedGameData.isJoinBonusActive = isJoinBonusActive;

  updatedUserData.avatarUrl = user.profile.avatarUrl
    ? user.telegramId
      ? `https://media.publit.io/file/UserAvatars/${user.profile.avatarUrl}.jpg`
      : user.profile.avatarUrl
    : null;

  return { updatedGameData, updatedUserData };
};

export const fillCharDetails = (charId, cardDeck) => {
  if (charId.includes("relic")) {
    const fetchedRelicData = gameItems.find((itm) => itm.id == charId);
    return {
      cardId: charId,
      attachmentId: null,
      isCurrentlyInHand: false,
      attack: fetchedRelicData.attack,
      defense: fetchedRelicData.defense,
    };
  } else if (charId.includes("char")) {
    const fetchedCharData = cardDeck.find((itm) => itm.cardId);
    return {
      cardIdcharId: charId,
      attachmentId: null,
      isCurrentlyInHand: false,
      attack: fetchedCharData.attack,
      defense: fetchedCharData.defense,
    };
  } else {
    return {
      cardId: charId,
      attachmentId: null,
      isCurrentlyInHand: false,
      attack: 0,
      defense: 0,
    };
  }
};

export const fillCardDeckDetails = (godsArr, avatarType) => {
  try {
    // attach AD details for gods

    let detailedCardDeck = godsArr.map((itm) => {
      const parts = itm.split(".");
      const mythology = parts[0];
      const code = parts[2];

      if (!characters[mythology] || !characters[mythology][code]) {
        throw new Error(`Invalid card: ${itm}`);
      }

      const data = characters[mythology][code];

      return {
        cardId: itm,
        attack: data.atk,
        defense: data.def,
      };
    });

    // celtic.char.C09_male

    const parts = avatarType.split(".");
    const mythology = parts[0];
    const code = parts[2];

    // avatar
    detailedCardDeck.push({
      cardId: avatarType,
      attack: characters[mythology][code].atk,
      defense: characters[mythology][code].def,
    });

    return detailedCardDeck;
  } catch (error) {
    console.error("Error validating rat:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const drawBotCard = (userGameData, botDrawnCards) => {
  const filteredCharBotCards = botDrawnCards.filter((itm) =>
    itm.cardId.includes("char")
  );
  const filteredRelicBotCards = botDrawnCards.filter((itm) =>
    itm.cardId.includes("relics")
  );

  let botCard;
  let orbBal;

  // generate random card for bot and keep in hand for battle
  if (filteredCharBotCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredCharBotCards.length);
    const [randomCard] = filteredCharBotCards.splice(randomIndex, 1);
    botCard = randomCard.toObject ? randomCard.toObject() : { ...randomCard };
    botCard.isCurrentlyInHand = true;
  }

  // check last battle if lost or won
  let hasBotLostPrevBattle = false;

  if (userGameData?.battleHistory?.length > 0) {
    const battlesThisTurn = userGameData.battleHistory.filter(
      (btl) => btl.turnNumber === userGameData.currentTurn
    );

    const lastBattle = battlesThisTurn.at(-1);
    if (lastBattle) {
      hasBotLostPrevBattle = lastBattle.roundWinner !== "bot";
    }
  }

  // add weapon for bot bot onluy if he had lost last battle furing same turn
  if (hasBotLostPrevBattle && filteredRelicBotCards.length > 0) {
    const randomRelic = filteredRelicBotCards[0];
    const charDataFromDeck = userGameData.bot.characterCardDeck.find(
      (crd) => crd.cardId === botCard.cardId
    );
    const charDetails = fetchCharDetails(botCard.cardId);
    const relicDetails = fetchRelicDetails(randomRelic.cardId);

    botCard.attachmentId = randomRelic.cardId;

    // attack update
    botCard.attack = handleSignMathOpr(
      charDataFromDeck.attack,
      charDetails.myth === relicDetails.myth
        ? relicDetails.atk_on
        : relicDetails.atk_off
    );

    // defense update
    botCard.defense = handleSignMathOpr(
      charDataFromDeck.defense,
      charDetails.myth === relicDetails.myth
        ? relicDetails.def_on
        : relicDetails.def_off
    );

    // bonus update
    if (botCard.weaponName === relicDetails.name) {
      botCard.attack = handleSignMathOpr(
        charDataFromDeck.attack,
        relicDetails.atk_bonus
      );
      botCard.defense = handleSignMathOpr(
        charDataFromDeck.defense,
        relicDetails.def_bonus
      );
    }

    // remove the werapon from drawn cards once added & update bot card in list
    botDrawnCards = botDrawnCards
      .filter((itm) => itm.cardId !== randomRelic.cardId)
      .map((itm) => {
        if (itm.cardId === botCard.cardId) {
          const obj = itm.toObject ? itm.toObject() : itm;
          return {
            ...obj,
            attachmentId: relicDetails.cardId,
            attack: botCard.attack,
            defense: botCard.defense,
          };
        }
        return itm;
      });

    orbBal = {
      [charDetails.orbBal.type]: charDetails.orbBal.amount,
      [relicDetails.orbType]: relicDetails.orbAmt,
    };
  }

  return { updatedBotDrawnCards: botDrawnCards, botCard, orbBal };
};

// p1: userCard
// p2: botCard
export const calBattleResult = (userCard, botCard) => {
  const damageToP2 = Math.max(0, userCard.attack - botCard.defense);
  const damageToP1 = Math.max(0, botCard.attack - userCard.defense);

  if (damageToP2 > damageToP1) return 1;
  if (damageToP1 > damageToP2) return 2;
  return 0;
};

export const updateTurnEnd = (userGameData) => {
  userGameData.gamePhase = "idle";
  userGameData.currentBattleGround = 0;
  userGameData.user.drawnCards = [];
  userGameData.bot.drawnCards = [];

  return userGameData;
};

export const fetchCharDetails = (charId) => {
  const parts = charId.split(".");
  const charMyth = parts[0];
  const charCode = parts[2];
  const atk = characters[charMyth][charCode].atk;
  const def = characters[charMyth][charCode].def;
  const weaponName = characters[charMyth][charCode].weaponName;
  const coinBal = characters[charMyth][charCode].coins;
  const orbBal = {
    type: characters[charMyth][charCode].orbType,
    amount: characters[charMyth][charCode].orbAmt,
  };

  return {
    cardId: `${charMyth}.char.${charCode}`,
    weaponName: weaponName,
    name: characters[charMyth][charCode].name,
    atk: atk,
    def: def,
    coinBal: coinBal,
    orbBal: orbBal,
    myth: charMyth,
  };
};

export const fetchRelicDetails = (relicId) => {
  const parts = relicId.split(".");
  const relicMyth = parts[0];
  const relicCode = parts[2];
  const relicDetails = relics.relics[relicMyth][relicCode];

  return {
    cardId: `${relicMyth}.relics.${relicCode}`,
    name: relicDetails.name ?? null,
    myth: relicMyth ?? null,
    atk_on: relicDetails.atk_on ?? 0,
    def_on: relicDetails.def_on ?? 0,
    atk_off: relicDetails.atk_off ?? 0,
    def_off: relicDetails.def_off ?? 0,
    atk_bonus: relicDetails.atk_bonus ?? 0,
    def_bonus: relicDetails.def_bonus ?? 0,
    coins: relicDetails.coins ?? 0,
    orbType: relicDetails.orbType ?? null,
    orbAmt: relicDetails.orbAmt ?? 0,
  };
};

export const fetchArtifactDetails = (relicId) => {
  const parts = relicId.split(".");
  const relicMyth = parts[0];
  const relicCode = parts[2];
  const relicDetails = relics.relics[relicMyth][relicCode];

  return {
    cardId: `${relicMyth}.relics.${relicCode}`,
    name: relicDetails.name ?? null,
    myth: relicMyth ?? null,
    atk_on: relicDetails.atk_on ?? 0,
    def_on: relicDetails.def_on ?? 0,
    atk_off: relicDetails.atk_off ?? 0,
    def_off: relicDetails.def_off ?? 0,
    atk_bonus: relicDetails.atk_bonus ?? 0,
    def_bonus: relicDetails.def_bonus ?? 0,
    coins: relicDetails.coins ?? 0,
    orbType: relicDetails.orbType ?? null,
    orbAmt: relicDetails.orbAmt ?? 0,
  };
};

export const handleSignMathOpr = (currentValue, changeStr) => {
  if (typeof changeStr !== "string" || changeStr.length < 2)
    return currentValue;
  const sign = changeStr[0];
  const num = parseInt(changeStr.slice(1), 10) || 0;

  if (sign === "+") return currentValue + num;
  if (sign === "-") return currentValue - num;
  return currentValue;
};
