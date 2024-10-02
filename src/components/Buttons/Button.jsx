import React, { useRef, useState } from "react";
import { mythSections } from "../../utils/variables";
import { Download } from "lucide-react";

const Button = ({ message, handleClick, activeMyth, t, isGold, isBooster }) => {
  const [isClicked, setIsClicked] = useState(false);
  let disableClick = useRef(false);

  return (
    <div
      onClick={() => {
        if (disableClick.current === false) {
          disableClick.current = true;
          handleClick();
          setTimeout(() => {
            disableClick.current = false;
          }, 2000);
        }
      }}
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
      <div className="text-[16px] z-10 uppercase">
        {message === "claim" ? <Download size={"18vw"} /> : message}
      </div>
      <div className="flex justify-center items-center w-1/4  h-full">
        {isBooster && (
          <div className="relative flex justify-center items-center">
            {" "}
            <img
              src={`/assets/uxui/240px-orb.multicolor.png`}
              alt="orb"
              className="p-1.5"
            />
            <div className="absolute z-10">
              <div className="font-medium text-[40px] text-white glow-text-black">
                1
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Button;
