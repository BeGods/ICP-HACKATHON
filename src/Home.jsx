import React, { useEffect, useState } from "react";
import { fetchGameStats, fetchRewards } from "./utils/api";
import i18next, { use } from "i18next";
import { getRandomColor } from "./helpers/randomColor.helper";
import { MyContext } from "./context/context";
import Quests from "./pages/Quest/Page";
import Profile from "./pages/Profile/Page";
import Boosters from "./pages/Booster/Page";
import Leaderboard from "./pages/Leaderboard/Page";
import Loader from "./components/Common/Loader";
import Forges from "./pages/Forge/Page";
import Gacha from "./pages/Gacha/Page";
import Tower from "./pages/Tower/Page";
import JoinBonus from "./pages/JoinBonus/Page";
import Redeem from "./pages/Redeem/Redeem";
import Footer from "./components/Common/Footer";
import Gift from "./pages/Gift/Gift";
const tele = window.Telegram?.WebApp;

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showCard, setShowCard] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [questsData, setQuestsData] = useState(null);
  const [socialQuestData, setSocialQuestData] = useState(null);
  const [enableSound, setEnableSound] = useState(true);
  const [keysData, setKeysData] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [rewardsClaimedInLastHr, setRewardsClaimedInLastHr] = useState(null);
  const [activeReward, setActiveReward] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeMyth, setActiveMyth] = useState(0);
  const [showBooster, setShowBooster] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [section, setSection] = useState(1);
  const [minimize, setMinimize] = useState(0);

  const sections = [
    <Forges />, // 0
    <Quests />, // 1
    <Boosters />, // 2
    <Profile />, // 3
    <Tower />, // 4
    <Gift />, // 5
    <Redeem />, // 6
    <Leaderboard />, // 7
    <Gacha />, // 8
    <JoinBonus />, // 9
  ];

  // fetch all game data
  const getGameData = async (token) => {
    try {
      const response = await fetchGameStats(token);
      const rewardsData = await fetchRewards(token);
      setGameData(response?.stats);
      setQuestsData(response?.quests);
      setSocialQuestData(response?.extraQuests);
      setUserData(response?.user);
      setRewards(rewardsData?.rewards);
      setRewardsClaimedInLastHr(rewardsData?.rewardsClaimedInLastHr);
      localStorage.setItem("bubbleLastClaimed", rewardsData?.bubbleLastClaimed);
      setKeysData(response?.towerKeys);
      if (!response?.user?.joiningBonus) {
        setSection(9);
      } else if (
        response?.user?.joiningBonus &&
        response?.user.isEligibleToClaim
      ) {
        setSection(8);
      } else {
        setSection(0);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      //! TODO: Add toast for error
    }
  };

  // set initial cookies
  useEffect(() => {
    localStorage.setItem("avatarColor", getRandomColor());

    tele.CloudStorage.getItem("lang", (err, item) => {
      (async () => {
        if (item) {
          i18next.changeLanguage(item);
        } else {
          console.log("Unable to fetch language.");
          //! TODO:Add error toast
        }
      })();
    });
    tele.CloudStorage.getItem("accessToken", (err, item) => {
      (async () => {
        if (item) {
          setAuthToken(item);
          await getGameData(item);
        } else {
          console.log("You are not authenticated.");
          //! TODO:Add error toast
        }
      })();
    });
    tele.CloudStorage.getItem("sound", (err, item) => {
      (async () => {
        if (item) {
          setEnableSound(false);
        } else {
          console.log("Unable to fetch sound.");
          //! TODO:Add error toast
        }
      })();
    });
  }, []);

  useEffect(() => {
    if (tele) {
      tele.setHeaderColor("#000000");
      tele.setBackgroundColor("#000000");
      tele.setBottomBarColor("#000000");
      setPlatform(tele.platform);
    }
  }, []);

  useEffect(() => {
    if (platform === "ios") {
      document.body.style.position = "fixed";
      document.body.style.top = 0;
      document.body.style.bottom = 0;
      document.body.style.left = 0;
      document.body.style.right = 0;
      document.body.style.overflow = "hidden";
    }
  }, [platform]);

  return (
    <div>
      {!isLoading ? (
        <div className="h-screen w-screen bg-white select-none font-fof">
          <MyContext.Provider
            value={{
              gameData,
              setGameData,
              questsData,
              setQuestsData,
              userData,
              setUserData,
              section,
              setSection,
              activeMyth,
              setActiveMyth,
              showBooster,
              setShowBooster,
              platform,
              authToken,
              keysData,
              setKeysData,
              socialQuestData,
              setSocialQuestData,
              rewards,
              setRewards,
              activeReward,
              setActiveReward,
              setRewardsClaimedInLastHr,
              rewardsClaimedInLastHr,
              enableSound,
              setEnableSound,
              minimize,
              setMinimize,
              setShowCard,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div key={item}>
                <>{section === item && sections[item]}</>
              </div>
            ))}
            {section != 7 && section != 10 && section != 9 && section != 8 && (
              <Footer minimize={minimize} />
            )}
            {showCard && (
              <div className="absolute z-50 h-screen w-screen">{showCard}</div>
            )}
          </MyContext.Provider>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Home;
