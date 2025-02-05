import AuthRoutes from "./common/routes/auth.routes";
import GeneralRoutes from "./fof/routes/general.fof.routes";
import GeneralRoRRoutes from "./ror/routes/general.ror.routes";
import AdminRoutes from "./common/routes/admin.routes";
import GameRoutes from "./fof/routes/game.fof.routes";
import GameRORRoutes from "./ror/routes/game.ror.routes";
import PartnerRoutes from "./fof/routes/partners.routes";
import QuestsRoutes from "./fof/routes/quests.fof.routes";
import UserRoutes from "./common/routes/user.routes";

export const fofRoutes = [
  AuthRoutes,
  AdminRoutes,
  GeneralRoutes,
  GameRoutes,
  PartnerRoutes,
  QuestsRoutes,
  UserRoutes,
];

export const rorRoutes = [GameRORRoutes, AuthRoutes, GeneralRoRRoutes];
