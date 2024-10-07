import React, { useEffect, useState } from "react";
import { fetchGameStats, fetchRewards } from "./utils/api";
import Quests from "./pages/Quest/Quests";
import Profile from "./pages/Profile";
import Boosters from "./pages/Booster/Boosters";
import { MyContext } from "./context/context";
import Leaderboard from "./pages/Leaderboard";
import { getRandomColor } from "./utils/randomColor";
import Loader from "./components/Common/Loader";
import Forges from "./pages/Forge/Forge";
import Gacha from "./pages/Gacha/Gacha";
import Tower from "./pages/Tower/Tower";
import JoinBonus from "./pages/JoinBonus";
import Partners from "./pages/Partners";
import Redeem from "./pages/Redeem";

const tele = window.Telegram?.WebApp;

const Home = (props) => {
  const [isLoading, setIsLoading] = useState(true);
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
  const [showGlow, setShowGlow] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [section, setSection] = useState(0);

  const sections = [
    <Quests />,
    <Forges />,
    <Boosters />,
    <Profile />,
    <Leaderboard />,
    <Gacha />,
    <Tower />,
    <JoinBonus />,
    <Partners />,
    <Redeem />,
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
      if (!response?.user.joiningBonus) {
        setSection(7);
      } else if (
        response?.user.joiningBonus &&
        response?.user.isEligibleToClaim
      ) {
        setSection(5);
      } else {
        setSection(1);
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

    // const token = localStorage.getItem("accessToken");
    // (async () => {
    //   if (token) {
    //     setAuthToken(token);
    //     await getGameData(token);
    //   } else {
    //     console.log("You are not authenticated.");
    //     //! TODO:Add error toast
    //   }
    // })();

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
              showGlow,
              setShowGlow,
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
            }}
            ps
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div key={item}>{section === item && sections[item]}</div>
            ))}
          </MyContext.Provider>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Home;
