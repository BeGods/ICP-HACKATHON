import React, { useContext, useEffect, useState } from "react";
import { toggleBackButton } from "../../utils/teleBackButton";
import LeaderboardItem from "./LeaderboardItem";
import { fetchLeaderboard } from "../../utils/api";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";
import {
  formatRankOrbs,
  timeRemainingForHourToFinishUTC,
} from "../../helpers/leaderboard.helper";
import { trackComponentView } from "../../utils/ga";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import UserInfoCard from "../../components/Cards/Info/UserInfoCrd";

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

const Leaderboard = (props) => {
  const { t } = useTranslation();
  const { setSection, authToken, assets, userData, enableHaptic, setShowCard } =
    useContext(MyContext);
  const [activeTab, setActiveTab] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const avatarColor = localStorage.getItem("avatarColor");
  const [leaderboard, setLeaderboard] = useState([]);
  const [squad, setSquad] = useState([]);
  const updateTimeLeft = timeRemainingForHourToFinishUTC();
  const util = {
    0: "second",
    1: "first",
    2: "third",
  };

  const getLeaderboardData = async () => {
    try {
      const response = await fetchLeaderboard(authToken);
      setLeaderboard(response.leaderboard);
      setSquad(response.squad);
      setTimeout(() => {
        setIsLoading(true);
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    trackComponentView("leaderboard");
    toggleBackButton(tele, () => {
      setSection(3);
    });
    (async () => getLeaderboardData())();
  }, []);

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
            backgroundImage: `url(${
              activeTab ? assets.uxui.fofsplash : assets.uxui.rorspash
            })`,
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
            setSection(3);
          }}
          className="flex slide-inside-left p-0.5 justify-end items-center w-1/4 bg-white rounded-r-full"
        >
          <div className="flex justify-center items-center bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full">
            0
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

      {/* Active Tab */}
      <div className="flex mt-[1.5vh] flex-col  absolute top-0 w-full">
        <div
          className={`flex z-50 transition-all p-0.5 duration-1000 ${
            activeTab ? "bg-white" : "bg-black"
          } mx-auto border border-black w-[40%] rounded-full h-[30px]`}
        >
          <div
            onClick={() => {
              setActiveTab(true);
            }}
            className={`flex justify-center items-center ${
              activeTab ? "bg-black text-white" : "text-white"
            } h-full uppercase rounded-full w-1/2 text-[16px] py-1`}
          >
            FoF
          </div>
          <div
            onClick={() => {
              setActiveTab(false);
            }}
            className={`flex justify-center items-center ${
              !activeTab ? "bg-white text-black" : "text-black"
            } h-full uppercase rounded-full w-1/2 text-[16px] py-1`}
          >
            RoR
          </div>
        </div>
        <div className="z-50 text-white text-black-contour w-full text-secondary text-center">
          ({t(`note.text`)} {updateTimeLeft.minutes}min)
        </div>
      </div>
      {activeTab ? (
        <div className="flex flex-grow justify-center">
          {isLoading && (
            <div className="flex items-end w-[90%] gap-2">
              {[leaderboard[1], leaderboard[0], leaderboard[2]].map(
                (item, index) => {
                  const positions = [
                    {
                      pos: 2,
                      size: "text-[60px]",
                      align: 5,
                    },
                    {
                      pos: 1,
                      size: "text-[100px]",
                      align: 10,
                    },
                    {
                      pos: 3,
                      size: "text-[50px]",
                      align: 5,
                    },
                  ];

                  return (
                    <div
                      onClick={() => {
                        handleClickHaptic(tele, enableHaptic);
                        setShowCard(
                          <UserInfoCard
                            close={() => {
                              setShowCard(null);
                            }}
                            userData={item}
                          />
                        );
                      }}
                      key={index}
                      style={{
                        boxShadow:
                          "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px, rgba(0, 0, 0, 0.55) 0px -50px 36px -28px inset",
                      }}
                      className={`flex leaderboard-${util[index]} relative justify-center items-center rise-up-${util[index]} w-full uppercase`}
                    >
                      <div
                        className={`flex text-[${positions[index].size}] ${positions[index].size} mt-12 h-fit text-white font-mono font-bold text-black-contour`}
                      >
                        {positions[index].pos}
                      </div>
                      <div className="absolute text-white -bottom-1 text-tertiary font-normal">
                        {formatRankOrbs(item.totalOrbs)}
                      </div>
                      <UserAvatar user={item} index={index} />
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
      {/* Leaderboard items */}
      {activeTab ? (
        <div className="flex flex-col w-full text-medium h-[56vh] bg-black text-black rounded-t-primary">
          <div className="flex justify-between text-secondary uppercase text-cardsGray items-center w-[90%] mx-auto py-3">
            <h1>
              <span className="pr-6">#</span>
              {t(`profile.name`)}
            </h1>
            <h1>{t(`keywords.orbs`)}</h1>
          </div>
          <div className="pb-[9vh] overflow-auto disable-scroll-bar">
            {leaderboard.slice(3).map((item, index) => (
              <div
                onClick={() => {
                  handleClickHaptic(tele, enableHaptic);
                  setShowCard(
                    <UserInfoCard
                      close={() => {
                        setShowCard(null);
                      }}
                      userData={item}
                    />
                  );
                }}
                key={index}
                className=""
              >
                <LeaderboardItem
                  key={index}
                  rank={index + 4}
                  name={item.telegramUsername}
                  totalOrbs={item.totalOrbs}
                  imageUrl={item.profileImage}
                />
              </div>
            ))}
          </div>
          <div className="flex px-1 pb-1 justify-center absolute bottom-0 w-full h-[8vh]">
            <div className="flex border border-gray-400 rounded-primary bg-black justify-center w-full">
              <div className="flex text-white justify-center items-center w-[20%] h-full">
                {userData.overallRank}
              </div>
              <div className="flex gap-3 items-center  w-full">
                <div className="h-[35px] w-[35px]">
                  {userData.avatarUrl ? (
                    <img
                      src={`https://media.publit.io/file/UserAvatars/${userData.avatarUrl}.jpg`}
                      alt="profile-image"
                      className="rounded-full"
                    />
                  ) : (
                    <Avatar
                      name={userData.telegramUsername}
                      className="h-full w-full"
                      profile={0}
                      color={avatarColor}
                    />
                  )}
                </div>
                <h1 className="text-white">
                  {userData.telegramUsername.length > 20
                    ? userData.telegramUsername.slice(0, 20)
                    : userData.telegramUsername}
                </h1>
              </div>
              <div className="flex flex-col text-white justify-center items-center text-tertiary w-[25%] h-full">
                <h1>{formatRankOrbs(userData.totalOrbs)}</h1>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-end w-full text-medium h-[60vh] bottom-0 text-black rounded-t-primary">
          <div className="w-full text-center text-[11vw] ">COMING SOON</div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
