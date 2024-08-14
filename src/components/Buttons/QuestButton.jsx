import { CornerUpLeft, CornerUpRight } from "lucide-react";
import React from "react";

const mythSections = ["celtic", "egyptian", "greek", "norse"];

const QuestButton = ({
  handlePrev,
  handleNext,
  isCompleted,
  activeMyth,
  action,
  message,
  t,
}) => {
  return (
    <div>
      {/* <div className="absolute flex justify-center items-center w-full -mt-2">
        <div className="bg-black  h-[60px] w-[60px] rounded-full z-1"></div>
      </div> */}
      <div
        className={`flex items-center justify-between h-[60px] w-[192px] mx-auto border border-${mythSections[activeMyth]}-primary bg-glass-black text-white  rounded-button z-10`}
      >
        <div className="flex justify-center items-center w-1/4 border-r-[0.5px] border-borderGray h-full">
          <CornerUpLeft
            color="white"
            className="h-[20px] w-[20px]"
            onClick={handlePrev}
          />
        </div>
        {isCompleted ? (
          <div
            className={`text-[18px] uppercase px-2 text-${mythSections[activeMyth]}-primary font-semibold`}
          >
            {t("buttons.completed")}
          </div>
        ) : (
          <div
            onClick={action}
            className={`text-[18px] uppercase ${
              message === "Complete" && "px-2"
            } `}
          >
            {message}
          </div>
        )}
        <div className="flex justify-center items-center w-1/4 border-l-[0.5px] border-borderGray h-full">
          <CornerUpRight
            color="white"
            className="h-[20px] w-[20px]"
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestButton;
