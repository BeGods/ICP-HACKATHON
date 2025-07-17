import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import LeaderboardItem from "./LeaderboardItem";
import { fetchLeaderboard, updateRewardStatus } from "../../../utils/api.fof";
import { FofContext } from "../../context/context";
import { useTranslation } from "react-i18next";
import {
  formatRankOrbs,
  timeRemainingForHourToFinishUTC,
} from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import UserInfoCard from "../../components/Cards/Info/UserInfoCrd";
import { Crown, MoveDown, MoveUp, Trophy } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { countries } from "../../utils/country";
import confetti from "canvas-confetti";
import StakeCrd from "../../components/Cards/Reward/StakeCrd";
import { showToast } from "../../components/Toast/Toast";
import BlackOrbRewardCrd from "../../components/Cards/Reward/OrbCrd";

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
              : `${assets.uxui.baseOrb}`
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
              {user.username[0]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const KOLboard = (props) => {
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
  } = useContext(FofContext);
  const [activeTab, setActiveTab] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
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
  const animationFrameId = useRef(null);

  const getLeaderboardData = async (pageNum) => {
    try {
      const response = await fetchLeaderboard(authToken, pageNum, "refer");

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

  useEffect(() => {
    getLeaderboardData(page);
  }, [page]);

  const loadMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const placeholderItem = {
    username: "Anonymous",
    profileImage: "default-profile.png",
    id: null,
    country: "NA",
    isEmpty: true,
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
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
              activeTab ? assets.locations.fof : assets.uxui.rorspash
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
            setIsFinished(true);
          }}
          className="flex slide-inside-right p-0.5 justify-start items-center w-1/4 bg-white rounded-l-full"
        >
          <div className="flex justify-center items-center bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full">
            <Crown size={"9vw"} color="#ffd660" />
          </div>
        </div>
        <div
          key={animationKey}
          className="absolute flex text-white text-black-contour px-1 w-full mt-[4.5rem] font-fof text-tertiary uppercase"
        >
          <div className={`mr-auto slide-in-out-left`}>{t("profile.task")}</div>
          <div className={`ml-auto slide-in-out-right`}>Winners</div>
        </div>
      </div>

      <div className="font-fof z-50 top-0 mx-auto mt-[1.5vh] w-1/2">
        <div className={`flex-col flex justify-center items-center`}>
          <div className="z-50 text-white text-black-contour w-full text-secondary text-center">
            KOL board
          </div>
        </div>
      </div>

      <div className="flex flex-grow justify-center">
        {isLoading && (
          <div className="flex items-end w-[90%] gap-2">
            {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map(
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
                      {item.directReferralCount}
                    </div>
                    <UserAvatar user={item} index={index} />
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col w-full text-medium h-[56vh] bg-gray-100 text-black rounded-t-primary">
        <div className="flex justify-between text-secondary uppercase text-black font-semibold items-center w-[90%] mx-auto py-3">
          <h1>
            <span className="pr-12">#</span>
            {t(`profile.name`)}
          </h1>
          <h1>Refers</h1>
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
                className="border-t"
              >
                <LeaderboardItem
                  isKOL={true}
                  key={index}
                  rank={index + 4}
                  name={item.username}
                  totalOrbs={item.directReferralCount}
                  imageUrl={item.profileImage}
                  stake={item.userBetFor}
                />
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default KOLboard;
