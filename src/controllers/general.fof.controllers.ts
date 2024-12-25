import User from "../models/user.models";
import ranks from "../models/ranks.models";
import {
  claimBonusBooster,
  claimBonusOrb,
  claimBonusQuest,
  getLeaderboardRanks,
  getLeaderboardSnapshot,
  getRandomValue,
  sortRanksByCountry,
  updatePartnersInLastHr,
} from "../services/general.fof.services";
import Stats from "../models/Stats.models";
import userMythologies from "../models/mythologies.models";
import {
  claimPlaysuperReward,
  fetchPlaySuperRewards,
  getPlaysuperOtp,
  resendPlaysuperOtp,
  verifyPlaysuperOtp,
} from "../services/playsuper.services";
import milestones from "../models/milestones.models";
import partners from "../models/partners.models";
import { validCountries } from "../utils/constants/variables";
import quest from "../models/quests.models";
import axios from "axios";

export const ping = async (req, res) => {
  try {
    res.send("Server is runnnig fine.");
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getLeaderboard = async (req, res) => {
  const { page } = req.query;
  const requestPage = page || 0;
  try {
    const overallLeaderboard = await getLeaderboardRanks(requestPage, 100);

    res.status(200).json({
      leaderboard: overallLeaderboard[0].active,
      hallOfFame: overallLeaderboard[0].finished,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// const squadOwner = user?.squadOwner ? user?.squadOwner : user._id;

// const squadLeaderboard = await ranks
// .find({ squadOwner: squadOwner })
// .sort({ totalOrbs: -1 })
// .limit(100)
// .select("-__v -createdAt -updatedAt");

// squad: squadLeaderboard.sort((a, b) => a.squadRank - b.squadRank),

// export const updateRanks = async (req, res) => {
//   try {
//     const leaderboard = await getLeaderboardSnapshot();

//     // const squadPipeline = [
//     //   {
//     //     $group: {
//     //       _id: "$squadOwner",
//     //       totalOrbs: { $sum: "$totalOrbs" },
//     //     },
//     //   },
//     //   {
//     //     $sort: { totalOrbs: -1 as -1 },
//     //   },
//     // ];

//     // const squadOrbs = await ranks
//     //   .aggregate(squadPipeline)
//     //   .allowDiskUse(true)
//     //   .exec();

//     // Map to get squad ranks
//     // const squadRankMap = new Map();
//     // squadOrbs.forEach((squad, index) => {
//     //   if (squad._id) {
//     //     // Ensure the _id (parentReferrerId) is not null
//     //     squadRankMap.set(squad._id.toString(), index + 1);
//     //   }
//     // });

//     // Calculate overall rank based on totalOrbs
//     const sortedUsers = leaderboard
//       .map((user, index) => ({ ...user, overallRank: index + 1 }))
//       .sort((a, b) => b.totalOrbs - a.totalOrbs);

//     const usersBySquad = {};

//     sortedUsers.forEach((user) => {
//       if (user.squadOwner) {
//         const parentId = user.squadOwner.toString();
//         if (!usersBySquad[parentId]) {
//           usersBySquad[parentId] = [];
//         }
//         usersBySquad[parentId].push(user);
//       }
//     });

//     // Calculate ranks within each squad
//     Object.keys(usersBySquad).forEach((squadId) => {
//       const squadUsers = usersBySquad[squadId];
//       squadUsers.sort((a, b) => b.totalOrbs - a.totalOrbs);
//       squadUsers.forEach((user, index) => {
//         user.squadRank = index + 1;
//       });
//     });

//     // Prepare bulk operations for updating ranks
//     const bulkOps = sortedUsers.map((user) => {
//       let squadRank = 0;
//       // if (user.squadOwner) {
//       //   const parentId = user.squadOwner.toString();
//       //   squadRank = usersBySquad[parentId]
//       //     ? usersBySquad[parentId].find(
//       //         (u) => u.userId.toString() === user.userId.toString()
//       //       ).squadRank
//       //     : 1;
//       // }

//       return {
//         updateOne: {
//           filter: { userId: user.userId },
//           update: {
//             $set: {
//               userId: user.userId,
//               telegramUsername: user.telegramUsername,
//               profileImage: user.profileImage,
//               totalOrbs: user.totalOrbs,
//               squadOwner: user.squadOwner,
//               overallRank: user.overallRank,
//               country: user.country ?? "NA",
//               squadRank: squadRank,
//             },
//           },
//           upsert: true,
//         },
//       };
//     });

//     await ranks.bulkWrite(bulkOps);

//     // Prepare bulk operations for teams
//     // const teamBulkOps = squadOrbs.map((squad) => ({
//     //   updateOne: {
//     //     filter: { owner: squad._id },
//     //     update: {
//     //       $set: { totalOrbs: squad.totalOrbs },
//     //     },
//     //     upsert: true,
//     //   },
//     // }));

//     // await Team.bulkWrite(teamBulkOps);

//     // const totalUsers = await User.countDocuments({});
//     await Stats.findOneAndUpdate(
//       { statId: "fof" },
//       { $set: { totalUsers: totalUsers } },
//       { upsert: true }
//     );
//     console.log("Leaderboard updated successfully.");

//     res.status(200).json({ message: "Leaderboard updated successfully." });
//   } catch (error) {
//     console.error("Error during updateRanks:", error);
//     res.status(500).json({
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };

export const updateRanks = async (req, res) => {
  try {
    const leaderboard = await getLeaderboardSnapshot();

    const finishedUsers = leaderboard.filter((user) => user.totalOrbs > 999999);
    const activeUsers = leaderboard.filter((user) => user.totalOrbs <= 999999);

    // overall rank
    const sortedUsers = activeUsers
      .map((user, index) => ({
        ...user,
        overallRank: index + 1,
      }))
      .sort((a, b) => b.totalOrbs - a.totalOrbs);

    const usersByCountry = await sortRanksByCountry(sortedUsers);

    // Update ranks in bulk for active users
    const bulkOps = sortedUsers.map((user) => {
      let userCountryRank = 0;
      if (user.country && user.country !== "NA") {
        const key = user.country;
        userCountryRank = usersByCountry[key]
          ? usersByCountry[key].find(
              (u) => u.userId.toString() === user.userId.toString()
            ).countryRank
          : 1;
      }
      return {
        updateOne: {
          filter: { userId: user.userId },
          update: {
            $set: {
              userId: user.userId,
              telegramUsername: user.telegramUsername,
              profileImage: user.profileImage,
              totalOrbs: user.totalOrbs,
              squadOwner: user.squadOwner,
              overallRank: user.overallRank,
              country: user.country ?? "NA",
              countryRank: userCountryRank,
              gameData: {
                ...user.mythologyOrbsData.reduce((acc, obj) => {
                  if (obj.name && obj.orbs !== undefined) {
                    acc[obj.name.toLowerCase()] = obj.orbs;
                  }
                  return acc;
                }, {}),
                blackOrbs: user.blackOrbs,
                multiColorOrbs: user.multiColorOrbs,
              },
              squadRank: 0,
            },
          },
          upsert: true,
        },
      };
    });

    // Mark finished users
    const finishedOps = finishedUsers.map((user) => ({
      updateOne: {
        filter: { userId: user.userId },
        update: {
          $set: {
            fofCompletedAt: user.finishedAt,
            userId: user.userId,
            telegramUsername: user.telegramUsername,
            profileImage: user.profileImage,
            totalOrbs: user.totalOrbs,
            squadOwner: user.squadOwner,
            overallRank: 0,
            country: user.country ?? "NA",
            countryRank: 0,
            gameData: {
              ...user.mythologyOrbsData.reduce((acc, obj) => {
                if (obj.name && obj.orbs !== undefined) {
                  acc[obj.name.toLowerCase()] = obj.orbs;
                }
                return acc;
              }, {}),
              blackOrbs: user.blackOrbs,
              multiColorOrbs: user.multiColorOrbs,
            },
            squadRank: 0,
          },
        },
        upsert: true,
      },
    }));

    // Perform bulkWrite operations
    await ranks.bulkWrite([...bulkOps, ...finishedOps]);

    const totalUsers = await User.countDocuments({});
    await Stats.findOneAndUpdate(
      { statId: "fof" },
      { $set: { totalUsers: totalUsers } },
      { upsert: true }
    );

    console.log("Leaderboard updated successfully.");
  } catch (error) {
    console.error("Error during updateRanks:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const fetchUserData = async (req, res) => {
  try {
    const telegramUsername = req.body.telegramUsername;

    const userData = await User.findOne({ telegramUsername: telegramUsername });
    const userMythData = await userMythologies.findOne({
      userId: userData._id,
    });

    res.status(200).json({ data: userData });
  } catch (error) {
    console.error("Error during viewUser:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const userId = req.user;
    const { updatedValue } = req.body;

    await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { announcements: updatedValue } }
    );

    res.status(200).json({ message: "Announcements updated successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimDailyBonus = async (req, res) => {
  try {
    const user = req.user;
    const isNotClaimedToday = req.isNotClaimedToday;

    const result = getRandomValue();
    const currTimeInUTC = new Date();
    let bonusReward;

    if (isNotClaimedToday) {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            "bonus.fof.dailyBonusClaimedAt": currTimeInUTC,
            "bonus.fof.exploitCount": 0,
          },
        }
      );
    } else {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            "bonus.fof.dailyBonusClaimedAt": currTimeInUTC,
          },
          $inc: { "bonus.fof.exploitCount": 1 },
        }
      );
    }

    if (result === "blackOrb") {
      bonusReward = await claimBonusOrb(result, user._id);
    } else if (result === "mythOrb") {
      bonusReward = await claimBonusOrb(result, user._id);
    } else if (result === "booster") {
      bonusReward = await claimBonusBooster(user._id);
    } else if (result === "quest") {
      bonusReward = await claimBonusQuest(user._id);
    }

    res.status(200).json({ reward: bonusReward });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimJoiningBonus = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findOneAndUpdate(
      { _id: userId },
      { "bonus.fof.joiningBonus": true }
    );

    await userMythologies.findOneAndUpdate(
      { userId: userId, "mythologies.name": "Greek" },
      { $inc: { multiColorOrbs: 3, "mythologies.$.orbs": 2 } }
    );

    res.status(200).json({ message: "Joining bonus claimed successfully." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimStreakBonus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;
    const playusperCred = req.user.playsuper;
    const { country } = req.query;

    const userMilestones = await milestones.findOne({ userId: userId });
    const activePartners = await partners.find().lean();
    const userRewards = userMilestones.rewards.claimedRewards;

    let playsuper = [];

    if (validCountries.includes(country)) {
      const playsuperRewards = await fetchPlaySuperRewards(
        country,
        "en",
        playusperCred
      );

      playsuper = playsuperRewards.map((reward) => {
        return {
          ...reward,
          partnerType: "playsuper",
        };
      });
    }

    const claimedRewards = userRewards
      .filter((item) => item.tokensCollected == 12)
      .map((item) => item.partnerId.toString());

    const filteredCustomRewards = activePartners
      .filter(
        (item) =>
          !claimedRewards.includes(item._id.toString()) && !item.isCharity
      )
      .map((item) => ({
        ...item,
        id: item._id,
      }));

    const availablePartners = [...filteredCustomRewards, ...playsuper];

    if (availablePartners.length === 0) {
      user.save();
      res.status(200).json({ reward: "fdg" });
      return;
    }

    const randomPartner = Math.floor(Math.random() * availablePartners.length);
    const partnerExists = userRewards.find(
      (item) => item.partnerId == availablePartners[randomPartner].id.toString()
    );

    if (partnerExists) {
      await milestones.findOneAndUpdate(
        {
          userId,
          "rewards.claimedRewards.partnerId":
            availablePartners[randomPartner].id.toString(),
        },
        {
          $set: { "rewards.updatedAt": Date.now() },
          $inc: { "rewards.claimedRewards.$.tokensCollected": 1 },
        },
        {
          new: true,
        }
      );
    } else {
      await userMilestones.updateOne(
        {
          $set: {
            "rewards.updatedAt": Date.now(),
          },
          $push: {
            "rewards.claimedRewards": {
              partnerId: availablePartners[randomPartner].id.toString(),
              type:
                availablePartners[randomPartner].partnerType == "playsuper"
                  ? "playsuper"
                  : "custom",
              isClaimed: false,
              tokensCollected: 1,
            },
          },
        },
        { new: true }
      );
    }

    res.status(200).json({
      reward: availablePartners[randomPartner],
    });

    user.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getRewards = async (req, res) => {
  try {
    const userId = req.user._id;
    // const playusperCred = req.user.playsuper;
    const { country, lang } = req.query;

    let userMilestones = await milestones.findOne({ userId });
    userMilestones = await updatePartnersInLastHr(userMilestones);

    const claimedRewards = userMilestones.rewards.claimedRewards;
    const rewardsClaimedInLastHr = userMilestones.rewards.rewardsInLastHr;

    const activePartners = await partners
      .find()
      .lean()
      .select("-__v -createdAt -updatedAt");

    // let playsuper = [];
    let activeCustomPartners = [];
    let claimedCustomPartners = [];

    // playsuper partners
    // if (validCountries.includes(country)) {
    //   const playsuperRewards = await fetchPlaySuperRewards(
    //     country,
    //     lang,
    //     playusperCred
    //   );

    //   playsuper = playsuperRewards.map((reward) => {
    //     const claimedReward = claimedRewards.find(
    //       (claimed) => claimed.partnerId === reward.id
    //     );

    //     const tokensCollected = claimedReward
    //       ? claimedReward.tokensCollected
    //       : 0;
    //     const isClaimed = claimedReward ? claimedReward.isClaimed : false;

    //     return {
    //       ...reward,
    //       partnerType: "playsuper",
    //       tokensCollected,
    //       isClaimed,
    //     };
    //   });
    // }

    // inhlouse partners
    const ourPartners = activePartners.map((reward) => {
      const claimedReward = claimedRewards.find(
        (claimed) => claimed.partnerId == reward._id.toString()
      );

      const tokensCollected = claimedReward ? claimedReward.tokensCollected : 0;
      const isClaimed = claimedReward ? claimedReward.isClaimed : false;

      return {
        ...reward,
        id: reward._id,
        partnerType: "custom",
        tokensCollected,
        isClaimed,
      };
    });

    //? till here I have fetched and mapped the custom-playsuper partners
    // active - custom
    activeCustomPartners = ourPartners.filter(
      (item) => item.tokensCollected < 12
    );
    // completed - playsuper
    claimedCustomPartners = ourPartners.filter(
      (item) => item.tokensCollected === 12
    );

    // manage number of parters
    // const playSuperItems = playsuper.slice(0, 9);
    // const remainingSlots = 12 - playSuperItems.length;
    // const partnerItems = activeCustomPartners.slice(0, remainingSlots);
    const partnerItems = activeCustomPartners;

    // playsuper orders
    // const playsuperOrders = await fetchPlaysuperOrders(lang, playusperCred.key);

    // const claimedPlaysuperOrders = playsuperOrders
    //   .filter((reward) =>
    //     claimedRewards.some((claimed) => reward.rewardId === claimed.partnerId)
    //   )
    //   .map((reward) => {
    //     const claimedReward = claimedRewards.find(
    //       (claimed) => claimed.partnerId === reward.rewardId
    //     );

    //     return {
    //       ...reward,
    //       id: reward.rewardId,
    //       partnerType: "playsuper",
    //       tokensCollected: claimedReward ? claimedReward.tokensCollected : 0,
    //       isClaimed: claimedReward ? claimedReward.isClaimed : false,
    //     };
    //   });

    res.status(200).json({
      rewards: [...partnerItems],
      claimedRewards: [...claimedCustomPartners],
      rewardsClaimedInLastHr: rewardsClaimedInLastHr,
      bubbleLastClaimed: userMilestones.rewards.updatedAt,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// playsuper
export const generateOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    await getPlaysuperOtp(mobileNumber);
    res.status(200).json({ message: "OTP has been sent successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    const response = await resendPlaysuperOtp(mobileNumber);
    res.status(200).json({ otp: response });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mobileNumber, name, otp } = req.body;

    const response = await verifyPlaysuperOtp(mobileNumber, otp);

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          name: name,
          phoneNumber: mobileNumber,
          "playsuper.isVerified": true,
          "playsuper.key": response.data.access_token,
          "playsuper.createdAt": Date.now(),
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Authenticated successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const redeemPlayuperReward = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user._id;
    const updatedPartner = req.partner;
    const { rewardId } = req.body;

    const reward = await claimPlaysuperReward(rewardId, user.playsuper.key);

    updatedPartner.isClaimed = true;
    updatedPartner.orderId = reward.data.orderId;
    // updatedPartner.couponCode = reward.couponCode;

    if (reward) {
      await milestones.findOneAndUpdate(
        { userId, "rewards.claimedRewards.partnerId": rewardId },
        {
          $set: {
            "rewards.claimedRewards.$": updatedPartner,
          },
        }
      );
    }

    res.status(200).json({
      couponCode: reward.data.couponCode,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const redeemCustomReward = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedPartner = req.partner;
    const { partnerId } = req.body;

    updatedPartner.isClaimed = true;

    await milestones.findOneAndUpdate(
      { userId, "rewards.claimedRewards.partnerId": partnerId },
      {
        $set: {
          "rewards.claimedRewards.$": updatedPartner,
        },
      }
    );

    await userMythologies.findOneAndUpdate(
      { userId },
      {
        $inc: {
          blackOrbs: 3,
        },
      }
    );

    res.status(200).json({
      message: "Reward claimed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const createPartner = async (req, res) => {
  try {
    const { data } = req.body;

    const newPartner = new partners(data);

    await newPartner.save();
    res.status(201).json({ message: "Partner added successfully." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const clearRewardsInLastHr = async (req, res) => {
  try {
    await milestones.bulkWrite([
      {
        updateMany: {
          filter: {},
          update: { $set: { "rewards.rewardsInLastHr": [] } },
        },
      },
    ]);

    res.status(200).json({ message: "rewardsInLastHr is cleared." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await Stats.findOne({ statId: "fof" });
    res.status(200).json({ totalUsers: totalUsers.totalUsers });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const migrateDb = async (req, res) => {
  try {
    await User.updateMany({}, [
      {
        $set: {
          bonus: {
            fof: {
              exploitCount: "$exploitCount",
              joiningBonus: "$joiningBonus",
              streakBonus: {
                isActive: false,
                claimedAt: 0,
                streakCount: 0,
              },
              dailyBonusClaimedAt: "$dailyBonusClaimedAt",
            },
          },
        },
      },
      {
        $unset: [
          "exploitCount",
          "joiningBonus",
          "streakBonus",
          "dailyBonusClaimedAt",
        ],
      },
    ]);

    res.status(200).json({ data: "done" });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getDailyUsers = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };

    const count = await User.countDocuments(query);
    res.status(200).json({ totalUsers: count });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getDailyActiveUsers = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
      lastLoginAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };

    const count = await User.countDocuments(query);
    res.status(200).json({ totalUsers: count });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateDailyQuest = async (req, res) => {
  try {
    const currentDate = new Date();
    const previousDate = new Date(currentDate);

    previousDate.setUTCDate(previousDate.getUTCDate() - 1);
    const previousDayStart = new Date(
      Date.UTC(
        previousDate.getUTCFullYear(),
        previousDate.getUTCMonth(),
        previousDate.getUTCDate()
      )
    );
    const previousDayEnd = new Date(
      Date.UTC(
        previousDate.getUTCFullYear(),
        previousDate.getUTCMonth(),
        previousDate.getUTCDate() + 1
      )
    );

    // inactive previous quests
    await quest.updateMany(
      {
        createdAt: {
          $gte: previousDayStart,
          $lt: previousDayEnd,
        },
      },
      { $set: { status: "Inactive" } }
    );

    // curr date in given date format
    const currentDayKey =
      currentDate.toISOString().slice(8, 10) +
      "-" +
      currentDate.toISOString().slice(5, 7) +
      "-" +
      currentDate.toISOString().slice(2, 4);

    const fetchedQuests = await axios.get(
      "https://begods.github.io/public-assets/quests.json"
    );
    const dailyQuests = fetchedQuests.data;

    // fetch quest of the day
    const questForToday = dailyQuests[currentDayKey];
    if (questForToday) {
      const questWithCreatedAt = new quest({
        ...questForToday,
        createdAt: new Date(),
      });

      await questWithCreatedAt.save();

      console.log("Daily quests updated.");
      res.status(200).json({ message: "Daily quests updated successfully." });
    } else {
      console.log("No quests available for today.");
      res.status(404).json({ message: "No quests available for today." });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getHourlyUsers = async (req, res) => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const query = {
      createdAt: {
        $gte: oneHourAgo,
        $lte: now,
      },
    };

    const count = await User.countDocuments(query);
    res.status(200).json({ totalUsers: count });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
