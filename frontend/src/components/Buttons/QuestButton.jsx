import { CornerUpLeft, CornerUpRight, ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import { mythSections } from "../../utils/variables";

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
  t,
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
      className={`flex items-center justify-between h-button-primary mt-[10px] w-button-primary mx-auto ${
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
        <div
          className={`text-[18px] uppercase px-2 text-${mythSections[activeMyth]}-primary`}
        >
          {t("buttons.completed")}
        </div>
      ) : message === "Complete" ? (
        <div onClick={action} className={`text-[18px] uppercase px-2`}>
          {message}
        </div>
      ) : (
        <div onClick={action} className={`text-[18px] uppercase`}>
          <ThumbsUp size={"7vw"} />
        </div>
      )}
      <div className="flex justify-center items-center w-1/4 border-l-secondary border-borderGray h-full">
        <CornerUpRight
          color={currQuest !== lastQuest ? "white" : "#707579"}
          className="h-icon-secondary w-icon-secondary"
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default QuestButton;
