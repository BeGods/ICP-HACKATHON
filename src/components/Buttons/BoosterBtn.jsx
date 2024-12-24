import React, { useContext, useRef } from "react";
import { mythSections } from "../../utils/constants";
import {
  calculateMoonRemainingTime,
  calculateRemainingTime,
  hasTimeElapsed,
} from "../../helpers/booster.helper";
import { MyContext } from "../../context/context";
import { Lock } from "lucide-react";

const BoosterBtn = ({ activeCard, handleClaim, isAutoPay }) => {
  let disableClick = useRef(false);
  const { assets, activeMyth, gameData } = useContext(MyContext);
  const mythData = gameData.mythologies[activeMyth].boosters;

  return (
    <div className="relative mt-[10px]">
      <div className="relative z-50">
        {activeCard === "automata" &&
        gameData?.isAutomataAutoActive !== -1 &&
        !hasTimeElapsed(gameData.isAutomataAutoActive) &&
        isAutoPay ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary border border-${mythSections[activeMyth]}-primary  mx-auto  bg-glass-black z-50 text-white  rounded-primary`}
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
          !isAutoPay ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary border border-${mythSections[activeMyth]}-primary  mx-auto  bg-glass-black z-50 text-white  rounded-primary`}
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
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black text-white  rounded-primary`}
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
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black text-white  rounded-primary`}
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
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black text-white  rounded-primary`}
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
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              -{calculateRemainingTime(gameData.autoPayBurstExpiry)}
            </div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        ) : activeCard === "moon" && gameData.isMoonActive ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black text-white  rounded-primary`}
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
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary  bg-glass-black z-50 text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-[30%]  h-full">
              <h1
                className={`text-xl text-${mythSections[activeMyth]}-text text-button-primary rounded-full  w-full flex justify-center items-center`}
              >
                {!isAutoPay && activeCard !== "moon" && "Lvl"}
                {activeCard === "automata" && !isAutoPay
                  ? mythData.automatalvl + 2 >= 99
                    ? 99
                    : mythData.automatalvl + 2
                  : activeCard === "minion" && !isAutoPay
                  ? mythData.shardslvl + 2 >= 99
                    ? 99
                    : mythData.shardslvl + 2
                  : activeCard === "burst" && !isAutoPay
                  ? mythData.burstlvl + 2 >= 99
                    ? 99
                    : mythData.burstlvl + 2
                  : activeCard === "moon" && !isAutoPay
                  ? "4x"
                  : "4x"}
              </h1>
            </div>
            <div
              className={`flex shadow-black shadow-2xl justify-center text-[40px] font-symbols items-center bg-black w-[18vw] h-[18vw] border-[3px]  border-${mythSections[activeMyth]}-primary rounded-full`}
            >
              <div>V</div>
            </div>
            <div className="flex relative justify-center items-center w-[30%] h-full pr-1">
              <img
                src={`${assets.uxui.multiorb}`}
                alt="orb"
                className="p-1.5"
              />
              <div className="absolute z-10">
                <div className="font-medium text-[40px] text-white glow-text-black">
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
