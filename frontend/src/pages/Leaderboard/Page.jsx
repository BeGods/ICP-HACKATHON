import React, { useCallback, useContext, useEffect, useState } from "react";
import LeaderboardItem from "./LeaderboardItem";
import { fetchLeaderboard } from "../../utils/api";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";
import {
  formatRankOrbs,
  timeRemainingForHourToFinishUTC,
} from "../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import UserInfoCard from "../../components/Cards/Info/UserInfoCrd";
import { Crown, Trophy } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { countries } from "../../utils/country";

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
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [hallOfFameData, sethallOfFameData] = useState([]);
  const avatarColor = localStorage.getItem("avatarColor");
  const updateTimeLeft = timeRemainingForHourToFinishUTC();
  const util = {
    0: "second",
    1: "first",
    2: "third",
  };

  const getLeaderboardData = async (pageNum) => {
    try {
      const response = await fetchLeaderboard(authToken, pageNum);

      if (response.leaderboard.length > 0) {
        sethallOfFameData(response.hallOfFame);
        setLeaderboardData((prevData) => [
          ...prevData,
          ...response.leaderboard,
        ]);
      } else {
        setHasMore(false);
      }

      setTimeout(() => {
        setIsLoading(true);
      }, 500);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    getLeaderboardData(page);
  }, [page]);

  const loadMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const placeholderItem = {
    telegramUsername: "Anonymous",
    profileImage: "default-profile.png", // Provide a default profile image URL
    id: null,
    country: "NA", // Default or placeholder country code
    isEmpty: true,
  };

  const paddedHallOfFameData = [
    ...hallOfFameData,
    ...Array.from(
      { length: 99 - hallOfFameData.length },
      () => placeholderItem
    ),
  ];

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

      {isFinished ? (
        <div className="flex h-button-primary mt-[1.5vh] absolute z-50 text-black font-symbols justify-between w-screen">
          <div
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setIsFinished(false);
            }}
            className="flex slide-inside-left p-0.5 justify-end items-center w-1/4 bg-white rounded-r-full"
          >
            <div className="flex justify-center items-center bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full">
              r
            </div>
          </div>
          <div className="flex font-fof z-20 flex-col top-0 w-1/2">
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
              ( Hall Of Fame )
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
      ) : (
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
          <div className="flex font-fof z-20 flex-col top-0 w-1/2">
            <div
              className={`flex z-50 transition-all p-0.5  duration-1000 ${
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
          <div
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setIsFinished(true);
            }}
            className="flex slide-inside-right p-0.5 justify-start items-center w-1/4 bg-white rounded-l-full"
          >
            <div className="flex justify-center items-center bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full">
              <Crown size={"9vw"} />
            </div>
          </div>
        </div>
      )}

      <>
        {isFinished ? (
          <>
            {activeTab ? (
              <div className="flex flex-grow justify-center">
                {isLoading && (
                  <div className="flex items-end w-[90%] gap-2">
                    {[
                      hallOfFameData[1],
                      hallOfFameData[0],
                      hallOfFameData[2],
                    ].map((item, index) => {
                      const countryFlag =
                        countries.find(
                          (country) => country.code == item.country
                        ).flag || "🌐";
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
                          <div className="absolute text-white -bottom-1 text-[24px] font-normal">
                            {countryFlag}
                          </div>
                          <UserAvatar user={item} index={index} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {activeTab ? (
              <div className="flex flex-grow justify-center">
                {isLoading && (
                  <div className="flex items-end w-[90%] gap-2">
                    {[
                      leaderboardData[1],
                      leaderboardData[0],
                      leaderboardData[2],
                    ].map((item, index) => {
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
                    })}
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </>
      {/* Leaderboard items */}
      <>
        {isFinished ? (
          <>
            {activeTab ? (
              <div className="flex flex-col w-full text-medium h-[56vh] bg-black text-black rounded-t-primary">
                <div className="flex justify-between text-secondary uppercase text-cardsGray items-center w-[90%] mx-auto py-3">
                  <h1>
                    <span className="pr-6">#</span>
                    {t(`profile.name`)}
                  </h1>
                  <h1>{t(`keywords.orbs`)}</h1>
                </div>
                <div
                  id="scrollableDiv"
                  className="pb-[9vh] overflow-auto disable-scroll-bar"
                >
                  {paddedHallOfFameData.slice(3).map((item, index) => {
                    const { telegramUsername, profileImage, id, isEmpty } =
                      item;

                    const countryFlag =
                      countries.find((country) => country.code == item.country)
                        .flag || "🌐";

                    return (
                      <div key={id || index} className="leaderboard-item">
                        <LeaderboardItem
                          isEmpty={isEmpty || false}
                          rank={index + 1}
                          name={telegramUsername}
                          totalOrbs={countryFlag}
                          imageUrl={profileImage}
                        />
                      </div>
                    );
                  })}
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
                <div className="w-full text-center text-[11vw] ">
                  COMING SOON
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {activeTab ? (
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
                <div
                  id="scrollableDiv"
                  className="pb-[9vh] overflow-auto disable-scroll-bar"
                >
                  <InfiniteScroll
                    dataLength={leaderboardData.length}
                    next={() => {
                      page < 4 && loadMoreData();
                    }}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                  >
                    {leaderboardData.slice(3, 333).map((item, index) => (
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
                          totalOrbs={formatRankOrbs(item.totalOrbs)}
                          imageUrl={item.profileImage}
                        />
                      </div>
                    ))}
                  </InfiniteScroll>
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
                <div className="w-full text-center text-[11vw] ">
                  COMING SOON
                </div>
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default Leaderboard;
