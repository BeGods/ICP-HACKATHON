import rateLimit from "express-rate-limit";
import { fofRoutes, rorRoutes } from "./router";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import config from "./config/config";
import { getClientIP, normalizeUserAgent } from "./utils/morgan/ua";
const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cookieParser());
app.use(express.json());
app.use(limiter);

const blockedIPs = new Set(config.server.BLOCKED_IPS);
app.use((req, res, next) => {
  const realIP = getClientIP(req);
  if (blockedIPs.has(realIP)) {
    return res.status(403).json({ message: "Your IP is blocked." });
  }
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.server.WHITELISTED_URLS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const problematicOrigin = "https://2r2cf484-5174.inc1.devtunnels.ms";
  if (
    origin === problematicOrigin &&
    req.originalUrl === "/api/v1/auth/refresh"
  ) {
    console.warn("Removing duplicated CORS headers for:", req.originalUrl);
    res.removeHeader("Access-Control-Allow-Origin");
    res.removeHeader("Access-Control-Allow-Credentials");
  }
  next();
});

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

morgan.token("real-ip", (req) => getClientIP(req));
morgan.token("origin", (req) => req.headers.origin || "No-Origin");
morgan.token("body", (req) => JSON.stringify(req.body));
morgan.token("ua-type", (req) => normalizeUserAgent(req.headers["user-agent"]));

const loggerFormat =
  ":real-ip - :method :url :status - :response-time ms - UA: :ua-type - Origin: :origin";

app.use(morgan(loggerFormat));

app.use("/api/v1", fofRoutes);
app.use("/api/v2", rorRoutes);
app.get("/socket.io/*", (_, res) => {
  res.status(204).end();
});

export default app;
