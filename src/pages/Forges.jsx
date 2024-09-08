import React, { useContext, useEffect, useRef, useState } from "react";
import Convert from "./Convert";
import { MyContext } from "../context/context";
import {
  claimShardsBooster,
  startTapSession,
  updateGameData,
} from "../utils/api";
import { useTranslation } from "react-i18next";
import {
  elements,
  mythologies,
  mythSections,
  mythSymbols,
} from "../utils/variables";
import { ToggleLeft, ToggleRight } from "../components/Common/SectionToggles";
import MilestoneCard from "../components/Cards/MilestoneCard";
import Button from "../components/Buttons/Button";
import Header from "../components/Headers/Header";
import GameHeader from "../components/Headers/Game";
import ReactHowler from "react-howler";
import BoosterClaim from "../components/Cards/Boosters/BoosterClaim";
import BoosterButtom from "../components/Buttons/BoosterButtom";
import { showToast } from "../components/Toast/Toast";
import Footer from "../components/Common/Footer";
import { hideBackButton } from "../utils/teleBackButton";
import { Star } from "lucide-react";

const tele = window.Telegram?.WebApp;

const HeaderContent = ({
  activeMyth,
  t,
  shards,
  orbs,
  orbGlow,
  tapGlow,
  glowReward,
  glowSymbol,
  glowShards,
  mythData,
}) => {
  const height = Math.min(
    100,
    Math.max(0, (mythData.energy / mythData.energyLimit) * 100)
  );

  return (
    <div className="flex justify-between relative w-full">
      {/* Left */}
      <div className="flex flex-col justify-between h-full px-2 pt-1">
        <div
          className={`text-head  text-white glow-myth-${mythSections[activeMyth]} uppercase`}
        >
          Forge
        </div>
        <div className="flex mb-4 -ml-2 items-center text-black-contour w-fit h-fit">
          <div
            className={`font-symbols ${
              glowShards && `scale-[175%]`
            }  text-icon transition-all duration-1000  text-${
              mythSections[activeMyth]
            }-text`}
          >
            S
          </div>
          <div className={`text-num transition-all duration-1000 text-white`}>
            {shards}
          </div>
        </div>
      </div>
      <div className="flex absolute justify-center w-full z-20">
        <div
          className={`flex text-center justify-center h-[36vw] w-[36vw] -mt-5 items-center rounded-full outline outline-${
            mythSections[activeMyth]
          }-primary transition-all duration-1000 ${
            orbGlow
              ? `glow-tap-${mythSections[activeMyth]} outline-[2px] `
              : `glow-icon-${mythSections[activeMyth]}`
          } ${tapGlow && "scale-[125%] outline-[2px]"} ${
            glowReward && "scale-[125%] outline-[2px]"
          } `}
        >
          <div
            className={`absolute z-10 h-full w-full overflow-hidden rounded-full  outline outline-${mythSections[activeMyth]}-primary`}
          >
            <div
              style={{
                height: `${height}%`,
              }}
              className={`absolute bottom-0 opacity-20 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
            ></div>
          </div>
          <img
            src="/assets/uxui/240px-orb.base.png"
            alt="base-orb"
            className={`filter-orbs-${mythSections[activeMyth]} w-full h-full`}
          />
          <div
            className={`z-1 flex justify-center items-start font-symbols ${
              glowReward
                ? ` text-${mythSections[activeMyth]}-text opacity-100`
                : "text-white opacity-50"
            } text-[34vw] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute flex h-full w-full rounded-full`}
          >
            <div className="-mt-2">{mythSymbols[mythSections[activeMyth]]}</div>
          </div>
        </div>
      </div>
      {/* Right */}
      <div className="flex items-end flex-col justify-between h-full px-2 pt-1">
        <h1
          className={`text-head  text-black-contour uppercase text-${mythSections[activeMyth]}-text`}
        >
          {t(`elements.${elements[activeMyth]}`)}
        </h1>
        <div className="flex mb-4 -mr-2 items-center text-black-contour w-fit h-fit">
          <div className={`text-num transition-all duration-1000 text-white`}>
            {orbs}
          </div>
          <div
            className={`font-symbols  ${
              glowSymbol && `scale-[175%]`
            } text-icon transition-all duration-1000 text-${
              mythSections[activeMyth]
            }-text`}
          >
            {mythSymbols[mythSections[activeMyth]]}
          </div>
        </div>
      </div>
    </div>
  );
};

const Forges = () => {
  const { t } = useTranslation();
  const { activeMyth, setActiveMyth, gameData, setGameData, setSection } =
    useContext(MyContext);
  const initialState = gameData.mythologies.map((myth) => ({
    orbs: myth.orbs,
    shards: myth.shards,
    minionTaps: 0,
    energy: myth.energy,
    energyLimit: myth.energyLimit,
    currShards: 0,
    shardslvl: myth.boosters.shardslvl,
    automatalvl: myth.boosters.automatalvl,
    isShardsClaimActive: myth.boosters.isShardsClaimActive,
    automataStartTime: myth.boosters.automataStartTime,
    isAutomataActive: myth.boosters.isAutomataActive,
    shardsLastClaimedAt: myth.boosters.shardsLastClaimedAt,
    disabled: false,
  }));
  const popupDown = gameData.mythologies.map(() => ({
    coolDown: 0,
  }));
  const [showCard, setShowCard] = useState(null);
  const [showBlackOrb, setShowBlackOrb] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [mythStates, setMythStates] = useState(initialState);
  const [sessionActive, setSessionActive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [startOrbGlow, setstartOrbGlow] = useState(false);
  const [orbGlow, setOrbGlow] = useState(false);
  const [tapGlow, setTapGlow] = useState(false);
  const [glowReward, setGlowReward] = useState(false);
  const [glowNumber, setGlowNumber] = useState(false);
  const [glowSymbol, setGlowSymbol] = useState(false);
  const [glowShards, setGlowShards] = useState(false);
  const [minimize, setMinimize] = useState(0);
  const [platform, setPlatform] = useState(null);
  const { orbs, shards } = mythStates[activeMyth >= 4 ? 0 : activeMyth];
  const [plusOnes, setPlusOnes] = useState([]);
  const [isHolding, setIsHolding] = useState(false);
  const timeoutRef = useRef(null);
  const mythStatesRef = useRef(mythStates);

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
    setTapGlow(true);
  };

  // handle start session
  const handleStartSession = async (e) => {
    if (disabled) return;

    if (!sessionActive) {
      setMinimize(1);
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

  const orbChangeEffect = () => {
    setGlowShards(true);
    setTimeout(() => {
      setGlowShards(false);
      setTimeout(() => {
        setGlowReward(true);
        setTimeout(() => {
          setGlowReward(false);
          setTimeout(() => {
            setGlowSymbol(true);
            setTimeout(() => {
              setGlowSymbol(false);
              setTimeout(() => {
                setGlowNumber(true);
                setTimeout(() => {
                  setGlowNumber(false);
                }, 250);
              }, 250);
            }, 250);
          }, 250);
        }, 500);
      }, 250);
    }, 250);
  };

  const handlePlusOneEffect = (e) => {
    if (e.target.closest(".minion-button")) return;

    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;
    const newPlusOne = { x, y, id: Date.now() };
    setPlusOnes((prev) => [...prev, newPlusOne]);

    setTimeout(() => {
      setPlusOnes((prev) =>
        prev.filter((plusOne) => plusOne.id !== newPlusOne.id)
      );
    }, 1000);

    clearTimeout(timeoutId);
  };

  const handleClaimShards = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const mythologyName = {
      mythologyName: mythologies[activeMyth],
    };
    try {
      const response = await claimShardsBooster(mythologyName, accessToken);
      setGameData((prevData) => {
        const updatedData = {
          ...prevData,
          mythologies: prevData.mythologies.map((item) =>
            item.name === mythologies[activeMyth]
              ? {
                  ...item,
                  boosters: response.updatedBooster,
                }
              : item
          ),
        };

        return updatedData;
      });
      setMythStates((prevData) => {
        return prevData.map((item, index) => {
          if (index === activeMyth) {
            return {
              ...item,
              shardslvl: response.updatedBooster.shardslvl,
              isShardsClaimActive: response.updatedBooster.isShardsClaimActive,
              shardsLastClaimedAt: response.updatedBooster.shardsLastClaimedAt,
            };
          }
          return item;
        });
      });
      setShowCard(null);
      showToast("claim_minion_success");
    } catch (error) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("claim_minion_error");
    }
  };

  // update black orbs
  const updateBlackOrbStatus = () => {
    setShowBlackOrb(false);
    setGameData((prev) => ({
      ...prev,
      blackOrbs: prev.blackOrbs + 1,
    }));
  };

  // useEffect(() => {
  //   const currTime = new Date.now();
  //   console.log(currTime);
  // }, []);

  // const handleRandonPopup = (coolDown) => {
  //   return true;
  // };

  // handle tapping
  const handleTap = async (e) => {
    e.preventDefault();
    if (mythStates[activeMyth].disabled) return;

    const { energy, shardslvl, currShards } = mythStates[activeMyth];

    if (energy > 0) {
      window.navigator.vibrate(25);
      handlePlusOneEffect(e);
      let reachedBlackOrb = false;
      const updatedMythStates = mythStates.map((myth, index) => {
        if (index === activeMyth) {
          let newShards = myth.shards + shardslvl;
          let newOrbs = myth.orbs;
          let newMinionTaps = myth.minionTaps;

          if (newShards >= 1000) {
            orbChangeEffect();
            newOrbs += Math.floor(newShards / 1000);
            newShards = newShards % 1000;
          }

          if (isHolding && activeCard === "minion") {
            newMinionTaps += 1;
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
            minionTaps: newMinionTaps,
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

      // if (currShards >= 10 && handleRandonPopup) {
      // setActiveCard("minion");
      // call the random time function which shall return random booster on a random time within a minute
      // pass the cooldown period and update it as tapping increases
      // }

      if (currShards === 25) {
        setActiveCard("minion");
        setTimeout(() => {
          if (isHolding) {
            setTimeout(() => {
              setActiveCard("minion-down");
              setTimeout(() => {
                setActiveCard(null);
              }, 500);
            }, 5000);
          } else {
            setActiveCard("minion-down");
            setTimeout(() => {
              setActiveCard(null);
            }, 500);
          }
        }, 3000);
      }

      // After tap stop
      const newTimeoutId = setTimeout(async () => {
        if (activeCard === "minion") {
          setActiveCard("minion-down");
        }
        if (activeCard !== null) {
          setTimeout(() => {
            setActiveCard(null);
          }, 500);
        }
        setMinimize(2);
        setstartOrbGlow(false);
        setOrbGlow(false);
        setTapGlow(false);
        if (updatedMythStates[activeMyth].currShards > 10 || reachedBlackOrb) {
          handleUpdateTapData();
        }
      }, 700);
      setTimeoutId(newTimeoutId);
    } else {
      setMinimize(2);
      setOrbGlow(false);
      setMythStates((prevData) => {
        return prevData.map((item, index) => {
          if (index === activeMyth) {
            return {
              ...item,
              disabled: true,
            };
          }
          return item;
        });
      });

      setTimeout(() => {
        setMythStates((prevData) => {
          return prevData.map((item, index) => {
            if (index === activeMyth) {
              return {
                ...item,
                disabled: false,
              };
            }
            return item;
          });
        });
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
            let newShards =
              newState[index].shards + newState[index].automatalvl;
            let newOrbs = newState[index].orbs;

            // Logic to convert shards to orbs
            if (newShards >= 1000) {
              orbChangeEffect();

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
            let newShards =
              newState[index].shards + newState[index].automatalvl;
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

  // disable smoke for ios
  useEffect(() => {
    const teleConfigHandle = async () => {
      if (tele) {
        try {
          await tele.ready();
          setPlatform(tele.platform);
        } catch (error) {
          console.error("Error fetching user data from Telegram:", error);
        }
      } else {
        console.warn("Telegram WebApp is not available");
      }
    };

    teleConfigHandle();
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
                tapGlow={tapGlow}
                glowShards={glowShards}
                glowReward={glowReward}
                glowNumber={glowNumber}
                glowSymbol={glowSymbol}
                orbs={orbs}
                mythData={mythStates[activeMyth]}
                shards={mythStates[activeMyth].shards}
              />
            }
            gameData={gameData}
            t={t}
          />
          {/* Taping region */}
          <div className="flex relative flex-grow justify-center items-center">
            {/* Header Stats */}
            <GameHeader
              orbs={orbs}
              shards={shards}
              activeMyth={activeMyth}
              mythStates={mythStates}
            />
            {/* TapArea */}
            <div
              onMouseDown={handleStartSession}
              onTouchStart={handleStartSession}
              onTouchEnd={(e) => {
                handleTap(e);
              }}
              className="flex flex-col items-center justify-center  w-full h-full"
            >
              {/* <div
                style={{ position: "absolute", display: "inline-block" }}
                className="w-[250px] -top-[80px]"
              >
                <img
                  src="/assets/uxui/600px-smoke.wide.webp"
                  alt="smoke"
                  style={{
                    display: "block",
                    width: "100%",
                    mixBlendMode: "color-dodge",
                    filter: "contrast(254%) brightness(80%)",
                  }}
                  className={` ${
                    tapGlow && "scale-150 -mt-[45px]"
                  } transition-all duration-[1s]`}
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
                  +
                  {mythStates[activeMyth].shardslvl *
                    (isHolding && activeCard === "minion" ? 2 : 1)}
                </span>
              ))}
              <div className="flex justify-center items-center h-[450px] w-full rounded-full"></div>
            </div>
          </div>
          <div className="flex flex-col bottom-[12%] w-full justify-center items-center absolute z-10">
            {/* {mythStates[activeMyth].minionTaps} */}
            {/* <div className="abolsute bg-white w-[50px] h-[140vw] z-0 -mb-8">
              hi
            </div>
            <Star
              onClick={() => {
                tele.HapticFeedback.notificationOccurred("success");
              }}
              size={"18vw"}
              fill={"white"}
              color={"white"}
              className={`glow-star-${mythSections[activeMyth]} scale-star`}
            /> */}
          </div>
          {/* Footer */}
          {minimize < 4 && <Footer minimize={minimize} />}
          {/* RightButton */}
          <ToggleRight
            handleClick={() => {
              setActiveMyth((prev) => (prev + 1) % 5);
            }}
            activeMyth={activeMyth}
            minimize={minimize}
          />
          {/* LeftButton */}
          <ToggleLeft
            handleClick={() => {
              setActiveMyth((prev) => (prev - 1 + 5) % 5);
            }}
            activeMyth={activeMyth}
            minimize={minimize}
          />
          <ReactHowler
            src="/assets/audio/fof.forges.background01.wav"
            playing={!JSON.parse(localStorage.getItem("sound"))}
            preload={true}
            loop
          />
          {(activeCard === "minion" || activeCard === "minion-down") && (
            <div
              onTouchStart={() => {
                if (mythStates[activeMyth].isShardsClaimActive) {
                  setShowCard("minion");
                } else {
                  if (activeCard === "minion") {
                    setIsHolding(true);
                  }
                }
              }}
              onTouchEnd={() => setIsHolding(false)}
              className={`absolute ${
                activeCard === "minion-down" && "popdown"
              } ${
                activeCard === "minion" && "popup"
              } bottom-0 select-none left-0 -mb-2.5 minion-button`}
            >
              <div className="relative">
                <img
                  src="/assets/uxui/188px-minion.png"
                  alt="dwarf"
                  className="w-full h-full select-none pointer-events-none"
                />
              </div>
            </div>
          )}
          {showCard === "minion" && (
            <BoosterClaim
              activeCard={activeCard}
              activeMyth={activeMyth}
              mythData={mythStates[activeMyth]}
              closeCard={() => setShowCard(null)}
              Button={
                <BoosterButtom
                  activeCard={activeCard}
                  mythData={mythStates[activeMyth]}
                  handleClaim={handleClaimShards}
                  activeMyth={activeMyth}
                  t={t}
                />
              }
            />
          )}
          {/* {activeCard == "automata" && (
            <div className="absolute bottom-0 right-0 z-0">
              <div className="relative">
                <img
                  src="/assets/uxui/188px-automata.png"
                  alt="dwarf"
                  className="w-full h-full"
                  onClick={() => {
                    setActiveCard(null);
                  }}
                />
              </div>
            </div>
          )} */}
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
    </>
  );
};

export default Forges;
