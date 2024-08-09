import React, { useContext, useEffect, useState } from "react";
import { toggleBackButton } from "../utils/teleBackButton";
import LeaderboardItem from "../components/LeaderboardItem";
import { fetchLeaderboard } from "../utils/api";
import { MyContext } from "../context/context";
import Avatar from "../components/Avatar";

const tele = window.Telegram?.WebApp;

const Leaderboard = (props) => {
  const { userData } = useContext(MyContext);
  const [activeTab, setActiveTab] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [squad, setSquad] = useState([]);

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getLeaderboardData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetchLeaderboard(accessToken);
      setLeaderboard(response.leaderboard);
      setSquad(response.squad);
      console.log(response.squad);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    toggleBackButton(tele, () => {
      setSection(0);
    });
    (async () => getLeaderboardData())();
  }, []);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-auto items-center w-full font-montserrat text-[10px] text-white bg-[#121212]">
      {/* HEADER */}
      <div className="relative h-[140px] w-full flex-shrink-0">
        {/* Background with filter */}
        <div
          style={{
            backgroundImage: `url(/assets/uxui/header.paper_tiny.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
          className="absolute inset-0 z-0 filter-paper-other"
        ></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col p-[20px] w-full h-full justify-end">
          <h1 className="text-[36px]">LEADERBOARD</h1>
          <h3 className="text-[20px]">#11 Daniel</h3>
        </div>
      </div>

      <div className="flex flex-col w-full flex-grow px-1.5 mb-[80px]">
        {/* TABS */}
        <div className="flex border border-[#414141] w-full p-1 rounded-full h-[44px]">
          <div
            onClick={() => {
              setActiveTab(true);
            }}
            className={`flex justify-center items-center ${
              activeTab && "bg-borderGray"
            } h-full rounded-full w-1/2 text-[16px] py-1.5`}
          >
            PROFILE
          </div>
          <div
            onClick={() => {
              setActiveTab(false);
            }}
            className={`flex justify-center items-center ${
              !activeTab && "bg-borderGray"
            } h-full rounded-full w-1/2 text-[16px] py-1.5`}
          >
            SQUAD
          </div>
        </div>

        {/* LEADERBOARD */}
        <div className="flex flex-col w-full flex-grow  bg-black rounded-button my-2 py-[15px] gap-[10px]">
          {activeTab
            ? leaderboard.map((item, index) => (
                <LeaderboardItem
                  key={index}
                  rank={item.overallRank}
                  name={item.telegramUsername}
                  totalOrbs={item.totalOrbs}
                />
              ))
            : squad.map((item, index) => (
                <LeaderboardItem
                  key={index}
                  rank={item.overallRank}
                  name={item.telegramUsername}
                  totalOrbs={item.totalOrbs}
                />
              ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between h-[80px] w-[95%] mx-auto mb-1 text-[16px]  border border-yellow-500 bg-glass-black text-white font-montserrat rounded-button fixed bottom-0 left-0 right-0 box-border">
        <div className="flex justify-center items-center w-2/5 h-full">
          #{userData.overallRank}
        </div>
        <div className="flex items-center gap-4 w-full">
          <div className="h-[35px] w-[35px]">
            <Avatar
              name={userData.telegramUsername}
              className="h-full w-full"
              profile={0}
            />
          </div>
          <h1>{userData.telegramUsername}</h1>
        </div>
        <div className="flex flex-col justify-center items-center text-[14px] w-2/5 h-full">
          <h1>{userData.totalOrbs}</h1>
          <h1 className="-mt-1.5">$ORBS</h1>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
