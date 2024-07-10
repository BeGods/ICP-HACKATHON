export const calculateEnergy = (
  tapSessionStartTime,
  lastTapAcitivityTime,
  currEnergy
) => {
  const calculateRestoredEnergy =
    (tapSessionStartTime - lastTapAcitivityTime) / 1000;

  const restoredEnergy = Math.floor(
    Math.min(currEnergy + calculateRestoredEnergy, 1000)
  );

  return restoredEnergy;
};
