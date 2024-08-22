import React, { useState } from "react";
import { mythSections } from "../../utils/variables";

// mr-[55px] mt-7 - convert info
// -mt-6 ml-6 - jigsaw info
// -mt-7 ml-7 - quest and jigsaw info
// -mt-[28px] ml-[52px] - infoncard close

const alignBasedOnCard = [
  "-mt-[28px] ml-[52px]",
  "-mt-7 ml-7",
  "mr-[60px] mt-6",
];
const IconButton = ({ isInfo, handleClick, activeMyth, align }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleButtonClick = () => {
    setIsButtonClicked(true);

    setTimeout(() => {
      setIsButtonClicked(false);
      handleClick();
    }, 100);
  };

  return (
    <div
      className={`absolute flex w-full justify-end top-0 ${alignBasedOnCard[align]}  z-10`}
      onClick={handleButtonClick}
    >
      <img
        src={`/assets/icons/${isInfo ? "info" : "close"}.svg`}
        alt={`${isInfo ? "info" : "close"}`}
        // style={{ filter: "invert(100%)" }}
        className={`w-icon-primary h-icon-primary border rounded-full ${
          isButtonClicked ? `glow-button-${mythSections[activeMyth]}` : ""
        }`}
      />
    </div>
  );
};

export default IconButton;
