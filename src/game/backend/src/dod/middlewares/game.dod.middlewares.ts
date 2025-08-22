import userMythologies from "../../common/models/mythologies.models";
import { dodGameData } from "../../common/models/game.model";
import characters from "../../assets/characters.json";
import { fetchCharDetails, fetchRelicDetails } from "../helpers/game.helpers";
import { log } from "node:console";

export const validateStartSession = async (req, res, next) => {
  try {
    const user = req.user;
    const userGameData = await dodGameData.findOne({ userId: user._id });

    if (!userGameData) {
      throw Error("Failed to load DOD gameData");
    }

    // check state
    if (!["idle"].includes(userGameData.gamePhase)) {
      throw Error("Invalid state to perform this operation");
    }

    if (userGameData.user?.characterCardDeck.length < 1) {
      throw Error("Card deck is not initalized to perform this operation.");
    }

    req.userGameData = userGameData;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validateEndSession = async (req, res, next) => {
  try {
    // valid gamePhase: check if sessionExpired
    const user = req.user;
    const userGameData = await dodGameData.findOne({ userId: user._id });

    if (!userGameData) {
      //! throw error
    }

    // check state
    if (userGameData.gamePhase == "idle") {
      //! throw error
    }

    req.userGameData = userGameData;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validateActivateGod = async (req, res, next) => {
  try {
    const user = req.user;
    const { charId, payMethod } = req.body;

    if (!charId || typeof payMethod === "undefined") {
      throw new Error("Missing required parameters: charId or payMethod");
    }

    // check if character & not avatar C09
    if (!charId.includes("char") || charId.includes("C09")) {
      throw new Error("Invalid cardId passed");
    }

    const charDetails = fetchCharDetails(charId);
    const userGameData = await dodGameData.findOne({ userId: user._id });
    const userMythData = await userMythologies.findOne({ userId: user._id });

    if (!userGameData) {
      throw new Error("Failed to load DOD game data");
    }

    if (!userMythData) {
      throw new Error("Failed to load mythology data");
    }

    if (!charDetails) {
      throw new Error("Invalid character ID");
    }

    // ensure correct game phase
    if (!["battle", "drawn"].includes(userGameData.gamePhase)) {
      throw new Error("Invalid state to perform this operation");
    }

    // ensure char exists in deck and not already in hand
    const inDeck = userGameData.user.characterCardDeck?.some(
      (itm) => itm.cardId === charId
    );

    const inDrawn = userGameData.user.drawnCards.find(
      (crd) => crd.cardId == charId
    );

    const alreadyInHand = userGameData.user.drawnCards?.some(
      (itm) => itm.cardId === charId && itm.isCurrentlyInHand
    );

    if (!inDeck || !inDrawn || alreadyInHand) {
      throw new Error(
        "Invalid request. Character is either not in your deck or is already in hand"
      );
    }

    // find mythology balance
    const mythologyBal = userMythData.mythologies.find(
      (myth) => myth.name === charDetails.orbBal?.type
    );
    if (!mythologyBal && payMethod !== 0) {
      throw new Error("Invalid mythology type for payment");
    }

    // balance check
    if (payMethod === 0 && userMythData.gobcoin < charDetails.coinBal) {
      throw new Error("Insufficient gobcoins");
    }
    if (payMethod === 1 && mythologyBal.orbs < charDetails.orbBal.amount) {
      throw new Error("Insufficient orbs");
    }
    if (payMethod === 2 && mythologyBal.faith < 1) {
      throw new Error("Insufficient faith tokens");
    }

    console.log("charDetails", charDetails);

    req.charDetails = charDetails;
    req.mythologyBal = mythologyBal;
    req.userMythData = userMythData;
    req.userGameData = userGameData;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const validateEquipRelic = async (req, res, next) => {
  try {
    const user = req.user;
    const { relicId, charId, payMethod } = req.body;
    console.log(relicId, charId);

    if (!charId || !relicId || typeof payMethod === "undefined") {
      throw new Error(
        "Missing required parameters: relicId, charId, or payMethod"
      );
    }

    const userGameData = await dodGameData.findOne({ userId: user._id });
    if (!userGameData) {
      throw new Error("Failed to load DOD game data");
    }

    const userMythData = await userMythologies.findOne({ userId: user._id });
    if (!userMythData) {
      throw new Error("Failed to load mythology data");
    }

    const charDetails = fetchCharDetails(charId);
    if (!charDetails) {
      throw new Error("Invalid character ID");
    }

    const relicDetails = fetchRelicDetails(relicId);
    if (!relicDetails) {
      throw new Error("Invalid relic ID");
    }

    // ensure correct game phase
    if (!["battle", "drawn"].includes(userGameData.gamePhase)) {
      throw new Error("Invalid state to equip relic");
    }

    // validate character and relic presence in drawn cards
    const charCard = userGameData.user.characterCardDeck?.find(
      (itm) => itm.cardId === charId
    );
    const relicInDrawn = userGameData.user.drawnCards?.find(
      (itm) => itm.cardId === relicId
    );
    const charInDrawn = userGameData.user.drawnCards?.find(
      (itm) => itm.cardId === charId
    );

    if (!charCard) {
      throw new Error("Character is not in your deck");
    }
    if (!charInDrawn || !charInDrawn.isCurrentlyInHand) {
      throw new Error("Character must be in hand to equip relic");
    }
    if (charInDrawn.attachmentId) {
      throw new Error("Character already has a relic equipped");
    }
    if (!relicInDrawn) {
      throw new Error("Relic must be drawn before it can be equipped");
    }

    // mythology balance
    const mythologyBal = userMythData.mythologies.find(
      (myth) => myth.name === relicDetails.orbType
    );

    // balance checks
    if (payMethod === 0 && userMythData.gobcoin < relicDetails.coins) {
      throw new Error("Insufficient gobcoins");
    }

    if (payMethod === 1) {
      if (mythologyBal) {
        if (mythologyBal.orbs < relicDetails.orbAmt) {
          throw new Error("Insufficient orbs");
        }
      } else if (relicDetails.orbType === "white aether") {
        if (userMythData.whiteOrbs < relicDetails.orbAmt) {
          throw new Error("Insufficient white aether orbs");
        }
      } else if (relicDetails.orbType === "black aether") {
        if (userMythData.blackOrbs < relicDetails.orbAmt) {
          throw new Error("Insufficient black aether orbs");
        }
      } else {
        throw new Error("Invalid orb type for payment");
      }
    }

    req.charDetails = charDetails;
    req.relicDetails = relicDetails;
    req.userMythData = userMythData;
    req.userGameData = userGameData;
    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
};

export const validateResolveBattle = async (req, res, next) => {
  try {
    const user = req.user;
    const userGameData = await dodGameData.findOne({ userId: user._id });
    const { cardId } = req.body;

    if (!cardId) {
      throw new Error("Missing required parameters: cardId");
    }

    if (!userGameData) {
      throw new Error("Failed to load DOD game data");
    }

    // check state
    if (!["battle", "drawn"].includes(userGameData.gamePhase)) {
      throw new Error("Invalid state to perform this operation");
    }

    // validate battle ground
    if (userGameData.currentBattleGround > 3) {
      throw new Error("Invalid battle ground");
    }

    // validate character and relic presence in drawn cards
    const charInDeck = userGameData.user.characterCardDeck?.find(
      (itm) => itm.cardId === cardId
    );

    const charInDrawn = userGameData.user.drawnCards?.find(
      (itm) => itm.cardId === cardId
    );

    if (!charInDeck || !charInDrawn || !charInDrawn.isCurrentlyInHand) {
      throw new Error(
        "INvalid request. Card is either not drawn or not in hand"
      );
    }

    req.userGameData = userGameData;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validateExplore = async (req, res, next) => {
  try {
    const user = req.user;
    const userGameData = await dodGameData.findOne({ userId: user._id });

    if (!userGameData) {
      throw new Error("Failed to load DOD game data");
    }

    // check state
    if (!["explore"].includes(userGameData.gamePhase)) {
      throw new Error("Invalid state to perform this operation");
    }

    // check currentBattleGround
    if (userGameData.currentBattleGround !== 3) {
      throw new Error("Invalid battle ground");
    }

    // validate battle history if user had won last 3 battles in taht turn
    const currTurnResults = userGameData.battleHistory.filter(
      (btl) =>
        btl.turnNumber === userGameData.currentTurn && btl.roundWinner == "user"
    );

    if (currTurnResults.length !== 3) {
      throw new Error(
        "Invalid request. User needs to win 3 rounds during the turn to avail explore."
      );
    }

    if (userGameData.exploreCardLog.length >= 9) {
      throw new Error("Invalid request. All items have been already explored");
    }

    req.userGameData = userGameData;
    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
};

export const validateUpdateDeck = async (req, res, next) => {
  try {
    const user = req.user;
    const { godsArr } = req.body;
    const userGameData = await dodGameData.findOne({ userId: user._id });

    if (!userGameData) {
      throw Error("Failed to load DOD gameData");
    }

    // check state
    if (!["idle"].includes(userGameData.gamePhase)) {
      throw Error("Invalid state to perform this operation");
    }

    // check if deck already exists
    if (userGameData.user.characterCardDeck.length > 0) {
      throw Error("Invalid request. Deck is already initialized");
    }

    // check enough gods
    if (godsArr.length < 9) {
      throw Error("Please select 9 characters to perform this operation");
    }

    // sanitate if the characters added are actually valid
    godsArr.forEach((codePath) => {
      const parts = codePath.split(".");
      const mythology = parts[0];
      const code = parts[2];

      if (
        !characters[mythology] ||
        !characters[mythology][code] ||
        code == "C09"
      ) {
        throw Error("Invalid character passed");
      }
    });

    req.userGameData = userGameData;
    next();
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
};
