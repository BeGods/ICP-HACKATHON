import React, { useEffect, useState } from "react";
import { fetchGameStats } from "../utils/api";
import Game from "./Game";
import Quests from "./Quests";
import Profile from "./Profile";
import Boosters from "./Boosters";
import { MyContext } from "../context/context";

const tele = window.Telegram?.WebApp;

const Home = (props) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [questsData, setQuestsData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [section, setSection] = useState(() => {
    return JSON.parse(localStorage.getItem("section")) ?? 0;
  });

  const getGameData = async (token) => {
    try {
      const response = await fetchGameStats(token);
      setGameData(response?.stats);
      setQuestsData(response?.quests);
      setUserData(response?.user);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
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
        <div className="h-screen w-screen bg-red-400">
          <MyContext.Provider
            value={{
              gameData,
              setGameData,
              questsData,
              setQuestsData,
              userData,
              setUserData,
            }}
          >
            {section === 0 && (
              <Game
                gameData={gameData?.updatedMythologies}
                multiColorOrbs={gameData?.multiColorOrbs}
              />
            )}
            {section === 1 && <Quests quests={questsData} />}
            {section === 2 && (
              <Boosters gameData={gameData?.updatedMythologies} />
            )}
            {section === 3 && <Profile gameData={userData} />}
            <div className="flex gap-4 bg-white">
              <button
                onClick={() => {
                  setSection((prev) => (prev - 1 + 4) % 4);
                }}
              >
                Prev
              </button>
              <button
                onClick={() => {
                  setSection((prev) => (prev - 1 + 4) % 4);
                }}
              >
                Next
              </button>
            </div>
          </MyContext.Provider>
        </div>
      ) : (
        <h1>Loading</h1>
      )}
    </>
  );
};

export default Home;
