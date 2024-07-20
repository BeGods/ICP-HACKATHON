import { Team, Referral } from "../models/referral.models";
import User from "../models/user.models";

export const createUser = async (userData) => {
  try {
    userData.referralCode = `FDG${userData.telegramId}`;

    const newUser = new User(userData);
    const newUserCreated = await newUser.save();

    return newUserCreated;
  } catch (error) {
    throw new Error("Could not create user");
  }
};

export const addTeamMember = async (user, existingReferrer, referralCode) => {
  try {
    if (user.parentReferrerId) {
      await Referral.findOneAndUpdate(
        { userId: user.parentReferrerId },
        { $push: { directInvites: user._id } },
        { upsert: true }
      );

      await Team.findOneAndUpdate(
        { owner: user.parentReferrerId },
        {
          $push: { members: user._id },
          teamName: referralCode,
        },
        { upsert: true }
      );

      existingReferrer.directReferralCount += 1;
      existingReferrer.save();
    }
  } catch (error) {
    throw new Error("Could not add team member");
  }
};
