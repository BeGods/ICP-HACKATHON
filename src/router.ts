import AuthRoutes from "./routes/auth.routes";
import GeneralRoutes from "./routes/fof/general.routes";
import GameRoutes from "./routes/fof/game.routes";
import QuestsRoutes from "./routes/fof/quests.routes";
import UserRoutes from "./routes/fof/user.routes";
import RorGameRoutes from "./routes/ror/game.routes";

export const fofRoutes = [
  AuthRoutes,
  GeneralRoutes,
  GameRoutes,
  QuestsRoutes,
  UserRoutes,
];

export const rorRoutes = [RorGameRoutes];
