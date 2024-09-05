import React, { useState } from "react";
import { boosterIcon, mythSections } from "../../../utils/variables";
import { ChevronRight, LockKeyhole, Star } from "lucide-react";

const starColors = ["#ff0000", "#01ff29", "#179fd1", "#feea4b"];

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
        <div className={`font-symbols text-booster p-0 -mt-5 -ml-2 `}>
          {booster > 5 ? (
            <Star
              size={"13vw"}
              fill={"white"}
              color={"white"}
              className={`mx-2 mt-[20px] glow-star-${mythSections[activeMyth]}`}
            />
          ) : (
            <>{boosterIcon[booster]}</>
          )}
        </div>{" "}
      </div>
      <div className={`flex flex-col flex-grow justify-center -ml-1 `}>
        <h1 className="text-tertiary uppercase">
          {t(`boosters.${booster}.title`)}
        </h1>
        <h2 className="text-secondary">
          {t(`boosters.${booster}.desc`)}{" "}
          {booster === 1 && (
            <span className={`text-${mythSections[activeMyth]}-text pl-1`}>
              200%
            </span>
          )}
          {booster === 6 && (
            <span className={`text-${mythSections[activeMyth]}-text pl-1`}>
              L99
            </span>
          )}
          <span className={`text-${mythSections[activeMyth]}-text pl-1`}>
            {booster != 1 && booster != 6 && "L1-99"}
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
