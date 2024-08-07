import React from "react";

const Symbol = ({ myth }) => {
  return (
    <div className="relative flex justify-center items-center h-[120px] w-[120px] bg-black border-2 border-white rounded-full">
      <div
        className={`flex justify-center items-center absolute z-10 filter-orbs-${myth}`}
      >
        <img src={`/themes/orb.png`} alt="orb" className="w-[80%] h-[80%]" />
      </div>
      <img
        src={`/assets/myths-orbs/mythology.${myth}.base.svg`}
        alt="symbol"
        className="h-[100%] w-[100%] absolute z-20"
      />
    </div>
  );
};

export default Symbol;
