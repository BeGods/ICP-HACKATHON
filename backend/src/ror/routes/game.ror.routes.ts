import { authMiddleware } from "../../middlewares/auth.middlewares";
import {
  activateVault,
  generateSessionReward,
  getGameStats,
  joinFragments,
  startSession,
  tradeFragments,
  transferToBag,
  transferToVault,
} from "../../controllers/ror/game.controllers";
import express from "express";
import {
  isValidVaultReq,
  validateJoinFrgmnt,
  validateSessionReward,
  validateSessionsStart,
  validateTradeFragment,
  validTransferToBag,
  validTransferToVault,
} from "../../middlewares/ror/game.middlewares";
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
