import { generateCode } from "../../helpers/general.helpers";
import milestones from "../models/milestones.models";
import userMythologies from "../models/mythologies.models";
import { Team, Referral } from "../models/referral.models";
import User from "../models/user.models";

export const addNewTelegramUser = async (userData) => {
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
    throw new Error("Failed to create a new user.");
  }
};

export const addNewLineUser = async (userData) => {
  try {
    const genRandomCode = generateCode();
    userData.referralCode = `FDG${genRandomCode}`;

    if (!userData.lineName) {
      const lastUser = await User.findOne({
        lineName: { $regex: /^AVATAR\d{4}$/ },
      })
        .sort({ lineName: -1 })
        .exec();

      let newEndingNumber = "0001";

      if (lastUser) {
        const lastEndingNumber = parseInt(lastUser.lineName.slice(-4), 10);
        newEndingNumber = String(lastEndingNumber + 1).padStart(4, "0");
      }

      userData.lineName = `AVATAR${newEndingNumber}`;
    }

    const newUser = new User(userData);
    const newUserCreated = await newUser.save();

    return newUserCreated;
  } catch (error) {
    throw new Error("Failed to create a new user.");
  }
};

export const addNewOneWaveUser = async (userData) => {
  try {
    const genRandomCode = generateCode();
    userData.referralCode = `FDG${genRandomCode}`;

    if (!userData.oneWaveUsername) {
      const lastUser = await User.findOne({
        oneWaveUsername: { $regex: /^AVATAR\d{4}$/ },
      })
        .sort({ oneWaveUsername: -1 })
        .exec();

      let newEndingNumber = "0001";

      if (lastUser) {
        const lastEndingNumber = parseInt(
          lastUser.oneWaveUsername.slice(-4),
          10
        );
        newEndingNumber = String(lastEndingNumber + 1).padStart(4, "0");
      }

      userData.oneWaveUsername = `AVATAR${newEndingNumber}`;
    }

    const newUser = new User(userData);
    const newUserCreated = await newUser.save();

    return newUserCreated;
  } catch (error) {
    throw new Error("Failed to create a new user.");
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
    throw new Error("Failed to add default usermythology.");
  }
};
