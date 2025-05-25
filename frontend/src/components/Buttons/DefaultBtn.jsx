import React, { useContext, useRef, useState } from "react";
import { mythSections } from "../../utils/constants.fof";
import { BookOpenText, Handshake } from "lucide-react";
import { FofContext } from "../../context/context";

const DefaultBtn = ({
  message,
  handleClick,
  activeMyth,
  isGold,
  isBooster,
}) => {
  const { assets } = useContext(FofContext);
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
      className={`flex cursor-pointer items-center ${
        isGold
          ? "text-gold border border-gold"
          : ` border text-white border-${mythSections[activeMyth]}-primary ${
              isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
            }`
      } justify-between h-button-primary w-button-primary mt-[4px] mx-auto  bg-glass-black z-50 rounded-primary`}
    >
      <div className="flex justify-center items-center w-1/4 h-full"></div>
      <div
        className={`flex shadow-black shadow-2xl justify-center text-[2rem] font-symbols items-center bg-black w-[4rem] h-[4rem] border-[3px]  border-${mythSections[activeMyth]}-primary rounded-full`}
      >
        {message === 0 ? (
          "V"
        ) : message === 1 ? (
          <Handshake size={"2rem"} />
        ) : message === 2 ? (
          "8"
        ) : message === 3 ? (
          <BookOpenText size={"2rem"} />
        ) : (
          ""
        )}
      </div>

      <div className="flex justify-center items-center w-1/4  h-full">
        {isBooster && (
          <div className="relative flex justify-center items-center">
            <img src={`${assets.items.multiorb}`} alt="orb" className="p-1.5" />
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

export default DefaultBtn;
