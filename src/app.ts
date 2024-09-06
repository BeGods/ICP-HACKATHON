import rateLimit from "express-rate-limit";
import routes from "./router";
import helmet from "helmet";
const express = require("express");
const cors = require("cors");
const app = express();
import morgan from "morgan";
const mongoSanitize = require("express-mongo-sanitize");

app.use(express.json());
// const limiter = rateLimit({
//   windowMs: 20 * 1000,
//   max: 40,
//   message: "Too many requests from this IP, please try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });
app.set("trust proxy", 1);
app.use(
  cors({
    // origin: "*",
    origin: "https://fof.battleofgods.io",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("tiny"));
// xss and hpp
// app.use(limiter);
app.use("/api/v1", routes);

export default app;
