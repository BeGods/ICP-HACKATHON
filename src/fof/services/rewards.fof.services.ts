import mongoose from "mongoose";
import partners from "../../common/models/partners.models";
import rewards from "../../common/models/rewards.models";
import milestones from "../../common/models/milestones.models";

export const fetchUserRewards = async (userId) => {
  try {
    const [activePartners, activeRewards] = await Promise.all([
      partners
        .find({ status: true })
        .lean()
        .select("-__v -createdAt -updatedAt"),
      rewards
        .find({ status: true })
        .lean()
        .select("-__v -createdAt -updatedAt"),
    ]);

    let userMilestones = await milestones.findOne({ userId });

    const result = {
      activePartners,
      activeRewards,
      userMilestones,
    };

    return result;
  } catch (error) {}
};
