import React, { useContext, useRef } from "react";
import { MainContext } from "../../context/context";

const CustomBtn = ({ handleClick, buttonColor, message }) => {
  const { assets } = useContext(MainContext);
  let disableClick = useRef(false);

  return (
    <div
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
        src={assets.buttons[buttonColor].off ?? assets.buttons.black.off}
        alt="button"
      />
      <div className="absolute gap-x-2 z-50 text-[1.75rem] flex items-center font-fof justify-center text-white opacity-80 text-black-contour mt-[2px]">
        {message}
      </div>
    </div>
  );
};

export default CustomBtn;
