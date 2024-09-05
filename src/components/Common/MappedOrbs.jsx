import React from "react";
import { mythSymbols } from "../../utils/variables";

const MappedOrbs = ({ quest, showNum }) => {
  return (
    <div className="flex w-full gap-[3px]">
      {Object.entries(quest.requiredOrbs).map(([key, value]) => (
        <div className="flex gap-[3px]" key={key}>
          {console.log(`text-${key.toLowerCase()}-text`)}
          {Array.from({ length: value }, (_, index) => (
            <div
              key={index}
              className={`flex relative text-center justify-center text-black-sm-contour items-center glow-icon-${key.toLowerCase()} max-w-[10vw]`}
            >
              <img
                src="/assets/uxui/240px-orb.base.png"
                alt="orb"
                className={`filter-orbs-${key.toLowerCase()}`}
              />
              <span
                className={`absolute z-1  text-black-sm-contour transition-all duration-1000 ${
                  showNum
                    ? `transform scale-150 transition-transform duration-1000 opacity-100 text-${key.toLowerCase()}-text`
                    : "text-white"
                }  font-symbols  text-[2.3rem] mt-1 opacity-50`}
              >
                {mythSymbols[key.toLowerCase()]}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MappedOrbs;
