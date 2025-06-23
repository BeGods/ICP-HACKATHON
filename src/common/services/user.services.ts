import { generateCode } from "../../helpers/general.helpers";
import milestones from "../models/milestones.models";
import userMythologies from "../models/mythologies.models";
import { Team, Referral } from "../models/referral.models";
import Stats from "../models/Stats.models";
import User from "../models/user.models";
import { getAvatarCounter } from "./redis.services";

export const addNewTelegramUser = async (userData) => {
  try {
    userData.referralCode = `FDG${userData.telegramId}`;
    userData.squadOwner = userData.parentReferrerId;

    const MAX_RETRIES = 5;
    let attempt = 0;
    let newUserCreated = null;

    while (attempt < MAX_RETRIES) {
      try {
        if (!userData.telegramUsername) {
          userData.telegramUsername = await getAvatarCounter(User);
          await new Promise((res) => setTimeout(res, 50));
        }

        const newUser = new User(userData);
        newUserCreated = await newUser.save();
        break;
      } catch (err) {
        if (
          err.code === 11000 &&
          err.keyPattern &&
          err.keyPattern.telegramUsername
        ) {
          console.warn(
            `Duplicate telegramUsername ${userData.telegramUsername}, retrying...`
          );
          userData.telegramUsername = null;
          attempt++;
        } else {
          throw err;
        }
      }
    }

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

    const MAX_RETRIES = 5;
    let attempt = 0;
    let newUserCreated = null;

    while (attempt < MAX_RETRIES) {
      try {
        if (!userData.telegramUsername) {
          userData.telegramUsername = await getAvatarCounter(User);
          await new Promise((res) => setTimeout(res, 50));
        }

        const newUser = new User(userData);
        newUserCreated = await newUser.save();
        break;
      } catch (err) {
        if (
          err.code === 11000 &&
          err.keyPattern &&
          err.keyPattern.telegramUsername
        ) {
          console.warn(
            `Duplicate telegramUsername ${userData.telegramUsername}, retrying...`
          );
          userData.telegramUsername = null;
          attempt++;
        } else {
          throw err;
        }
      }
    }

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

    const MAX_RETRIES = 5;
    let attempt = 0;
    let newUserCreated = null;

    while (attempt < MAX_RETRIES) {
      try {
        if (!userData.telegramUsername) {
          userData.telegramUsername = await getAvatarCounter(User);
          await new Promise((res) => setTimeout(res, 50));
        }

        const newUser = new User(userData);
        newUserCreated = await newUser.save();
        break;
      } catch (err) {
        if (
          err.code === 11000 &&
          err.keyPattern &&
          err.keyPattern.telegramUsername
        ) {
          console.warn(
            `Duplicate telegramUsername ${userData.telegramUsername}, retrying...`
          );
          userData.telegramUsername = null;
          attempt++;
        } else {
          throw err;
        }
      }
    }

    if (!newUserCreated) {
      throw new Error(
        "Failed to generate unique telegramUsername after retries."
      );
    }

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

    const MAX_RETRIES = 5;
    let attempt = 0;
    let newUserCreated = null;

    while (attempt < MAX_RETRIES) {
      try {
        if (!userData.telegramUsername) {
          userData.telegramUsername = await getAvatarCounter(User);
          await new Promise((res) => setTimeout(res, 50));
        }

        const newUser = new User(userData);
        newUserCreated = await newUser.save();
        break;
      } catch (err) {
        if (
          err.code === 11000 &&
          err.keyPattern &&
          err.keyPattern.telegramUsername
        ) {
          console.warn(
            `Duplicate telegramUsername ${userData.telegramUsername}, retrying...`
          );
          userData.telegramUsername = null;
          attempt++;
        } else {
          throw err;
        }
      }
    }

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

    const MAX_RETRIES = 5;
    let attempt = 0;
    let newUserCreated = null;

    while (attempt < MAX_RETRIES) {
      try {
        if (!userData.telegramUsername) {
          userData.telegramUsername = await getAvatarCounter(User);
          await new Promise((res) => setTimeout(res, 50));
        }

        const newUser = new User(userData);
        newUserCreated = await newUser.save();
        break;
      } catch (err) {
        if (
          err.code === 11000 &&
          err.keyPattern &&
          err.keyPattern.telegramUsername
        ) {
          console.warn(
            `Duplicate telegramUsername ${userData.telegramUsername}, retrying...`
          );
          userData.telegramUsername = null;
          attempt++;
        } else {
          throw err;
        }
      }
    }
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

    const MAX_RETRIES = 3;
    let attempt = 0;
    let newUserCreated = null;

    while (attempt < MAX_RETRIES) {
      try {
        if (!userData.telegramUsername) {
          userData.telegramUsername = await getAvatarCounter(User);
          await new Promise((res) => setTimeout(res, 50));
        }

        const newUser = new User(userData);
        newUserCreated = await newUser.save();
        break;
      } catch (err) {
        if (
          err.code === 11000 &&
          err.keyPattern &&
          err.keyPattern.telegramUsername
        ) {
          console.warn(
            `Duplicate telegramUsername ${userData.telegramUsername}, retrying...`
          );
          userData.telegramUsername = null;
          attempt++;
        } else {
          throw err;
        }
      }
    }
    // update user count
    await updateUserCount("onewave");

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
