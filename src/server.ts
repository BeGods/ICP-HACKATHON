import config from "./config/config";
import app from "./app";
import connectMongo from "./config/database/mongo";

const PORT = 3000;

connectMongo();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
