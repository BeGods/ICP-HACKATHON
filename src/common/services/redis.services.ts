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

export const fetchKaiaValue = async () => {
  try {
    const redisClient = await connectRedis(2);
    let result = await redisClient.get("kaia");

    if (result) {
      return JSON.parse(result);
    }

    let price = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=kaia&vs_currencies=usd",
          { timeout: 2000 }
        );
        price = response.data?.kaia?.usd;
        if (price != null) {
          await redisClient.set("kaia", JSON.stringify(price), { EX: 300 });
          return price;
        }
      } catch (err) {
        console.warn(`Retry ${attempt + 1} failed:`, err.message);
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
