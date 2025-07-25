const dotenv = require("dotenv");

dotenv.config();

const parseArray = (value) =>
  value ? value.split(",").map((url) => url.trim()) : [];

const config = {
  source: {
    client: process.env.CLIENT,
    server: process.env.SERVER,
    PROXY_SERVER_JP: process.env.PROXY_SERVER_JP,
  },
  server: {
    PORT: process.env.PORT || 3000,
    WHITELISTED_URLS: parseArray(process.env.WHITELISTED_URLS),
    ENVIRONMENT: process.env.ENVIRONMENT,
    BLOCKED_IPS: parseArray(process.env.BLOCKED_IPS),
  },
  database: {
    url: process.env.MONGO_CONNECT_URL,
    redis: process.env.REDIS_URL,
  },
  security: {
    HASH_KEY: process.env.HASH_KEY,
    ONEWAVE_KEY: process.env.ONEWAVE_KEY,
    TMA_BOT_TOKEN: process.env.TMA_BOT_TOKEN,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE,
    ADMIN_KEY: process.env.ADMIN_KEY,
    LINE_CHANNEL_ID: process.env.LINE_CHANNEL_ID,
    LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET,
  },
  cdn: {
    CDN_API_KEY: process.env.CDN_API_KEY,
    CDN_SECRET: process.env.CDN_SECRET,
  },
  playsuper: {
    PS_API_KEY: process.env.PS_API_KEY,
    PS_API_URL: process.env.PS_API_URL,
    PS_COIN_ID: process.env.PS_COIN_ID,
  },
  adsgram: {
    AD_BOOSTER_ID: process.env.AD_VERIFY_ID,
    AD_EVENT_ID: process.env.AD_VERIFY_ID,
  },
  alibaba: {
    accessKeyId: process.env.ALI_ACCESS_KEY,
    accessKeySecret: process.env.ALI_ACCESS_SECERT,
    endpoint: process.env.ALI_ENDPOINT,
    senderId: process.env.ALI_SENDER_ID,
    channel: process.env.ALI_CHANNEL,
  },
  line: {
    LINE_WALLET_CLIENT: process.env.LINE_WALLET_CLIENT,
    LINE_WALLET_SECRET: process.env.LINE_WALLET_SECRET,
  },
};

export default config;
