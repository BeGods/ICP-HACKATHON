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
    } else {
      const response = await axios(
        "https://api.coingecko.com/api/v3/simple/price?ids=kaia&vs_currencies=usd"
      );
      result = response.data;

      await redisClient.set("kaia", result?.kaia?.usd, { EX: 120 }); // 2min
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};
