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
