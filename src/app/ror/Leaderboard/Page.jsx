import { useEffect, useState } from "react";
import LeaderboardItem from "./LeaderboardItem";
import { fetchLeaderboard, updateRewardStatus } from "../../../utils/api.ror";
import { useTranslation } from "react-i18next";
import { formatRankOrbs } from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import UserInfoCard from "../../../components/Cards/Info/UserInfoCrd";
import InfiniteScroll from "react-infinite-scroll-component";
import { countries } from "../../../utils/country";
import BlackOrbRewardCrd from "../../../components/Cards/Reward/OrbCrd";
import { mythSections, rankPositions } from "../../../utils/constants.fof";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import LeaderboardHeader from "./Header";
import BgLayout from "../../../components/Layouts/BgLayout";
import ReactHowler from "react-howler";
import { useStore } from "../../../store/useStore";

const tele = window.Telegram?.WebApp;

const getRandomColor = () => {
  return mythSections[Math.floor(Math.random() * mythSections.length)];
};

const UserAvatar = ({ user, index, category }) => {
  const assets = useStore((s) => s.assets);
  const userData = useStore((s) => s.userData);

  const avatarColor = getRandomColor();
  const [image, setImage] = useState(() => {
    return user?.profileImage || assets.uxui.baseOrb;
  });
  const [error, setError] = useState(false);

  const determineLevel = () => {
    switch (true) {
      case userData.coinRank <= 12:
        return "gold";
      case userData.coinRank <= 99:
        return "silver";
      case userData.coinRank <= 333:
        return "bronze";
      case userData.coinRank <= 666:
        return "[#1D1D1D]";
      default:
        return "[#1D1D1D]";
    }
  };

  return (
    <div className="absolute rounded-full min-w-[15dvh] min-h-[15dvh] bg-white top-0 -mt-[8dvh]">
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
          <div className="z-1 flex justify-center items-start text-white text-[20vw] mt-2 transition-all duration-1000 text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full">
            <div className={`uppercase text-white`}>{user.username[0]}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const Leaderboard = (props) => {
  const { t } = useTranslation();
  const authToken = useStore((s) => s.authToken);
  const userData = useStore((s) => s.userData);
  const enableHaptic = useStore((s) => s.enableHaptic);
  const setShowCard = useStore((s) => s.setShowCard);
  const setUserData = useStore((s) => s.setUserData);
  const setSection = useStore((s) => s.setSection);
  const enableSound = useStore((s) => s.enableSound);
  const assets = useStore((s) => s.assets);

  const [showEffect, setShowEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [hallOfFameData, sethallOfFameData] = useState([]);
  const [ReferData, setReferData] = useState([]);
  const [category, setCategory] = useState(1);

  const util = {
    0: "second",
    1: "first",
    2: "third",
  };

  const determineLevel = () => {
    switch (true) {
      case userData.coinRank <= 12:
        return "gold";
      case userData.coinRank <= 99:
        return "silver";
      case userData.coinRank <= 333:
        return "bronze";
      case userData.coinRank <= 666:
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
        userData.coinRank,
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
      userData.coinRank <= 12 || // Gold (no increment)
      userData.coinRank <= 99 || // Silver (no increment)
      (userData.coinRank <= 333 && page >= 2) || // Bronze (max 2 pages)
      (userData.coinRank <= 666 && page >= 6) // Wood (max 6 pages)
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

  const paddedReferData = [
    ...ReferData,
    ...Array.from({ length: 99 - ReferData.length }, () => placeholderItem),
  ];

  useEffect(() => {
    setShowEffect(false);
    setTimeout(() => {
      setShowEffect(true);
    }, 50);
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

  return (
    <BgLayout>
      {/* Flipper */}
      <LeaderboardHeader
        category={category}
        setCategory={(idx) => setCategory(idx)}
      />

      <div className="absolute bottom-1 w-full">
        {/* Rankers */}
        {category == 2 ? (
          <div className="flex flex-grow justify-center">
            {/* {isLoading && (
              <>
                {hallOfFameData.length > 0 && (
                  <div className={`flex items-end ranker-width gap-3`}>
                    {[
                      hallOfFameData[1],
                      hallOfFameData[0],
                      hallOfFameData[2],
                    ].map((item, index) => {
                      const countryFlag =
                        countries.find(
                          (country) => country.code == item.country
                        ).flag || "🌐";

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
                          className={`flex bg-[#b9f2ff] relative justify-center items-center ${
                          showEffect && `rise-up-${util[index]}`
                        } w-full uppercase`}
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
                            key={`category-${category}-${index}`}
                            user={item}
                            index={index}
                            category={category}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )} */}
          </div>
        ) : category == 0 ? (
          <div className="flex flex-grow justify-center">
            {isLoading && (
              <div className={`flex items-end ranker-width gap-3`}>
                {[ReferData[1], ReferData[0], ReferData[2]].map(
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
                        className={`flex bg-darker border-l border-r border-white/50 relative justify-center items-center h-[0] ${
                          showEffect && `rise-up-${util[index]}`
                        } w-full uppercase`}
                      >
                        <div
                          className={`flex text-[${rankPositions[index].size}] ${rankPositions[index].size} mt-12 h-fit text-white font-mono font-bold text-black-contour`}
                        >
                          {item.referRank}
                        </div>
                        <div className="absolute text-white -bottom-1 text-tertiary font-normal">
                          {item.directReferralCount}
                        </div>
                        <UserAvatar
                          key={`category-${category}-${index}`}
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
        ) : (
          <div className="flex flex-grow justify-center">
            {isLoading && (
              <div className={`flex items-end ranker-width gap-3`}>
                {[
                  leaderboardData[1],
                  leaderboardData[0],
                  leaderboardData[2],
                ].map((item, index) => {
                  const countryObj = countries.find(
                    (country) => country.code === item.country
                  );
                  const countryFlag =
                    countryObj?.flag !== "🌐" && countryObj?.flag;
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
                        item.coinRank
                      )} relative justify-center items-center h-[0] ${
                        showEffect && `rise-up-${util[index]}`
                      } w-full uppercase`}
                    >
                      <div
                        className={`flex text-[${rankPositions[index].size}] ${rankPositions[index].size} mt-12 h-fit text-white font-mono font-bold text-black-contour`}
                      >
                        {item.coinRank}
                      </div>
                      <div className="absolute flex justify-center items-center gap-x-1.5 text-white bottom-0 text-tertiary font-normal">
                        <div className="text-white text-[1.1rem] font-normal">
                          {countryFlag}
                        </div>
                        <div>{formatRankOrbs(item?.gobcoin ?? 0)}</div>
                      </div>
                      <UserAvatar
                        key={`category-${category}-${index}`}
                        user={item}
                        index={index}
                        category={category}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Leaderboard list */}
        {category == 2 ? (
          <div
            className={`flex z-50 flex-col mx-auto leaderboard-width text-medium h-[42dvh] bg-white text-black rounded-t-primary`}
          >
            {/* <div className="flex justify-between text-secondary uppercase text-black-contour text-gold items-center w-[90%] mx-auto py-1.5">
              <h1>
                <span className="pr-12">#</span>
                {t(`profile.name`)}
              </h1>

              <h1>{t(`profile.country`)}</h1>
            </div>
            {hallOfFameData.length > 0 && (
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
            )} */}
          </div>
        ) : category == 0 ? (
          <div
            className={`flex z-50 flex-col leaderboard-width mx-auto text-medium h-[42dvh] bg-black text-black rounded-t-primary`}
          >
            <div className="flex justify-between text-secondary uppercase text-cardsGray items-center w-[90%] mx-auto py-1.5">
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
                const { profileImage, id, isEmpty } = item;
                const countryObj = countries.find(
                  (country) => country.code === item.country
                );

                const countryFlag =
                  countryObj?.flag !== "🌐" ? countryObj?.flag : "";

                return (
                  <div key={id || index} className="leaderboard-item">
                    <LeaderboardItem
                      colorType={determineFinalLevel(index + 1)}
                      isEmpty={isEmpty || false}
                      rank={index + 4}
                      name={`${item.username} ${countryFlag}`}
                      totalOrbs={item.directReferralCount}
                      imageUrl={profileImage}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className={`flex z-50 flex-col leaderboard-width mx-auto text-medium h-[42dvh] bg-black text-black rounded-t-primary`}
          >
            <div className="flex justify-between text-secondary uppercase text-cardsGray items-center w-[90%] mx-auto py-1.5">
              <h1>
                <span className="pr-12">#</span>
                {t(`profile.name`)}
              </h1>

              <h1>COIN(S)</h1>
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
                {leaderboardData.slice(3, 333).map((item, index) => {
                  const countryObj = countries.find(
                    (country) => country.code === item.country
                  );
                  const countryFlag =
                    countryObj?.flag !== "🌐" ? countryObj?.flag : "";

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
                      className=""
                    >
                      <LeaderboardItem
                        key={index}
                        rank={item.coinRank}
                        name={`${item.username} ${countryFlag}`}
                        totalOrbs={formatRankOrbs(item?.gobcoin ?? 0)}
                        imageUrl={item.profileImage}
                        prevRank={item.prevRank}
                      />
                    </div>
                  );
                })}
              </InfiniteScroll>
            </div>
          </div>
        )}
      </div>

      <div className="absolute z-0">
        <ReactHowler
          src={assets.audio.fofIntro}
          playing={enableSound}
          preload={true}
          loop
        />
      </div>

      <>
        <ToggleBack
          minimize={2}
          handleClick={() => {
            setSection(8);
          }}
          lightMode={category == 2 ? true : false}
          activeMyth={8}
        />
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
    </BgLayout>
  );
};

export default Leaderboard;
