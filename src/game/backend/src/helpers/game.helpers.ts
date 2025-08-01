export const isWithinOneMinute = (times) => {
  if (times.length !== 5) return false;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  return maxTime - minTime < 60000;
};

export const checkLastMoonClaim = (lastMoonClaimAt) => {
  const currentTime = Date.now();
  const fourDaysInMs = 4 * 24 * 60 * 60 * 1000;

  if (currentTime - lastMoonClaimAt > fourDaysInMs) {
    return 100;
  }

  return currentTime - lastMoonClaimAt;
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
    return false;
  }

  const now = Date.now();
  const fourDaysInMs = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds

  // if within 4 days then true, else false
  return now - lastClaimedTime < fourDaysInMs;
};

export const hasTwelveHoursElapsed = (date) => {
  const twelveHoursInMs = 12 * 60 * 60 * 1000;

  if (!date || date === 0) {
    return true;
  }

  return Date.now() > date + twelveHoursInMs;
};

export const checkIsUnderworldActive = (
  isUW,
  gameSession,
  mythology,
  pouch
) => {
  const turns = gameSession.dailyGameQuota >= 2;

  const treasureKey = `${mythology.toLowerCase()}.artifact.treasure01`;
  const commonKey = `${mythology.toLowerCase()}.artifact.common02`;

  const hasDemonCoin = pouch?.includes(treasureKey);
  const hasKey = pouch?.includes(commonKey);

  const itemExists = hasDemonCoin || hasKey;

  if (isUW && itemExists) {
    if (hasDemonCoin) return true;
    if (hasKey && turns) return true;
  }

  return false;
};

export const combineVaultItems = (vault) => {
  if (!Array.isArray(vault)) return [];

  return vault.flatMap((myth) => myth.items ?? []);
};

export const isCoin = (itemId, checkForTreaure) => {
  const starterCoin = /starter0[3-9]/?.test(itemId);
  const commonCoin = itemId?.includes("artifact.common01");
  const treasureCoin = itemId?.includes("artifact.treasure01");

  if (checkForTreaure && treasureCoin) {
    return true;
  } else {
    if (starterCoin || commonCoin) {
      return true;
    }
  }

  return false;
};
