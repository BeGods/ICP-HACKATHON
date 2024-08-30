import React, { useState } from "react";
import { mythSections, mythSymbols } from "../../utils/variables";

const GameHeader = ({ activeMyth, mythStates, handleActiveCard }) => {
  return (
    <div className="flex justify-between mt-2">
      <div className="flex absolute top-0  gap-4 flex-grow justify-center items-start text-white pl-2 "></div>
      <div className="flex w-full justify-between absolute -mt-2 top-0 z-50">
        <div>
          {!mythStates[activeMyth].isShardsClaimActive && (
            <h1
              onClick={() => {
                handleActiveCard("shard");
              }}
              className={`font-symbols glow-test-contour text-[50px] p-0 ml-2 text-white`}
            >
              H
            </h1>
          )}
        </div>
        <div>
          <div>
            {mythStates[activeMyth].isAutomataActive && (
              <h1
                onClick={() => {
                  handleActiveCard("automata");
                }}
                className="font-symbols glow-test-contour text-[50px] p-0 ml-2  text-white"
              >
                B
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;

{
  /* Stats */
}
{
  /* <div className="flex gap-1 items-center">
          <div
            className={`flex relative text-center justify-center max-w-orb items-center rounded-full glow-icon-${mythSections[activeMyth]}`}
          >
            <img
              src="/assets/uxui/240px-orb.base.png"
              alt="orb"
              className={`filter-orbs-${mythSections[activeMyth]}`}
            />
            <span
              className={`absolute z-1 font-symbols text-[40px] mt-0.5 ml-1 opacity-50 orb-glow`}
            >
              {mythSymbols[mythSections[activeMyth]]}
            </span>
          </div>
          <div className="font-fof text-primary font-normal">
            {formatOrbsWithLeadingZeros(orbs)}
          </div>
        </div> */
}
