import React, { useContext, useEffect, useState } from "react";
import LeaderboardItem from "./LeaderboardItem";
import { fetchLeaderboard, updateRewardStatus } from "../../../utils/api.fof";
import { FofContext } from "../../../context/context";
import { useTranslation } from "react-i18next";
import {
  formatRankOrbs,
  timeRemainingForHourToFinishUTC,
} from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import UserInfoCard from "../../../components/Cards/Info/UserInfoCrd";
import InfiniteScroll from "react-infinite-scroll-component";
import { countries } from "../../../utils/country";
import StakeCrd from "../../../components/Cards/Reward/StakeCrd";
import { showToast } from "../../../components/Toast/Toast";
import BlackOrbRewardCrd from "../../../components/Cards/Reward/BlackOrbCrd";
import Avatar from "../../../components/Common/Avatar";
import { rankPositions } from "../../../utils/constants.fof";

const tele = window.Telegram?.WebApp;

const UserAvatar = ({ user, index }) => {
  const { assets, platform } = useContext(FofContext);
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
  const {
    setSection,
    authToken,
    assets,
    userData,
    enableHaptic,
    gameData,
    setShowCard,
    setUserData,
    isTelegram,
  } = useContext(FofContext);
  const [activeTab, setActiveTab] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [hallOfFameData, sethallOfFameData] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const avatarColor = localStorage.getItem("avatarColor");
  const updateTimeLeft = timeRemainingForHourToFinishUTC();
  const util = {
    0: "second",
    1: "first",
    2: "third",
  };
  const [animationKey, setAnimationKey] = useState(0);

  const determineLevel = () => {
    switch (true) {
      case userData.overallRank <= 12:
        return "gold";
      case userData.overallRank <= 99:
        return "silver";
      case userData.overallRank <= 333:
        return "bronze";
      case userData.overallRank <= 666:
        return "wood";
      default:
        return "wood";
    }
  };

  const determineFinalLevel = (rank) => {
    switch (true) {
      case rank <= 12:
        return "diamond";
      case rank <= 99:
        return "ruby";
      case rank <= 333:
        return "emberald";
      case rank <= 666:
        return "topaz";
      default:
        return "topaz";
    }
  };

  const getLeaderboardData = async (pageNum) => {
    try {
      const response = await fetchLeaderboard(
        authToken,
        userData.overallRank,
        pageNum
      );

      if (response.leaderboard.length > 0) {
        sethallOfFameData(response.hallOfFame);
        setLeaderboardData((prevData) => [
          ...prevData,
          ...response.leaderboard,
        ]);
      } else {
        setHasMore(false);
      }

      setUserData((prev) => {
        return {
          ...prev,
          stakeOn: prev.stakeOn,
        };
      });
      setTimeout(() => {
        setIsLoading(true);
      }, 500);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const loadMoreData = () => {
    if (
      userData.overallRank <= 12 || // Gold (no increment)
      userData.overallRank <= 99 || // Silver (no increment)
      (userData.overallRank <= 333 && page >= 2) || // Bronze (max 2 pages)
      (userData.overallRank <= 666 && page >= 6) // Wood (max 6 pages)
    ) {
      return;
    }

    setPage((prevPage) => prevPage + 1);
  };

  const handleClaimReward = async () => {
    try {
      const response = await updateRewardStatus(authToken);
      setUserData((prev) => {
        return {
          ...prev,
          stakeReward: null,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const placeholderItem = {
    telegramUsername: "Anonymous",
    profileImage: "default-profile.png",
    id: null,
    country: "NA",
    isEmpty: true,
  };

  const paddedHallOfFameData = [
    ...hallOfFameData,
    ...Array.from(
      { length: 99 - hallOfFameData.length },
      () => placeholderItem
    ),
  ];

  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, [isFinished]);

  useEffect(() => {
    getLeaderboardData(page);
  }, [page]);

  useEffect(() => {
    if (userData.stakeReward === "+1") {
      setShowCard(
        <BlackOrbRewardCrd
          reward={`https://media.publit.io/file/UserAvatars/${userData.avatarUrl}.jpg`}
          blackorbs={1}
          value={userData.stakeReward}
          handAction={handleClaimReward}
        />
      );
    } else if (userData.stakeReward === "-1") {
      handleClaimReward();
    }
  }, []);

  useEffect(() => {
    if (!userData.stakeOn) {
      const interval = setInterval(() => {
        setFlipped((prev) => !prev);
      }, 4000);
      return () => clearInterval(interval);
    } else {
      setFlipped(false);
    }
  }, []);

  return (
    <div
      className={`flex ${
        isTelegram ? "tg-container-height" : "browser-container-height"
      } flex-col overflow-hidden m-0`}
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
            backgroundImage: `url(${assets.uxui.intro})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>

      {/* Toggles */}
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
        <div
          key={animationKey}
          className="absolute flex text-white text-black-contour px-1 w-full mt-[9vh] font-fof text-[17px] uppercase"
        >
          <div className={`mr-auto slide-in-out-left`}>{t("profile.task")}</div>
          <div className={`ml-auto slide-in-out-right`}>
            {" "}
            {t("sections.forges")}
          </div>
        </div>
      </div>

      {/* Flipper */}
      <div className="font-fof z-50 top-0 mx-auto mt-[1.5vh] w-1/2">
        <div className={`w-full button ${flipped ? "flipped" : ""}`}>
          <div
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setIsFinished((prev) => !prev);
            }}
            className={`button__face button__face--front flex-col flex justify-center items-center`}
          >
            <div
              className={`flex z-50 transition-all p-0.5  duration-1000 bg-white mx-auto border border-black w-[60%] rounded-full`}
            >
              <div
                className={`flex justify-center items-center ${
                  !isFinished ? "bg-black text-white" : "text-black"
                } h-full font-symbols rounded-full w-1/2 text-[24px]`}
              >
                $
              </div>
              <div
                className={`flex font-symbols justify-center items-center ${
                  isFinished ? "bg-black text-white" : "text-black"
                } h-full uppercase rounded-full w-1/2 py-1 text-[24px]`}
              >
                %
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              if (gameData.blackOrbs < 1) {
                showToast("stake_error");
              } else if (
                !isFinished &&
                userData.overallRank !== 0 &&
                !userData.stakeOn
              ) {
                setShowCard(
                  <StakeCrd
                    profileImg={`https://media.publit.io/file/UserAvatars/${userData.avatarUrl}.jpg`}
                  />
                );
              }
            }}
            className="button__face button__face--back z-50 flex justify-center items-center"
          >
            <div className="custom-button bg-black text-white text-center text-[24px] rounded-full">
              <span className="text w-full text-gold px-6 py-1">STAKE</span>
              <span className="shimmer"></span>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center text-center text-white text-black-contour mt-2">
          ({t(`note.text`)} {updateTimeLeft.minutes}min)
        </div>
      </div>

      {/* Rankers */}
      {isFinished ? (
        <div className="flex flex-grow justify-center">
          {isLoading && (
            <div className="flex items-end w-[90%] gap-2">
              {[hallOfFameData[1], hallOfFameData[0], hallOfFameData[2]].map(
                (item, index) => {
                  const countryFlag =
                    countries.find((country) => country.code == item.country)
                      .flag || "🌐";

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
                        className={`absolute text-black-contour font-symbols text-${determineFinalLevel(
                          index + 1
                        )} text-[24px] z-[50] w-[40%] ${
                          rankPositions[index].alignIcon
                        }`}
                      >
                        %
                      </div>
                      <div
                        className={`flex text-[${rankPositions[index].size}] ${rankPositions[index].size} mt-12 h-fit text-white font-mono font-bold text-black-contour`}
                      >
                        {rankPositions[index].pos}
                      </div>
                      <div className="absolute text-white -bottom-1 text-[24px] font-normal">
                        {countryFlag}
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
        <div className="flex flex-grow justify-center">
          {isLoading && (
            <div className="flex items-end w-[90%] gap-2">
              {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map(
                (item, index) => {
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
                      className={`flex leaderboard-${util[index]} relative justify-center items-center h-[0] rise-up-${util[index]} w-full uppercase`}
                    >
                      <div
                        className={`absolute text-black-contour font-symbols text-${determineLevel(
                          item.overallRank
                        )} text-[24px] z-[50] w-[40%] ${
                          rankPositions[index].alignIcon
                        }`}
                      >
                        {userData.overallRank > 333 ? "&" : "$"}
                      </div>
                      <div
                        className={`flex text-[${rankPositions[index].size}] ${rankPositions[index].size} mt-12 h-fit text-white font-mono font-bold text-black-contour`}
                      >
                        {item.overallRank}
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
      )}

      {/* Leaderboard list */}
      {isFinished ? (
        <div className="flex z-50 flex-col w-full text-medium h-[49vh] bg-white text-black rounded-t-primary">
          <div className="flex justify-between text-secondary uppercase text-black-contour text-gold items-center w-[90%] mx-auto py-3">
            <h1>
              <span className="pr-12">#</span>
              {t(`profile.name`)}
            </h1>

            <h1>{t(`profile.country`)}</h1>
          </div>
          <div
            id="scrollableDiv"
            className="pb-[9vh] overflow-auto disable-scroll-bar"
          >
            {paddedHallOfFameData.slice(3).map((item, index) => {
              const { telegramUsername, profileImage, id, isEmpty } = item;

              const countryFlag =
                countries.find((country) => country.code == item.country)
                  .flag || "🌐";

              return (
                <div key={id || index} className="leaderboard-item">
                  <LeaderboardItem
                    colorType={determineFinalLevel(index + 1)}
                    isKOL={true}
                    isEmpty={isEmpty || false}
                    rank={index + 4}
                    name={telegramUsername}
                    totalOrbs={countryFlag}
                    imageUrl={profileImage}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex px-1 pb-1 justify-center absolute bottom-0 w-full h-[8vh]">
            <div className="flex border border-gray-400 rounded-primary bg-white justify-center w-full">
              <div className="flex text-black justify-center items-center w-[20%] h-full">
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
                <h1 className="text-black">
                  {userData.telegramUsername.length > 20
                    ? userData.telegramUsername.slice(0, 20)
                    : userData.telegramUsername}
                </h1>
              </div>
              <div className="flex flex-col text-black justify-center items-end text-tertiary w-[30%] mr-4 h-full">
                <h1>{formatRankOrbs(userData.totalOrbs)}</h1>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex z-50 flex-col w-full text-medium h-[49vh] bg-black text-black rounded-t-primary">
          <div className="flex justify-between text-secondary uppercase text-cardsGray items-center w-[90%] mx-auto py-3">
            <h1>
              <span className="pr-12">#</span>
              {t(`profile.name`)}
            </h1>

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
                    rank={item.overallRank}
                    name={item.telegramUsername}
                    totalOrbs={formatRankOrbs(item.totalOrbs)}
                    imageUrl={item.profileImage}
                    prevRank={item.prevRank}
                  />
                </div>
              ))}
            </InfiniteScroll>
          </div>
          <div className="flex px-1 pb-1 justify-center absolute bottom-1 w-full h-[8vh]">
            <div
              onClick={() => {
                if (gameData.blackOrbs < 1) {
                  showToast("stake_error");
                } else if (
                  !isFinished &&
                  userData.overallRank !== 0 &&
                  !userData.stakeOn
                ) {
                  setShowCard(
                    <StakeCrd
                      profileImg={`https://media.publit.io/file/UserAvatars/${userData.avatarUrl}.jpg`}
                    />
                  );
                }
              }}
              className="flex border border-gray-400 rounded-primary bg-black justify-center w-full"
            >
              <div className="flex relative text-tertiary text-white justify-start pl-5 items-center w-[25%] h-full">
                <h1>{userData.overallRank}</h1>
                <div>
                  {userData.stakeOn == "+" && (
                    <h1 className="text-green-500 text-[18px]">▲</h1>
                  )}
                  {userData.stakeOn == "-" && (
                    <h1 className="text-red-500 text-[18px]">▼</h1>
                  )}
                </div>
              </div>
              <div className="flex gap-3 items-center w-full">
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
                <h1 className="text-white text-tertiary">
                  {userData.telegramUsername.length > 20
                    ? userData.telegramUsername.slice(0, 20)
                    : userData.telegramUsername}
                </h1>
              </div>
              <div className="flex flex-col text-white justify-center items-end text-tertiary w-[30%] mr-4 h-full">
                <h1>{formatRankOrbs(userData.totalOrbs)}</h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
