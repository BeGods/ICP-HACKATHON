import userMythologies from "../../common/models/mythologies.models";
import User from "../../common/models/user.models";
import { generateDailyRwrd } from "../services/general.ror.services";

export const claimDailyBonus = async (req, res) => {
  const userId = req.user._id;
  const user = req.user;
  try {
    const currTimeInUTC = new Date();

    await user.updateOne({
      $set: {
        "bonus.ror.dailyBonusClaimedAt": currTimeInUTC,
      },
    });

    let bonusReward: {} = await generateDailyRwrd(userId);

    if (!bonusReward) {
      bonusReward = "shards";

      await userMythologies.findOneAndUpdate(
        { userId: userId },
        { $inc: { blackShards: 10 } }
      );
    }

    res.status(200).json({ reward: bonusReward });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update daily bonus.",
      error: error.message,
    });
  }
};
