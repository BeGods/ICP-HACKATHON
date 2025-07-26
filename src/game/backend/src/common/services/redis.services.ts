import axios from "axios";
import { connectRedis } from "../../config/database/redis";

export const setOTP = async (key, value, expiry) => {
  try {
    const redisClient = await connectRedis(0);

    await redisClient.set(key, value, { EX: expiry });
  } catch (error) {
    console.log(error);
  }
};

export const setRequestCnt = async (key) => {
  try {
    const redisClient = await connectRedis(0);

    const requestCount = await redisClient.incr(`count_${key}`);

    if (requestCount === 1) {
      await redisClient.expire(`count_${key}`, 3600); // 1hr
    }

    return requestCount;
  } catch (error) {
    console.log(error);
  }
};

export const getOTP = async (key) => {
  try {
    const redisClient = await connectRedis(0);

    const result = await redisClient.get(key);

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const deleteRedisKey = async (key) => {
  try {
    const redisClient = await connectRedis(0);

    const result = await redisClient.del(key);

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getOneWaveSession = async (key) => {
  try {
    const redisClient = await connectRedis(1);

    const result = await redisClient.get(key);

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const setOneWaveSession = async (key, value, expiry) => {
  try {
    const redisClient = await connectRedis(1);

    await redisClient.set(key, value, { EX: expiry });
  } catch (error) {
    console.log(error);
  }
};

const axiosInstance = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 2000,
});

export const fetchKaiaValue = async () => {
  try {
    const redisClient = await connectRedis(2);
    const cached = await redisClient.get("kaia");

    if (cached) return parseFloat(cached);

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await axiosInstance.get(
          "/simple/price?ids=kaia&vs_currencies=usd"
        );
        const price = res.data?.kaia?.usd;

        if (typeof price === "number") {
          await redisClient.set("kaia", price.toString(), { EX: 300 });
          return price;
        }
      } catch (err) {
        console.warn(`Retry ${attempt + 1} failed:`, err.message);
        new Promise((res) => setTimeout(res, 50));
      }
    }

    console.warn("All attempts failed, returning fallback KAIA value.");
    return 0.11;
  } catch (error) {
    console.error("Unexpected error in fetchKaiaValue:", error.message);
    return 0.11;
  }
};
export const getAvatarCounter = async (User) => {
  try {
    const redisClient = await connectRedis(2);

    let current;

    if (redisClient) {
      const cached = await redisClient.get("avatar:counter");

      if (!cached) {
        const lastUser = await User.findOne({
          telegramUsername: { $regex: /^AVATAR\d+$/ },
        })
          .sort({ telegramUsername: -1 })
          .exec();

        const lastId = lastUser
          ? parseInt(lastUser.telegramUsername.replace("AVATAR", ""), 10)
          : 0;

        const startFrom = lastId + 1;
        await redisClient.set("avatar:counter", startFrom);
        current = startFrom;
      } else {
        current = await redisClient.incr("avatar:counter");
      }
    } else {
      const lastUser = await User.findOne({
        telegramUsername: { $regex: /^AVATAR\d+$/ },
      })
        .sort({ telegramUsername: -1 })
        .exec();

      current = lastUser
        ? parseInt(lastUser.telegramUsername.replace("AVATAR", ""), 10) + 1
        : 1;
    }

    return `AVATAR${current}`;
  } catch (error) {
    console.error("Error generating avatar username:", error);
    throw new Error("Failed to generate avatar username");
  }
};
