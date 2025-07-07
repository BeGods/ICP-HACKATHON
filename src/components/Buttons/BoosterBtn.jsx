import React, { useContext, useRef } from "react";
import { mythSections } from "../../utils/constants.fof";
import {
  calculateMoonRemainingTime,
  calculateRemainingTime,
  hasTimeElapsed,
} from "../../helpers/booster.helper";
import { FofContext } from "../../context/context";
import { Lock } from "lucide-react";
import { colorByMyth } from "../../utils/constants.ror";

const BoosterBtn = ({ activeCard, handleClaim, isAutoPay }) => {
  let disableClick = useRef(false);
  const { assets, activeMyth, gameData } = useContext(FofContext);
  const mythData = gameData.mythologies[activeMyth].boosters;
  let buttonColor = colorByMyth[mythSections[activeMyth]];

  return (
    <div className="flex cursor-pointer justify-center items-center relative h-fit mt-1">
      <img
        src={assets.buttons[buttonColor].on ?? assets.buttons.black.on}
        alt="button"
      />
      <div className="absolute gap-x-2 z-50 flex items-center justify-center  text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
        {activeCard === "automata" &&
        gameData?.isAutomataAutoActive !== -1 &&
        !hasTimeElapsed(gameData.isAutomataAutoActive) &&
        isAutoPay ? (
          <div className="text-primary uppercase">
            -{calculateRemainingTime(gameData.isAutomataAutoActive)}
          </div>
        ) : activeCard === "automata" &&
          mythData?.isAutomataActive &&
          !hasTimeElapsed(mythData.automataStartTime) &&
          isAutoPay ? (
          <div className="text-primary uppercase">
            <Lock />
          </div>
        ) : activeCard === "automata" &&
          mythData?.isAutomataActive &&
          !hasTimeElapsed(mythData.automataStartTime) &&
          !isAutoPay ? (
          <div className="text-primary uppercase">
            -{calculateRemainingTime(mythData.automataStartTime)}
          </div>
        ) : activeCard === "minion" &&
          !mythData?.isShardsClaimActive &&
          !hasTimeElapsed(mythData.shardsLastClaimedAt) ? (
          <div className="text-primary uppercase">
            -{calculateRemainingTime(mythData.shardsLastClaimedAt)}
          </div>
        ) : activeCard === "burst" &&
          !mythData.isEligibleForBurst &&
          mythData.isBurstActive ? (
          <div className="text-primary uppercase">
            <Lock />
          </div>
        ) : activeCard === "burst" &&
          !mythData?.isBurstActiveToClaim &&
          !hasTimeElapsed(mythData.burstActiveAt) &&
          !isAutoPay ? (
          <div className="text-primary uppercase">
            -{calculateRemainingTime(mythData.burstActiveAt)}
          </div>
        ) : activeCard === "burst" &&
          !hasTimeElapsed(gameData.autoPayBurstExpiry) &&
          isAutoPay ? (
          <div className="text-primary uppercase">
            -{calculateRemainingTime(gameData.autoPayBurstExpiry)}
          </div>
        ) : activeCard === "moon" && gameData.isMoonActive ? (
          <div className="text-primary uppercase">
            -{calculateMoonRemainingTime(gameData.moonExpiresAt)}
          </div>
        ) : (
          <>
            <div
              onClick={(e) => {
                if (disableClick.current === false) {
                  disableClick.current = true;
                  handleClaim(e);
                  setTimeout(() => {
                    disableClick.current = false;
                  }, 2000);
                }
              }}
              className={`flex relative text-center justify-center max-w-xs-orb p-0.5 items-center rounded-full glow-icon-black`}
            >
              <img src={assets.items.multiorb} alt="orb" />
            </div>{" "}
            {activeCard == "burst" && isAutoPay
              ? 9
              : (activeCard == "burst" && !isAutoPay) ||
                isAutoPay ||
                activeCard === "moon"
              ? 3
              : 1}
          </>
        )}
      </div>
    </div>
  );
};

export default BoosterBtn;
