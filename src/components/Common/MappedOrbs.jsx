import React from "react";
import { mythSymbols } from "../../utils/variables";

const MappedOrbs = ({ quest }) => {
  return (
    <div className="flex w-full gap-[3px]">
      {Object.entries(quest.requiredOrbs).map(([key, value]) => (
        <div className="flex gap-[3px]" key={key}>
          {Array.from({ length: value }, (_, index) => (
            <div
              key={index}
              className={`flex relative text-center justify-center items-center glow-icon-${key.toLowerCase()} max-w-[10vw]`}
            >
              <img
                src="/assets/uxui/240px-orb.base.png"
                alt="orb"
                className={`filter-orbs-${key.toLowerCase()} `}
              />
              <span
                className={`absolute z-1 opacity-50 orb-glow font-symbols text-white text-[2.3rem] mt-1 ${
                  key.toLowerCase() === "egyptian" && "ml-[2px]"
                } ${key.toLowerCase() === "greek" && "ml-[5px]"}`}
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
