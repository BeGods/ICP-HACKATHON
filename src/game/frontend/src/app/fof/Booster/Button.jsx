import { useRef } from "react";
import {
  getTimerContent,
  hasTimeElapsed,
} from "../../../helpers/booster.helper";
import { Lock } from "lucide-react";
import { PrimaryBtn } from "../../../components/Buttons/PrimaryBtn";
import { useStore } from "../../../store/useStore";

export const checkBoosterIsInfoMode = ({
  activeCard,
  gameData,
  mythData,
  isAutoPay,
}) => {
  return (
    (activeCard === "automata" &&
      gameData?.isAutomataAutoActive !== -1 &&
      !hasTimeElapsed(gameData.isAutomataAutoActive) &&
      isAutoPay) ||
    (activeCard === "automata" &&
      mythData?.isAutomataActive &&
      !hasTimeElapsed(mythData.automataStartTime)) ||
    (activeCard === "minion" &&
      !mythData?.isShardsClaimActive &&
      !hasTimeElapsed(mythData.shardsLastClaimedAt)) ||
    (activeCard === "burst" &&
      !mythData.isEligibleForBurst &&
      mythData.isBurstActive) ||
    (activeCard === "burst" &&
      !mythData?.isBurstActiveToClaim &&
      !hasTimeElapsed(mythData.burstActiveAt) &&
      !isAutoPay) ||
    (activeCard === "burst" &&
      !hasTimeElapsed(gameData.autoPayBurstExpiry) &&
      isAutoPay) ||
    (activeCard === "moon" && gameData.isMoonActive)
  );
};

const BoosterBtn = ({ activeCard, handleClaim, isAutoPay, boosterLvl }) => {
  const disableClick = useRef(false);
  const activeMyth = useStore((s) => s.activeMyth);
  const gameData = useStore((s) => s.gameData);
  const mythData = gameData.mythologies[activeMyth].boosters;

  const isInfoMode = checkBoosterIsInfoMode({
    activeCard,
    gameData,
    mythData,
    isAutoPay,
  });

  const centerContent = isInfoMode ? (
    getTimerContent(activeCard, gameData, mythData, isAutoPay) ?? <Lock />
  ) : (
    <div>V</div>
  );

  const handleCenterClick = isInfoMode
    ? undefined
    : (e) => {
        if (!disableClick.current) {
          disableClick.current = true;
          handleClaim(e);
          setTimeout(() => {
            disableClick.current = false;
          }, 2000);
        }
      };

  return (
    <PrimaryBtn
      showGlow={isInfoMode}
      mode={isInfoMode ? "info" : "default"}
      leftContent={
        <div className="w-full flex gap-x-1">
          <span>{!isAutoPay && "Lvl"}</span>
          <span>{boosterLvl}</span>
        </div>
      }
      rightContent={
        activeCard == "burst" && isAutoPay
          ? 9
          : (activeCard == "burst" && !isAutoPay) ||
            isAutoPay ||
            activeCard === "moon"
          ? 3
          : 1
      }
      onClick={handleCenterClick}
      centerContent={centerContent}
      isOrb={true}
    />
  );
};

export default BoosterBtn;
