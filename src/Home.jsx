import React, { useEffect, useState } from "react";
import { fetchGameStats } from "./utils/api";
import Quests from "./pages/Quests";
import Profile from "./pages/Profile";
import Boosters from "./pages/Boosters";
import { MyContext } from "./context/context";
import Leaderboard from "./pages/Leaderboard";
import { getRandomColor } from "./utils/randomColor";
import Loader from "./components/Common/Loader";
import Forges from "./pages/Forges";
import Gacha from "./pages/Gacha";
import Convert from "./pages/Convert";
import JoinBonus from "./pages/JoinBonus";
import { toast } from "react-toastify";

const tele = window.Telegram?.WebApp;

const Home = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [questsData, setQuestsData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeMyth, setActiveMyth] = useState(0);
  const [showBooster, setShowBooster] = useState(null);
  const [showGlow, setshowGlow] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [section, setSection] = useState(() => {
    return JSON.parse(localStorage.getItem("section")) ?? 0;
  });

  const sections = [
    <Forges />,
    <Quests />,
    <Boosters />,
    <Profile />,
    <Leaderboard />,
    <Gacha />,
    <Convert />,
    <JoinBonus />,
  ];

  // fetch all game data
  const getGameData = async (token) => {
    try {
      const response = await fetchGameStats(token);
      setGameData(response?.stats);
      setQuestsData(response?.quests);
      setUserData(response?.user);
      if (!response?.user.joiningBonus) {
        setSection(7);
      } else if (
        response?.user.joiningBonus &&
        response?.user.isEligibleToClaim
      ) {
        setSection(5);
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
  }, []);

  useEffect(() => {
    if (tele) {
      tele.setHeaderColor("#000000");
      setPlatform(tele.platform);
    }
  }, []);

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
              setshowGlow,
              platform,
              authToken,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
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
