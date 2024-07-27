import React, { useEffect, useState } from "react";
import { toggleBackButton } from "../utils/teleBackButton";
import LeaderboardItem from "../components/LeaderboardItem";

const tele = window.Telegram?.WebApp;

const Leaderboard = (props) => {
  const [activeTab, setActiveTab] = useState(true);

  useEffect(() => {
    toggleBackButton(tele);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden  items-center w-full font-montserrat text-[10px] text-white bg-[#121212]">
      {/* HEADER */}
      <div
        style={{
          backgroundImage: `url(/themes/header/other.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
        className="h-[18.5%] w-full"
      >
        <div className="flex flex-col p-[20px]">
          <h1 className="text-[36px]">LEADERBOARD</h1>
          <h3 className="text-[20px]">#11 Daniel</h3>
        </div>
      </div>
      <div className="flex flex-col w-full h-full px-2 py-1.5 gap-2">
        {/* TABS */}
        <div className="flex border border-[#414141] w-full p-1 rounded-full h-[44px]">
          <div
            onClick={() => {
              setActiveTab(true);
            }}
            className={`flex justify-center items-center ${
              activeTab && "bg-borderGray"
            } h-full rounded-full w-1/2 text-[16px]`}
          >
            PLAYER
          </div>
          <div
            onClick={() => {
              setActiveTab(false);
            }}
            className={`flex justify-center items-center ${
              !activeTab && "bg-borderGray"
            } h-full rounded-full w-1/2 text-[16px]`}
          >
            SQUAD
          </div>
        </div>
        {/* LEADERBOARD */}
        <div className="flex flex-col h-[80%] w-full overflow-auto bg-black rounded-button py-[15px] gap-[10px]">
          <LeaderboardItem />
          <LeaderboardItem />
          <LeaderboardItem />
          <LeaderboardItem />
          <LeaderboardItem />
          <LeaderboardItem />
          <LeaderboardItem />
          <LeaderboardItem />
          <LeaderboardItem />
          <LeaderboardItem />
          <LeaderboardItem />
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-between h-[11.5%] text-[16px] w-full mx-auto mb-2 border border-yellow-500 bg-glass-black text-white font-montserrat rounded-button">
          <div className="flex justify-center items-center w-2/5 h-full">
            #1
          </div>
          <div className="flex items-center gap-4 w-full">
            <img
              src="/images/profile.png"
              alt="profile"
              className="h-[35px] w-[35px]"
            />
            <h1>Daniel</h1>
          </div>
          <div className="flex flex-col justify-center items-center text-[14px] w-2/5 h-full">
            <h1>300</h1>
            <h1 className="-mt-1.5">$ORBS</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
