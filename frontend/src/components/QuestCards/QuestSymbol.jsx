import React from "react";

const QuestSymbol = ({ myth }) => {
  return (
    <div className="relative flex justify-center items-center h-[45px] w-[45px] bg-black border-2 border-white rounded-full">
      <div
        className={`flex justify-center items-center absolute z-10 filter-orbs-${myth}`}
      >
        <img
          src={`/assets/uxui/240px-orb.base-tiny.png`}
          alt="orb"
          className="w-[65%] h-[65%]"
        />
      </div>
      <img
        src={`/assets/myth/mythology.${myth}.base.svg`}
        alt="symbol"
        className="h-[100%] w-[100%] absolute z-20"
      />
    </div>
  );
};

export default QuestSymbol;
