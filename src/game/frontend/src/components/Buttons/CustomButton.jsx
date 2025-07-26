import React, { useContext, useRef, useState } from "react";
import { MainContext } from "../../context/context";

const CustomBtn = ({
  handleClick,
  buttonColor,
  message,
  isDefaultOff,
  isPay,
}) => {
  const { assets } = useContext(MainContext);
  const [isClicked, setIsClicked] = useState(false);
  let disableClick = useRef(false);

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
      onClick={() => {
        if (!disableClick.current) {
          disableClick.current = true;
          handleClick();
          setTimeout(() => {
            disableClick.current = false;
          }, 2000);
        }
      }}
      className="flex cursor-pointer justify-center items-center z-50 relative h-fit max-w-[60vw]"
    >
      <img
        className="pointer-events-none"
        src={
          (isDefaultOff
            ? assets.buttons[buttonColor].off
            : assets.buttons[buttonColor].on) ?? assets.buttons.black.off
        }
        alt="button"
      />
      {isPay ? (
        <div className="absolute gap-x-2 z-50 text-[1.75rem] uppercase flex items-center font-fof justify-center text-white opacity-80 text-black-contour mt-[2px]">
          <span className="font-symbols">A</span>
          <span>{isPay}</span>
        </div>
      ) : (
        <div className="absolute gap-x-2 z-50 text-[1.75rem] uppercase flex items-center font-fof justify-center text-white opacity-80 text-black-contour mt-[2px]">
          {message}
        </div>
      )}
    </div>
  );
};

export default CustomBtn;
