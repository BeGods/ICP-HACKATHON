import { Check, CircleCheck, CornerUpLeft, CornerUpRight } from "lucide-react";
import React, { useState } from "react";
import { mythSections } from "../../utils/constants";

const QuestButton = ({
  handlePrev,
  handleNext,
  isCompleted,
  activeMyth,
  action,
  message,
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
      <div className="flex justify-center items-center w-1/4 border-r-secondary border-borderGray h-full">
        <CornerUpLeft
          color={currQuest === 0 ? `#707579` : "white"}
          className="h-icon-secondary w-icon-secondary"
          onClick={handlePrev}
        />
      </div>
      {isCompleted ? (
        <div>
          <div
            className={`flex shadow-black shadow-2xl justify-center items-center bg-${mythSections[activeMyth]}-text p-[5vw] rounded-full`}
          >
            <Check size={"7.5vw"} strokeWidth={5} />
          </div>
        </div>
      ) : message === "Complete" ? (
        <div
          onClick={action}
          className={`text-${mythSections[activeMyth]}-text`}
        >
          <CircleCheck size={"75px"} />
        </div>
      ) : (
        <div onClick={action}>
          <CircleCheck size={"75px"} />
        </div>
      )}
      <div className="flex justify-center items-center w-1/4 border-l-secondary border-borderGray h-full">
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
