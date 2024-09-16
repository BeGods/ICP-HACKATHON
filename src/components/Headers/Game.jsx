import React, { useState } from "react";
import { mythSections } from "../../utils/variables";
import {
  calculateRemainingTime,
  hasTimeElapsed,
} from "../../utils/getBoosterCard";

const GameHeader = ({
  activeMyth,
  mythStates,
  handleActiveCard,
  minimize,
  glowBooster,
}) => {
  const [showMinion, setShowMinion] = useState(false);
  const [showAutomata, setShowAutomata] = useState(false);
  const [toggleValue, setToggleValue] = useState(true);

  return (
    <div className="flex justify-between -mt-2">
      <div
        className={`flex w-full justify-between absolute top-0 z-50 transition-all duration-500`}
      >
        <div>
          {!mythStates[activeMyth].isShardsClaimActive &&
            !hasTimeElapsed(mythStates[activeMyth].shardsLastClaimedAt) && (
              <div className="flex items-center leading-tight flex-col relative h-fit ">
                <div
                  onClick={() => {
                    if (showMinion) {
                      setToggleValue((prev) => !prev);
                    }
                    setShowMinion((prev) => !prev);
                  }}
                  className={`font-symbols transition-all duration-1000 ${
                    glowBooster === 1
                      ? `scale-125 text-${mythSections[activeMyth]}-text`
                      : "text-white"
                  } text-black-contour text-[50px] p-0 ml-2 `}
                >
                  h
                </div>
                {showMinion && (
                  <div
                    className={`text-${mythSections[activeMyth]}-text text-black-contour bottom-0 right-0 text-tertiary -mt-3`}
                  >
                    {!toggleValue
                      ? calculateRemainingTime(
                          mythStates[activeMyth].shardsLastClaimedAt
                        )
                      : "L" + mythStates[activeMyth].shardslvl}
                  </div>
                )}
              </div>
            )}
        </div>
        <div>
          <div>
            {mythStates[activeMyth].isAutomataActive &&
              !hasTimeElapsed(mythStates[activeMyth].automataStartTime) && (
                <div className="flex items-center leading-tight flex-col relative h-fit ">
                  <div
                    onClick={() => {
                      if (showAutomata) {
                        setToggleValue((prev) => !prev);
                      }
                      setToggleValue((prev) => !prev);
                      setShowAutomata((prev) => !prev);
                    }}
                    className={`font-symbols transition-all duration-1000 ${
                      glowBooster === 2
                        ? `scale-125 text-${mythSections[activeMyth]}-text`
                        : "text-white"
                    } text-black-contour text-[50px] p-0 ml-2 `}
                  >
                    b
                  </div>
                  {showAutomata && (
                    <div
                      className={`text-${mythSections[activeMyth]}-text text-black-contour bottom-0 right-0 text-tertiary -mt-3`}
                    >
                      {!toggleValue
                        ? calculateRemainingTime(
                            mythStates[activeMyth].automataStartTime
                          )
                        : "L" + mythStates[activeMyth].automatalvl}
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
