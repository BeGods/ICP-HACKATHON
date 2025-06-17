import partners from "../models/partners.models";
import quest from "../models/quests.models";
import Stats from "../models/Stats.models";
import User from "../models/user.models";
import axios from "axios";
import { Request, Response } from "express";
import { IQuest, IStats } from "../../ts/models.interfaces";
import rewards from "../models/rewards.models";
import mongoose from "mongoose";
import { getDailyActiveUsers } from "../services/admin.services";

// get
// test server
export const ping = async (req: Request, res: Response): Promise<void> => {
  try {
    res.send("Server is runnnig fine.");
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getAdminUpdates = async (req, res) => {
  try {
    const stats = await Stats.find();
    const userCounts = stats.map((stat) => stat.totalUsers);
    const { dailyActive, weeklyActive, monthlyActive, dailyNewUsers } =
      await getDailyActiveUsers();

    const data = {
      totalUsers: userCounts[4],
      newUsers: dailyNewUsers,
      tgUsers: userCounts[1],
      dapp: userCounts[2],
      onewave: userCounts[3],
      fof: userCounts[0],
      ror: userCounts[5],
      dailyActive: dailyActive,
      weeklyActive: weeklyActive,
      monthlyActive: monthlyActive,
    };

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// update
export const updateDailyQuest = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    } else {
      console.log("No quests available for today.");
      res.status(404).json({ message: "No quests available for today." });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update daily quest.",
      error: error.message,
    });
  }
};

// create
export const createPartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { data } = req.body;

    const newPartner = new partners(data);

    await newPartner.save();
    res.status(201).json({ message: "Partner added successfully." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create partner.",
      error: error.message,
    });
  }
};

// create
export const createReward = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { data } = req.body;

    const newReward = new rewards(data);

    await newReward.save();
    res.status(201).json({ message: "Reward added successfully." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create partner.",
      error: error.message,
    });
  }
};

export const verifyPayment = async (req, res): Promise<void> => {
  try {
    const { paymentDetails, paymentId, status } = req;

    if (status) {
      await paymentDetails.updateOne({
        $set: {
          status: "success",
          paymentId: paymentId,
        },
      });
    } else {
      // refund
      await User.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(paymentDetails.userId),
        },
        {
          $inc: {
            [`holdings.${paymentDetails?.currency?.toLowerCase()}`]:
              paymentDetails?.amount,
          },
        }
      );
    }

    res.status(201).json({ message: "Payment status updated successfully." });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create partner.",
      error: error.message,
    });
  }
};

export const createQuest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { questData }: { questData: Partial<IQuest> } = req.body;

    if (!questData) {
      throw new Error("Invalid quest data.");
    }

    const newQuest = new quest(questData);
    const newQuestCreated = await newQuest.save();

    res.status(200).json({ data: newQuestCreated });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create quest.",
      error: error.message,
    });
  }
};

// db migrate and shift fields from User to usermyth

// export async function migrate() {
//   const usersWithGameSession = await User.find({
//     gameSession: { $exists: true },
//   }).lean();

//   const bulkUserUpdates = [];
//   const bulkMythUpdates = [];

//   for (const user of usersWithGameSession) {
//     const userId = user._id;
//     const gameSession = user.gameSession;

//     if (!gameSession) continue;

//     const userMyths = await userMythologies.findOne({ userId });

//     if (!userMyths) {
//       continue;
//     }

//     const newRorStats = {
//       ...userMyths.rorStats,
//       ...gameSession,
//     };

//     bulkMythUpdates.push({
//       updateOne: {
//         filter: { userId },
//         update: { $set: { rorStats: newRorStats } },
//       },
//     });

//     bulkUserUpdates.push({
//       updateOne: {
//         filter: { _id: userId },
//         update: {
//           $unset: {
//             gameSession: "",
//             announcements: "",
//             playsuper: "",
//           },
//         },
//       },
//     });
//   }

//   // Run bulk writes
//   if (bulkMythUpdates.length > 0) {
//     await userMythologies.bulkWrite(bulkMythUpdates);
//     console.log(`✅ Updated rorStats for ${bulkMythUpdates.length} users`);
//   }

//   if (bulkUserUpdates.length > 0) {
//     await User.bulkWrite(bulkUserUpdates);
//     console.log(
//       `🧹 Cleaned fields in User model for ${bulkUserUpdates.length} users`
//     );
//   }

//   console.log("🎉 Migration complete.");
// }

// db migrations
// export const migrateDb = async (req: Request, res: Response): Promise<void> => {
//   try {
//     await User.updateMany({}, [
//       {
//         $set: {
//           bonus: {
//             fof: {
//               exploitCount: "$exploitCount",
//               joiningBonus: "$joiningBonus",
//               streakBonus: {
//                 isActive: false,
//                 claimedAt: 0,
//                 streakCount: 0,
//               },
//               dailyBonusClaimedAt: "$dailyBonusClaimedAt",
//             },
//           },
//         },
//       },
//       {
//         $unset: [
//           "exploitCount",
//           "joiningBonus",
//           "streakBonus",
//           "dailyBonusClaimedAt",
//         ],
//       },
//     ]);

//     res.status(200).json({ data: "done" });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };

// export const updateFileCode = async () => {
//   try {
//     const bulkOperations = updates.map(({ _id, fileId }) => {
//       return {
//         updateOne: {
//           filter: { _id },
//           update: { "profile.avatarUrl": fileId },
//         },
//       };
//     });

//     const result = await User.bulkWrite(bulkOperations);

//     console.log("Bulk update result:", result);
//   } catch (error) {
//     console.log();
//   }
// };
