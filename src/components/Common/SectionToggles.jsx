import React, { useState } from "react";
import { mythSections } from "../../utils/variables";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export const ToggleLeft = ({ handleClick, activeMyth }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleButtonClick = () => {
    setIsButtonClicked(true);

    setTimeout(() => {
      setIsButtonClicked(false);
      handleClick();
    }, 100);
  };
  return (
    <div className="flex justify-center items-center w-[20%] z-50">
      <div
        onClick={handleButtonClick}
        className={`bg-glass-black p-[6px] mt-1 rounded-full cursor-pointer  ${
          isButtonClicked ? `glow-button-${mythSections[activeMyth]}` : ""
        }`}
      >
        <ChevronsLeft color="white" className="h-[30px] w-[30px]" />
      </div>
    </div>
  );
};

export const ToggleRight = ({ handleClick, activeMyth }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleButtonClick = () => {
    setIsButtonClicked(true);

    setTimeout(() => {
      setIsButtonClicked(false);
      handleClick();
    }, 100);
  };

  return (
    <div className="flex justify-center items-center w-[20%] z-50">
      <div
        onClick={handleButtonClick}
        className={`bg-glass-black p-[6px] mt-1 rounded-full cursor-pointer  ${
          isButtonClicked ? `glow-button-${mythSections[activeMyth]}` : ""
        }`}
      >
        <ChevronsRight color="white" className="h-[30px] w-[30px]" />
      </div>
    </div>
  );
};
