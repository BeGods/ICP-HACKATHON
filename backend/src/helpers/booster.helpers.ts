import { validStreakReward } from "./streak.helpers";

export const calculateAutomataEarnings = (
  automataLastClaimedAt,
  automatalvl
) => {
  const automataTimeElapsed = Math.floor(
    (Date.now() - automataLastClaimedAt) / 1000
  );

  const automataEarnings = automataTimeElapsed * automatalvl;

  return automataEarnings;
};

export const getAutomataStartTimes = (mythologies) =>
  mythologies
    .flatMap((myth) => myth.boosters.automataStartTime)
    .filter((time) => time !== 0);

export const getShortestStartTime = (arrayOfTimes) => {
  if (arrayOfTimes.length < 4) {
    return -1;
  }

  return Math.min(...arrayOfTimes);
};

export const getBurstStartTimes = (mythologies) =>
  mythologies
    .flatMap((myth) => myth.boosters.burstActiveAt)
    .filter((time) => time !== 0);

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
      boosters.shardslvl = 99;
    }

    return boosters;
  } catch (error) {
    throw new Error("Error in validating booster.");
  }
};

export const checkAutomataStatus = (gameData, user) => {
  try {
    const streakMultipier = validStreakReward(
      "automata",
      user.bonus.fof.streak.count,
      user.bonus.fof.streak.claimedAt,
      user.bonus.fof.streak.lastMythClaimed === gameData.name
    );

    const timeLapsed = Date.now() - gameData.boosters.automataStartTime;

    if (timeLapsed >= 86400000) {
      // 24 hours
      gameData.boosters.isAutomataActive = false;
      gameData.boosters.automataLastClaimedAt = 0;
      gameData.boosters.automataStartTime = 0;
    }

    if (gameData.boosters.automatalvl === 98) {
      // 48 hours or level 7
      gameData.boosters.automatalvl = 98;
    }

    if (gameData.boosters.isAutomataActive) {
      gameData.shards += calculateAutomataEarnings(
        gameData.boosters.automataLastClaimedAt,
        Math.round(gameData.boosters.automatalvl * streakMultipier)
      );

      gameData.boosters.automataLastClaimedAt = Date.now();
    }

    return gameData.boosters;
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
      gameData.boosters.burstlvl = 99;
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
