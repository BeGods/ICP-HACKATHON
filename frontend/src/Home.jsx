import React, { useEffect, useState } from "react";
import { fetchGameStats } from "./utils/api";
import Quests from "./pages/Quests";
import Profile from "./pages/Profile";
import Boosters from "./pages/Boosters";
import { MyContext } from "./context/context";
import Leaderboard from "./pages/Leaderboard";
import { getRandomColor } from "./utils/randomColor";
import Loader from "./components/Loader";
import Forges from "./pages/Forges";

const tele = window.Telegram?.WebApp;

const Home = (props) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [questsData, setQuestsData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeMyth, setActiveMyth] = useState(0);
  const [section, setSection] = useState(() => {
    return JSON.parse(localStorage.getItem("section")) ?? 0;
  });

  const sections = [
    <Forges />,
    <Quests />,
    <Boosters />,
    <Profile />,
    <Leaderboard />,
  ];

  // fetch all game data
  const getGameData = async (token) => {
    try {
      const response = await fetchGameStats(token);
      setGameData(response?.stats);
      setQuestsData(response?.quests);
      setUserData(response?.user);
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
    const token = localStorage.getItem("accessToken");
    (async () => {
      if (token) {
        await getGameData(token);
      } else {
        console.log("You are not authenticated.");
        //! TODO:Add error toast
      }
    })();
  }, []);

  useEffect(() => {
    if (tele) {
      tele.setHeaderColor("#000000");
    }
  }, []);

  return (
    <>
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
            }}
          >
            {[0, 1, 2, 3, 4].map((item) => (
              <div key={item}>{section === item && sections[item]}</div>
            ))}
          </MyContext.Provider>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Home;
