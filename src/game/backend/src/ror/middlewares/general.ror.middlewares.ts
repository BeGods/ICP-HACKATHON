import { rorGameData } from "../../common/models/game.model";

export const validDailyBonusReq = async (req, res, next) => {
  try {
    const user = req.user;
    const userGameData = await rorGameData.findOne({ userId: user._id });
    const dailyBonusClaimed = userGameData.dailyBonusClaimedAt;
    const nowUtc = new Date();

    const startOfTodayUtc = new Date(
      Date.UTC(
        nowUtc.getUTCFullYear(),
        nowUtc.getUTCMonth(),
        nowUtc.getUTCDate(),
        0,
        0,
        0
      )
    );

    const endOfTodayUtc = new Date(
      Date.UTC(
        nowUtc.getUTCFullYear(),
        nowUtc.getUTCMonth(),
        nowUtc.getUTCDate(),
        23,
        59,
        59
      )
    );
    const validClaim =
      dailyBonusClaimed >= startOfTodayUtc &&
      dailyBonusClaimed <= endOfTodayUtc;

    if (validClaim) {
      throw Error("You have already claimed today's daily bonus!");
    } else {
      req.userGameData = userGameData;
      next();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const validJoinBonusReq = async (req, res, next) => {
  try {
    const user = req.user;
    const userGameData = await rorGameData.findOne({ userId: user._id });

    if (userGameData.joiningBonus) {
      throw Error("You have already claimed joining bonus!");
    } else {
      req.userGameData = userGameData;
      next();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
