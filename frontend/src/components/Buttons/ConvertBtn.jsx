import React, { useState } from "react";
import { mythSections } from "../../utils/constants.fof";
import { CornerUpLeft, CornerUpRight, Repeat2, RotateCw } from "lucide-react";

const ConvertBtn = ({
  isConvert,
  handleClick,
  activeMyth,
  handleNext,
  handlePrev,
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
      className={`flex cursor-pointer items-center ${` border text-white border-${
        mythSections[activeMyth]
      }-primary ${
        isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
      }`} justify-between h-button-primary w-button-primary mt-[4px] mx-auto  bg-glass-black-lg z-50 rounded-primary`}
    >
      <div className="flex justify-center items-center w-1/4 h-full">
        <CornerUpLeft
          color={"white"}
          className="h-icon-secondary w-icon-secondary"
          onClick={handlePrev}
        />
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();

          handleClick();
        }}
        className={`flex shadow-black shadow-2xl justify-center text-[1.75rem] font-symbols items-center bg-black w-[4rem] h-[4rem] border-[3px]  border-${mythSections[activeMyth]}-primary rounded-full`}
      >
        {isConvert ? <RotateCw size={"2rem"} /> : <Repeat2 size={"2rem"} />}
      </div>

      <div className="flex justify-center items-center w-1/4  h-full">
        <CornerUpRight
          color={"white"}
          className="h-icon-secondary w-icon-secondary"
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default ConvertBtn;
