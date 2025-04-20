import React, { useContext, useRef, useState } from "react";
import { RorContext } from "../../context/context";

const RoRBtn = ({ handleClick, left, right }) => {
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
      className={`flex items-center border text-white ${
        isClicked && `glow-button-white`
      } justify-between h-button-primary mt-[4px] w-button-primary  mx-auto  bg-glass-black z-50 rounded-primary`}
    >
      <div className="flex text-primary justify-center items-center w-1/4 h-full">
        {left}
      </div>
      <div
        className={`flex shadow-black shadow-2xl justify-center text-[40px] font-symbols items-center bg-black w-[18vw] h-[18vw] border-[3px] rounded-full`}
      >
        V
      </div>

      <div className="flex justify-center items-center w-1/4  h-full">
        <div className="relative flex justify-center items-center">
          <img src={`/assets/240px-gobcoin.png`} alt="orb" className="p-1" />
          <div className="absolute z-10">
            <div className="text-primary text-white glow-text-black">
              {right}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoRBtn;
