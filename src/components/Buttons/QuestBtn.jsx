import { Check, CircleCheck, CornerUpLeft, CornerUpRight } from "lucide-react";
import React, { useState } from "react";
import { mythSections } from "../../utils/constants.fof";

const QuestButton = ({
  handlePrev,
  handleNext,
  isCompleted,
  activeMyth,
  action,
  currQuest,
  lastQuest,
  faith,
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
      }-primary bg-glass-black text-white rounded-primary z-10`}
    >
      {/* Left Arrow */}
      <div className="flex justify-center items-center w-1/4  h-full">
        <CornerUpLeft
          color={currQuest === 0 ? `#707579` : "white"}
          className="h-icon-secondary w-icon-secondary"
          onClick={handlePrev}
        />
      </div>
      {/* Click */}
      {isCompleted ? (
        <div
          className={`flex shadow-black shadow-2xl justify-center items-center bg-${mythSections[activeMyth]}-text p-[5vw] rounded-full`}
        >
          <Check size={"7.5vw"} strokeWidth={5} />
        </div>
      ) : (
        <div
          onClick={action}
          className={`flex shadow-black shadow-2xl justify-center items-center bg-black border-[3px] p-[5vw] rounded-full`}
        >
          <Check size={"7.5vw"} strokeWidth={5} />
        </div>
      )}
      {/* Right Arrow */}
      <div className="flex justify-center items-center w-1/4 h-full">
        <CornerUpRight
          color={currQuest !== lastQuest || faith !== 0 ? "white" : "#707579"}
          className="h-icon-secondary w-icon-secondary"
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default QuestButton;
