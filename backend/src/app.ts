import routes from "./router";
import helmet from "helmet";
const express = require("express");
const cors = require("cors");
const app = express();
import morgan from "morgan";

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(helmet());
app.use(morgan("tiny"));

app.use("/api/v1", routes);

export default app;
