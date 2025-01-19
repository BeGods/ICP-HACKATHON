import milestones from "../../common/models/milestones.models";
import userMythologies from "../../common/models/mythologies.models";
import partners from "../../common/models/partners.models";
import {
  OrbsTransactions,
  RewardsTransactions,
} from "../../common/models/transactions.models";
import User from "../../common/models/user.models";
import { updatePartnersInLastHr } from "../services/general.fof.services";
import {
  claimPlaysuperReward,
  getPlaysuperOtp,
  resendPlaysuperOtp,
  verifyPlaysuperOtp,
} from "../../common/services/playsuper.services";

// operations
export const getAllPartners = async (req, res) => {
  try {
    const userId = req.user._id;
    // const playusperCred = req.user.playsuper;
    const country = req.user.country ?? null;

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
    const partnerItems = activeCustomPartners.sort(
      (a, b) => b.startDate - a.startDate
    );

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
      message: "Failed to fetch partners.",
      error: error.message,
    });
  }
};

export const redeemPlayuperRwrd = async (req, res) => {
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

    const newRewardTransaction = new RewardsTransactions({
      userId: userId,
      rewardId: rewardId,
      type: "playsuper",
    });
    await newRewardTransaction.save();

    res.status(200).json({
      couponCode: reward.data.couponCode,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update partner reward.",
      error: error.message,
    });
  }
};

export const redeemCustomRwrd = async (req, res) => {
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

    const newRewardTransaction = new RewardsTransactions({
      userId: userId,
      rewardId: partnerId,
      type: "custom",
    });
    await newRewardTransaction.save();

    const newOrbTransaction = new OrbsTransactions({
      userId: userId,
      source: "voucher",
      orbs: { BlackOrb: 1 },
    });
    await newOrbTransaction.save();

    res.status(200).json({
      message: "Reward claimed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update partner reward.",
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
      message: "Failed to generate otp.",
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
      message: "Failed to generate otp.",
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
      message: "Failed to verify otp.",
      error: error.message,
    });
  }
};
