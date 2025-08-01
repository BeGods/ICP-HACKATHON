import React, { useContext, useState } from "react";
import { mythSections } from "../../../utils/constants.fof";
import {
  calculateRemainingTime,
  hasTimeElapsed,
} from "../../../helpers/booster.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { FofContext } from "../../../context/context";

const tele = window.Telegram?.WebApp;

const GameHeader = ({
  activeMyth,
  mythStates,
  glowBooster,
  minimize,
  maximize,
}) => {
  const { enableHaptic } = useContext(FofContext);
  const [toggleValue, setToggleValue] = useState(true);

  return (
    <div className="w-full flex justify-center">
      <div
        className={`flex ${minimize && "minimize"} ${
          maximize && "maximize"
        } footer-width justify-between absolute bottom-1.5 z-0 transition-all duration-250`}
      >
        <div>
          {!mythStates[activeMyth].isShardsClaimActive &&
            !hasTimeElapsed(mythStates[activeMyth].shardsLastClaimedAt) && (
              <div className="flex items-center leading-tight flex-col relative h-fit shake-booster">
                <div
                  onClick={() => {
                    handleClickHaptic(tele, enableHaptic);

                    setToggleValue((prev) => !prev);
                  }}
                  className={`font-symbols glow-icon-${
                    mythSections[activeMyth]
                  } transition-all duration-500 ${
                    glowBooster === 1
                      ? `scale-150 text-${mythSections[activeMyth]}-text`
                      : "text-white"
                  }  text-iconLg p-0 ml-2`}
                >
                  9
                </div>
                <div
                  className={`text-white ml-2  flex justify-center items-center text-center text-black-contour bottom-0 right-0 -mt-1.5 w-full text-[1rem] `}
                >
                  {!toggleValue ? (
                    <>
                      {" "}
                      <div className="text-tertiary">
                        x{mythStates[activeMyth].shardslvl}
                      </div>
                    </>
                  ) : (
                    <>
                      -
                      {calculateRemainingTime(
                        mythStates[activeMyth].shardsLastClaimedAt
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
        </div>
        <div>
          {mythStates[activeMyth].isAutomataActive &&
            !hasTimeElapsed(mythStates[activeMyth].automataStartTime) && (
              <div className="flex items-center leading-tight flex-col relative h-fit shake-booster">
                <div
                  onClick={() => {
                    handleClickHaptic(tele, enableHaptic);
                    setToggleValue((prev) => !prev);
                  }}
                  className={`font-symbols transition-all duration-250 glow-icon-${
                    mythSections[activeMyth]
                  } ${
                    glowBooster === 2
                      ? `scale-150 text-${mythSections[activeMyth]}-text`
                      : "text-white"
                  } text-iconLg p-0 mr-2`}
                >
                  n
                </div>
                <div
                  className={`text-white flex items-center justify-center w-full text-black-contour bottom-0 right-0 text-[1rem]  -mt-1.5 mr-3`}
                >
                  {!toggleValue ? (
                    <>
                      <div className="text-tertiary">
                        x{mythStates[activeMyth].automatalvl}
                      </div>
                    </>
                  ) : (
                    <>
                      -
                      {calculateRemainingTime(
                        mythStates[activeMyth].automataStartTime
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
