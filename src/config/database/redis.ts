const { createClient } = require("redis");

export const connectRedis = async (index) => {
  try {
    const client = createClient({
      url: "redis://localhost:6379",
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();
    await client.select(index); //  otps

    return client;
  } catch (error) {
    console.log(error);
  }
};
