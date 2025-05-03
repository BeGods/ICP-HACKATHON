import React, { useContext, useRef, useState } from "react";
import { RorContext } from "../../context/context";
import { Lock, ThumbsUp } from "lucide-react";
import {
  colorByElement,
  colorByMyth,
  elements,
  mythSections,
} from "../../utils/constants.ror";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const RoRBtn = ({
  handleClick,
  message,
  left,
  right,
  disable,
  isNotPay,
  itemId,
}) => {
  const { assets, enableHaptic } = useContext(RorContext);
  let disableClick = useRef(false);
  let buttonColor = "black";
  const matchedElement =
    elements.find((element) => itemId?.includes(element)) || null;
  const matchedMyth =
    mythSections.find((element) => itemId?.includes(element)) || null;
  if (matchedMyth && itemId) {
    buttonColor = colorByMyth[matchedMyth];
  } else if (matchedElement && itemId) {
    buttonColor = colorByElement[matchedElement];
  }

  return (
    <div
      onClick={() => {
        if (disableClick.current === false) {
          disableClick.current = true;
          handleClickHaptic(tele, enableHaptic);
          handleClick();
          setTimeout(() => {
            disableClick.current = false;
          }, 2000);
        }
      }}
      className="flex justify-center items-center relative h-fit mt-1"
    >
      <img
        src={assets.buttons[buttonColor]?.on ?? assets.buttons.black.on}
        alt="button"
      />
      <div className="absolute z-50 flex items-center justify-center  text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
        {isNotPay ? (
          <h1 className="uppercase">{message}</h1>
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
