import userMythologies from "../models/mythologies.models";
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

      if (existingReferrer.parentReferrerId) {
        existingReferrer.squadOwner = existingReferrer.parentReferrerId;
      }

      existingReferrer.directReferralCount += 1;
      existingReferrer.save();
    }
  } catch (error) {
    throw new Error("Could not add team member");
  }
};

export const createDefaultUserMyth = async (user) => {
  try {
    const newUserMyth = new userMythologies({
      userId: user._id,
    });

    await newUserMyth.save();
  } catch (error) {
    throw new Error("Could create default myth");
  }
};

// export const createDefaultMilestones = async (user) => {
//   try {
//     const newUserMyth = new userMythologies({
//       userId: user._id,
//     });

//     await newUserMyth.save();
//   } catch (error) {
//     throw new Error("Could create default myth");
//   }
// };
