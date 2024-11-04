import milestones from "../../models/milestones.models";
import userMythologies from "../../models/mythologies.models";
import { Team, Referral } from "../../models/referral.models";
import User from "../../models/user.models";

export const addNewUser = async (userData) => {
  try {
    userData.referralCode = `FDG${userData.telegramId}`;
    userData.squadOwner = userData.parentReferrerId;

    if (!userData.telegramUsername) {
      const lastUser = await User.findOne({
        telegramUsername: { $regex: /^AVATAR\d{4}$/ },
      })
        .sort({ telegramUsername: -1 })
        .exec();

      let newEndingNumber = "0001";

      if (lastUser) {
        const lastEndingNumber = parseInt(
          lastUser.telegramUsername.slice(-4),
          10
        );
        newEndingNumber = String(lastEndingNumber + 1).padStart(4, "0");
      }

      userData.telegramUsername = `AVATAR${newEndingNumber}`;
    }

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
          $set: { teamName: referralCode },
          $push: { members: user._id },
        },
        { upsert: true }
      );

      await userMythologies.findOneAndUpdate(
        {
          userId: existingReferrer._id,
        },
        { $inc: { multiColorOrbs: 3 } }
      );

      if (!existingReferrer.parentReferrerId) {
        existingReferrer.squadOwner = existingReferrer._id;
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

    const newMilestone = new milestones({
      userId: user._id,
    });

    await newUserMyth.save();
    await newMilestone.save();
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
