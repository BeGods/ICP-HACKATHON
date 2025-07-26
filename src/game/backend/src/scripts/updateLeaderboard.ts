import mongoose from "mongoose";
import { updateLeadboardRanks } from "../fof/controllers/general.fof.controllers";

const dotenv = require("dotenv");

dotenv.config({ path: ".env.script" });

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected");

    await updateLeadboardRanks();

    console.log("Leaderboard updated successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Error running leaderboard cron:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();
