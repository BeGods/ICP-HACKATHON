import { authMiddleware } from "../../common/middlewares/auth.middlewares";
import {
  activateVault,
  generateSessionReward,
  getGameStats,
  joinFragments,
  startSession,
  tradeFragments,
  tradeShardsToPotion,
  transferToBag,
  transferToVault,
  useItemAbility,
  claimCompleteRelic,
  claimArtifact,
  activateMeal,
  tradeShardsToCoin,
} from "../controllers/game.ror.controllers";
import express from "express";
import {
  isValidMealReq,
  isValidVaultReq,
  validArtifactClaim,
  validateCompleteItem,
  validateJoinFrgmnt,
  validateSessionReward,
  validateSessionsStart,
  validateShardConv,
  validateTradeFragment,
  validateTradePotion,
  validItemAbility,
  validTransferToBag,
  validTransferToVault,
} from "../middlewares/game.ror.middlewares";
const router = express.Router();

// game
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
router.post("/game/claim", authMiddleware, validItemAbility, useItemAbility);

// transactions
router.post(
  "/blacksmith/join",
  authMiddleware,
  validateJoinFrgmnt,
  joinFragments
);
router.post(
  "/blacksmith/claim",
  authMiddleware,
  validateCompleteItem,
  claimCompleteRelic
);
router.post(
  "/merchant/trade",
  authMiddleware,
  validateTradeFragment,
  tradeFragments
);
router.post(
  "/artifact/claim",
  authMiddleware,
  validArtifactClaim,
  claimArtifact
);

// features
// router.get(
//   "/blacksmith/activate",
//   authMiddleware,
//   validBlksmthReq,
//   activateBlackSmith
// );
// router.get(
//   "/librarian/activate",
//   authMiddleware,
//   validLibrnReq,
//   activateLibrarian
// );
router.get("/vault/activate", authMiddleware, isValidVaultReq, activateVault);
router.get("/meal/activate", authMiddleware, isValidMealReq, activateMeal);

// potion
router.post(
  "/shards/convert",
  authMiddleware,
  validateShardConv,
  tradeShardsToCoin
);

// shard conversion
router.post(
  "/trade/potion",
  authMiddleware,
  validateTradePotion,
  tradeShardsToPotion
);

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
