import React, { useContext, useEffect, useRef, useState } from "react";
import Convert from "./Convert";
import { MyContext } from "../context/context";
import Footer from "../components/Footer";
import { startTapSession, updateGameData } from "../utils/api";
import { hideBackButton } from "../utils/teleBackButton";
import { useTranslation } from "react-i18next";
import {
  elements,
  mythologies,
  mythSections,
  mythSymbols,
} from "../utils/variables";
import { ToggleLeft, ToggleRight } from "../components/Common/SectionToggles";
import MilestoneCard from "../components/MilestoneCard";
import BoosterButtom from "../components/Buttons/BoosterButtom";
import AutomataCard from "../components/Cards/Boosters/AutomataCard";
import Button from "../components/Buttons/Button";
import Header from "../components/Headers/Header";
import GameHeader from "../components/Headers/Game";
import ReactHowler from "react-howler";

const tele = window.Telegram?.WebApp;

const HeaderContent = ({ activeMyth, t, shards, orbs, orbGlow }) => {
  return (
    <div className="flex relative flex-col flex-grow justify-center items-center text-white ">
      {/* <div className=" h-full z-20">
        <h1 className={`text-primary uppercase`}>
          {elements[activeMyth]} Forge
        </h1>
      </div> */}
      <div
        className={`flex text-center  justify-center outline outline-[0.5px] outline-green-400 h-[160px] -mt-10 absolute items-center rounded-full transition-all duration-1000 ${
          orbGlow
            ? `glow-tap-${mythSections[activeMyth]} `
            : `glow-icon-${mythSections[activeMyth]}`
        }`}
      >
        <img
          src="/assets/uxui/240px-orb.base.png"
          alt="orb"
          className={`filter-orbs-${mythSections[activeMyth]}  w-full h-full`}
        />
        <span
          className={`absolute z-1 font-symbols t text-white text-[160px] mt-11 ml-1  opacity-50 orb-glow`}
        >
          {mythSymbols[mythSections[activeMyth]]}
        </span>
      </div>
      <div className="flex justify-between h-full w-full px-2">
        <div>
          <h1
            className={`text-tertiary uppercase glow-text-small-${mythSections[activeMyth]}`}
          >
            {" "}
            {t(`elements.${elements[activeMyth]}`)}
          </h1>
          <h1
            className={`text-primary uppercase text-${mythSections[activeMyth]}-text`}
          >
            Forge
          </h1>

          <div>
            {" "}
            <h1 className="text-white text-2xl">{orbs}</h1>
            {/* <h1 className={`text-primary uppercase`}>{t("sections.forges")}</h1> */}
          </div>
        </div>
        {/* //TODO: Fix this component */}
        <div className="flex  gap-1">
          <div
            className={`flex flex-col relative text-center justify-center items-center max-w-orb top-0 rounded-full mr-1 -mt-10`}
          >
            <div
              className={`flex flex-col glow-shard-${mythSections[activeMyth]} w-full`}
            >
              <img
                src="/assets/uxui/240px-shard.base.png"
                alt="orb"
                className={`filter-orbs-${mythSections[activeMyth]} `}
              />
            </div>
            <div className="text-primary font-fof font-normal">{shards}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Forges = () => {
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
  const [activeCard, setActiveCard] = useState(null);
  const [mythStates, setMythStates] = useState(initialState);
  const [sessionActive, setSessionActive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [startOrbGlow, setstartOrbGlow] = useState(false);
  const [orbGlow, setOrbGlow] = useState(false);
  const { orbs, shards, energy } = mythStates[activeMyth >= 4 ? 0 : activeMyth];
  const [plusOnes, setPlusOnes] = useState([]);
  const timeoutRef = useRef(null);
  const mythStatesRef = useRef(mythStates);

  // setActiveCard
  const handleActiveCard = (type) => {
    setActiveCard(type);
  };

  // update sessionStart timestamp
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

  // handle startSession states
  const startSession = () => {
    setSessionActive(true);
    handleTriggerStart();
    setstartOrbGlow(true);
  };

  // handle start session
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

  // update tapData
  const handleUpdateTapData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    setstartOrbGlow(false);

    const sessionShards =
      mythStates[activeMyth].shards === 999
        ? mythStates[activeMyth].currShards + 1
        : mythStates[activeMyth].currShards;

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

  // handle tapping
  const handleTap = async (e) => {
    e.preventDefault();
    if (disabled) return;

    const { energy, shardslvl } = mythStates[activeMyth];

    if (energy > 0) {
      window.navigator.vibrate(25);
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

      setMythStates(() => updatedMythStates);

      if (reachedBlackOrb) {
        setShowBlackOrb(true);
      }

      setTimeout(() => {
        setPlusOnes((prev) =>
          prev.filter((plusOne) => plusOne.id !== newPlusOne.id)
        );
      }, 1000);

      clearTimeout(timeoutId);

      if (updatedMythStates[activeMyth].currShards > 10 || reachedBlackOrb) {
        const newTimeoutId = setTimeout(async () => {
          handleUpdateTapData();
        }, 700);
        setTimeoutId(newTimeoutId);
      }
    } else {
      setDisabled(true);
      setTimeout(() => {
        setDisabled(false);
      }, 15000);
    }
  };

  useEffect(() => {
    if (startOrbGlow) {
      const interval = setInterval(() => {
        setOrbGlow((prev) => !prev);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startOrbGlow]);

  // update black orbs
  const updateBlackOrbStatus = () => {
    setShowBlackOrb(false);
    setGameData((prev) => ({
      ...prev,
      blackOrbs: prev.blackOrbs + 1,
    }));
  };

  // handle increment energy every second
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

  // handle increment shards incase of autonmata
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

  // persist states for diff myths
  useEffect(() => {
    mythStatesRef.current = mythStates;
  }, [mythStates]);

  // update global context states
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

  // disable backbutton
  useEffect(() => {
    hideBackButton(tele);
  }, []);

  return (
    <>
      {activeMyth < 4 ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
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
              className={`absolute top-0 left-0 h-full w-full filter-${mythSections[activeMyth]}`}
              style={{
                backgroundImage: `url(/assets/uxui/480px-fof.forge.jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            />
          </div>
          <Header
            children={
              <HeaderContent
                activeMyth={activeMyth}
                t={t}
                orbGlow={orbGlow}
                orbs={orbs}
                shards={mythStates[activeMyth].shards}
              />
            }
            gameData={gameData}
            t={t}
          />
          {/* Progressbar Header */}
          {/* <div className="relative flex justify-center">
            <ProgressBar
              value={energy}
              max={mythStates[activeMyth].energyLimit}
              activeMyth={activeMyth}
            />
          </div> */}

          {/* Taping region */}
          <div className="flex relative flex-grow justify-center items-center">
            {/* <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src="/assets/uxui/test.webp"
                alt="smoke"
                style={{ display: "block", width: "100%" }}
                className="filter-norse"
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              ></div>
            </div> */}

            {/* Header Stats */}
            <GameHeader
              orbs={orbs}
              shards={shards}
              activeMyth={activeMyth}
              mythStates={mythStates}
              handleActiveCard={handleActiveCard}
            />
            {/* LeftButton */}
            <ToggleLeft
              handleClick={() => {
                setActiveMyth((prev) => (prev - 1 + 5) % 5);
              }}
              activeMyth={activeMyth}
            />
            {/* TapArea */}
            <div
              onMouseDown={handleStartSession}
              onTouchStart={handleStartSession}
              onTouchEnd={(e) => {
                handleTap(e);
              }}
              className="flex flex-col items-center justify-center w-full"
            >
              {plusOnes.map((plusOne) => (
                <span
                  key={plusOne.id}
                  className={`plus-one glow-text-${mythSections[activeMyth]}`}
                  style={{
                    top: `${plusOne.y}px`,
                    left: `${plusOne.x}px`,

                    zIndex: 99,
                  }}
                >
                  +{mythStates[activeMyth].shardslvl}
                </span>
              ))}

              <div className="flex justify-center items-center h-[450px] w-full rounded-full"></div>
            </div>
            {/* RightButton */}
            <ToggleRight
              handleClick={() => {
                setActiveMyth((prev) => (prev + 1) % 5);
              }}
              activeMyth={activeMyth}
            />
          </div>
          {/* Footer */}
          <Footer />
          <ReactHowler
            src="/assets/audio/fof.forges.background01.wav"
            playing={!JSON.parse(localStorage.getItem("sound"))}
            preload={true}
            loop
          />
        </div>
      ) : (
        <Convert />
      )}
      {/* Booster card */}
      {showBlackOrb && (
        <MilestoneCard
          isOrb={true}
          isBlack={true}
          t={t}
          activeMyth={activeMyth}
          closeCard={() => {
            setShowBlackOrb(false);
          }}
          Button={
            <Button
              message={t(`buttons.claim`)}
              handleClick={updateBlackOrbStatus}
              activeMyth={activeMyth}
              t={t}
            />
          }
        />
      )}
      {activeCard === "automata" && (
        <AutomataCard
          activeCard={activeCard}
          activeMyth={activeMyth}
          closeCard={() => setActiveCard(null)}
          Button={
            <BoosterButtom
              activeCard={activeCard}
              mythData={mythStates[activeMyth]}
              handleClaim={() => {}}
              activeMyth={activeMyth}
              t={t}
            />
          }
        />
      )}
      {activeCard === "shard" && (
        <MilestoneCard
          isOrb={false}
          isBlack={false}
          activeMyth={activeMyth}
          closeCard={() => {
            setActiveCard(null);
          }}
          booster={5}
          Button={
            <BoosterButtom
              activeCard={activeCard}
              mythData={mythStates[activeMyth]}
              handleClaim={() => {}}
              activeMyth={activeMyth}
              t={t}
            />
          }
        />
      )}
    </>
  );
};

export default Forges;

{
  /* {showCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative w-[72%] rounded-lg shadow-lg mt-12">
            <img
              src={`/assets/cards/320px-${
                activeCard + "." + boosterCards[activeMyth]
              }1.png`}
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
                className={`flex items-center justify-between h-[60px] w-[192px] mx-auto -mt-2 bg-glass-black z-50 text-white  rounded-primary`}
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
              <div className="flex items-center justify-between h-[60px] w-[192px] mx-auto -mt-2   bg-glass-black text-white  rounded-primary">
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
      )} */
}

//* Using Words
{
  /* <div className="text-right font-medium  text-[22px]">
                {formatOrbsWithLeadingZeros(orbs)}{" "}
                <span className={`text-${mythSections[activeMyth]}-text`}>
                  ORB(S)
                </span> */
}
{
  /* <div className="text-right font-medium  -mt-1 text-[14px]">
                {formatShardsWithLeadingZeros(shards)}{" "}
                <span className={`text-${mythSections[activeMyth]}-text`}>
                  SHARDS
                </span>
              </div> */
}

//* Down button
{
  /* <div className="absolute bg-black rounded-full p-[6px] -mt-3">
              <ChevronDown color="white" />
            </div> */
}

//* Sound
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

//* V1
// <>
//   {activeMyth < 4 ? (
//     <div
//       style={{
//         backgroundImage: `url(/assets/uxui/480px-fof.forge.${mythSections[activeMyth]}.png)`,
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
//             backgroundImage: `url(/assets/uxui/fof.header.paper.png)`,
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
//           }1.png`}
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
//                 className={`flex items-center justify-between h-[45px] w-[192px] mx-auto bg-glass-black text-white  rounded-primary`}
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
//               <div className="flex items-center justify-between h-[45px] w-[192px] mx-auto bg-glass-black text-white  rounded-primary">
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
