import React, { useState } from "react";
import { mythSections } from "../../utils/constants";
import {
  calculateRemainingTime,
  hasTimeElapsed,
} from "../../helpers/booster.helper";

const tele = window.Telegram?.WebApp;

const GameHeader = ({ activeMyth, mythStates, glowBooster }) => {
  const [showMinion, setShowMinion] = useState(false);
  const [showAutomata, setShowAutomata] = useState(false);
  const [toggleValue, setToggleValue] = useState(true);

  //TODO: this can be improved
  return (
    <div
      className={`flex w-full justify-between absolute top-0 mt-[5px] z-50 transition-all duration-250`}
    >
      <div>
        {!mythStates[activeMyth].isShardsClaimActive &&
          !hasTimeElapsed(mythStates[activeMyth].shardsLastClaimedAt) && (
            <div className="flex items-center leading-tight flex-col relative h-fit ">
              <div
                onClick={() => {
                  tele.HapticFeedback.notificationOccurred("success");
                  if (showMinion) {
                    setToggleValue((prev) => !prev);
                  }
                  setShowMinion((prev) => !prev);
                }}
                className={`font-symbols transition-all duration-500 ${
                  glowBooster === 1
                    ? `scale-150 text-${mythSections[activeMyth]}-text`
                    : "text-white"
                } text-black-contour text-[50px] p-0 ml-2 `}
              >
                m
              </div>
              {showMinion && (
                <div
                  className={`text-${mythSections[activeMyth]}-text ml-4  flex justify-center items-center text-center text-black-contour bottom-0 right-0  w-full text-tertiary -mt-1`}
                >
                  {!toggleValue ? (
                    <>
                      -
                      {calculateRemainingTime(
                        mythStates[activeMyth].shardsLastClaimedAt
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-[15px] pr-1">Lvl</span>
                      <div className="text-tertiary">
                        {mythStates[activeMyth].shardslvl}
                      </div>
                    </>
                  )}
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
                    tele.HapticFeedback.notificationOccurred("success");

                    if (showAutomata) {
                      setToggleValue((prev) => !prev);
                    }
                    setToggleValue((prev) => !prev);
                    setShowAutomata((prev) => !prev);
                  }}
                  className={`font-symbols transition-all duration-250 ${
                    glowBooster === 2
                      ? `scale-150 text-${mythSections[activeMyth]}-text`
                      : "text-white"
                  } text-black-contour text-[50px] p-0 mr-2`}
                >
                  n
                </div>
                {showAutomata && (
                  <div
                    className={`text-${mythSections[activeMyth]}-text flex items-center justify-center w-full text-black-contour bottom-0 right-0 text-tertiary -mt-1 mr-3`}
                  >
                    {!toggleValue ? (
                      <>
                        -
                        {calculateRemainingTime(
                          mythStates[activeMyth].automataStartTime
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-[15px] pr-1">Lvl</span>{" "}
                        <div className="text-tertiary">
                          {mythStates[activeMyth].automatalvl}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
