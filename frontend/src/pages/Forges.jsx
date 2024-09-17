import React, { useContext, useEffect, useRef, useState } from "react";
import Convert from "./Convert";
import { MyContext } from "../context/context";
import {
  claimBurst,
  claimShardsBooster,
  startTapSession,
  updateGameData,
  updateMythology,
} from "../utils/api";
import { useTranslation } from "react-i18next";
import {
  elements,
  mythologies,
  mythSections,
  mythSymbols,
} from "../utils/variables";
import { ToggleLeft, ToggleRight } from "../components/Common/SectionToggles";
import Button from "../components/Buttons/Button";
import Header from "../components/Headers/Header";
import GameHeader from "../components/Headers/Game";
import ReactHowler from "react-howler";
import BoosterClaim from "../components/Cards/Boosters/BoosterClaim";
import BoosterButtom from "../components/Buttons/BoosterButtom";
import { showToast } from "../components/Toast/Toast";
import Footer from "../components/Common/Footer";
import { Star } from "lucide-react";
import { ForgesGuide } from "../components/Common/Tutorial";
import MilestoneCard from "../components/Cards/MilestoneCard";
import { hideBackButton } from "../utils/teleBackButton";
import { toast } from "react-toastify";

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
  platform,
  showBlackOrb,
  glowBooster,
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
            className={`absolute z-10 h-full w-[36vw] overflow-hidden rounded-full  outline outline-${mythSections[activeMyth]}-primary`}
          >
            <div
              style={{
                height: `${height}%`,
              }}
              className={`absolute bottom-0  opacity-20 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
            ></div>
          </div>
          <img
            src="/assets/uxui/240px-orb.base.png"
            alt="base-orb"
            className={`filter-orbs-${mythSections[activeMyth]} w-full h-full`}
          />
          <div
            className={`z-1  flex justify-center items-start  font-symbols ${
              glowReward
                ? ` text-${mythSections[activeMyth]}-text opacity-100`
                : showBlackOrb === 1
                ? "text-white opacity-100"
                : "text-white opacity-50"
            } text-[34vw] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute flex h-full w-full rounded-full`}
          >
            <div className={` ${platform === "ios" ? "-mt-6" : "-mt-2"}`}>
              {mythSymbols[mythSections[activeMyth]]}
            </div>
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
              (glowSymbol || glowBooster) && `scale-[175%]`
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
  const {
    activeMyth,
    setActiveMyth,
    gameData,
    setGameData,
    showBooster,
    setShowBooster,
    showGlow,
    setShowGlow,
    platform,
    authToken,
  } = useContext(MyContext);
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
    isStarActive: myth.isStarActive,
    isEligibleForBurst: myth.isEligibleForBurst,
    disabled: false,
  }));
  const [showCard, setShowCard] = useState(null);
  const [showBlackOrb, setShowBlackOrb] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [mythStates, setMythStates] = useState(initialState);
  const [popupStates, setPopupStates] = useState({
    isActive: false,
    counter: 0,
    popupTime: 0,
    sessionTaps: 0,
  });
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
  const [glowBooster, setGlowBooster] = useState(false);
  const [minimize, setMinimize] = useState(0);
  const { orbs, shards } = mythStates[activeMyth >= 4 ? 0 : activeMyth];
  const [plusOnes, setPlusOnes] = useState([]);
  const [plusMinion, setPlusMinion] = useState([]);
  const [plusAutomata, setPlusAutomata] = useState([]);
  const [isHolding, setIsHolding] = useState(false);
  const [isStarHolding, setIsStarHolding] = useState(0);
  const [showStarBoosters, setshowStarBoosters] = useState(false);
  const [showStarHand, setshowStarHand] = useState(false);
  const [enableGuide, setEnableGuide] = useState(false);
  const [count, setCount] = useState(0);
  const timeoutRef = useRef(null);
  const holdTimeoutId = useRef(null);
  const maxHoldTimeoutId = useRef(null);
  const mythStatesRef = useRef(mythStates);
  const countRef = useRef(count);
  const disableStarTimeout = useRef(null);

  useEffect(() => {
    tele.CloudStorage.getItem("guide1", (err, item) => {
      if (!item) {
        setEnableGuide(true);
        setTimeout(() => {
          setEnableGuide(false);

          tele.CloudStorage.setItem("guide1", 1);
        }, 5000);
      }
    });
  }, []);

  // update sessionStart timestamp
  const handleTriggerStart = async () => {
    try {
      await startTapSession(
        { mythologyName: mythologies[activeMyth] },
        authToken
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
    const sessionShards =
      mythStates[activeMyth].shards === 999 ||
      mythStates[activeMyth].shards === 998
        ? mythStates[activeMyth].currShards + 1
        : mythStates[activeMyth].currShards;

    try {
      await updateGameData(
        {
          minionTaps: mythStates[activeMyth].minionTaps / 2,
          taps: sessionShards,
          mythologyName: mythologies[activeMyth],
        },
        authToken
      );

      setMythStates((prevState) => {
        const newState = [...prevState];
        newState[activeMyth].currShards = 0;
        newState[activeMyth].minionTaps = 0;
        return newState;
      });
      console.log("Shards claimed successfully.");
    } catch (error) {
      setMythStates((prevState) => {
        const newState = [...prevState];
        newState[activeMyth].currShards = 0;
        newState[activeMyth].minionTaps = 0;
        return newState;
      });
      console.log(error);
    }
  };

  const handleUpdateStarStatus = async () => {
    try {
      await claimBurst(
        {
          session: countRef.current,
          mythologyName: mythologies[activeMyth],
        },
        authToken
      );
      setCount(0);
      setMythStates((prevState) => {
        return prevState.map((item, index) => {
          if (index === activeMyth) {
            return {
              ...item,
              isStarActive: false,
              isEligibleForBurst: true,
            };
          }
          return item;
        });
      });

      console.log("Star claimed successfully.");
    } catch (error) {
      setCount(0);
      console.log(error);
    }
  };

  const handleUpdateMythology = async () => {
    try {
      await updateMythology(mythologies[activeMyth], authToken);

      console.log("Mythology Updated successfully.");
    } catch (error) {
      setCount(0);
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

  const handlePlusMinon = (xvalue, yvalue) => {
    const x = xvalue;
    const y = yvalue;
    const newPlusOne = { x, y, id: Date.now() };
    setPlusMinion((prev) => [...prev, newPlusOne]);

    setTimeout(() => {
      setPlusMinion((prev) =>
        prev.filter((plusOne) => plusOne.id !== newPlusOne.id)
      );
    }, 1000);

    clearTimeout(timeoutId);
  };

  const handlePlusAutomata = (xvalue, yvalue) => {
    const x = xvalue;
    const y = yvalue;
    const newPlusOne = { x, y, id: Date.now() };
    setPlusAutomata((prev) => [...prev, newPlusOne]);

    setTimeout(() => {
      setPlusAutomata((prev) =>
        prev.filter((plusOne) => plusOne.id !== newPlusOne.id)
      );
    }, 1000);

    clearTimeout(timeoutId);
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
    const mythologyName = {
      mythologyName: mythologies[activeMyth],
    };
    try {
      const response = await claimShardsBooster(mythologyName, authToken);
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

  const handleGenerateCoolDown = (counter) => {
    if (counter === 0) {
      return 0;
    } else if (counter === 1) {
      return 10000;
    } else if (counter === 2) {
      return 10000;
    } else if (counter >= 3) {
      return 5000;
    } else {
      return 10000;
    }
  };

  const clearMinionTimeouts = () => {
    if (holdTimeoutId.current) {
      clearTimeout(holdTimeoutId.current);
      holdTimeoutId.current = null;
    }
    if (maxHoldTimeoutId.current) {
      clearTimeout(maxHoldTimeoutId.current);
      maxHoldTimeoutId.current = null;
    }
  };

  // generate random time in next 1 min
  const handleGeneratePopTime = (counter) => {
    const currTime = Date.now();
    const downTime = currTime + handleGenerateCoolDown(counter);

    // Generate a random time within the next 1 minute (60,000 ms)
    const randomOffset = Math.floor(Math.random() * 30000);
    const randomTime = downTime + randomOffset;
    return randomTime;
  };

  const closeMinion = () => {
    if (activeCard === "minion") {
      setActiveCard(`minion-down`);
    }
    setIsHolding(false);
    clearMinionTimeouts();
    setTimeout(() => {
      setActiveCard(null);
      setPopupStates((prev) => ({
        ...prev,
        popupTime: 0,
        counter: prev.counter + 1,
        isActive: false,
      }));
    }, 300);
  };

  // handle tapping
  const handleTap = async (e) => {
    e.preventDefault();
    if (mythStates[activeMyth].disabled) return;

    const { energy, shardslvl, currShards } = mythStates[activeMyth];
    const { counter, popupTime, isActive } = popupStates;

    if (energy > 0 && showBlackOrb !== 1) {
      if (platform !== "ios") {
        window.navigator.vibrate(25);
      }
      if (platform === "ios") {
        tele.HapticFeedback.impactOccurred("light");
      }
      handlePlusOneEffect(e);

      let reachedBlackOrb = false;
      const updatedMythStates = mythStates.map((myth, index) => {
        if (index === activeMyth) {
          let newShards = myth.shards + shardslvl * (isHolding ? 2 : 1);
          let newOrbs = myth.orbs;
          let newMinionTaps = myth.minionTaps;

          if (newShards >= 1000) {
            orbChangeEffect();
            newOrbs += Math.floor(newShards / 1000);
            newShards = newShards % 1000;
          }

          if (isHolding) {
            newMinionTaps += 1;
          }

          // Convert orbs to black orbs
          if (newOrbs >= 1000) {
            reachedBlackOrb = true;
            newOrbs = newOrbs % 1000;
          }

          return {
            ...myth,
            energy: Math.max(0, myth.energy - (isHolding ? 2 : 1)),
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
        // setMinimize(1);
        setShowBlackOrb(1);
        closeMinion();
        updateBlackOrbStatus();
        // setTimeout(() => {
        //   setIsStarHolding(false);
        //   setshowStarBoosters(2);
        //   setShowBlackOrb(2);
        //   setMinimize(2);
        //   handleUpdateStarStatus();
        // }, 10000);
      }

      // initial round
      if (currShards >= 10 && popupTime === 0 && !isActive && energy >= 150) {
        setPopupStates((prev) => ({
          ...prev,
          popupTime: handleGeneratePopTime(counter),
        }));
      } else if (currShards >= 10 && popupTime - Date.now() < 0 && !isActive) {
        // trigger initial timeout for 3s
        setPopupStates((prev) => ({
          ...prev,
          isActive: true,
        }));
        setActiveCard("minion");
        if (!holdTimeoutId.current) {
          // 1. Disappear after 3 seconds if not held
          holdTimeoutId.current = setTimeout(() => {
            if (!isHolding) {
              closeMinion();
            }
          }, 3000);
        }
      } else if (isActive) {
        if (!maxHoldTimeoutId.current && isHolding) {
          if (holdTimeoutId.current) {
            clearTimeout(holdTimeoutId.current);
            holdTimeoutId.current = null;
          }
          // 2. Should not stay more than 9 seconds if isHolding true
          maxHoldTimeoutId.current = setTimeout(() => {
            closeMinion();
          }, 5000);
        }
        // 3. Should disappear immediately if stopped holding within those 9 seconds
        if (!isHolding && maxHoldTimeoutId.current) {
          closeMinion();
        }
      }

      // After tap stop
      const newTimeoutId = setTimeout(async () => {
        if (activeCard === "minion") {
          setActiveCard(`minion-down`);
        }
        if (activeCard !== null) {
          setTimeout(() => {
            setActiveCard(null);
          }, 1000);
        }

        setMinimize(2);

        clearMinionTimeouts();
        setPopupStates((prev) => ({
          ...prev,
          popupTime: 0,
          counter: 0,
          sessionTaps: prev.sessionTaps + 0,
          isActive: false,
        }));

        setstartOrbGlow(false);
        setOrbGlow(false);
        setTapGlow(false);

        if (updatedMythStates[activeMyth].currShards > 10 || reachedBlackOrb) {
          handleUpdateTapData(sessionTaps);
        }
      }, 700);
      setTimeoutId(newTimeoutId);
    } else {
      setMinimize(2);
      setOrbGlow(false);
      setPopupStates((prev) => ({
        ...prev,
        popupTime: 0,
        counter: 0,
      }));
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

            if (newOrbs >= 1000) {
              newOrbs = newOrbs % 1000;
              handleUpdateMythology();
              setShowBlackOrb(1);
              // setTimeout(() => {
              //   setIsStarHolding(false);
              //   setshowStarBoosters(2);
              //   setShowBlackOrb(2);
              //   setMinimize(2);
              //   handleUpdateStarStatus();
              // }, 10000);
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
          isStarActive: mythStatesRef.current[index].isStarActive,
          isEligibleForBurst: mythStatesRef.current[index].isEligibleForBurst,
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

  // disable backbutton
  useEffect(() => {
    hideBackButton(tele);
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

  // disable backbutton
  useEffect(() => {
    hideBackButton(tele);
  }, []);

  // star hold
  useEffect(() => {
    let intervalId;

    if (isStarHolding === 1) {
      disableStarTimeout.current = setTimeout(() => {
        setIsStarHolding(2);
        setshowStarBoosters(2);
        setShowBlackOrb(2);
        setMinimize(2);
        handleUpdateStarStatus();
        if (disableStarTimeout.current) {
          clearTimeout(disableStarTimeout.current);
          disableStarTimeout.current = null;
        }
        setTimeout(() => {
          setShowBlackOrb(0);
          setshowStarBoosters(0);
        }, 500);
      }, 9000);
    }
    if (isStarHolding === 1) {
      intervalId = setInterval(() => {
        if (platform !== "ios") {
          window.navigator.vibrate(100);
        }
        if (platform === "ios") {
          tele.HapticFeedback.impactOccurred("light");
        }
        setCount((prev) => prev + 1);
        setMythStates((prevData) => {
          return prevData.map((item, index) => {
            let newShards = Math.floor(item.shards + 9.6);
            let newOrbs = 0;
            if (index === activeMyth) {
              if (newShards >= 1000) {
                orbChangeEffect();

                newOrbs += Math.floor(newShards / 1000);
                newShards = newShards % 1000;
              }
              if (!mythStates[activeMyth].isShardsClaimActive) {
                handlePlusMinon(50, 800);
              }
              if (mythStates[activeMyth].isAutomataActive) {
                handlePlusAutomata(300, 800);
              }
              return {
                ...item,

                shards: newShards,
                orbs: item.orbs + newOrbs,
              };
            }
            return item;
          });
        });
      }, 100);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isStarHolding]);

  // Sync the ref with the state
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (mythStates[activeMyth]?.isStarActive) {
      setShowBlackOrb(1);
      setIsStarHolding(0);
    } else {
      setShowBlackOrb(0);
      setIsStarHolding(0);
    }
  }, [activeMyth]);

  useEffect(() => {
    if (showBooster) {
      setShowCard(showBooster);
    }

    if (showGlow) {
      setTimeout(() => {
        setGlowBooster(() => {
          if (showGlow === "automata") {
            return 2;
          } else {
            return 1;
          }
        });
        setTimeout(() => {
          setGlowBooster(0);
          setShowGlow(null);
        }, 2000);
      }, 1000);
    }
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
                platform={platform}
                orbGlow={orbGlow}
                tapGlow={tapGlow}
                showBlackOrb={showBlackOrb}
                glowBooster={glowBooster}
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
              minimize={minimize}
              glowBooster={glowBooster}
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
          {showBlackOrb > 0 && (
            <div className="flex flex-col bottom-[12%] w-full justify-center items-center absolute z-10">
              <div
                className={`bg-white  ${
                  isStarHolding ? "w-[20vw]" : "w-[14vw]"
                } glow-box-${mythSections[activeMyth]}  ${
                  isStarHolding === 1 && "star-beam-active"
                } ${isStarHolding === 2 && "star-beam-inactive"} -mb-5`}
              ></div>
              <div className="relative">
                <Star
                  onTouchStart={() => {
                    setMinimize(1);
                    setIsStarHolding(1);
                    setshowStarBoosters(1);
                  }}
                  onTouchEnd={() => {
                    setIsStarHolding(2);
                    setshowStarBoosters(2);
                  }}
                  size={"18vw"}
                  fill={"white"}
                  color={"white"}
                  className={`glow-star-${
                    mythSections[activeMyth]
                  } duration-500 transition-all ${
                    showBlackOrb === 1 && "maximize-star"
                  } ${showBlackOrb === 2 && "minimize-star"} ${
                    isStarHolding === 1 ? "scale-150" : "scale-100"
                  }`}
                />
                {showStarHand && (
                  <div className="font-symbols scale-point z-10 mx-auto my-auto absolute -mt-20 text-white text-[100px] text-black-contour">
                    T
                  </div>
                )}
              </div>
            </div>
          )}
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
          {showStarBoosters != 0 && (
            <div>
              <div
                className={`absolute  ${showStarBoosters === 2 && "popdown"} ${
                  showStarBoosters === 1 && "popup"
                } bottom-0 select-none left-0 -mb-2.5 minion-button`}
              >
                <div className="relative">
                  <img
                    src="/assets/cards/160px-minion.png"
                    alt="dwarf"
                    className="w-full h-full select-none pointer-events-none "
                  />
                </div>
              </div>
              {plusMinion.map((plusOne) => (
                <span
                  key={plusOne.id}
                  className={`plus-one glow-text-${mythSections[activeMyth]}`}
                  style={{
                    top: `${plusOne.y}px`,
                    left: `${plusOne.x}px`,

                    zIndex: 99,
                  }}
                >
                  +{mythStates[activeMyth].shardslvl * (isStarHolding ? 2 : 1)}
                </span>
              ))}
              <div
                className={`absolute  ${showStarBoosters === 2 && "popdown"} ${
                  showStarBoosters === 1 && "popup"
                } bottom-0 select-none right-0 -mb-2.5 minion-button`}
              >
                <div className="relative">
                  <img
                    src="/assets/cards/160px-automata.png"
                    alt="dwarf"
                    className="w-full h-full select-none pointer-events-none "
                  />
                </div>
              </div>
              {plusAutomata.map((plusOne) => (
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
                  {mythStates[activeMyth].automatalvl * (isStarHolding ? 2 : 1)}
                </span>
              ))}
            </div>
          )}
          {(activeCard === "minion" || activeCard === "minion-down") && (
            <div
              onTouchStart={() => {
                if (mythStates[activeMyth].isShardsClaimActive) {
                  setShowCard("minion");
                  if (platform !== "ios") {
                    window.navigator.vibrate(500);
                  }
                  if (platform === "ios") {
                    tele.HapticFeedback.impactOccurred("light");
                  }
                } else {
                  if (activeCard === "minion") {
                    setIsHolding(true);
                    if (platform !== "ios") {
                      window.navigator.vibrate(1000);
                    }
                    if (platform === "ios") {
                      tele.HapticFeedback.impactOccurred("light");
                    }
                  }
                }
              }}
              onTouchEnd={() => setIsHolding(false)}
              className={`absolute  ${
                activeCard === "minion-down" && "popdown"
              } ${activeCard === "minion" && "popup"} bottom-0 ${
                mythStates[activeMyth].isShardsClaimActive && "grayscale"
              } select-none left-0 -mb-2.5 minion-button`}
            >
              <div className="relative">
                <img
                  src="/assets/cards/160px-minion.png"
                  alt="dwarf"
                  className="w-full h-full select-none pointer-events-none "
                />
              </div>
            </div>
          )}
          {(showCard === "automata" || showCard === "minion") && (
            <BoosterClaim
              activeCard={showCard}
              activeMyth={activeMyth}
              mythData={mythStates[activeMyth]}
              disableIcon={showBooster}
              closeCard={() => setShowCard(null)}
              Button={
                showBooster ? (
                  <Button
                    message={"claim"}
                    handleClick={() => {
                      tele.HapticFeedback.notificationOccurred("success");
                      setGlowBooster(() => {
                        if (showCard === "automata") {
                          return 2;
                        } else {
                          return 1;
                        }
                      });
                      setTimeout(() => {
                        setGlowBooster(0);
                      }, 2000);
                      setShowCard(null);
                      setShowBooster(null);
                    }}
                    activeMyth={activeMyth}
                  />
                ) : (
                  <BoosterButtom
                    activeCard={showCard}
                    mythData={mythStates[activeMyth]}
                    handleClaim={handleClaimShards}
                    activeMyth={activeMyth}
                    t={t}
                  />
                )
              }
            />
          )}
          {enableGuide && (
            <ForgesGuide
              handleClick={() => {
                setEnableGuide(false);
              }}
            />
          )}
          {(showBooster === "mythOrb" || showBooster === "blackOrb") && (
            <MilestoneCard
              t={t}
              isMulti={false}
              isOrb={true}
              isBlack={showBooster === "blackOrb"}
              activeMyth={activeMyth}
              isForge={showBooster}
              closeCard={() => {
                tele.HapticFeedback.notificationOccurred("success");
                setShowBooster(null);
              }}
              handleClick={() => {
                tele.HapticFeedback.notificationOccurred("success");
                setShowBooster(null);

                setGlowBooster(3);
                setTimeout(() => {
                  setGlowBooster(0);
                }, 2000);
              }}
            />
          )}

          <div className="absolute">
            <ReactHowler
              src="/assets/audio/fof.forges.background01.wav"
              playing={
                !JSON.parse(localStorage.getItem("sound")) && activeMyth < 4
              }
              preload={true}
              loop
            />
            {(isHolding || isStarHolding) && (
              <ReactHowler
                src="/assets/audio/fof.minion.grunt.short.wav"
                playing={
                  !JSON.parse(localStorage.getItem("sound")) && activeMyth < 4
                }
                preload={true}
              />
            )}
            {isStarHolding && (
              <ReactHowler
                src="/assets/audio/fof.automata.pulse.short.wav"
                playing={
                  !JSON.parse(localStorage.getItem("sound")) && activeMyth < 4
                }
                preload={true}
              />
            )}
          </div>
        </div>
      ) : (
        <Convert />
      )}
    </>
  );
};

export default Forges;

{
  /* <div
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
              </div> */
}
