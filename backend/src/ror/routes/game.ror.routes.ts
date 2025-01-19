import { authMiddleware } from "../../common/middlewares/auth.middlewares";
import {
  activateInside,
  activateVault,
  deActivateInside,
  generateSessionReward,
  getGameStats,
  joinFragments,
  startSession,
  tradeFragments,
  transferToBag,
  transferToVault,
} from "../controllers/game.ror.controllers";
import express from "express";
import {
  isValidInsideReq,
  isValidOutsideReq,
  isValidVaultReq,
  validateJoinFrgmnt,
  validateSessionReward,
  validateSessionsStart,
  validateTradeFragment,
  validTransferToBag,
  validTransferToVault,
} from "../middlewares/game.ror.middlewares";
const router = express.Router();

router.get("/game/stats", authMiddleware, getGameStats);
router.get(
  "/game/startSession",
  authMiddleware,
  validateSessionsStart,
  startSession
);
router.post(
  "/game/claimSession",
  authMiddleware,
  validateSessionReward,
  generateSessionReward
);

// transactions
router.post(
  "/blacksmith/join",
  authMiddleware,
  validateJoinFrgmnt,
  joinFragments
);
router.post(
  "/merchant/trade",
  authMiddleware,
  validateTradeFragment,
  tradeFragments
);

// underworld
router.get(
  "/inside/activate",
  authMiddleware,
  isValidInsideReq,
  activateInside
);
router.get(
  "/inside/deactivate",
  authMiddleware,
  isValidOutsideReq,
  deActivateInside
);

// vault
router.get("/vault/activate", authMiddleware, isValidVaultReq, activateVault);

// transfers
router.post(
  "/transfer/toVault",
  authMiddleware,
  validTransferToVault,
  transferToVault
);
router.post(
  "/transfer/toBag",
  authMiddleware,
  validTransferToBag,
  transferToBag
);

export default router;
