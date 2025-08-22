import userMythologies from "../../common/models/mythologies.models";

export const updateMultiAutomata = async (
  mythData,
  now,
  deductValue,
  userId
) => {
  try {
    mythData.mythologies.forEach((mythology) => {
      mythology.boosters.automatalvl = Math.min(
        mythology.boosters.automatalvl + 2,
        99
      );
      mythology.boosters.isAutomataActive = true;
      mythology.boosters.automataLastClaimedAt = now;
      mythology.boosters.automataStartTime = now;
    });

    await userMythologies
      .findOneAndUpdate(
        { userId: userId },
        {
          $inc: { multiColorOrbs: deductValue },
          $set: {
            mythologies: mythData.mythologies,
          },
        },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt -_id");

    return mythData;
  } catch (error) {
    throw Error("Failed to update mythologies data.");
  }
};

export const updateMultiBurst = async (
  userMyth,
  deductValue,
  userId,
  userGameData
) => {
  try {
    userMyth.mythologies.forEach((mythology) => {
      mythology.boosters.isBurstActive = true;
    });

    await userMythologies
      .findOneAndUpdate(
        { userId: userId },
        {
          $inc: { multiColorOrbs: deductValue },
          $set: {
            mythologies: userMyth.mythologies,
          },
        },
        { new: true }
      )
      .select("-__v -createdAt -updatedAt -_id");

    await userGameData.updateOne({
      $set: {
        burstAutoPayExpiration: Date.now(),
      },
    });

    return userMyth;
  } catch (error) {
    throw Error("Failed to update mythologies data.");
  }
};
