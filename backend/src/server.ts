import config from "./config/config";
import app from "./app";
import connectMongo from "./config/database/mongo";
import http from "http";
import { initSocket } from "./config/socket";

const PORT = config.server.PORT;

connectMongo();

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
