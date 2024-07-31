import React, { useEffect, useState } from "react";
import { fetchGameStats } from "../utils/api";
import Game from "./Game";
import Quests from "./Quests";
import Profile from "./Profile";
import Boosters from "./Boosters";
import { MyContext } from "../context/context";
import Leaderboard from "./Leaderboard";

const tele = window.Telegram?.WebApp;

const Home = (props) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [questsData, setQuestsData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeMyth, setActiveMyth] = useState(0);
  const [error, setError] = useState(null);
  const [section, setSection] = useState(() => {
    return JSON.parse(localStorage.getItem("section")) ?? 0;
  });

  const sections = [
    <Game />,
    <Quests />,
    <Boosters />,
    <Profile />,
    <Leaderboard />,
  ];

  const getGameData = async (token) => {
    try {
      const response = await fetchGameStats(token);
      setGameData(response?.stats);
      setQuestsData(response?.quests);
      setUserData(response?.user);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const currSection = localStorage.getItem("section");
    if (!currSection) {
      localStorage.setItem("section", 0);
    }

    (async () => {
      if (token) {
        await getGameData(token);
      } else {
        console.log("You are not authenticated.");
      }
    })();
  }, []);

  return (
    <>
      {!isLoading ? (
        <div className="h-screen w-screen bg-white select-none">
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
        <div className="bg-white h-screen w-screen">Loading</div>
      )}
    </>
  );
};

export default Home;
