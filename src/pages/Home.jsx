import React, { useEffect, useState } from "react";
import { fetchGameStats } from "../utils/api";
import Game from "./Game";
import Quests from "./Quests";
import Profile from "./Profile";
import Boosters from "./Boosters";
import { MyContext } from "../context/context";
import Leaderboard from "./Leaderboard";
import { toggleBackButton } from "../utils/teleBackButton";
import Lottie, { LottiePlayer } from "lottie-react";
import animationData from "../../public/assets/uxui/loader.json";

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

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

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
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    localStorage.setItem("avatarColor", getRandomColor());

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

  useEffect(() => {
    toggleBackButton(
      tele,
      () => {
        setSection(0);
      },
      section === 3 || section === 4
    );
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
        <div className="bg-black flex flex-col justify-center items-center h-screen w-screen">
          <div className="w-[80%] flex flex-col justify-between h-full mb-4">
            <img
              src="/assets/logos/battle.gods.white.svg"
              alt="black-gods"
              className="h-full w-full"
            />
            <div>
              <Lottie
                autoplay
                loop
                animationData={animationData}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
