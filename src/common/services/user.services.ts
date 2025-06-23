import { generateCode } from "../../helpers/general.helpers";
import milestones from "../models/milestones.models";
import userMythologies from "../models/mythologies.models";
import { Team, Referral } from "../models/referral.models";
import Stats from "../models/Stats.models";
import User from "../models/user.models";

export const addNewTelegramUser = async (userData) => {
  try {
    userData.referralCode = `FDG${userData.telegramId}`;
    userData.squadOwner = userData.parentReferrerId;

    if (!userData.telegramUsername) {
      const allAvatarUsers = await User.find({
        telegramUsername: { $regex: /^AVATAR\d+$/ },
      });

      let maxNumber = 0;

      allAvatarUsers.forEach((user) => {
        const number = parseInt(user.telegramUsername.slice(6), 10);
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      });

      const newEndingNumber = String(maxNumber + 1).padStart(4, "0");
      userData.telegramUsername = `AVATAR${newEndingNumber}`;
    }

    const newUser = new User(userData);
    const newUserCreated = await newUser.save();

    // update user count
    await updateUserCount("telegram");

    return newUserCreated;
  } catch (error) {
    throw new Error("Failed to create a new user.");
  }
};

export const addNewKaiaAddrUser = async (userData) => {
  try {
    const genRandomCode = generateCode(6);
    userData.referralCode = `FDGLIN${genRandomCode}`;

    if (!userData.telegramUsername) {
      const allAvatarUsers = await User.find({
        telegramUsername: { $regex: /^AVATAR\d+$/ },
      });

      let maxNumber = 0;

      allAvatarUsers.forEach((user) => {
        const number = parseInt(user.telegramUsername.slice(6), 10);
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      });

      const newEndingNumber = String(maxNumber + 1).padStart(4, "0");
      userData.telegramUsername = `AVATAR${newEndingNumber}`;
    }

    const newUser = new User(userData);
    const newUserCreated = await newUser.save();

    // update user count
    await updateUserCount("line");

    return newUserCreated;
  } catch (error) {
    console.log(error);

    throw new Error("Failed to create a new user.");
  }
};

export const addNewLineUser = async (userData) => {
  try {
    const genRandomCode = generateCode(6);
    userData.referralCode = `FDGLIN${genRandomCode}`;

    if (!userData.telegramUsername) {
      const allAvatarUsers = await User.find({
        telegramUsername: { $regex: /^AVATAR\d+$/ },
      });

      let maxNumber = 0;

      allAvatarUsers.forEach((user) => {
        const number = parseInt(user.telegramUsername.slice(6), 10);
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      });

      const newEndingNumber = String(maxNumber + 1).padStart(4, "0");
      userData.telegramUsername = `AVATAR${newEndingNumber}`;
    }

    const newUser = new User(userData);
    const newUserCreated = await newUser.save();

    // update user count
    await updateUserCount("line");

    return newUserCreated;
  } catch (error) {
    console.log(error);

    throw new Error("Failed to create a new user.");
  }
};

export const addNewTwitterUser = async (userData) => {
  try {
    const genRandomCode = generateCode(6);

    userData.referralCode = `FDGXT${genRandomCode}`;

    if (!userData.telegramUsername) {
      const allAvatarUsers = await User.find({
        telegramUsername: { $regex: /^AVATAR\d+$/ },
      });

      let maxNumber = 0;

      allAvatarUsers.forEach((user) => {
        const number = parseInt(user.telegramUsername.slice(6), 10);
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      });

      const newEndingNumber = String(maxNumber + 1).padStart(4, "0");
      userData.telegramUsername = `AVATAR${newEndingNumber}`;
    }

    const newUser = new User(userData);
    const newUserCreated = await newUser.save();

    // update user count
    await updateUserCount("X");

    return newUserCreated;
  } catch (error) {
    console.log(error);

    throw new Error("Failed to create a new user.");
  }
};

export const addNewOTPUser = async (userData, referPartner) => {
  try {
    const genRandomCode =
      referPartner == "" ? generateCode(8) : generateCode(6);
    userData.referralCode = `FDG${referPartner + genRandomCode}`;

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

    // update user count
    await updateUserCount(referPartner);

    return newUserCreated;
  } catch (error) {
    throw new Error("Failed to create a new user.");
  }
};

export const addNewOneWaveUser = async (userData, referPartner) => {
  try {
    const genRandomCode =
      referPartner == "" ? generateCode(8) : generateCode(6);
    userData.referralCode = `FDG${referPartner + genRandomCode}`;

    if (!userData.telegramUsername) {
      const allAvatarUsers = await User.find({
        telegramUsername: { $regex: /^AVATAR\d+$/ },
      });

      let maxNumber = 0;

      allAvatarUsers.forEach((user) => {
        const number = parseInt(user.telegramUsername.slice(6), 10);
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      });

      const newEndingNumber = String(maxNumber + 1).padStart(4, "0");
      userData.telegramUsername = `AVATAR${newEndingNumber}`;
    }

    // update user count
    await updateUserCount("onewave");

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
