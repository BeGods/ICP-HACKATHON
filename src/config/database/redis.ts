import config from "../../config/config";

const { createClient } = require("redis");

export const connectRedis = async (index) => {
  try {
    const client = createClient({
      url: config.database.redis,
    });
    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();
    await client.select(index); //  otps

    return client;
  } catch (error) {
    console.log(error);
  }
};
