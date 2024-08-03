import React, { useContext, useEffect, useRef, useState } from "react";
import Convert from "./Convert";
import { MyContext } from "../context/context";
import ProgressBar from "../components/ProgressBar";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Footer from "../components/Footer";
import {
  formatOrbsWithLeadingZeros,
  formatShardsWithLeadingZeros,
} from "../utils/gameManipulations";
import { startTapSession, updateGameData } from "../utils/api";

const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];
const mythSections = ["celtic", "egyptian", "greek", "norse", "other"];

const Game = () => {
  const { activeMyth, setActiveMyth, gameData, setGameData } =
    useContext(MyContext);
  const initialState = gameData.mythologies.map((myth) => ({
    orbs: myth.orbs,
    shards: myth.shards,
    energy: myth.energy,
    energyLimit: myth.energyLimit,
    currShards: 0,
    shardslvl: myth.boosters.shardslvl,
    isAutomataActive: myth.boosters.isAutomataActive,
  }));

  const [mythStates, setMythStates] = useState(initialState);
  const [sessionActive, setSessionActive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const { orbs, shards, energy } = mythStates[activeMyth >= 4 ? 0 : activeMyth];
  const [plusOnes, setPlusOnes] = useState([]);
  const timeoutRef = useRef(null);
  const mythStatesRef = useRef(mythStates);

  const handleUpdateTapData = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await updateGameData(
        {
          taps: mythStates[activeMyth].currShards,
          mythologyName: mythologies[activeMyth],
        },
        accessToken
      );

      setMythStates((prevState) => {
        const newState = [...prevState];
        newState[activeMyth].currShards = 0;
        return newState;
      });
      console.log("Shards claimed successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  const handleTriggerStart = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await startTapSession(
        { mythologyName: mythologies[activeMyth] },
        accessToken
      );
      console.log("Tap session started.");
    } catch (error) {
      console.log(error);
    }
  };

  const handleTap = async (e) => {
    e.preventDefault();
    if (disabled) return;

    const { energy, shardslvl } = mythStates[activeMyth];

    if (energy > 0) {
      const x = e.clientX || e.touches[0].clientX;
      const y = e.clientY || e.touches[0].clientY;
      const newPlusOne = { x, y, id: Date.now() };
      setPlusOnes((prev) => [...prev, newPlusOne]);
      setMythStates((prevState) => {
        const newState = prevState.map((myth, index) => {
          if (index === activeMyth) {
            let newShards = myth.shards + shardslvl;
            let newOrbs = myth.orbs;

            if (newShards >= 1000) {
              newOrbs += Math.floor(newShards / 1000);
              newShards = newShards % 1000;
            }

            return {
              ...myth,
              energy: Math.max(0, myth.energy - 1),
              shards: newShards,
              currShards: myth.currShards + 1,
              orbs: newOrbs, // Update the orbs count
            };
          }
          return myth;
        });

        return newState;
      });

      setTimeout(() => {
        setPlusOnes((prev) =>
          prev.filter((plusOne) => plusOne.id !== newPlusOne.id)
        );
      }, 1000);

      clearTimeout(timeoutId);

      if (mythStates[activeMyth].currShards > 10) {
        const newTimeoutId = setTimeout(async () => {
          handleUpdateTapData();
        }, 600);
        setTimeoutId(newTimeoutId);
      }
    } else {
      setDisabled(true);
      setTimeout(() => {
        setDisabled(false);
      }, 15000);
    }
  };

  const startSession = () => {
    setSessionActive(true);
    handleTriggerStart();
  };

  const handleStartSession = async (e) => {
    if (disabled) return;

    if (!sessionActive) {
      startSession();
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSessionActive(false);
    }, 700);

    handleTap(e);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMythStates((prevStates) => {
        return prevStates.map((state) => {
          if (state.energy < state.energyLimit) {
            return {
              ...state,
              energy: state.energy + 1,
            };
          } else {
            return state;
          }
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    mythStatesRef.current = mythStates;
  }, [mythStates]);

  useEffect(() => {
    return () => {
      setGameData((prevData) => {
        const newMythologies = prevData.mythologies.map((myth, index) => ({
          ...myth,
          orbs: mythStatesRef.current[index].orbs,
          shards: mythStatesRef.current[index].shards,
          energy: mythStatesRef.current[index].energy,
        }));
        return { ...prevData, mythologies: newMythologies };
      });
    };
  }, []);

  useEffect(() => {
    const automataIntervals = [];

    gameData.mythologies.forEach((myth, index) => {
      const automataTimeleft =
        (Date.now() - myth.boosters.automataLastClaimedAt) / 1000;

      if (myth.boosters.isAutomataActive && automataTimeleft > 0) {
        const interval = setInterval(() => {
          setMythStates((prevState) => {
            const newState = [...prevState];
            newState[index] = {
              ...newState[index],
              shards: newState[index].shards + newState[index].shardslvl,
            };
            return newState;
          });
        }, 1000);
        automataIntervals.push(interval);
      }
    });

    return () => {
      automataIntervals.forEach((interval) => clearInterval(interval));
    };
  }, [gameData.mythologies]);

  return (
    <>
      {activeMyth < 4 ? (
        <div
          style={{
            backgroundImage: `url(/themes/background/game/${mythSections[activeMyth]}.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
          }}
          className="flex flex-col h-screen overflow-hidden"
        >
          {/* Header */}
          <div
            style={{
              position: "relative",
              height: "18.5%",
              width: "100%",
            }}
            className="flex -mt-1"
          >
            <div
              style={{
                backgroundImage: `url(/images/head.png)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center center",
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                zIndex: -1,
              }}
              className={`filter-paper-${mythSections[activeMyth]}`}
            />
            <div className="flex flex-col flex-grow justify-center items-start text-white pl-5 pr-10 -mt-1.5">
              <h1 className={`glow-${mythSections[activeMyth]}`}>
                {mythSections[activeMyth].toUpperCase()}
              </h1>
              <div className="text-right font-medium font-montserrat text-[22px] -mt-3">
                {formatOrbsWithLeadingZeros(orbs)}{" "}
                <span className={`text-${mythSections[activeMyth]}-text`}>
                  $ORB(S)
                </span>
              </div>
              <div className="text-right font-medium font-montserrat -mt-1 text-[14px]">
                {formatShardsWithLeadingZeros(shards)}{" "}
                <span className={`text-${mythSections[activeMyth]}-text`}>
                  SHARDS
                </span>
              </div>
            </div>
            <div className="h-full -mr-[16%] ml-auto mt-1">
              <img
                src={`/themes/symbols/${mythSections[activeMyth]}.png`}
                alt="symbol"
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Main */}
          <div className="flex relative flex-grow justify-center items-center">
            {mythStates[activeMyth].isAutomataActive && (
              <div className="absolute top-0 left-0">
                <h1 className="font-symbols text-[50px] p-0 ml-2 -mt-2 text-white">
                  B
                </h1>
              </div>
            )}
            <div className="flex justify-center items-center w-[20%]">
              <div
                onClick={() => {
                  setActiveMyth((prev) => (prev - 1 + 5) % 5);
                }}
                className="bg-glass-black p-1 rounded-full cursor-pointer"
              >
                <ChevronsLeft color="white" className="h-[30px] w-[30px]" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              {plusOnes.map((plusOne) => (
                <span
                  key={plusOne.id}
                  className={`plus-one glow-${mythSections[activeMyth]}`}
                  style={{
                    top: `${plusOne.y}px`,
                    left: `${plusOne.x}px`,
                    position: "absolute",
                    zIndex: 99,
                  }}
                >
                  +{mythStates[activeMyth].shardslvl}
                </span>
              ))}
              <div
                onMouseDown={handleStartSession}
                onTouchStart={handleStartSession}
                onTouchEnd={handleTap}
                className="flex justify-center items-center h-[400px] w-full rounded-full"
              >
                Click
              </div>
            </div>
            <div className="flex justify-center items-center w-[20%]">
              <div
                onClick={() => {
                  setActiveMyth((prev) => (prev + 1) % 5);
                }}
                className="bg-glass-black p-1 rounded-full cursor-pointer"
              >
                <ChevronsRight color="white" className="h-[30px] w-[30px]" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      ) : (
        <Convert />
      )}
    </>
  );
};

export default Game;
