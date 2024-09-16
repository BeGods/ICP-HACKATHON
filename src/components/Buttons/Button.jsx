import React, { useState } from "react";
import { mythSections } from "../../utils/variables";
import { Download } from "lucide-react";

const Button = ({ message, handleClick, activeMyth, t, isGold }) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      onClick={handleClick}
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
      className={`flex items-center ${
        isGold
          ? "text-gold border border-gold"
          : ` border text-white border-${mythSections[activeMyth]}-primary ${
              isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
            }`
      } justify-between h-button-primary w-button-primary mt-[10px] mx-auto  bg-glass-black z-50 rounded-primary`}
    >
      <div className="flex justify-center items-center w-1/4 h-full"></div>
      <div className="text-[16px] uppercase">
        {message === "claim" && <Download size={"18vw"} />}
      </div>
      <div className="flex justify-center items-center w-1/4  h-full"></div>
    </div>
  );
};

export default Button;
