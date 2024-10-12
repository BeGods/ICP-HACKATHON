import React from "react";

const Symbol = ({ myth, isCard, showClaimEffect }) => {
  return (
    <div
      className={`relative  select-none pointer-events-none  flex justify-center items-center ${
        isCard
          ? "h-symbol-secondary w-symbol-secondary"
          : "h-symbol-primary w-symbol-primary"
      } bg-black border border-white rounded-full outline-[2px] transition-all duration-1000  z-30 ${
        showClaimEffect ? `glow-tap-${myth}` : `glow-symbol-${myth}`
      }`}
    >
      <div className={`flex justify-center items-center absolute z-10  `}>
        <div className={`w-[65%] h-[65%] glow-symbol-${myth}`}>
          <img
            src={`/assets/uxui/240px-orb.base.png`}
            alt="orb"
            className={`w-full h-full filter-orbs-${myth} `}
          />
        </div>
      </div>
      <img
        src={`/assets/myth/mythology.${myth}.base.svg`}
        alt="symbol"
        className="h-[100%] w-[100%] absolute z-20"
      />
    </div>
  );
};

export default Symbol;
