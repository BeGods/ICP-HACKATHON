import mongoose from "mongoose";
import dotenv from "dotenv";
import { updateLeadboardRanks } from "../fof/controllers/general.fof.controllers";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT_URL);

    console.log("MongoDB connected");

    await updateLeadboardRanks();

    process.exit(0);
  } catch (error) {
    console.error("Error running leaderboard cron", error);
    process.exit(1);
  }
})();
