import React, { useContext, useEffect, useRef, useState } from "react";
import Convert from "./Convert";
import { MyContext } from "../context/context";
import ProgressBar from "../components/ProgressBar";
import { ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";
import Footer from "../components/Footer";
import {
  formatOrbsWithLeadingZeros,
  formatShardsWithLeadingZeros,
} from "../utils/gameManipulations";
import { startTapSession, updateGameData } from "../utils/api";
import { hideBackButton, tapHaptick } from "../utils/teleBackButton";
import Symbol from "../components/Symbol";
import { calculateRemainingTime } from "../utils/getBoosterCard";
import ProgressBarSVG from "../components/Progressbars/ProgressBarArc";
import { useTranslation } from "react-i18next";
import OrbCard from "../components/OrbCard";

const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];
const mythSections = ["celtic", "egyptian", "greek", "norse", "other"];
const boosterCards = ["earth", "air", "fire", "water"];

const symbols = {
  greek: 4,
  celtic: 2,
  norse: 5,
  egyptian: 1,
};

const tele = window.Telegram?.WebApp;

const Game = () => {
  const { t } = useTranslation();
  const { activeMyth, setActiveMyth, gameData, setGameData } =
    useContext(MyContext);
  const initialState = gameData.mythologies.map((myth) => ({
    orbs: myth.orbs,
    shards: myth.shards,
    energy: myth.energy,
    energyLimit: myth.energyLimit,
    currShards: 0,
    shardslvl: myth.boosters.shardslvl,
    isShardsClaimActive: myth.boosters.isShardsClaimActive,
    automataStartTime: myth.boosters.automataStartTime,
    isAutomataActive: myth.boosters.isAutomataActive,
    shardsLastClaimedAt: myth.boosters.shardsLastClaimedAt,
  }));
  const [showBlackOrb, setShowBlackOrb] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [mythStates, setMythStates] = useState(initialState);
  const [sessionActive, setSessionActive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isButtonGlowing, setIsButtonGlowing] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);
  const { orbs, shards, energy } = mythStates[activeMyth >= 4 ? 0 : activeMyth];
  const [plusOnes, setPlusOnes] = useState([]);
  const timeoutRef = useRef(null);
  const audioRef = useRef(null);
  const mythStatesRef = useRef(mythStates);

  const handleCloseButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
      setShowCard((prev) => !prev);
    }, 100);
  };

  const handleButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
    }, 100);
  };

  const handleUpdateTapData = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const sessionShards =
      mythStates[activeMyth].shards === 999 &&
      mythStates[activeMyth].currShards + 1;

    try {
      await updateGameData(
        {
          taps: sessionShards,
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

      let reachedBlackOrb = false;
      const updatedMythStates = mythStates.map((myth, index) => {
        if (index === activeMyth) {
          let newShards = myth.shards + shardslvl;
          let newOrbs = myth.orbs;

          if (newShards >= 1000) {
            newOrbs += Math.floor(newShards / 1000);
            newShards = newShards % 1000;
          }

          // Convert orbs to black orbs
          if (newOrbs >= 1000) {
            reachedBlackOrb = true;
            newOrbs = newOrbs % 1000;
          }

          return {
            ...myth,
            energy: Math.max(0, myth.energy - 1),
            shards: newShards,
            currShards: myth.currShards + 1,
            orbs: newOrbs,
          };
        }
        return myth;
      });

      setMythStates(updatedMythStates);

      if (reachedBlackOrb) {
        setShowBlackOrb(true);
      }

      setTimeout(() => {
        setPlusOnes((prev) =>
          prev.filter((plusOne) => plusOne.id !== newPlusOne.id)
        );
      }, 1000);

      clearTimeout(timeoutId);

      if (mythStates[activeMyth].currShards > 10 || reachedBlackOrb) {
        const newTimeoutId = setTimeout(async () => {
          reachedBlackOrb = false; // Resetting the flag
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

  const updateBlackOrbStatus = () => {
    setShowBlackOrb(false);
    setGameData((prev) => ({
      ...prev,
      blackOrbs: prev.blackOrbs + 1,
    }));
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
    const automataIntervals = [];

    gameData.mythologies.forEach((myth, index) => {
      const automataTimeleft =
        (Date.now() - new Date(myth.boosters.automataLastClaimedAt).getTime()) /
        1000;

      if (myth.boosters.isAutomataActive) {
        const interval = setInterval(() => {
          setMythStates((prevState) => {
            const newState = [...prevState];
            let newShards = newState[index].shards + newState[index].shardslvl;
            let newOrbs = newState[index].orbs;

            // Logic to convert shards to orbs
            if (newShards >= 1000) {
              newOrbs += Math.floor(newShards / 1000);
              newShards = newShards % 1000;
            }

            newState[index] = {
              ...newState[index],
              shards: newShards,
              orbs: newOrbs,
            };

            return newState;
          });
        }, 1000);

        automataIntervals.push(interval);

        if (automataTimeleft > 0 && automataTimeleft < 1000) {
          setMythStates((prevState) => {
            const newState = [...prevState];
            let newShards = newState[index].shards + newState[index].shardslvl;
            let newOrbs = newState[index].orbs;

            if (newShards >= 1000) {
              newOrbs += Math.floor(newShards / 1000);
              newShards = newShards % 1000;
            }

            newState[index] = {
              ...newState[index],
              shards: newShards,
              orbs: newOrbs,
            };

            return newState;
          });
        }
      }
    });

    return () => {
      automataIntervals.forEach((interval) => clearInterval(interval));
    };
  }, [gameData.mythologies]);

  useEffect(() => {
    hideBackButton(tele);
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
        return {
          ...prevData,
          mythologies: newMythologies,
        };
      });
    };
  }, []);

  // const handlePlay = () => {
  //   if (audioRef.current) {
  //     audioRef.current.play().catch((error) => {
  //       // Handle the error here if play() fails
  //       console.log("Error playing audio:", error);
  //     });
  //   }
  // };

  // useEffect(() => {
  //   const audio = audioRef.current;
  //   // `/assets/audio/sound.background.pulsing.ogg`;

  //   if (audio) {
  //     audio.src = `/assets/audio/sound.background.pulsing.ogg`;

  //     audio.play();
  //   }
  // }, []);

  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.hidden) {
  //       audioRef.current.pause();
  //     } else {
  //       audioRef.current.play();
  //     }
  //   };
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  return (
    // <>
    //   {activeMyth < 4 ? (
    //     <div
    //       style={{
    //         backgroundImage: `url(/assets/uxui/480px-fof.forge.${mythSections[activeMyth]}_tiny.png)`,
    //         backgroundRepeat: "no-repeat",
    //         backgroundSize: "cover",
    //         backgroundPosition: "center center",
    //         height: "100vh",
    //         width: "100vw",
    //         position: "fixed",
    //         top: 0,
    //         left: 0,
    //       }}
    //       className="flex flex-col h-screen overflow-hidden"
    //     >
    //       {/* Header */}
    //       <div
    //         style={{
    //           position: "relative",
    //           height: "18.5%",
    //           width: "100%",
    //         }}
    //         className="flex -mt-1"
    //       >
    //         <div
    //           style={{
    //             backgroundImage: `url(/assets/uxui/fof.header.paper_tiny.png)`,
    //             backgroundRepeat: "no-repeat",
    //             backgroundSize: "cover",
    //             backgroundPosition: "center center",
    //             position: "absolute",
    //             top: 0,
    //             left: 0,
    //             height: "100%",
    //             width: "100%",
    //             zIndex: -1,
    //           }}
    //           className={`filter-paper-${mythSections[activeMyth]}`}
    //         />
    //         {/* <button className="bg-white" onClick={handlePlay}>
    //           Click
    //         </button> */}

    //         <div className="flex flex-col flex-grow justify-center items-start text-white pl-5 pr-10 ">
    //           <h1 className={`glow-${mythSections[activeMyth]} uppercase`}>
    //             {t(`mythologies.${mythSections[activeMyth]}`)}
    //           </h1>
    //           <div className="text-right font-medium  text-[22px] -mt-3">
    //             {formatOrbsWithLeadingZeros(orbs)}{" "}
    //             <span className={`text-${mythSections[activeMyth]}-text`}>
    //               {t(`keywords.orbs`)}
    //             </span>
    //           </div>
    //           <div className="text-right font-medium  -mt-1 text-[14px]">
    //             {formatShardsWithLeadingZeros(shards)}{" "}
    //             <span
    //               className={`text-${mythSections[activeMyth]}-text uppercase`}
    //             >
    //               {t(`keywords.shards`)}
    //             </span>
    //           </div>
    //         </div>
    //         <div
    //           className="h-full relative ml-auto -mr-2 mt-1 pt-2"
    //           style={{ width: "18.5%" }}
    //         >
    //           <Symbol myth={mythSections[activeMyth]} />
    //           <div className="absolute -mt-[150px] -ml-[46px]">
    //             <ProgressBarSVG
    //               value={energy}
    //               max={gameData.mythologies[activeMyth].energyLimit}
    //               activeMyth={activeMyth}
    //             />
    //           </div>
    //         </div>
    //       </div>

    //       {/* Main */}
    //       <div className="flex relative flex-grow justify-center items-center">
    //         <div className="flex flex-col absolute top-0 right-0 mt-2">
    //           {mythStates[activeMyth].isAutomataActive && (
    //             <h1
    //               onClick={() => {
    //                 setShowCard(true);
    //                 setActiveCard("automata");
    //               }}
    //               className="font-symbols text-[50px] p-0 ml-2 text-white glow-booster"
    //             >
    //               B
    //             </h1>
    //           )}
    //           {mythStates[activeMyth].shardsLastClaimedAt !== 0 && (
    //             <h1
    //               onClick={() => {
    //                 setShowCard(true);
    //                 setActiveCard("shard");
    //               }}
    //               className={`font-symbols text-[50px] p-0 ml-2 text-white booster-shadow ${
    //                 mythStates[activeMyth].isAutomataActive && "-mt-6"
    //               }`}
    //             >
    //               H
    //             </h1>
    //           )}
    //         </div>
    //         <div className="flex justify-center items-center w-[20%]">
    //           <div
    //             onClick={() => {
    //               handleButtonClick(1);

    //               setActiveMyth((prev) => (prev - 1 + 5) % 5);
    //             }}
    //             className={`bg-glass-black p-[6px] mt-1 rounded-full cursor-pointer  ${
    //               isButtonGlowing === 1
    //                 ? `glow-button-${mythSections[activeMyth]}`
    //                 : ""
    //             }`}
    //           >
    //             <ChevronsLeft color="white" className="h-[30px] w-[30px]" />
    //           </div>
    //         </div>
    //         <div className="flex flex-col items-center justify-center w-full">
    //           {plusOnes.map((plusOne) => (
    //             <span
    //               key={plusOne.id}
    //               className={`plus-one glow-${mythSections[activeMyth]}`}
    //               style={{
    //                 top: `${plusOne.y}px`,
    //                 left: `${plusOne.x}px`,
    //                 position: "absolute",
    //                 zIndex: 99,
    //               }}
    //             >
    //               +{mythStates[activeMyth].shardslvl}
    //             </span>
    //           ))}
    //           <div
    //             onMouseDown={handleStartSession}
    //             onTouchStart={handleStartSession}
    //             onTouchEnd={handleTap}
    //             className="flex justify-center items-center h-[450px] w-full rounded-full"
    //           ></div>
    //         </div>
    //         <div className="flex justify-center items-center w-[20%]">
    //           <div
    //             onClick={() => {
    //               handleButtonClick(2);

    //               setActiveMyth((prev) => (prev + 1) % 5);
    //             }}
    //             className={`bg-glass-black p-[6px] mt-1 rounded-full cursor-pointer  ${
    //               isButtonGlowing === 2
    //                 ? `glow-button-${mythSections[activeMyth]}`
    //                 : ""
    //             }`}
    //           >
    //             <ChevronsRight color="white" className="h-[30px] w-[30px]" />
    //           </div>
    //         </div>
    //       </div>

    //       {/* Footer */}
    //       <Footer />
    //     </div>
    //   ) : (
    //     <Convert />
    //   )}
    //   {/* Booster card */}
    //   {showCard && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    //       <div className="relative w-[72%] rounded-lg shadow-lg mt-12">
    //         <img
    //           src={`/assets/cards/320px-${
    //             activeCard + "." + boosterCards[activeMyth]
    //           }1_tiny.png`}
    //           alt="card"
    //           className="w-full h-full mx-auto"
    //         />
    //         <div className="absolute top-0 right-0 w-[55px] h-[55px] cursor-pointer">
    //           <img
    //             src="/assets/icons/close.svg"
    //             alt="close"
    //             className={`h-full w-full ml-auto -mt-6 -mr-6 rounded-full ${
    //               isButtonGlowing === 3
    //                 ? `glow-button-${mythSections[activeMyth]}`
    //                 : ""
    //             }`}
    //             onClick={() => {
    //               handleCloseButtonClick(3);
    //             }}
    //           />
    //         </div>
    //         <div className="relative">
    //           <div className="absolute flex justify-center items-center w-full top-0 z-0">
    //             <div className="bg-black h-[60px] w-[60px] rounded-full -mt-2"></div>
    //           </div>
    //           <div className="relative z-50">
    //             {activeCard === "automata" && !mythStates?.isAutomataActive ? (
    //               <div
    //                 className={`flex items-center justify-between h-[45px] w-[192px] mx-auto bg-glass-black text-white  rounded-button`}
    //               >
    //                 <div className="flex justify-center items-center w-1/4 h-full"></div>
    //                 <div className="text-[16px] uppercase">
    //                   {calculateRemainingTime(
    //                     mythStates[activeMyth].automataStartTime
    //                   )}
    //                 </div>
    //                 <div className="flex justify-center items-center w-1/4 h-full"></div>
    //               </div>
    //             ) : (
    //               <div className="flex items-center justify-between h-[45px] w-[192px] mx-auto bg-glass-black text-white  rounded-button">
    //                 <div className="flex justify-center items-center w-1/4 h-full"></div>
    //                 <div className="text-[16px] uppercase">
    //                   {calculateRemainingTime(
    //                     mythStates[activeMyth].shardsLastClaimedAt
    //                   )}
    //                 </div>
    //                 <div className="flex justify-center items-center w-1/4 h-full"></div>
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    //   <audio ref={audioRef} loop>
    //     <source src={`/assets/audio/sound.background.pulsing.ogg`} />
    //     Your browser does not support the audio element.
    //   </audio>
    //   {showBlackOrb && (
    //     <OrbCard
    //       updateBlackOrbStatus={updateBlackOrbStatus}
    //       closeCard={() => setShowBlackOrb(false)}
    //     />
    //   )}
    // </>
    <>
      {activeMyth < 4 ? (
        <div
          style={{
            backgroundImage: `url(/assets/uxui/480px-fof.forge.${mythSections[activeMyth]}_tiny.png)`,
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
          <div className="relative flex justify-center">
            <ProgressBar
              value={energy}
              max={gameData.mythologies[activeMyth].energyLimit}
              activeMyth={activeMyth}
            />
            {/* <div className="absolute bg-black rounded-full p-[6px] -mt-3">
              <ChevronDown color="white" />
            </div> */}
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex flex-col gap-4 flex-grow justify-center items-start text-white pl-2 ">
              {/* <div className="text-right font-medium  text-[22px]">
                {formatOrbsWithLeadingZeros(orbs)}{" "}
                <span className={`text-${mythSections[activeMyth]}-text`}>
                  ORB(S)
                </span> */}
              <div className="flex gap-1 items-center">
                <div
                  className={`flex relative text-center justify-center max-w-[10vw] items-center rounded-full glow-icon-${mythSections[activeMyth]}`}
                >
                  <img
                    src="/assets/uxui/240px-orb.base-tiny.png"
                    alt="orb"
                    className={`filter-orbs-${mythSections[activeMyth]}`}
                  />
                  <span
                    className={`absolute z-1 font-symbols text-[40px] mt-0.5 ml-1 opacity-50 orb-glow`}
                  >
                    {symbols[mythSections[activeMyth]]}
                  </span>
                </div>
                <div className="text-[22px] font-fof  font-normal">
                  {formatOrbsWithLeadingZeros(orbs)}
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <div
                  className={`flex relative text-center justify-center items-center w-[40px] rounded-full`}
                >
                  <img
                    src="/assets/uxui/240px-shard.base-tiny.png"
                    alt="orb"
                    className={`filter-orbs-${mythSections[activeMyth]}`}
                  />
                </div>
                <div className="text-[18px] font-fof  font-normal">
                  {formatOrbsWithLeadingZeros(orbs)}
                </div>
              </div>

              {/* <div className="text-right font-medium  -mt-1 text-[14px]">
                {formatShardsWithLeadingZeros(shards)}{" "}
                <span className={`text-${mythSections[activeMyth]}-text`}>
                  SHARDS
                </span>
              </div> */}
            </div>

            <div className="flex flex-col absolute top-0 right-0">
              {!mythStates[activeMyth].isAutomataActive && (
                <h1
                  onClick={() => {
                    setShowCard(true);
                    setActiveCard("automata");
                  }}
                  className="font-symbols text-[50px] p-0 ml-2  text-white"
                >
                  B
                </h1>
              )}
              {!mythStates[activeMyth].shardsLastClaimedAt !== 0 && (
                <h1
                  onClick={() => {
                    setShowCard(true);
                    setActiveCard("shard");
                  }}
                  className={`font-symbols text-[50px] p-0 ml-2 text-white ${
                    !mythStates[activeMyth].isAutomataActive && "-mt-[30px]"
                  }`}
                >
                  H
                </h1>
              )}
            </div>
          </div>

          {/* Main */}
          <div className="flex relative flex-grow justify-center items-center">
            <div className="flex justify-center items-center w-[20%]">
              <div
                onClick={() => {
                  handleButtonClick(1);

                  setActiveMyth((prev) => (prev - 1 + 5) % 5);
                }}
                className={`bg-glass-black p-[6px] mt-1 rounded-full cursor-pointer  ${
                  isButtonGlowing === 1
                    ? `glow-button-${mythSections[activeMyth]}`
                    : ""
                }`}
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
                onTouchEnd={(e) => {
                  handleTap(e);
                }}
                className="flex justify-center items-center h-[450px] w-full rounded-full"
              ></div>
            </div>
            <div className="flex justify-center items-center w-[20%]">
              <div
                onClick={() => {
                  handleButtonClick(2);

                  setActiveMyth((prev) => (prev + 1) % 5);
                }}
                className={`bg-glass-black p-[6px] mt-1 rounded-full cursor-pointer  ${
                  isButtonGlowing === 2
                    ? `glow-button-${mythSections[activeMyth]}`
                    : ""
                }`}
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
      {/* Booster card */}
      {showCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative w-[72%] rounded-lg shadow-lg mt-12">
            <img
              src={`/assets/cards/320px-${
                activeCard + "." + boosterCards[activeMyth]
              }1_tiny.png`}
              alt="card"
              className="w-full h-full mx-auto"
            />
            <div className="absolute top-0 right-0 w-[55px] h-[55px] cursor-pointer">
              <img
                src="/assets/icons/close.svg"
                alt="close"
                className={`h-full w-full ml-auto -mt-6 -mr-6 rounded-full ${
                  isButtonGlowing === 3
                    ? `glow-button-${mythSections[activeMyth]}`
                    : ""
                }`}
                onClick={() => {
                  handleCloseButtonClick(3);
                }}
              />
            </div>

            {activeCard === "automata" && mythStates?.isAutomataActive ? (
              <div
                className={`flex items-center justify-between h-[60px] w-[192px] mx-auto -mt-2 bg-glass-black z-50 text-white  rounded-button`}
              >
                <div className="flex justify-center items-center w-1/4 h-full"></div>
                <div className="text-[16px] uppercase">
                  {calculateRemainingTime(
                    mythStates[activeMyth].automataStartTime
                  )}
                </div>
                <div className="flex justify-center items-center w-1/4  h-full"></div>
              </div>
            ) : (
              <div className="flex items-center justify-between h-[60px] w-[192px] mx-auto -mt-2   bg-glass-black text-white  rounded-button">
                <div className="flex justify-center items-center w-1/4 h-full"></div>
                <div className="text-[16px] uppercase">
                  {calculateRemainingTime(
                    mythStates[activeMyth].shardsLastClaimedAt
                  )}
                </div>
                <div className="flex justify-center items-center w-1/4  h-full"></div>
              </div>
            )}
          </div>
        </div>
      )}
      <audio ref={audioRef} loop />
      {/* <OrbCard activeMyth={activeMyth} /> */}
    </>
  );
};

export default Game;
