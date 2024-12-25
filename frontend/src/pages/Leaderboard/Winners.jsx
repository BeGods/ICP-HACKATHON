import React, { useContext, useState } from "react";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";
import LeaderboardItem from "./LeaderboardItem";
import { countries } from "../../utils/country";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import UserInfoCard from "../../components/Cards/Info/UserInfoCrd";
import { formatRankOrbs } from "../../helpers/leaderboard.helper";

const tele = window.Telegram?.WebApp;

const UserAvatar = ({ user, index }) => {
  const { assets, platform } = useContext(MyContext);
  const util = {
    0: "second",
    1: "first",
    2: "third",
  };
  const [avatarColor, setAvatarColor] = useState(() => {
    return localStorage.getItem("avatarColor");
  });

  return (
    <div className="absolute rounded-full min-w-[31vw] min-h-[31vw] bg-white top-0 -mt-[15vw]">
      <div
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 1) 0px 1px 12px",
        }}
        className={`flex flex-col items-start relative leaderboard-${util[index]} rounded-full `}
      >
        <img
          src={
            user?.profileImage
              ? `https://media.publit.io/file/UserAvatars/${user?.profileImage}.jpg`
              : `${assets.uxui.baseorb}`
          }
          alt="base-orb"
          className={`${
            !user?.profileImage && `filter-orbs-${avatarColor}`
          } w-full h-full rounded-full p-[5px] pointer-events-none`}
        />
        {!user?.profileImage && (
          <div
            className={`z-1 flex justify-center items-start text-white text-[22vw] transition-all duration-1000  text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
          >
            <div
              className={`uppercase ${
                platform === "ios" ? "" : "mt-1"
              } text-white`}
            >
              {user.telegramUsername[0]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Winners = () => {
  const { assets, leaderboard, setSection, enableHaptic } =
    useContext(MyContext);
  const leaderboardData = leaderboard.hallOfFame;
  const { t } = useTranslation();
  const util = {
    0: "second",
    1: "first",
    2: "third",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
      }}
      className="flex flex-col h-screen overflow-hidden m-0"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
        className="background-wrapper"
      >
        <div
          className={`absolute top-0 left-0 h-full w-full blur-[3px]`}
          style={{
            backgroundImage: `url(${assets.uxui.fofsplash})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>

      <div className="flex h-button-primary mt-[1.5vh] absolute z-50 text-black font-symbols justify-between w-screen">
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            setSection(7);
          }}
          className="flex slide-inside-left p-0.5 justify-end items-center w-1/4 bg-white rounded-r-full"
        >
          <div className="flex justify-center items-center bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full">
            r
          </div>
        </div>
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            setSection(0);
          }}
          className="flex slide-inside-right p-0.5 justify-start items-center w-1/4 bg-white rounded-l-full"
        >
          <div className="flex justify-center items-center bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full">
            z
          </div>
        </div>
      </div>

      <div className="flex flex-grow justify-center"></div>

      <div className="flex flex-col w-full text-medium h-[56vh] bg-black text-black rounded-t-primary">
        <div className="flex justify-between text-secondary uppercase text-cardsGray items-center w-[90%] mx-auto py-3">
          <h1>
            <span className="pr-6">#</span>
            {t(`profile.name`)}
          </h1>
          <div className="absolute text-gold w-full flex justify-center ">
            {t(`sections.leaderboard`)}
          </div>
          <h1>{t(`keywords.orbs`)}</h1>
        </div>
        <div className="pb-[9vh] overflow-auto disable-scroll-bar">
          {leaderboard.hallOfFame.map((item, index) => {
            const { telegramUsername, profileImage, id } = item;

            const countryFlag =
              countries.find((country) => country.code == item.country).flag ||
              "🌐";

            return (
              <div key={id || index} className="leaderboard-item">
                <LeaderboardItem
                  rank={index + 1}
                  name={telegramUsername}
                  totalOrbs={countryFlag}
                  imageUrl={profileImage}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Winners;
