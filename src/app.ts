import rateLimit from "express-rate-limit";
import { fofRoutes, rorRoutes } from "./router";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import config from "./config/config";
const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

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
app.set("trust proxy", 1);

const blockedIPs = new Set(config.server.BLOCKED_IPS);

app.use((req, res, next) => {
  const ip = req.ip;

  // Optional: normalize IPv6-style localhost ::ffff:127.0.0.1
  const cleanIP = ip.startsWith("::ffff:") ? ip.replace("::ffff:", "") : ip;

  if (blockedIPs.has(cleanIP)) {
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

morgan.token("body", (req) => JSON.stringify(req.body));
morgan.token("origin", (req) => req.headers.origin || "No-Origin");

const loggerFormat =
  ":remote-addr - :method :url :status - :response-time ms - Origin: :origin";

app.use(morgan(loggerFormat));

// API Routes
app.use("/api/v1", fofRoutes);
app.use("/api/v2", rorRoutes);

export default app;
