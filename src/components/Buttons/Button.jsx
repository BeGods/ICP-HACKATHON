import React, { useState } from "react";
import { mythSections } from "../../utils/variables";

const Button = ({ message, handleClick, activeMyth, t }) => {
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
      className={`flex items-center justify-between h-button-primary w-button-primary mt-[10px] mx-auto border border-${
        mythSections[activeMyth]
      }-primary  bg-glass-black z-50 text-white ${
        isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
      } rounded-primary`}
    >
      <div className="flex justify-center items-center w-1/4 h-full"></div>
      <div className="text-[16px] uppercase">{message}</div>
      <div className="flex justify-center items-center w-1/4  h-full"></div>
    </div>
  );
};

export default Button;
