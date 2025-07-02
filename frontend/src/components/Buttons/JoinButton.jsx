import React, { useContext, useRef, useState } from "react";
import { RorContext } from "../../context/context";

const JoinButton = ({ payWithOrb, payWithCoin }) => {
  const { assets } = useContext(RorContext);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="flex gap-2">
      <div
        onClick={() => {
          payWithCoin();
        }}
        className={`flex items-center border text-white ${
          isClicked && `glow-button-white`
        } justify-between h-button-primary w-[100px] mt-[4px] mx-auto bg-glass-black-lg z-50 rounded-primary`}
      >
        <div className="flex justify-center items-center  h-full">
          <div className={`relative flex justify-center items-center`}>
            <img src={assets.uxui.gobcoin} alt="orb" className="p-5" />
            <div className="absolute z-10">
              <div className="text-num text-white glow-text-black">3</div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          payWithOrb();
        }}
        className={`flex items-center border text-white ${
          isClicked && `glow-button-white`
        } justify-between h-button-primary w-[100px] mt-[4px] mx-auto bg-glass-black-lg z-50 rounded-primary`}
      >
        <div className="flex justify-center items-center  h-full">
          <div className={`relative flex justify-center items-center`}>
            <img
              src={`${assets.uxui.baseOrb}`}
              alt="orb"
              className="p-5 filter-orbs-celtic"
            />
            <div className="absolute z-10">
              <div className="text-num text-white glow-text-black">3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinButton;

{
  /* <div className="flex justify-center items-center w-1/2 h-full">
<div
  onClick={payWithOrb}
  className={`relative flex justify-center items-center`}
>
  <img
    src={`${assets.uxui.baseOrb}`}
    alt="orb"
    className="p-5 filter-orbs-celtic"
  />
  <div className="absolute z-10">
    <div className="text-[10px] text-white glow-text-black">3</div>
  </div>
</div>
</div> */
}

// onClick={() => {
//     if (disableClick.current === false) {
//       disableClick.current = true;
//       handleClick();
//       setTimeout(() => {
//         disableClick.current = false;
//       }, 2000);
//     }
//   }}
