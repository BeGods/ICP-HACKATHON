import { calculateAutomataEarnings } from "../utils/game";

export const validateBooster = (boosters) => {
  try {
    const timeLapsed = Date.now() - boosters.shardsLastClaimedAt;

    if (timeLapsed >= 86400000) {
      // 24 hours
      boosters.isShardsClaimActive = true;
    }
    if (timeLapsed >= 172800000 || boosters.shardslvl === 7) {
      // 48 hours or level 7
      boosters.isShardsClaimActive = true;
      boosters.shardslvl = 1;
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
    console.log(timeLapsed);

    gameData.shards += calculateAutomataEarnings(
      gameData.boosters.automataLastClaimedAt,
      gameData.boosters.shardslvl
    );

    gameData.boosters.automataLastClaimedAt = Date.now();

    if (timeLapsed >= 86400000) {
      // 24 hours
      gameData.boosters.isAutomataActive = false;
      gameData.boosters.automataLastClaimedAt = 0;
      gameData.boosters.automataStartTime = 0;
    }

    return gameData;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};
