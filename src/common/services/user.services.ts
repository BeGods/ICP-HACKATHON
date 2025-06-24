import { generateCode } from "../../helpers/general.helpers";
import milestones from "../models/milestones.models";
import userMythologies from "../models/mythologies.models";
import { Team, Referral } from "../models/referral.models";
import Stats from "../models/Stats.models";
import User from "../models/user.models";
import { getAvatarCounter } from "./redis.services";
import { generateNanoId } from "../../utils/nanoId";

export const addNewUser = async (userData, prefix, key) => {
  try {
    if (userData.telegramId) {
      userData.referralCode = `FDG${userData.telegramId}`;
    } else {
      const genRandomCode = generateCode(6);
      userData.referralCode = `FDG${prefix}${genRandomCode}`;
    }

    if (!userData.telegramUsername) {
      const nanoId = await generateNanoId();
      userData.telegramUsername = `${prefix}${nanoId}`;
    }

    const newUser = new User(userData);
    const newUserCreated = await newUser.save();

    // update user count
    await updateUserCount(key);

    return newUserCreated;
  } catch (error) {
    throw new Error(`Failed to create a new user: ${error}`);
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

      // existingReferrer.directReferralCount += 1;
      existingReferrer.save();
    }
  } catch (error) {
    throw new Error("Failed to add refer for user.");
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
    console.log(error);

    throw new Error("Failed to add default usermythology.");
  }
};

export const validateUsername = async (username) => {
  try {
    const user = await User.findOne({ telegramUsername: username });
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Failed to validate username.");
  }
};

export const updateUserCount = async (key) => {
  try {
    await Stats.findOneAndUpdate(
      { statId: "begods" },
      { $inc: { totalUsers: 1 } },
      { upsert: true, new: true }
    );

    if (key && key !== "") {
      await Stats.findOneAndUpdate(
        { statId: key },
        { $inc: { totalUsers: 1 } },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    throw new Error("Failed to update stats.");
  }
};
