import rateLimit from "express-rate-limit";
import routes from "./router";
import helmet from "helmet";
const express = require("express");
const cors = require("cors");
const app = express();
import morgan from "morgan";

app.use(express.json());

// const limiter = rateLimit({
//   windowMs: 20 * 1000,
//   max: 20,
// });
// app.set("trust proxy", 1);

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(helmet());
app.use(morgan("tiny"));

// app.use(limiter);
app.use("/api/v1", routes);

export default app;
