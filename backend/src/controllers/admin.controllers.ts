import partners from "../models/partners.models";
import quest from "../models/quests.models";
import Stats from "../models/Stats.models";
import User from "../models/user.models";
import updates from "../../listOfImages.json";
import axios from "axios";

// test
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

// stats
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

// actions
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

export const createQuest = async (req, res) => {
  try {
    const { questData } = req.body;

    const newQuest = new quest(questData);
    const newQuestCreated = await newQuest.save();

    res.status(200).json({ data: newQuestCreated });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateFileCode = async () => {
  try {
    const bulkOperations = updates.map(({ _id, fileId }) => {
      return {
        updateOne: {
          filter: { _id },
          update: { "profile.avatarUrl": fileId },
        },
      };
    });

    const result = await User.bulkWrite(bulkOperations);

    console.log("Bulk update result:", result);
  } catch (error) {
    console.log();
  }
};
