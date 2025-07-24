import { useContext, useRef } from "react";
import {
  getTimerContent,
  hasTimeElapsed,
} from "../../../helpers/booster.helper";
import { FofContext } from "../../../context/context";
import { Lock } from "lucide-react";
import { ButtonLayout } from "../../../components/Layouts/ButtonLayout";

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
  const { activeMyth, gameData } = useContext(FofContext);
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
    <ButtonLayout
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
