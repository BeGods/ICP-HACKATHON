import { connectRedis } from "../../config/database/redis";

export const setOTP = async (key, value, expiry) => {
  try {
    const redisClient = await connectRedis();

    await redisClient.set(key, value, { EX: expiry });
  } catch (error) {
    console.log(error);
  }
};

export const setRequestCnt = async (key) => {
  try {
    const redisClient = await connectRedis();

    const requestCount = await redisClient.incr(`count_${key}`);

    if (requestCount === 1) {
      await redisClient.expire(key, 3600); // 1hr
    }

    return requestCount;
  } catch (error) {
    console.log(error);
  }
};

export const getOTP = async (key) => {
  try {
    const redisClient = await connectRedis();

    const result = await redisClient.get(key);

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const deleteRedisKey = async (key) => {
  try {
    const redisClient = await connectRedis();

    const result = await redisClient.del(key);

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const setOneWaveSession = async (key, value, expiry) => {
  try {
    const redisClient = await connectRedis();

    await redisClient.set(key, value, { EX: expiry });
  } catch (error) {
    console.log(error);
  }
};
