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

const tele = window.Telegram?.WebApp;

const UserAvatar = ({ user, index }) => {
  const { assets, platform } = useContext(MyContext);
  const util = {
    0: "first",
    1: "second",
    2: "third",
  };
  const [avatarColor, setAvatarColor] = useState(() => {
    return localStorage.getItem("avatarColor");
  });

  return (
    <div className="absolute rounded-full w-[31vw] h-[31vw] bg-white top-0 -mt-[15vw]">
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
          } w-full h-full rounded-full p-[5px] `}
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
  const { setSection, authToken, assets } = useContext(MyContext);
  const [activeTab, setActiveTab] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const avatarColor = localStorage.getItem("avatarColor");
  const [leaderboard, setLeaderboard] = useState([]);
  const [squad, setSquad] = useState([]);
  const updateTimeLeft = timeRemainingForHourToFinishUTC();
  const util = {
    0: "first",
    1: "second",
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

      {/* Active Tab */}
      <div className="flex flex-col  absolute top-0 w-full">
        <div className="z-50 text-white text-black-contour w-full text-secondary text-center">
          ({t(`note.text`)} {updateTimeLeft.minutes}min)
        </div>
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
      </div>
      {activeTab ? (
        <div className="flex flex-grow justify-center">
          {isLoading && (
            <div className="flex items-end w-[90%] gap-2">
              {leaderboard.slice(0, 3).map((item, index) => {
                const newIndex = index === 0 ? 1 : index === 1 ? 0 : 2;
                return (
                  <div
                    style={{
                      boxShadow:
                        "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px, rgba(0, 0, 0, 0.55) 0px -50px 36px -28px inset",
                    }}
                    className={`flex leaderboard-${util[newIndex]} relative justify-center items-center rise-up-${util[newIndex]} w-full uppercase`}
                  >
                    <div className="flex flex-col w-full justify-center text-center text-white absolute -bottom-1">
                      <h1 className="text-[50px] -mb-5 font-mono font-bold  text-black-contour">
                        {newIndex + 1}
                      </h1>
                      <h2 className="text-tertiary font-normal">
                        {formatRankOrbs(item.totalOrbs)}
                      </h2>
                    </div>
                    <UserAvatar user={item} index={newIndex} />
                  </div>
                );
              })}
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
          <div className="overflow-auto">
            {leaderboard.map((item, index) => (
              <div className="">
                <LeaderboardItem
                  key={index}
                  rank={index + 1}
                  name={item.telegramUsername}
                  totalOrbs={item.totalOrbs}
                  imageUrl={item.profileImage}
                />
              </div>
            ))}
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
