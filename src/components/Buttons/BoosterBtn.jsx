import React, { useRef } from "react";
import { mythSections } from "../../utils/variables";
import { calculateRemainingTime } from "../../utils/getBoosterCard";
import { Handshake } from "lucide-react";

const BoosterBtn = ({ activeCard, mythData, activeMyth, handleClaim, t }) => {
  let disableClick = useRef(false);

  return (
    <div className="relative mt-[10px]">
      <div className="relative z-50">
        {activeCard === "automata" && mythData?.isAutomataActive ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary border border-${mythSections[activeMyth]}-primary  mx-auto  bg-glass-black z-50 text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              {calculateRemainingTime(mythData.automataStartTime)}
            </div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        ) : activeCard === "minion" && !mythData?.isShardsClaimActive ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              {calculateRemainingTime(mythData.shardsLastClaimedAt)}
            </div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        ) : activeCard === "burst" && !mythData?.isBurstActiveToClaim ? (
          <div
            className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black text-white  rounded-primary`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-primary uppercase">
              {calculateRemainingTime(mythData.burstActiveAt)}
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
            <div className="flex justify-center items-center w-[30%]  h-full  border-r border-borderGray">
              <h1
                className={`text-xl text-${mythSections[activeMyth]}-text text-button-primary rounded-full  w-full flex justify-center items-center`}
              >
                L
                {activeCard === "automata"
                  ? mythData.automataPaylvl + 1
                  : activeCard === "minion"
                  ? mythData.shardsPaylvl + 1
                  : activeCard === "burst"
                  ? mythData.burstlvl + 1
                  : 1}
              </h1>
            </div>
            <div className="text-button-primary uppercase">
              {activeCard == "burst" ? (
                <div className="text-[40px] font-symbols z-10 uppercase">V</div>
              ) : (
                <>
                  <Handshake size={"10vw"} />
                </>
              )}
            </div>
            <div className="flex relative justify-center items-center w-[30%] h-full pr-1 border-l border-borderGray">
              <img
                src={`/assets/uxui/240px-orb.multicolor.png`}
                alt="orb"
                className="p-1.5"
              />
              <div className="absolute z-10">
                <div className="font-medium text-[40px] text-white glow-text-black">
                  {activeCard == "burst" ? 3 : 1}
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
