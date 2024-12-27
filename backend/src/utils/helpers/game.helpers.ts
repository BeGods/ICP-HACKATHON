export const calculateAutomataEarnings = (automataLastClaimedAt, shardslvl) => {
  const automataTimeElapsed = Math.floor(
    (Date.now() - automataLastClaimedAt) / 1000
  );

  const automataEarnings = automataTimeElapsed * shardslvl;

  return automataEarnings;
};

export const calculateEnergy = (
  tapSessionStartTime,
  lastTapAcitivityTime,
  currEnergy,
  energyLimit
) => {
  const calculateRestoredEnergy =
    (tapSessionStartTime - lastTapAcitivityTime) / 1000;

  if (calculateRestoredEnergy < 0) return 0;

  const restoredEnergy = Math.floor(
    Math.min(currEnergy + calculateRestoredEnergy, energyLimit)
  );

  return restoredEnergy;
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

export const isWithinOneMinute = (times) => {
  if (times.length !== 5) return false;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  return maxTime - minTime < 60000;
};

export const getPhaseByDate = (date = new Date()) => {
  const startDate = new Date(Date.UTC(2023, 0, 1)); // January 1, 2023 in UTC

  // Calculate the difference in days
  const diffInTime = date.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

  const phase = diffInDays % 5;

  return phase + 1;
};

export const isClaimedTodayUTC = (time) => {
  if (time === 0) {
    return false;
  }
  const now = new Date();
  const startOfTodayUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const endOfTodayUTC = startOfTodayUTC + 86400000;

  return time >= startOfTodayUTC && time < endOfTodayUTC;
};

export const hasBeenFourDaysSinceClaimedUTC = (lastClaimedTime) => {
  if (lastClaimedTime === 0) {
    return false; // No claim has been made yet
  }

  const now = Date.now(); // Current time in milliseconds
  const fourDaysInMs = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds

  // If the time difference is within 4 days, return true; otherwise, return false
  return now - lastClaimedTime < fourDaysInMs;
};

export const checkLastMoonClaim = (lastMoonClaimAt) => {
  const currentTime = Date.now();
  const fourDaysInMs = 4 * 24 * 60 * 60 * 1000;

  if (currentTime - lastMoonClaimAt > fourDaysInMs) {
    return 100;
  }

  return currentTime - lastMoonClaimAt;
};
