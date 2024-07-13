export const validateBooster = (boosters) => {
  try {
    const timeLapsed = 1721022695010 - boosters.shardsLastClaimedAt;

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

export const calculateEnergy = (
  tapSessionStartTime,
  lastTapAcitivityTime,
  currEnergy,
  energyLimit
) => {
  const calculateRestoredEnergy =
    (tapSessionStartTime - lastTapAcitivityTime) / energyLimit;

  if (calculateRestoredEnergy < 0) return 0;

  const restoredEnergy = Math.floor(
    Math.min(currEnergy + calculateRestoredEnergy, energyLimit)
  );

  return restoredEnergy;
};
