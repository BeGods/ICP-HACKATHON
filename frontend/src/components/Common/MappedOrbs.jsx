import React, { useContext } from "react";
import { mythSymbols } from "../../utils/constants.fof";
import { FofContext } from "../../context/context";

const MappedOrbs = ({ quest, showNum }) => {
  const { assets } = useContext(FofContext);
  return (
    <div className="flex w-full gap-[3px]">
      {Object.entries(quest.requiredOrbs).map(([key, value], index) => (
        <div key={index}>
          {key.toLowerCase() === "multiorb" ? (
            <div className="flex gap-[3px]" key={index}>
              {Array.from({ length: value }, (_, index) => (
                <div key={index}>
                  <div
                    className={`flex relative text-center justify-center text-black-sm-contour items-center glow-icon-white `}
                  >
                    <img
                      src={assets.items.multiorb}
                      alt="orb"
                      className={`filter-orbs-${key.toLowerCase()} max-w-[2.3rem]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-[3px]" key={key}>
              {Array.from({ length: value }, (_, index) => (
                <div key={index}>
                  <div
                    className={`flex  relative text-center justify-center text-black-sm-contour items-center glow-icon-${key.toLowerCase()} `}
                  >
                    <img
                      src={assets.uxui.baseOrb}
                      alt="orb"
                      className={`filter-orbs-${key.toLowerCase()} overflow-hidden max-w-xs-orb`}
                    />
                    <span
                      className={`absolute z-1  text-black-sm-contour transition-all duration-1000 ${
                        showNum
                          ? `transform scale-150 transition-transform duration-1000 opacity-100 text-${key.toLowerCase()}-text`
                          : "text-white"
                      }  font-symbols  text-symbol-xs mt-1 opacity-50`}
                    >
                      {mythSymbols[key.toLowerCase()]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MappedOrbs;
