import User from "../models/user.models";

// daily new users
export const getDailyNewUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    // const count: number | 0 = await User.countDocuments(query);
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to fetch daily new users.");
  }
};

// daily active users
export const getDailyActiveUsers = async () => {
  try {
    const now = new Date();

    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [dailyActive, weeklyActive, monthlyActive] = await Promise.all([
      User.countDocuments({ lastLoginAt: { $gte: last24Hours } }),
      User.countDocuments({ lastLoginAt: { $gte: last7Days } }),
      User.countDocuments({ lastLoginAt: { $gte: last30Days } }),
    ]);

    return {
      dailyActive,
      weeklyActive,
      monthlyActive,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch active users.");
  }
};

export const getHourlyUsers = async () => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const query = {
      createdAt: {
        $gte: oneHourAgo,
        $lte: now,
      },
    };

    const count: number | 0 = await User.countDocuments(query);
    return count;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch hourly users.");
  }
};
