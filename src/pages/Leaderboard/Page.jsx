import React, { useContext, useEffect, useState } from "react";
import { toggleBackButton } from "../../utils/teleBackButton";
import LeaderboardItem from "./LeaderboardItem";
import { fetchLeaderboard } from "../../utils/api";
import { MyContext } from "../../context/context";
import Avatar from "../../components/Common/Avatar";
import { useTranslation } from "react-i18next";
import { timeRemainingForHourToFinishUTC } from "../../helpers/leaderboard.helper";

const tele = window.Telegram?.WebApp;

const Leaderboard = (props) => {
  const { t } = useTranslation();
  const { userData, setSection, authToken } = useContext(MyContext);
  const [activeTab, setActiveTab] = useState(true);
  const avatarColor = localStorage.getItem("avatarColor");
  const [leaderboard, setLeaderboard] = useState([]);
  const [squad, setSquad] = useState([]);
  const updateTimeLeft = timeRemainingForHourToFinishUTC();

  const getLeaderboardData = async () => {
    try {
      const response = await fetchLeaderboard(authToken);
      setLeaderboard(response.leaderboard);
      setSquad(response.squad);
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
            {t(`profile.player`)}
          </div>
          <div
            onClick={() => {
              setActiveTab(false);
            }}
            className={`flex justify-center items-center ${
              !activeTab && "bg-borderGray"
            } h-full uppercase rounded-full w-1/2 text-[16px] py-1.5`}
          >
            {t(`profile.squad`)}
          </div>
        </div>
        <div className="w-full text-secondary text-center pt-1">
          {t(`note.text`)} {updateTimeLeft.minutes}min
        </div>
        {/* LEADERBOARD */}
        <div className="flex flex-col w-full flex-grow bg-black rounded-primary my-2">
          <div className="flex justify-between text-secondary uppercase text-cardsGray items-center w-[90%] mx-auto py-3">
            <h1>
              <span className="pr-6">#</span>
              {t(`profile.name`)}
            </h1>
            <h1>{t(`keywords.orbs`)}</h1>
          </div>
          {activeTab
            ? leaderboard.map((item, index) => (
                <div className="">
                  <div className="border-t border-borderDark w-[90%] mx-auto"></div>
                  <LeaderboardItem
                    key={index}
                    rank={index + 1}
                    name={item.telegramUsername}
                    totalOrbs={item.totalOrbs}
                  />
                </div>
              ))
            : squad.map((item, index) => (
                <LeaderboardItem
                  key={index}
                  rank={index + 1}
                  name={item.telegramUsername}
                  totalOrbs={item.totalOrbs}
                />
              ))}
        </div>
      </div>
      {/* FOOTER */}
      <div className="flex items-center justify-between h-[80px] w-[95%] mx-auto mb-1 text-tertiary  border border-borderDark bg-black text-white  rounded-primary fixed bottom-0 left-0 right-0 box-border">
        <div className="flex justify-center items-center w-2/5 h-full">
          {userData.overallRank}
        </div>
        <div className="flex items-center gap-4 w-full">
          <div className="h-[35px] w-[35px]">
            <Avatar
              name={userData.telegramUsername}
              className="h-full w-full"
              profile={0}
              color={avatarColor}
            />
          </div>
          <h1>{userData.telegramUsername}</h1>
        </div>
        <div className="flex flex-col justify-center items-center text-tertiary w-2/5 h-full">
          <h1>{parseFloat(userData.totalOrbs.toFixed(3))}</h1>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
