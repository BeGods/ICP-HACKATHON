import User from "../models/user.models";

export const createUser = async (userData) => {
  try {
    userData.referralCode = `FOF${userData.telegramId}FD`;

    const newUser = new User(userData);
    const newUserCreated = await newUser.save();
    console.log("newUSer");

    return newUserCreated;
  } catch (error) {
    console.log(error);
  }
};
