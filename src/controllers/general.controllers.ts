import User from "../models/user.models";
import ranks from "../models/ranks.models";
import { getLeaderboardSnapshot } from "../services/general.services";

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
  try {
    const leaderboard = await ranks
      .find()
      .sort({ totalOrbs: -1 })
      .limit(100)
      .select("-__v -createdAt -updatedAt");

    res.status(200).json({
      leaderboard,
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
    const bulkOps = leaderboard.map((user) => ({
      updateOne: {
        filter: { userId: user.userId },
        update: { $set: user },
        upsert: true,
      },
    }));
    await ranks.bulkWrite(bulkOps);

    res.status(200).json({ message: "Leaderboard updated successfully." });

    // maintain stats
  } catch (error) {
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
