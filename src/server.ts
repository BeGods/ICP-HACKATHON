import config from "./config/config";
import app from "./app";
import connectMongo from "./config/database/mongo";

const PORT = config.server.PORT;

connectMongo();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
