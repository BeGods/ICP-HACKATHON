import React, { useState } from "react";
import { boosterIcon, mythSections } from "../../../utils/variables";
import { ChevronRight, LockKeyhole } from "lucide-react";

const BoosterCard = ({ isActive, handleClick, activeMyth, t, booster }) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      onClick={handleClick}
      className={`flex gap-1 border 
  ${
    isActive
      ? `border-${mythSections[activeMyth]}-primary text-white`
      : "border-cardsGray text-cardsGray"
  } ${
        isActive && isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
      } rounded-primary h-[90px] w-full bg-glass-black p-[15px] `}
      onMouseDown={() => {
        setIsClicked(true);
      }}
      onMouseUp={() => {
        setIsClicked(false);
      }}
      onMouseLeave={() => {
        setIsClicked(false);
      }}
      onTouchStart={() => {
        setIsClicked(true);
      }}
      onTouchEnd={() => {
        setIsClicked(false);
      }}
      onTouchCancel={() => {
        setIsClicked(false);
      }}
    >
      <div>
        <h1 className={`font-symbols text-booster p-0 -mt-5 -ml-2 `}>
          {boosterIcon[booster]}
        </h1>{" "}
      </div>
      <div className={`flex flex-col flex-grow justify-center -ml-1 `}>
        <h1 className="text-tertiary uppercase">
          {t(`boosters.${booster}.title`)}
        </h1>
        <h2 className="text-secondary">
          {t(`boosters.${booster}.desc`)}{" "}
          <span className={`text-${mythSections[activeMyth]}-text`}>
            {booster != 1 && "(Lvl 1-7)"}
          </span>
        </h2>
      </div>
      <div className="flex justify-center items-center w-[8%] ">
        {isActive ? (
          <ChevronRight className="absolute" size={"30px"} />
        ) : (
          <LockKeyhole className="absolute" size={"30px"} />
        )}
      </div>
    </div>
  );
};

export default BoosterCard;
