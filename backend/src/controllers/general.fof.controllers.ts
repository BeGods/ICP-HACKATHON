import User from "../models/user.models";
import ranks from "../models/ranks.models";
import {
  claimBonusBooster,
  claimBonusOrb,
  claimBonusQuest,
  getLeaderboardSnapshot,
  getRandomValue,
  updatePartnersInLastHr,
} from "../services/general.fof.services";
import Stats from "../models/Stats.models";
import { Team } from "../models/referral.models";
import userMythologies from "../models/mythologies.models";
import {
  claimPlaysuperReward,
  fetchPlaysuperOrders,
  fetchPlaySuperRewards,
  getPlaysuperOtp,
  resendPlaysuperOtp,
  verifyPlaysuperOtp,
} from "../services/game.fof.services";
import milestones from "../models/milestones.models";
import partners from "../models/partners.models";
import { validCountries } from "../utils/constants/variables";

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
  const user = req.user;

  try {
    const overallLeaderboard = await ranks
      .find()
      .sort({ totalOrbs: -1 })
      .limit(100)
      .select("-__v -createdAt -updatedAt");

    const squadOwner = user?.squadOwner ? user?.squadOwner : user._id;

    const squadLeaderboard = await ranks
      .find({ squadOwner: squadOwner })
      .sort({ totalOrbs: -1 })
      .limit(100)
      .select("-__v -createdAt -updatedAt");

    res.status(200).json({
      leaderboard: overallLeaderboard,
      squad: squadLeaderboard.sort((a, b) => a.squadRank - b.squadRank),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateRanks = async (req, res) => {
  try {
    const leaderboard = await getLeaderboardSnapshot();

    const squadPipeline = [
      {
        $group: {
          _id: "$squadOwner",
          totalOrbs: { $sum: "$totalOrbs" },
        },
      },
      {
        $sort: { totalOrbs: -1 as -1 },
      },
    ];

    const squadOrbs = await ranks
      .aggregate(squadPipeline)
      .allowDiskUse(true)
      .exec();

    // Map to get squad ranks
    // const squadRankMap = new Map();
    // squadOrbs.forEach((squad, index) => {
    //   if (squad._id) {
    //     // Ensure the _id (parentReferrerId) is not null
    //     squadRankMap.set(squad._id.toString(), index + 1);
    //   }
    // });

    // Calculate overall rank based on totalOrbs
    const sortedUsers = leaderboard
      .map((user, index) => ({ ...user, overallRank: index + 1 }))
      .sort((a, b) => b.totalOrbs - a.totalOrbs);

    const usersBySquad = {};

    sortedUsers.forEach((user) => {
      if (user.squadOwner) {
        const parentId = user.squadOwner.toString();
        if (!usersBySquad[parentId]) {
          usersBySquad[parentId] = [];
        }
        usersBySquad[parentId].push(user);
      }
    });

    // Calculate ranks within each squad
    Object.keys(usersBySquad).forEach((squadId) => {
      const squadUsers = usersBySquad[squadId];
      squadUsers.sort((a, b) => b.totalOrbs - a.totalOrbs);
      squadUsers.forEach((user, index) => {
        user.squadRank = index + 1;
      });
    });

    // Prepare bulk operations for updating ranks
    const bulkOps = sortedUsers.map((user) => {
      let squadRank = 0;
      if (user.squadOwner) {
        const parentId = user.squadOwner.toString();
        squadRank = usersBySquad[parentId]
          ? usersBySquad[parentId].find(
              (u) => u.userId.toString() === user.userId.toString()
            ).squadRank
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
              squadRank: squadRank,
            },
          },
          upsert: true,
        },
      };
    });

    await ranks.bulkWrite(bulkOps);

    // Prepare bulk operations for teams
    const teamBulkOps = squadOrbs.map((squad) => ({
      updateOne: {
        filter: { owner: squad._id },
        update: {
          $set: { totalOrbs: squad.totalOrbs },
        },
        upsert: true,
      },
    }));

    await Team.bulkWrite(teamBulkOps);

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
            dailyBonusClaimedAt: currTimeInUTC,
            exploitCount: 0,
          },
        }
      );
    } else {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            dailyBonusClaimedAt: currTimeInUTC,
          },
          $inc: { exploitCount: 1 },
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
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const claimJoiningBonus = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findOneAndUpdate({ _id: userId }, { joiningBonus: true });

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

    const userMilestones = await milestones.findOne({ userId: userId });
    const activePartners = await partners.find({});
    const userRewards = userMilestones.rewards.claimedRewards;

    const claimedRewards = userRewards
      .filter((item) => item.tokensCollected == 12)
      .map((item) => item.partnerId.toString());

    const availablePartners = activePartners.filter(
      (item) => !claimedRewards.includes(item._id.toString())
    );

    if (availablePartners.length === 0) {
      user.streakBonus = Date.now();
      user.save();
      res.status(200).json({ reward: "fdg" });
      return;
    }

    const randomPartner = Math.floor(Math.random() * availablePartners.length);
    const partnerExists = userRewards.find(
      (item) =>
        item.partnerId == availablePartners[randomPartner]._id.toString()
    );

    if (partnerExists) {
      await milestones.findOneAndUpdate(
        {
          userId,
          "rewards.claimedRewards.partnerId":
            availablePartners[randomPartner]._id.toString(),
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
              partnerId: availablePartners[randomPartner]._id.toString(),
              type: "custom",
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

    user.streakBonus = Date.now();
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
    const playusperCred = req.user.playsuper;
    const { country, lang } = req.query;

    let userMilestones = await milestones.findOne({ userId });
    userMilestones = await updatePartnersInLastHr(userMilestones);

    const claimedRewards = userMilestones.rewards.claimedRewards;
    const rewardsClaimedInLastHr = userMilestones.rewards.rewardsInLastHr;

    const activePartners = await partners
      .find()
      .lean()
      .select("-__v -createdAt -updatedAt");

    let playsuper = [];
    let activeCustomPartners = [];
    let claimedCustomPartners = [];

    // playsuper partners
    if (validCountries.includes(country)) {
      const playsuperRewards = await fetchPlaySuperRewards(
        country,
        lang,
        playusperCred
      );

      playsuper = playsuperRewards.map((reward) => {
        const claimedReward = claimedRewards.find(
          (claimed) => claimed.partnerId === reward.id
        );

        const tokensCollected = claimedReward
          ? claimedReward.tokensCollected
          : 0;
        const isClaimed = claimedReward ? claimedReward.isClaimed : false;

        return {
          ...reward,
          partnerType: "playsuper",
          tokensCollected,
          isClaimed,
        };
      });
    }

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
    const playSuperItems = playsuper.slice(0, 9);
    const remainingSlots = 12 - playSuperItems.length;
    const partnerItems = activeCustomPartners.slice(0, remainingSlots);

    // playsuper orders
    const playsuperOrders = await fetchPlaysuperOrders(lang, playusperCred.key);

    const claimedPlaysuperOrders = playsuperOrders
      .filter((reward) =>
        claimedRewards.some((claimed) => reward.rewardId === claimed.partnerId)
      )
      .map((reward) => {
        const claimedReward = claimedRewards.find(
          (claimed) => claimed.partnerId === reward.rewardId
        );

        return {
          ...reward,
          id: reward.rewardId,
          partnerType: "playsuper",
          tokensCollected: claimedReward ? claimedReward.tokensCollected : 0,
          isClaimed: claimedReward ? claimedReward.isClaimed : false,
        };
      });

    res.status(200).json({
      rewards: [...playSuperItems, ...partnerItems],
      claimedRewards: [...claimedPlaysuperOrders, ...claimedCustomPartners],
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
