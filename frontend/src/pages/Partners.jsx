import React, { useContext, useEffect, useState } from "react";
import { toggleBackButton } from "../utils/teleBackButton";
import { MyContext } from "../context/context";

const tele = window.Telegram?.WebApp;

const Partners = (props) => {
  const { setSection, rewards, setActiveReward } = useContext(MyContext);
  const [activeTab, setActiveTab] = useState(true);

  useEffect(() => {
    toggleBackButton(tele, () => {
      setSection(1);
    });
  }, []);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-auto items-center w-full  text-[10px] text-white bg-[#121212]">
      {/* HEADER */}
      <div className="flex flex-col w-full flex-grow px-1.5 mt-2">
        {/* TABS */}
        <div className="flex border border-borderDark w-full p-1 rounded-full h-[44px]">
          <div
            onClick={() => {
              setActiveTab(true);
            }}
            className={`flex justify-center items-center ${
              activeTab && "bg-borderGray"
            } h-full uppercase rounded-full w-1/2 text-[16px] py-1.5`}
          >
            PARTNERS
          </div>
          <div
            onClick={() => {
              setActiveTab(false);
            }}
            className={`flex justify-center items-center ${
              !activeTab && "bg-borderGray"
            } h-full uppercase rounded-full w-1/2 text-[16px] py-1.5`}
          >
            CHARITY
          </div>
        </div>

        {/* LEADERBOARD */}
        <div className="grid grid-cols-3 w-full flex-grow  bg-black rounded-primary my-2  px-2.5 pt-[15px] pb-[30px] gap-3">
          {rewards.map((item) => {
            return (
              <div
                onClick={() => {
                  setActiveReward(item);
                  setSection(9);
                }}
                className="flex flex-col justify-center items-center w-full h-32 rounded-primary"
              >
                <img
                  src={`/assets/partners/160px-${item.category}.bubble.png`}
                  alt="partner"
                  className="rounded-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Partners;
