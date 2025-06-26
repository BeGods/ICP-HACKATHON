import User from "../models/user.models";

// daily active users
export const fetchAdminStats = async () => {
  try {
    const now = new Date();

    const last1Hour = new Date(now.getTime() - 1 * 60 * 60 * 1000);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      hourlyActive,
      dailyActive,
      weeklyActive,
      monthlyActive,
      hourlyNewUsers,
      dailyNewUsers,
    ] = await Promise.all([
      User.countDocuments({ lastLoginAt: { $gte: last1Hour } }),
      User.countDocuments({ lastLoginAt: { $gte: last24Hours } }),
      User.countDocuments({ lastLoginAt: { $gte: last7Days } }),
      User.countDocuments({ lastLoginAt: { $gte: last30Days } }),
      User.countDocuments({ createdAt: { $gte: last1Hour, $lte: now } }),
      User.countDocuments({ createdAt: { $gte: last24Hours, $lte: now } }),
    ]);

    return {
      hourlyActive,
      dailyActive,
      weeklyActive,
      monthlyActive,
      hourlyNewUsers,
      dailyNewUsers,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch admin stats.");
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
