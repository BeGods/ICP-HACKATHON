import rateLimit from "express-rate-limit";
import routes from "./router";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import morgan from "morgan";
const express = require("express");
const cors = require("cors");
const app = express();
const mongoSanitize = require("express-mongo-sanitize");
// const limiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 50,
//   message: "Too many requests from this IP, please try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });

app.use(express.json());
// app.use(limiter);

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
    // origin: "https://fof.battleofgods.io",
    methods:
      "GET,HEAD,PUT,PATCH,POST,DELETE                                                                                                                                  ",
  })
);
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("tiny"));
app.use(xss());
app.use(hpp());

app.use("/api/v1", routes);

export default app;
