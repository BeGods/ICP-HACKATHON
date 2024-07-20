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
