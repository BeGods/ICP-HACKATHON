import React, { useState } from "react";
import { mythSections } from "../../utils/variables";
import { calculateRemainingTime } from "../../utils/getBoosterCard";

const GameHeader = ({ activeMyth, mythStates, handleActiveCard }) => {
  const [showMinion, setShowMinion] = useState(false);
  const [showAutomata, setShowAutomata] = useState(false);
  const [toggleValue, setToggleValue] = useState(true);

  return (
    <div className="flex justify-between mt-2">
      <div className="flex absolute top-0  gap-4 flex-grow justify-center items-start text-white pl-2 "></div>
      <div className="flex w-full justify-between absolute -mt-2 top-0 z-50">
        <div>
          {!mythStates[activeMyth].isShardsClaimActive && (
            <div className="flex items-center leading-tight flex-col relative h-fit ">
              {/* <div className="absolute z-10 text-white top-0 right-0 -mr-4">
                <div>ᶻ 𝗓 𐰁</div>
              </div> */}
              <div
                onClick={() => {
                  if (showMinion) {
                    setToggleValue((prev) => !prev);
                  }
                  setShowMinion((prev) => !prev);
                  handleActiveCard("minion");
                }}
                className={`font-symbols text-black-contou text-[50px] p-0 ml-2 text-white`}
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
            {mythStates[activeMyth].isAutomataActive && (
              <div className="flex items-center leading-tight flex-col relative h-fit ">
                <div
                  onClick={() => {
                    if (showAutomata) {
                      setToggleValue((prev) => !prev);
                    }
                    setToggleValue((prev) => !prev);
                    setShowAutomata((prev) => !prev);
                    handleActiveCard("automata");
                  }}
                  className={`font-symbols text-black-contou text-[50px] p-0 ml-2 text-white`}
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
