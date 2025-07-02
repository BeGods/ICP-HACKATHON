import React, { useContext, useRef } from "react";
import { mythSections } from "../../utils/constants.fof";
import {
  calculateMoonRemainingTime,
  calculateRemainingTime,
  hasTimeElapsed,
} from "../../helpers/booster.helper";
import { FofContext } from "../../context/context";
import { Lock } from "lucide-react";

const BoosterBtn = ({ activeCard, handleClaim, isAutoPay }) => {
  let disableClick = useRef(false);
  const { assets, activeMyth, gameData } = useContext(FofContext);
  const mythData = gameData.mythologies[activeMyth].boosters;

  return (
    <div className="relative mt-[10px]">
      <div className="relative z-50">
        {activeCard === "automata" &&
        gameData?.isAutomataAutoActive !== -1 &&
        !hasTimeElapsed(gameData.isAutomataAutoActive) &&
        isAutoPay ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary border border-${mythSections[activeMyth]}-primary  mx-auto  bg-glass-black-lg z-50 text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              -{calculateRemainingTime(gameData.isAutomataAutoActive)}
            </div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        ) : activeCard === "automata" &&
          mythData?.isAutomataActive &&
          !hasTimeElapsed(mythData.automataStartTime) &&
          isAutoPay ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black-lg text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              <Lock />
            </div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        ) : activeCard === "automata" &&
          mythData?.isAutomataActive &&
          !hasTimeElapsed(mythData.automataStartTime) &&
          !isAutoPay ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary border border-${mythSections[activeMyth]}-primary  mx-auto  bg-glass-black-lg z-50 text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              -{calculateRemainingTime(mythData.automataStartTime)}
            </div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        ) : activeCard === "minion" &&
          !mythData?.isShardsClaimActive &&
          !hasTimeElapsed(mythData.shardsLastClaimedAt) ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black-lg text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              -{calculateRemainingTime(mythData.shardsLastClaimedAt)}
            </div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        ) : activeCard === "burst" &&
          !mythData.isEligibleForBurst &&
          mythData.isBurstActive ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black-lg text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              <Lock />
            </div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        ) : activeCard === "burst" &&
          !mythData?.isBurstActiveToClaim &&
          !hasTimeElapsed(mythData.burstActiveAt) &&
          !isAutoPay ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black-lg text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              -{calculateRemainingTime(mythData.burstActiveAt)}
            </div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        ) : activeCard === "burst" &&
          !hasTimeElapsed(gameData.autoPayBurstExpiry) &&
          isAutoPay ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black-lg text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              -{calculateRemainingTime(gameData.autoPayBurstExpiry)}
            </div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        ) : activeCard === "moon" && gameData.isMoonActive ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black-lg text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              -{calculateMoonRemainingTime(gameData.moonExpiresAt)}
            </div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        ) : (
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
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary  bg-glass-black-lg z-50 text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-[30%] h-full">
              <h1
                className={`text-xl text-${mythSections[activeMyth]}-text text-button-primary rounded-full w-full flex justify-center items-center`}
              >
                Lvl
                {!isAutoPay &&
                  (activeCard === "automata"
                    ? Math.min((mythData?.automatalvl ?? 0) + 2, 99)
                    : activeCard === "minion"
                    ? Math.min((mythData?.shardslvl ?? 1) + 2, 99)
                    : activeCard === "burst"
                    ? Math.min((mythData?.burstlvl ?? 0) + 2, 99)
                    : activeCard === "moon"
                    ? "4x"
                    : "4x")}
              </h1>
            </div>

            <div
              className={`flex shadow-black shadow-2xl justify-center  font-symbols items-center bg-black w-[4rem] h-[4rem] border-[3px]  border-${mythSections[activeMyth]}-primary rounded-full`}
            >
              <div className="text-[1.75rem]">V</div>
            </div>
            <div className="flex relative justify-center items-center w-[30%] h-full pr-1">
              <img
                src={`${assets.items.multiorb}`}
                alt="orb"
                className="p-1.5"
              />
              <div className="absolute z-10">
                <div className="font-medium text-[2rem] text-white glow-text-black">
                  {activeCard == "burst" && isAutoPay
                    ? 9
                    : (activeCard == "burst" && !isAutoPay) ||
                      isAutoPay ||
                      activeCard === "moon"
                    ? 3
                    : 1}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoosterBtn;
