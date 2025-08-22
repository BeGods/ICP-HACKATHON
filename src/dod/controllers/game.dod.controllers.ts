import { cleanDoDGameData, fillCardDeckDetails } from "../helpers/game.helpers";
import { generatePool, getRandomChars } from "../helpers/random.helpers";
import {
  fetchGameStats,
  fillDefaultMythData,
} from "../services/game.dod.services";

// game stats
export const getGameStats = async (req, res) => {
  try {
    // fetch dod game data
    let user = req.user;
    const userId = user._id;

    const data = await fetchGameStats(userId, true);

    let userGameData = data.userGameData?.[0];
    let userMythData = data.userMythologies?.[0];
    let tasks = data.quests;

    // clean up gameData
    const { updatedUserData, updatedGameData } = await cleanDoDGameData(
      userGameData,
      user
    );
    user = updatedUserData;
    userGameData = updatedGameData;

    if (userMythData.mythologies.length === 0) {
      userMythData = fillDefaultMythData(userId, userMythData);
    }

    //TODO: end session if timeout
    const responseData = {
      user: user,
      game: userGameData,
      stats: userMythData,
      tasks: tasks,
    };
    res.status(200).json(responseData);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to claim alchemist.",
      error: error.message,
    });
  }
};

// select gods
export const updateCardDeck = async (req, res) => {
  try {
    const userGameData = req.userGameData;
    const userGodsArr = req.body.godsArr;
    const charPool = generatePool("char");
    const botGodsArr = getRandomChars(charPool, 9);

    // fetch details of AD
    const updatedBotDeck = fillCardDeckDetails(
      botGodsArr,
      userGameData.bot.avatarType
    );
    const updatedUserDeck = fillCardDeckDetails(
      userGodsArr,
      userGameData.user.avatarType
    );

    // update
    await userGameData.updateOne({
      $set: {
        "user.characterCardDeck": updatedUserDeck,
        "bot.characterCardDeck": updatedBotDeck,
      },
    });
    console.log("Updated successfully");

    res.status(200).json(updatedUserDeck);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to claim alchemist.",
      error: error.message,
    });
  }
};

// start new game
export const startNewGame = async (req, res) => {
  try {
    //TODO: new avatar for user and bot
  } catch (error) {
    res.status(500).json({
      message: "Failed to claim alchemist.",
      error: error.message,
    });
  }
};

// end game
export const endGame = async (req, res) => {
  try {
    // validate conditions
    // reset everything
    // export histort
  } catch (error) {
    res.status(500).json({
      message: "Failed to claim alchemist.",
      error: error.message,
    });
  }
};
