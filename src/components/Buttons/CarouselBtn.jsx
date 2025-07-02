import { CornerUpLeft, CornerUpRight } from "lucide-react";
import React, { useState } from "react";
import { mythSections } from "../../utils/constants";

const CarouselBtn = ({
  handlePrev,
  handleNext,
  activeMyth,
  currState,
  lastState,
  icon,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
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
      className={`flex items-center justify-between h-button-primary mt-[6px] w-button-primary mx-auto ${
        isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
      }  border border-${
        mythSections[activeMyth]
      }-primary bg-glass-black-lg text-white rounded-primary z-10`}
    >
      {/* Left Arrow */}
      <div className="flex justify-center items-center w-1/4  h-full">
        <CornerUpLeft
          color={currState === 0 ? `#707579` : "white"}
          className="h-icon-secondary w-icon-secondary"
          onClick={handlePrev}
        />
      </div>
      <div
        className={`flex text-[40px] font-symbols shadow-black shadow-2xl justify-center items-center bg-${
          activeMyth === 4 ? "black" : `${mythSections[activeMyth]}-text`
        } w-[4rem] h-[4rem] border-[3px] border-${
          mythSections[activeMyth]
        }-primary rounded-full`}
      >
        {icon}
      </div>
      {/* Right Arrow */}
      <div className="flex justify-center items-center w-1/4 h-full">
        <CornerUpRight
          color={currState === lastState ? `#707579` : "white"}
          className="h-icon-secondary w-icon-secondary"
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default CarouselBtn;
