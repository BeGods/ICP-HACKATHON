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
import { mythSections, rankPositions } from "../../../utils/constants.fof";
import { User, UserPen } from "lucide-react";
import {
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";

const tele = window.Telegram?.WebApp;

const getRandomColor = () => {
  return mythSections[Math.floor(Math.random() * mythSections.length)];
};

const UserAvatar = ({ user, index, category }) => {
  const { assets, platform, userData } = useContext(FofContext);

  const util = {
    0: "second",
    1: "first",
    2: "third",
  };

  const avatarColor = getRandomColor();
  const [image, setImage] = useState(() => {
    return user?.profileImage || assets.uxui.baseOrb;
  });
  const [error, setError] = useState(false);

  const determineLevel = () => {
    switch (true) {
      case userData.orbRank <= 12:
        return "gold";
      case userData.orbRank <= 99:
        return "silver";
      case userData.orbRank <= 333:
        return "bronze";
      case userData.orbRank <= 666:
        return "[#1D1D1D]";
      default:
        return "[#1D1D1D]";
    }
  };

  return (
    <div className="absolute rounded-full min-w-[8dvh] min-h-[8dvh] bg-white top-0 -mt-[8dvh]">
      <div
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 1) 0px 1px 12px",
        }}
        className={`flex flex-col items-start relative ${
          category == 2
            ? "bg-[#b9f2ff]"
            : category == 1
            ? `bg-${determineLevel()}`
            : "bg-darker"
        }  rounded-full`}
      >
        <img
          src={image}
          alt="base-orb"
          onError={() => {
            setImage(assets.uxui.baseOrb);
            setError(true);
          }}
          className={` ${
            (error || !user?.profileImage) && `filter-orbs-${avatarColor} `
          } w-full h-full rounded-full p-[5px] pointer-events-none`}
        />
        {(!user?.profileImage || error) && (
          <div className="z-1 flex justify-center items-start text-white text-[22vw] transition-all duration-1000 text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full">
            <div className={`uppercase text-white`}>{user.username[0]}</div>
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
    isTgMobile,
  } = useContext(FofContext);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [hallOfFameData, sethallOfFameData] = useState([]);
  const [ReferData, setReferData] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const avatarColor = localStorage.getItem("avatarColor");
  const [category, setCategory] = useState(1);
  const updateTimeLeft = timeRemainingForHourToFinishUTC();
  const util = {
    0: "second",
    1: "first",
    2: "third",
  };
  const [animationKey, setAnimationKey] = useState(0);

  const determineLevel = () => {
    switch (true) {
      case userData.orbRank <= 12:
        return "gold";
      case userData.orbRank <= 99:
        return "silver";
      case userData.orbRank <= 333:
        return "bronze";
      case userData.orbRank <= 666:
        return "[#1D1D1D]";
      default:
        return "[#1D1D1D]";
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
        userData.orbRank,
        pageNum
      );

      if (response.leaderboard.length > 0) {
        sethallOfFameData(response.hallOfFame);
        setReferData(response.refer);
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
      userData.orbRank <= 12 || // Gold (no increment)
      userData.orbRank <= 99 || // Silver (no increment)
      (userData.orbRank <= 333 && page >= 2) || // Bronze (max 2 pages)
      (userData.orbRank <= 666 && page >= 6) // Wood (max 6 pages)
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
    username: "Anonymous",
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

  const paddedReferData = [
    ...ReferData,
    ...Array.from({ length: 99 - ReferData.length }, () => placeholderItem),
  ];

  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, [category]);

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

  // useEffect(() => {
  //   if (!userData.stakeOn) {
  //     const interval = setInterval(() => {
  //       setFlipped((prev) => !prev);
  //     }, 3000);
  //     return () => clearInterval(interval);
  //   } else {
  //     setFlipped(false);
  //   }
  // }, []);

  return (
    <div
      className={`flex ${
        isTgMobile ? "tg-container-height" : "browser-container-height"
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
            backgroundImage: `url(${assets.locations.fof})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>

      {/* Toggles */}
      <div className="flex h-button-primary mt-1 absolute z-50 text-black font-symbols justify-between w-screen">
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            setSection(3);
          }}
          className="flex  p-0.5 justify-end items-center w-[19%] bg-white rounded-r-full"
        >
          <div className="flex justify-center items-center bg-black text-white w-[3rem] h-[3rem] text-symbol-sm rounded-full">
            <User fill="white" size={30} />
          </div>
        </div>

        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            setSection(0);
          }}
          className="flex  p-0.5 justify-start items-center w-[19%] bg-white rounded-l-full"
        >
          <div className="flex justify-center items-center bg-black text-white w-[3rem] h-[3rem] text-symbol-sm rounded-full">
            z
          </div>
        </div>
        <div
          key={animationKey}
          className="absolute flex text-white text-black-contour px-1 w-full mt-[4.5rem] font-fof text-[2dvh] uppercase"
        >
          <div className={`mr-auto slide-in-out-left`}>
            {t("sections.profile")}
          </div>
          <div className={`ml-auto slide-in-out-right`}>
            {" "}
            {t("sections.forges")}
          </div>
        </div>
      </div>

      {/* Flipper */}
      <div className="font-fof z-50 top-0 mt-1.5 mx-auto w-1/2">
        <div
          className={`w-full flex justify-center items-center button ${
            flipped ? "flipped" : ""
          }`}
        >
          <div className="flex items-center justify-center w-full z-50  p-0.5 text-[24px] bg-white border border-black rounded-full shadow">
            <div
              onClick={() => {
                handleClickHaptic(tele, enableHaptic);
                setCategory(0);
              }}
              className={`flex-1 flex items-center justify-center rounded-full ${
                category == 0 ? "bg-black text-white " : "text-black"
              } font-symbols py-1`}
            >
              u
            </div>
            <div
              onClick={() => {
                handleClickHaptic(tele, enableHaptic);
                setCategory(1);
              }}
              className={`flex-1 flex items-center justify-center rounded-full ${
                category == 1 ? "bg-black text-white " : "text-black"
              } font-symbols py-1`}
            >
              $
            </div>
            <div
              onClick={() => {
                handleClickHaptic(tele, enableHaptic);
                setCategory(2);
              }}
              className={`flex-1 flex items-center justify-center rounded-full ${
                category == 2 ? "bg-black text-white " : "text-black"
              } font-symbols py-1`}
            >
              %
            </div>
          </div>
        </div>

        <div className="w-full uppercase flex justify-center text-center text-white text-black-contour mt-2">
          {category == 0
            ? "Referrals"
            : category == 1
            ? "Leaderboard"
            : "Hall Of Fame"}
        </div>
      </div>

      {/* Rankers */}
      {category == 2 ? (
        <div className="flex flex-grow justify-center">
          {isLoading && (
            <div className={`flex items-end ranker-width gap-2`}>
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
                      className={`flex bg-[#b9f2ff] relative justify-center items-center rise-up-${util[index]} w-full uppercase`}
                    >
                      <div
                        className={`flex text-[${rankPositions[index].size}] ${rankPositions[index].size} mt-12 h-fit text-white font-mono font-bold text-black-contour`}
                      >
                        {rankPositions[index].pos}
                      </div>
                      <div className="absolute text-white -bottom-1 text-[1.25rem] font-normal">
                        {countryFlag}
                      </div>
                      <UserAvatar
                        user={item}
                        index={index}
                        category={category}
                      />
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      ) : category == 0 ? (
        <div className="flex flex-grow justify-center">
          {isLoading && (
            <div className={`flex items-end ranker-width gap-2`}>
              {[ReferData[1], ReferData[0], ReferData[2]].map((item, index) => {
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
                    className={`flex bg-darker border-l border-r border-white/50 relative justify-center items-center h-[0] rise-up-${util[index]} w-full uppercase`}
                  >
                    {/* <div
                        className={`absolute text-black-contour font-symbols text-${determineLevel(
                          item.orbRank
                        )} text-[1.75rem] z-[50] w-[40%] ${
                          rankPositions[index].alignIcon
                        }`}
                      >
                        {userData.orbRank > 333 ? "&" : "$"}
                      </div> */}
                    <div
                      className={`flex text-[${rankPositions[index].size}] ${rankPositions[index].size} mt-12 h-fit text-white font-mono font-bold text-black-contour`}
                    >
                      {item.referRank}
                    </div>
                    <div className="absolute text-white -bottom-1 text-tertiary font-normal">
                      {item.directReferralCount}
                    </div>
                    <UserAvatar user={item} index={index} category={category} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-grow justify-center">
          {isLoading && (
            <div className={`flex items-end ranker-width gap-2`}>
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
                      className={`flex border-l border-r  ${
                        determineLevel === "darker"
                          ? "border-white/50"
                          : "border-black"
                      } bg-${determineLevel(
                        item.orbRank
                      )} relative justify-center items-center h-[0] rise-up-${
                        util[index]
                      } w-full uppercase`}
                    >
                      <div
                        className={`flex text-[${rankPositions[index].size}] ${rankPositions[index].size} mt-12 h-fit text-white font-mono font-bold text-black-contour`}
                      >
                        {item.orbRank}
                      </div>
                      <div className="absolute text-white -bottom-1 text-tertiary font-normal">
                        {formatRankOrbs(item.totalOrbs)}
                      </div>
                      <UserAvatar
                        user={item}
                        index={index}
                        category={category}
                      />
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      )}

      {/* Leaderboard list */}
      {category == 2 ? (
        <div
          className={`flex z-50 flex-col mx-auto leaderboard-width text-medium h-[42vh] bg-white text-black rounded-t-primary`}
        >
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
              const { username, profileImage, id, isEmpty } = item;

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
                    name={username}
                    totalOrbs={countryFlag}
                    imageUrl={profileImage}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex px-1 pb-1 justify-center absolute bottom-0 w-full h-[4rem]">
            <div
              className={`flex border border-gray-400 rounded-primary bg-white justify-center leaderboard-width`}
            >
              <div className="flex text-black justify-center items-center w-[20%] h-full">
                {userData.orbRank}
              </div>
              <div className="flex gap-3 items-center  w-full">
                <div className="h-[35px] w-[35px]">
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt="profile-image"
                      className="rounded-full"
                    />
                  ) : (
                    <Avatar
                      name={userData.username.charAt(0).toUpperCase()}
                      className="h-full w-full"
                      profile={0}
                      color={avatarColor}
                    />
                  )}
                </div>
                <h1 className="text-black">
                  {userData.username.length > 20
                    ? userData.username.slice(0, 20)
                    : userData.username}
                </h1>
              </div>
              <div className="flex flex-col text-black justify-center items-end text-tertiary w-[30%] mr-4 h-full">
                <h1>{formatRankOrbs(userData.totalOrbs)}</h1>
              </div>
            </div>
          </div>
        </div>
      ) : category == 0 ? (
        <div
          className={`flex z-50 flex-col leaderboard-width mx-auto text-medium h-[42vh] bg-black text-black rounded-t-primary`}
        >
          <div className="flex justify-between text-secondary uppercase text-cardsGray items-center w-[90%] mx-auto py-3">
            <h1>
              <span className="pr-12">#</span>
              {t(`profile.name`)}
            </h1>
            <h1>{t(`profile.referrals`)}</h1>
          </div>
          <div
            id="scrollableDiv"
            className="pb-[9vh] overflow-auto disable-scroll-bar"
          >
            {paddedReferData.slice(3).map((item, index) => {
              const { username, profileImage, id, isEmpty } = item;

              const countryFlag =
                countries.find((country) => country.code == item.country)
                  .flag || "🌐";

              return (
                <div key={id || index} className="leaderboard-item">
                  <LeaderboardItem
                    colorType={determineFinalLevel(index + 1)}
                    isKOL={false}
                    isEmpty={isEmpty || false}
                    rank={index + 4}
                    name={username}
                    totalOrbs={item.directReferralCount}
                    imageUrl={profileImage}
                  />
                </div>
              );
            })}
          </div>
          {/* <div
            id="scrollableDiv"
            className="pb-[9vh] overflow-auto disable-scroll-bar"
          >
            <InfiniteScroll
              dataLength={ReferData.length}
              next={() => {
                page < 4 && loadMoreData();
              }}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv"
            >
              {ReferData.slice(3, 111).map((item, index) => (
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
                    rank={item.referRank}
                    name={item.username}
                    totalOrbs={item.directReferralCount}
                    imageUrl={item.profileImage}
                    prevRank={null}
                  />
                </div>
              ))}
            </InfiniteScroll>
          </div> */}
          <div
            className={`flex px-1 pb-1 justify-center absolute bottom-1 leaderboard-width h-[4rem]`}
          >
            <div
              onClick={() => {
                if (gameData.blackOrbs < 1) {
                  showToast("stake_error");
                } else if (
                  category == 1 &&
                  userData.orbRank !== 0 &&
                  !userData.stakeOn
                ) {
                  setShowCard(<StakeCrd profileImg={userData.avatarUrl} />);
                }
              }}
              className="flex border border-gray-400 rounded-primary bg-black justify-center w-full"
            >
              <div className="flex relative text-tertiary text-white justify-start pl-5 items-center w-[25%] h-full">
                <h1>{userData.referRank}</h1>
              </div>
              <div className="flex gap-3 items-center w-full">
                <div className="h-[35px] w-[35px]">
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt="profile-image"
                      className="rounded-full"
                    />
                  ) : (
                    <Avatar
                      name={userData.username.charAt(0).toUpperCase()}
                      className="h-full w-full"
                      profile={0}
                      color={avatarColor}
                    />
                  )}
                </div>
                <h1 className="text-white text-tertiary">
                  {userData.username.length > 20
                    ? userData.username.slice(0, 20)
                    : userData.username}
                </h1>
              </div>
              <div className="flex flex-col text-white justify-center items-end text-tertiary w-[30%] mr-4 h-full">
                <h1>{formatRankOrbs(userData.directReferralCount)}</h1>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flex z-50 flex-col leaderboard-width mx-auto text-medium h-[42vh] bg-black text-black rounded-t-primary`}
        >
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
                    rank={item.orbRank}
                    name={item.username}
                    totalOrbs={formatRankOrbs(item.totalOrbs)}
                    imageUrl={item.profileImage}
                    prevRank={item.prevRank}
                  />
                </div>
              ))}
            </InfiniteScroll>
          </div>
          <div
            className={`flex px-1 pb-1 justify-center absolute bottom-1 leaderboard-width h-[4rem]`}
          >
            <div
              onClick={() => {
                if (gameData.blackOrbs < 1) {
                  showToast("stake_error");
                } else if (
                  category === 1 &&
                  userData.orbRank !== 0 &&
                  !userData.stakeOn
                ) {
                  setShowCard(<StakeCrd profileImg={userData.avatarUrl} />);
                }
              }}
              className="flex border border-gray-400 rounded-primary bg-black justify-center w-full"
            >
              <div className="flex relative text-tertiary text-white justify-start pl-5 items-center w-[25%] h-full">
                <h1>{userData.orbRank}</h1>
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
                      src={userData.avatarUrl}
                      alt="profile-image"
                      className="rounded-full"
                    />
                  ) : (
                    <Avatar
                      name={userData.username.charAt(0).toUpperCase()}
                      className="h-full w-full"
                      profile={0}
                      color={avatarColor}
                    />
                  )}
                </div>
                <h1 className="text-white text-tertiary">
                  {userData.username.length > 20
                    ? userData.username.slice(0, 20)
                    : userData.username}
                </h1>
              </div>
              <div className="flex flex-col text-white justify-center items-end text-tertiary w-[30%] mr-4 h-full">
                <h1>{formatRankOrbs(userData.totalOrbs)}</h1>
              </div>
            </div>
          </div>
        </div>
      )}

      <>
        <ToggleLeft
          minimize={2}
          handleClick={() => {
            setCategory((prev) => (prev - 1 + 3) % 3);
          }}
          activeMyth={4}
          isShrinked={true}
        />
        <ToggleRight
          minimize={2}
          handleClick={() => {
            setCategory((prev) => (prev + 1) % 3);
          }}
          activeMyth={4}
          isShrinked={true}
        />
      </>
    </div>
  );
};

export default Leaderboard;

//  <div
//             onClick={() => {
//               handleClickHaptic(tele, enableHaptic);
//               if (gameData.blackOrbs < 1) {
//                 showToast("stake_error");
//               } else if (
//                 category == 1 &&
//                 userData.orbRank !== 0 &&
//                 !userData.stakeOn
//               ) {
//                 setShowCard(
//                   <StakeCrd
//                     username={userData.username}
//                     profileImg={userData.avatarUrl}
//                   />
//                 );
//               } else {
//                 showToast("stake_error");
//               }
//             }}
//             className="button__face button__face--back z-[60] cursor-pointer flex justify-center items-center"
//           >
//             <div className="custom-button bg-black text-white text-center text-[24px] rounded-full">
//               <span className="text w-full text-gold px-6 py-1">STAKE</span>
//               <span className="shimmer"></span>
//             </div>
//           </div>
