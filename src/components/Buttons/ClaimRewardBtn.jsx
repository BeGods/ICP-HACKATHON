import React, { useContext, useRef, useState } from "react";
import { mythSections } from "../../utils/constants.fof";
import { ThumbsUp } from "lucide-react";
import { FofContext } from "../../context/context";

const ClaimRewardBtn = ({ handleClick }) => {
  let disableClick = useRef(false);

  return (
    <div
      onClick={() => {
        if (disableClick.current === false) {
          handleClick();
        }
      }}
      className={`flex items-center border text-white  justify-between h-button-primary w-button-primary mt-[4px] mx-auto  bg-glass-black-lg z-50 rounded-primary`}
    >
      <div className="flex justify-center items-center w-1/4 h-full"></div>
      <div
        className={`flex shadow-black shadow-2xl justify-center text-[40px] font-symbols items-center bg-black w-[4rem] h-[4rem] border-[3px] rounded-full`}
      >
        <ThumbsUp size={"1.75rem"} />
      </div>

      <div className="flex justify-center items-center w-1/4  h-full"></div>
    </div>
  );
};

export default ClaimRewardBtn;
