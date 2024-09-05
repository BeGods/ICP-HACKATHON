import React, { useState } from "react";
import { mythSections } from "../../utils/variables";
import { CornerUpLeft, CornerUpRight } from "lucide-react";

const JigsawButton = ({ activeMyth, handleNext, handlePrev, t, faith }) => {
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
      className={`flex items-center justify-between h-button-primary w-button-primary mx-auto mt-[42px] ${
        isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
      } border ${
        faith != 12
          ? "border-borderGray"
          : `border-${mythSections[activeMyth]}-primary`
      } bg-glass-black text-white  rounded-primary  absolute top-0 left-0 right-0`}
      style={{ top: "100%", transform: "translateY(-50%)" }}
    >
      <div className="flex justify-center items-center w-1/4 border-r-secondary border-borderGray h-full">
        <CornerUpLeft
          color="white"
          className="h-icon-secondary w-icon-secondary"
          onClick={handlePrev}
        />
      </div>
      <div
        className={`text-button-primary uppercase px-2 ${
          faith != 12 && "text-textGray"
        }`}
      >
        {t("buttons.redeem")}
      </div>
      <div className="flex justify-center items-center w-1/4 border-l-secondary border-borderGray h-full">
        <CornerUpRight
          color="#707579"
          className="h-icon-secondary w-icon-secondary"
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default JigsawButton;
