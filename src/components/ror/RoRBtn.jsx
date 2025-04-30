import React, { useContext, useRef, useState } from "react";
import { RorContext } from "../../context/context";
import { Lock, ThumbsUp } from "lucide-react";

const RoRBtn = ({ handleClick, left, right, disable, isNotPay }) => {
  const { assets } = useContext(RorContext);
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
      className="flex justify-center items-center relative h-fit mt-1"
    >
      <img src={assets.buttons.black.on} alt="button" />
      <div className="absolute z-50 flex items-center justify-center  text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
        {isNotPay ? (
          <h1 className="uppercase">enter</h1>
        ) : (
          <div className="flex items-center justify-center">
            <span className="font-symbols px-2">A</span>
            {right}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoRBtn;
