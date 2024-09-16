import React from "react";

export const ForgesGuide = ({ handleClick }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-[3px] flex flex-col items-center z-50">
      <div className="pb-2 h-[20%] w-screen bg-black -mt-1 text-white text-center uppercase">
        <div className="flex flex-col text-[12.2vw]  leading-[45px]">
          <span className="font-symbols text-[60px]">F</span>
          <div>TAP</div>
          <div>FORGES</div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow font-symbols items-center z-[99] text-white "
      >
        <div className="font-symbols  text-white text-[40vw]  top-5 scale-point">
          T
        </div>
      </div>
      <div className="h-[20%] flex justify-center items-center  bottom-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="text-primary break-words">TO EARN ORB(S)</div>
      </div>
    </div>
  );
};

export const QuestGuide = ({ handleClick }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-[3px] flex  flex-col items-center z-50">
      <div className="pb-2 w-screen bg-black  text-white text-center uppercase">
        <div className="flex flex-col text-[12.2vw] mt-2 leading-[45px]">
          <span className="font-symbols text-[60px]">Q</span>
          <div>
            CLAIM <br /> QUESTS
          </div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow font-symbols items-center text-white "
      >
        <div className="font-symbols  text-white text-[40vw] z-[99] top-10 scale-point">
          T
        </div>
      </div>
      <div className="h-[12%] flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
        <div className="text-primary break-words">Complete To Earn $FAITH</div>
      </div>
    </div>
  );
};

export const BoosterGuide = ({ handleClick }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-[3px] flex flex-col items-center z-50">
      <div className="pb-2 h-[20%] w-screen bg-black -mt-1 text-white text-center uppercase">
        <div className="flex flex-col text-[12.2vw]  leading-[45px]">
          <span className="font-symbols text-[60px]">Z</span>
          <div>ACQUIRE</div>
          <div>BOOSTER</div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow font-symbols items-center z-[99] text-white "
      >
        <div className="font-symbols  text-white text-[40vw]  top-5 scale-point">
          T
        </div>
      </div>
      <div className="h-[20%] flex justify-center items-center  bottom-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="text-primary break-words">FOR MORE REWARDS</div>
      </div>
    </div>
  );
};

export const ProfileGuide = ({ handleClick }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-[3px] flex  flex-col items-center z-50">
      <div className="pb-2 w-screen bg-black text-white text-center uppercase">
        <div className="flex flex-col text-[12.2vw] mt-2 leading-[45px]">
          <span className="font-symbols text-[60px]">P</span>
          <div>PLAYER</div>
          <div>INVITE</div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow font-symbols items-center text-white "
      >
        <div className="font-symbols  text-white text-[40vw] z-[99] top-10 scale-point">
          T
        </div>
      </div>
      <div className="h-[12%] flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
        <div className="text-primary break-words">TO CLAIM GIFTS</div>
      </div>
    </div>
  );
};
