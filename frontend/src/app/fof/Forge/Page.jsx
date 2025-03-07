import React, { useContext, useEffect, useRef, useState } from "react";
import { FofContext } from "../../../context/context";
import {
  claimBurst,
  claimRatUpdate,
  claimShardsBooster,
  startTapSession,
  updateFinishStatus,
  updateGameData,
  updateMythology,
} from "../../../utils/api.fof";
import { useTranslation } from "react-i18next";
import { mythologies, mythSections } from "../../../utils/constants.fof";
import {
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import Button from "../../../components/Buttons/DefaultBtn";
import GameHeader from "./BoosterBar";
import ReactHowler from "react-howler";
import BoosterClaim from "../../../components/Cards/Boosters/BoosterCrd";
import BoosterButtom from "../../../components/Buttons/BoosterBtn";
import { showToast } from "../../../components/Toast/Toast";
import { ForgesGuide } from "../../../components/Common/Tutorials";
import { useForgeGuide } from "../../../hooks/Tutorial";
import {
  getPhaseByDate,
  handleGeneratePopTime,
} from "../../../helpers/game.helper";
import ForgeHeader from "./Header";
import gsap from "gsap";
import { trackComponentView, trackEvent } from "../../../utils/ga";
import {
  handleClickHaptic,
  handleTapHaptic,
} from "../../../helpers/cookie.helper";
import confetti from "canvas-confetti";
import { getStreakMultipier } from "../../../helpers/streak.helper";

const tele = window.Telegram?.WebApp;

const Forges = () => {
  const { t } = useTranslation();
  const {
    activeMyth,
    setActiveMyth,
    gameData,
    setGameData,
    showBooster,
    setShowBooster,
    platform,
    authToken,
    setSection,
    rewards,
    setRewards,
    setActiveReward,
    setRewardsClaimedInLastHr,
    rewardsClaimedInLastHr,
    enableSound,
    minimize,
    setMinimize,
    setShowCard,
    assets,
    setTriggerConf,
    enableHaptic,
    userData,
    setUserData,
    isTelegram,
  } = useContext(FofContext);
  const streakMultpier = (boosterName) => {
    if (userData.streak?.streakCount && userData.streak?.lastMythClaimed) {
      const multiplier = getStreakMultipier(
        boosterName,
        userData.streak.streakCount,
        userData.streak.lastMythClaimed === mythologies[activeMyth]
      );
      return multiplier;
    }

    return 1;
  };

  const initialState = gameData.mythologies.map((myth) => {
    return {
      orbs: myth.orbs,
      shards: myth.shards,
      minionTaps: 0,
      energy: myth.energy,
      energyLimit: myth.energyLimit,
      currShards: 0,
      burstlvl: myth.boosters.burstlvl,
      shardslvl: myth.boosters.shardslvl,
      automatalvl: myth.boosters.automatalvl,
      isShardsClaimActive: myth.boosters.isShardsClaimActive,
      automataStartTime: myth.boosters.automataStartTime,
      isAutomataActive: myth.boosters.isAutomataActive,
      ratCount: myth.boosters.rats.count,
      shardsLastClaimedAt: myth.boosters.shardsLastClaimedAt,
      isBurstActive: myth.boosters.isBurstActive,
      isEligibleForBurst: myth.isEligibleForBurst,
      disabled: false,
    };
  });
  const [mythStates, setMythStates] = useState(initialState);

  const [showBlackOrb, setShowBlackOrb] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [popupStates, setPopupStates] = useState({
    isActive: false,
    counter: 0,
    popupTime: 0,
    sessionTaps: 0,
  });
  const [minimizeToggle, setMinimizeToggle] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [startOrbGlow, setstartOrbGlow] = useState(false);
  const [orbGlow, setOrbGlow] = useState(false);
  const [tapGlow, setTapGlow] = useState(false);
  const [showRat, setShowRat] = useState(false);
  const [showRatEffect, setShowRatEffect] = useState(0);
  const [ratEffectToggle, setRatEffectToggle] = useState(false);
  const [glowReward, setGlowReward] = useState(false);
  const [glowSymbol, setGlowSymbol] = useState(false);
  const [glowShards, setGlowShards] = useState(false);
  const [glowBooster, setGlowBooster] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const { orbs, shards } = mythStates[activeMyth >= 4 ? 0 : activeMyth];
  const [plusOnes, setPlusOnes] = useState([]);
  const [plusMinion, setPlusMinion] = useState([]);
  const [plusAutomata, setPlusAutomata] = useState([]);
  const [isHolding, setIsHolding] = useState(false);
  const [isStarHolding, setIsStarHolding] = useState(0);
  const [showStarBoosters, setshowStarBoosters] = useState(false);
  const [randomReward, setRandomReward] = useState(null);
  const [showToggles, setShowToggles] = useState(false);
  const [enableGuide, setEnableGuide] = useForgeGuide("tutorial01");
  const [currGuide, setCurrGuide] = useState(0);
  const [minionPosition, setMinionPosition] = useState(true);
  const [showPartner, setShowPartner] = useState(false);
  const [count, setCount] = useState(0);
  const timeoutRef = useRef(null);
  const holdTimeoutId = useRef(null);
  const maxHoldTimeoutId = useRef(null);
  const mythStatesRef = useRef(mythStates);
  const countRef = useRef(count);
  const disableStarTimeout = useRef(null);
  const ballRef = useRef(null);
  const isStarHold = useRef(false);
  const isMinionHold = useRef(false);
  const direction = useRef({ x: 1, y: 1 });
  const autoCloseTimeoutId = useRef(null);
  const [holdTime, setHoldTime] = useState({
    holdStartTime: 0,
    holdEndTime: 0,
  });

  const orbChangeEffect = () => {
    const timeoutIds = [];

    setGlowShards(true);
    timeoutIds.push(
      setTimeout(() => {
        setGlowShards(false);
        timeoutIds.push(
          setTimeout(() => {
            setGlowReward(true);
            timeoutIds.push(
              setTimeout(() => {
                setGlowReward(false);
                timeoutIds.push(
                  setTimeout(() => {
                    setGlowSymbol(true);
                    timeoutIds.push(
                      setTimeout(() => {
                        setGlowSymbol(false);
                      }, 300)
                    );
                  }, 250)
                );
              }, 500)
            );
          }, 250)
        );
      }, 300)
    );

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  };

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
    if (mythStates[activeMyth].disabled) return;

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
  const handleUpdateTapData = async (holdDuration) => {
    const sessionShards =
      mythStates[activeMyth].shards === 999 ||
      mythStates[activeMyth].shards === 998
        ? mythStates[activeMyth].currShards + 1
        : mythStates[activeMyth].currShards;
    let bubbleSession = null;

    if (holdDuration) {
      bubbleSession = {
        partnerId: randomReward.id,
        type: randomReward.partnerType,
        holdDuration: holdDuration,
        lastClaimedAt: Date.now(),
      };
    }

    try {
      await updateGameData(
        {
          bubbleSession: bubbleSession,
          minionTaps: mythStates[activeMyth].minionTaps / 2,
          taps: sessionShards,
          mythologyName: mythologies[activeMyth],
        },
        authToken
      );
      trackEvent("action", "tap_session", "success");

      setRandomReward(null);

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
      setRandomReward(null);

      console.log(error);
    }
  };

  const handleUpdateStarStatus = async () => {
    setCount(0);
    setIsStarHolding(0);
    try {
      await claimBurst(
        {
          session: countRef.current,
          mythologyName: mythologies[activeMyth],
        },
        authToken
      );
      trackEvent("action", "star_captured", "success");
      setMythStates((prevState) => {
        return prevState.map((item, index) => {
          if (index === activeMyth) {
            return {
              ...item,
              isBurstActive: false,
              isEligibleForBurst: true,
            };
          }
          return item;
        });
      });
      console.log("Star claimed successfully.");
    } catch (error) {
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
      trackEvent("purchase", "claim_alchemist", "success");
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
      showToast("booster_success");
    } catch (error) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("booster_error");
    }
  };

  // update black orbs
  const updateBlackOrbStatus = () => {
    const currPhase = getPhaseByDate(new Date());
    let blackOrbPhaseBonus = 1;

    if (currPhase === 4) {
      blackOrbPhaseBonus += 1;
    }
    setGameData((prev) => ({
      ...prev,
      blackOrbs: prev.blackOrbs + blackOrbPhaseBonus,
    }));
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

  const closeMinion = () => {
    if (activeCard === "minion") {
      setActiveCard(`minion-down`);
    }
    isMinionHold.current = false;
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
      setMinionPosition(true);
    }, 500);
  };

  const handleClaimRat = async (status) => {
    try {
      await claimRatUpdate(
        {
          mythologyName: mythologies[activeMyth],
          deduct: status,
        },
        authToken
      );
      setGameData((prevData) => {
        const updatedData = {
          ...prevData,
          mythologies: prevData.mythologies.map((item) =>
            item.name === mythologies[activeMyth]
              ? {
                  ...item,
                  boosters: {
                    ...item.boosters,
                    rats: {
                      ...item.boosters.rats,
                      count: item.boosters.rats.count - 1,
                      automatalvl: item.boosters.automatalvl - 1,
                    },
                  },
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
              ratCount: item.ratCount - 1,
              automatalvl: status ? item.automatalvl - 1 : item.automatalvl,
            };
          }
          return item;
        });
      });

      if (status) {
        setShowRatEffect(1);
        setTimeout(() => {
          handlePlusAutomata(290, 800);
        }, 500);
        setTimeout(() => {
          setShowRatEffect(2);
          setTimeout(() => {
            setShowRatEffect(0);
          }, 500);
        }, 4000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeRat = (status) => {
    if (activeCard === "rat") {
      setActiveCard(`rat-down`);
    }

    handleClaimRat(status);
    setIsHolding(false);
    clearMinionTimeouts();
    setTimeout(() => {
      setActiveCard(null);
      setShowRat(false);
    }, 500);
    if (maxHoldTimeoutId.current) {
      clearTimeout(maxHoldTimeoutId.current);
      maxHoldTimeoutId.current = null;
    }
    if (holdTimeoutId.current) {
      clearTimeout(holdTimeoutId.current);
      holdTimeoutId.current = null;
    }
  };

  const storeBubbleLastClaimedTime = () => {
    const currentTime = Date.now();

    localStorage.setItem("bubbleLastClaimed", currentTime.toString());
  };

  const getBubbleLastClaimedTime = () => {
    const lastClaimed = localStorage.getItem("bubbleLastClaimed");
    return lastClaimed ? parseInt(lastClaimed, 10) : null;
  };

  // handle tapping
  const handleTap = async (e) => {
    e.preventDefault();

    if (mythStates[activeMyth].disabled || showBubble) return;

    if (autoCloseTimeoutId.current) {
      clearTimeout(autoCloseTimeoutId.current);
      autoCloseTimeoutId.current = null;
    }

    const { energy, shardslvl, currShards, ratCount } = mythStates[activeMyth];

    const { counter, popupTime, isActive } = popupStates;

    const lastBubbleClaimedTime = getBubbleLastClaimedTime();
    const bubbleCooldown = 2 * 30 * 1000;
    const canShowBubble =
      !lastBubbleClaimedTime ||
      Date.now() - lastBubbleClaimedTime >= bubbleCooldown;

    let disableSubmit = false;

    if (energy > 0 && !isStarHolding) {
      handleTapHaptic(tele, platform, enableHaptic, 25);

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
        setShowBlackOrb(1);
        closeMinion();
        updateBlackOrbStatus();
      }

      if (
        currShards >= 10 &&
        popupTime === 0 &&
        (!isActive || !showRat) &&
        energy >= 150
      ) {
        setPopupStates((prev) => ({
          ...prev,
          popupTime: handleGeneratePopTime(counter),
        }));

        const randomPosArray = [true, false];
        const randomPos = randomPosArray[Math.floor(Math.random() * 2)];

        setMinionPosition(randomPos);
      } else if (
        currShards >= 10 &&
        popupTime - Date.now() < 0 &&
        !isActive &&
        !showRat
      ) {
        const filteredRewards = rewards.filter(
          (reward) =>
            !rewardsClaimedInLastHr.includes(reward.id) &&
            reward.tokensCollected < 12
        );

        if (canShowBubble && filteredRewards.length > 0 && counter === 1) {
          const randomIndex = Math.floor(
            Math.random() * filteredRewards.length
          );
          const randomReward = filteredRewards[randomIndex];
          setRandomReward(randomReward);
          disableSubmit = true;
          setShowBubble(true);
          setShowPartner(true);
          storeBubbleLastClaimedTime();
          setPopupStates((prev) => ({
            ...prev,
            popupTime: 0,
            counter: prev.counter + 1,
            isActive: false,
          }));
        } else if (
          ratCount > 0 &&
          mythStates[activeMyth].isAutomataActive &&
          counter % 2 !== 0 &&
          !showRat
        ) {
          setShowRat(true);
          setPopupStates((prev) => ({
            ...prev,
            popupTime: 0,
            counter: prev.counter + 1,
            isActive: false,
          }));
          setActiveCard("rat");
          if (!holdTimeoutId.current) {
            // Disappear after 3 seconds if not held
            holdTimeoutId.current = setTimeout(() => {
              if (!isHolding) {
                setActiveCard(`rat-down`);
                closeRat(true);
              }
            }, 3000);
          }
        } else {
          setPopupStates((prev) => ({
            ...prev,
            isActive: true,
          }));
          setActiveCard("minion");
          if (!holdTimeoutId.current) {
            // Disappear after 3 seconds if not held
            holdTimeoutId.current = setTimeout(() => {
              if (!isHolding) {
                setActiveCard(`minion-down`);
                closeMinion();
              }
            }, 3000);
          }
        }
      } else if (showRat) {
        if (isHolding) {
          if (holdTimeoutId.current) {
            clearTimeout(holdTimeoutId.current);
            holdTimeoutId.current = null;
          }

          if (!maxHoldTimeoutId.current) {
            maxHoldTimeoutId.current = setTimeout(() => {
              closeRat(false);
            }, 3000);
          }
        } else {
          if (maxHoldTimeoutId.current) {
            clearTimeout(maxHoldTimeoutId.current);
            maxHoldTimeoutId.current = null;
          }
        }
      } else if (isActive) {
        if (!maxHoldTimeoutId.current && isHolding) {
          trackEvent("action", "alchemist_captured", "success");
          if (holdTimeoutId.current) {
            clearTimeout(holdTimeoutId.current);
            holdTimeoutId.current = null;
          }
          maxHoldTimeoutId.current = setTimeout(() => {
            closeMinion();
          }, 5000);
        }
        if (!isHolding && maxHoldTimeoutId.current) {
          closeMinion();
        }
      }

      if (!disableSubmit) {
        const newTimeoutId = setTimeout(async () => {
          if (activeCard === "minion") {
            setActiveCard(`minion-down`);
          }
          if (activeCard !== null) {
            setTimeout(() => {
              setActiveCard(null);
            }, 300);
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

          if (
            updatedMythStates[activeMyth].currShards > 10 ||
            reachedBlackOrb
          ) {
            handleUpdateTapData();
          }
        }, 700);
        setTimeoutId(newTimeoutId);
      }
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
            let burstActive = newState[index].isBurstActive;

            // Logic to convert shards to orbs
            if (newShards >= 1000) {
              if (activeMyth == index) {
                orbChangeEffect();
              }

              newOrbs += Math.floor(newShards / 1000);
              newShards = newShards % 1000;
            }

            if (newOrbs >= 1000) {
              newOrbs = newOrbs % 1000;
              burstActive = true;
              handleUpdateMythology();
              updateBlackOrbStatus();
            }

            newState[index] = {
              ...newState[index],
              shards: newShards,
              orbs: newOrbs,
              isBurstActive: burstActive,
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

  const triggerConfetti = () => {
    var duration = 10 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 20, spread: 180, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 120 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 500);
  };

  useEffect(() => {
    if (!userData) return;

    setMythStates((prevState) =>
      prevState.map((myth, index) => ({
        ...myth,
        burstlvl: myth.burstlvl * streakMultpier("burst"),
        shardslvl: myth.shardslvl * streakMultpier("alchemist"),
        automatalvl: myth.automatalvl * streakMultpier("automata"),
      }))
    );
  }, [userData, activeMyth]);

  const handleUpdateFinishedGame = async () => {
    try {
      triggerConfetti();
      await updateFinishStatus(authToken);
      setUserData((prev) => ({
        ...prev,
        showFinishRwrd: false,
      }));
    } catch (error) {
      showToast("default");
    }
  };

  // persist states for diff myths
  useEffect(() => {
    mythStatesRef.current = mythStates;
  }, [mythStates]);

  useEffect(() => {
    if (userData.showFinishRwrd) {
      handleUpdateFinishedGame();
    }
    // ga
    trackComponentView("forge");
    // triggerToggles
    setTimeout(() => {
      setMinimizeToggle(true);
      setShowToggles(true);
    }, 300);

    setTimeout(() => {
      setGlowBooster(() => {
        if (showBooster === "automata") {
          return 2;
        } else if (showBooster === "minion") {
          return 1;
        } else if (showBooster === "mythOrb") {
          return 3;
        }
      });
      setTimeout(() => {
        setGlowBooster(0);
        setShowBooster(null);
      }, 500);
    }, 1000);

    // handle increment energy every second
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
    return () => {
      clearInterval(interval);
      setMinimize(0);

      // update global context states
      setGameData((prevData) => {
        const newMythologies = prevData.mythologies.map((myth, index) => ({
          ...myth,
          orbs: mythStatesRef.current[index].orbs,
          shards: mythStatesRef.current[index].shards,
          energy: mythStatesRef.current[index].energy,
          boosters: {
            ...myth.boosters,
            isBurstActive: mythStatesRef.current[index].isBurstActive,
          },
          isEligibleForBurst: mythStatesRef.current[index].isEligibleForBurst,
        }));

        return {
          ...prevData,
          mythologies: newMythologies,
        };
      });
    };
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
        setOrbGlow(false);
        setTapGlow(false);
        handleUpdateStarStatus();
        if (disableStarTimeout.current) {
          clearTimeout(disableStarTimeout.current);
          disableStarTimeout.current = null;
        }
        setTimeout(() => {
          setShowBlackOrb(0);
          setshowStarBoosters(0);
          isStarHold.current = false;
          setIsStarHolding(0);
        }, 500);
      }, 9000);
    }
    if (isStarHolding === 1) {
      const orbIntervalId = setInterval(() => {
        setMythStates((prevData) => {
          return prevData.map((item, index) => {
            if (index === activeMyth) {
              return {
                ...item,
                orbs: item.orbs + mythStates[activeMyth].burstlvl + 1,
              };
            }
            return item;
          });
        });
      }, 1000);

      const actionIntervalId = setInterval(() => {
        handleTapHaptic(tele, platform, enableHaptic, 100);

        setCount((prev) => prev + 1);
        handlePlusMinon(70, 800);
        handlePlusAutomata(290, 800);
      }, 100);

      return () => {
        clearInterval(orbIntervalId);
        clearInterval(actionIntervalId);
      };
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
    if (mythStates[activeMyth]?.isBurstActive) {
      setShowBlackOrb(1);
      setIsStarHolding(0);
    } else {
      setShowBlackOrb(0);
      setIsStarHolding(0);
    }
  }, [activeMyth]);

  const handleSubmitSessionData = (holdDuration) => {
    if (activeCard === "minion") {
      setActiveCard(`minion-down`);
    }
    if (activeCard !== null) {
      setTimeout(() => {
        setActiveCard(null);
      }, 300);
    }

    setRewardsClaimedInLastHr((prev) => [...prev, randomReward.id]);
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

    if (mythStates[activeMyth].currShards > 10) {
      handleUpdateTapData(holdDuration);
    }
  };

  useEffect(() => {
    if (showPartner) {
      const ball = ballRef.current;
      const parent = ball.parentNode;

      const parentRect = parent.getBoundingClientRect();
      const ballRect = ball.getBoundingClientRect();

      // Randomize from which corner the ball appears
      const getRandomCornerPosition = () => {
        const positions = [
          { x: 0, y: 0 }, // Top-left
          { x: parentRect.width - ballRect.width, y: 0 }, // Top-right
          { x: 0, y: parentRect.height - ballRect.height }, // Bottom-left
          {
            x: parentRect.width - ballRect.width,
            y: parentRect.height - ballRect.height,
          }, // Bottom-right
        ];
        return positions[Math.floor(Math.random() * positions.length)];
      };

      const initialPosition = getRandomCornerPosition();

      // Set the initial random position from one of the corners
      gsap.set(ball, {
        x: initialPosition.x,
        y: initialPosition.y,
      });

      const getRandomDirection = () => {
        const angle = Math.random() * 2 * Math.PI;
        return { x: Math.cos(angle), y: Math.sin(angle) };
      };

      const clampPosition = (pos, min, max) => {
        return Math.min(Math.max(pos, min), max);
      };

      const updateDirection = (position) => {
        if (
          position.x <= 0 ||
          position.x >= parentRect.width - ballRect.width
        ) {
          direction.current = getRandomDirection();
        }
        if (
          position.y <= 0 ||
          position.y >= parentRect.height - ballRect.height
        ) {
          direction.current = getRandomDirection();
        }
      };

      const animateBall = () => {
        const ballCurrentX = gsap.getProperty(ball, "x");
        const ballCurrentY = gsap.getProperty(ball, "y");
        const speed = 10;

        let newPosX = ballCurrentX + speed * direction.current.x;
        let newPosY = ballCurrentY + speed * direction.current.y;

        newPosX = clampPosition(newPosX, 0, parentRect.width - ballRect.width);
        newPosY = clampPosition(
          newPosY,
          0,
          parentRect.height - ballRect.height
        );

        updateDirection({ x: newPosX, y: newPosY });

        gsap.set(ball, { x: newPosX, y: newPosY });
        animationFrameId.current = requestAnimationFrame(animateBall);
      };

      let animationFrameId = { current: null };
      direction.current = getRandomDirection();
      animateBall();

      // Stop animation after 6 seconds
      const timeoutId = setTimeout(() => {
        setShowBubble(false);
        setShowPartner(false);
        autoCloseTimeoutId.current = setTimeout(() => {
          handleSubmitSessionData();
        }, 1500);
        cancelAnimationFrame(animationFrameId.current);
      }, 9000);

      let holdTimeoutId;

      const stopAnimationAndScale = () => {
        handleTapHaptic(tele, platform, enableHaptic, 1000);
        cancelAnimationFrame(animationFrameId.current);
        gsap.to(ball, { scale: 1.5, duration: 0.2 });

        // Start hold timeout (1 second)
        holdTimeoutId = setTimeout(() => {
          setHoldTime((prev) => ({ ...prev, holdEndTime: Date.now() }));
          const holdDuration = (Date.now() - holdTime.holdStartTime) / 1000;
          if (holdDuration >= 2) {
            setShowPartner(false);
            setActiveReward(randomReward);
            const incrementedReward = {
              ...randomReward,
              tokensCollected: randomReward.tokensCollected + 1,
            };

            const updatedRewards = rewards.map((reward) => {
              if (reward.id === randomReward.id) {
                if (reward.tokensCollected + 1 === 12) {
                  setTriggerConf(true);
                }
                return {
                  ...reward,
                  tokensCollected: reward.tokensCollected + 1,
                };
              }
              return reward;
            });
            trackEvent("action", "bubble_captured", "success");
            setRewards(updatedRewards);
            setActiveReward(incrementedReward);
            setSection(6);
            handleSubmitSessionData(holdDuration);
          } else {
            resumeAnimationAndResetScale();
          }
        }, 2000);
      };

      const resumeAnimationAndResetScale = () => {
        // Clear the hold timeout if released before 1 second
        clearTimeout(holdTimeoutId);
        // Reset the ball scale
        gsap.to(ball, { scale: 1, duration: 0.2 });

        // Resume the ball animation
        animateBall();
      };

      // Add event listeners for holding the ball
      ball.addEventListener("mousedown", stopAnimationAndScale);
      ball.addEventListener("mouseup", resumeAnimationAndResetScale);
      ball.addEventListener("touchstart", stopAnimationAndScale);
      ball.addEventListener("touchend", resumeAnimationAndResetScale);

      return () => {
        clearTimeout(timeoutId);
        cancelAnimationFrame(animationFrameId.current);
        gsap.killTweensOf(ball);

        // Clean up event listeners
        ball.removeEventListener("mousedown", stopAnimationAndScale);
        ball.removeEventListener("mouseup", resumeAnimationAndResetScale);
        ball.removeEventListener("touchstart", stopAnimationAndScale);
        ball.removeEventListener("touchend", resumeAnimationAndResetScale);

        // Clean up the hold timeout
        clearTimeout(holdTimeoutId);
      };
    }
  }, [showPartner]);

  useEffect(() => {
    if (enableGuide) {
      setShowCard(
        <ForgesGuide
          currTut={currGuide}
          Header={
            <ForgeHeader
              showTut={currGuide}
              activeMyth={activeMyth}
              t={t}
              starIsHeld={isStarHolding === 1}
              minimize={minimize}
              platform={platform}
              orbGlow={orbGlow}
              tapGlow={tapGlow}
              showBlackOrb={showBlackOrb}
              glowBooster={glowBooster}
              glowShards={glowShards}
              glowReward={glowReward}
              glowSymbol={glowSymbol}
              orbs={orbs}
              mythData={mythStates[activeMyth]}
              shards={mythStates[activeMyth].shards}
            />
          }
          Toggles={
            <>
              <ToggleRight
                handleClick={() => {
                  setActiveMyth((prev) => (prev + 1) % 4);
                }}
                activeMyth={activeMyth}
              />
              <ToggleLeft
                handleClick={() => {
                  setActiveMyth((prev) => (prev - 1 + 4) % 4);
                }}
                activeMyth={activeMyth}
              />
            </>
          }
          handleClick={() => {
            if (currGuide < 4) {
              setCurrGuide((prev) => prev + 1);
            } else {
              setEnableGuide(false);
              setShowCard(null);
            }
          }}
        />
      );
    }
  }, [enableGuide, currGuide]);

  useEffect(() => {
    let intervalId;
    if (showRatEffect === 0) {
      intervalId = setInterval(() => {
        setRatEffectToggle((prev) => !prev);
      }, 500);
    } else {
      clearInterval(intervalId);
    }
  }, [showRatEffect]);

  useEffect(() => {
    handlePlusAutomata(290, 800);
  }, [activeMyth]);

  return (
    <>
      <div
        style={{
          top: 0,
          left: 0,
          width: "100vw",
        }}
        className={`flex ${
          isTelegram ? "tg-container-height" : "browser-container-height"
        } flex-col overflow-hidden m-0`}
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
          className="background-wrapper transition-all duration-500"
        >
          <div
            className={`absolute top-0 left-0 h-full w-full filter-orbs-${mythSections[activeMyth]}`}
            style={{
              backgroundImage: `url(${assets.uxui.forgebg})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "44% 0%",
            }}
          />
        </div>
        <ForgeHeader
          activeMyth={activeMyth}
          t={t}
          starIsHeld={isStarHolding === 1}
          minimize={minimize}
          platform={platform}
          orbGlow={orbGlow}
          tapGlow={tapGlow}
          showBlackOrb={showBlackOrb}
          glowBooster={glowBooster}
          glowShards={glowShards}
          glowReward={glowReward}
          glowSymbol={glowSymbol}
          orbs={orbs}
          mythData={mythStates[activeMyth]}
          shards={mythStates[activeMyth].shards}
        />
        {/* Taping region */}
        <div className="flex relative flex-grow justify-center items-center">
          {/* Header Stats */}
          <GameHeader
            orbs={orbs}
            shards={shards}
            activeMyth={activeMyth}
            mythStates={mythStates}
            minimize={activeCard === "minion"}
            maximize={activeCard === "minion-down"}
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
                className={`plus-one glow-text-${mythSections[activeMyth]} `}
                style={{
                  top: `${plusOne.y}px`,
                  left: `${plusOne.x}px`,

                  zIndex: 99,
                }}
              >
                +{mythStates[activeMyth].shardslvl}
                {/* {mythStates[activeMyth].shardslvl *
                  (isHolding && activeCard === "minion" ? 2 : 1)} */}
              </span>
            ))}
            <div className="flex justify-center items-center h-[450px] w-full rounded-full"></div>
          </div>
          {showPartner && (
            <div className="h-[155vw] -mt-8 w-full absolute">
              <div ref={ballRef} className="h-20 w-20 shadow-2xl rounded-full">
                <div className="bubble-spin-effect">
                  <img
                    src={
                      randomReward.partnerType == "playsuper"
                        ? `${randomReward.metadata.campaignCoverImage}`
                        : `https://media.publit.io/file/BattleofGods/FoF/Assets/PARTNERS/160px-${randomReward.metadata.campaignCoverImage}.bubble.png`
                    }
                    alt="icon"
                    className="pointer-events-none h-20 w-20 rounded-full bg-white z-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Toggles */}
        {showToggles && (
          <>
            <ToggleRight
              handleClick={() => {
                setActiveMyth((prev) => (prev + 1) % 4);
              }}
              activeMyth={activeMyth}
              minimize={minimize === 0 && minimizeToggle ? 2 : minimize}
            />
            <ToggleLeft
              handleClick={() => {
                setActiveMyth((prev) => (prev - 1 + 4) % 4);
              }}
              activeMyth={activeMyth}
              minimize={minimize === 0 && minimizeToggle ? 2 : minimize}
            />
          </>
        )}

        {showBlackOrb > 0 && (
          <div className="flex flex-col bottom-[12%] w-full justify-center items-center absolute z-10">
            <div
              className={`bg-white  ${
                isStarHolding ? "w-[24vw]" : "w-[14vw]"
              } glow-box-${mythSections[activeMyth]}  ${
                isStarHolding === 1 && "star-beam-active"
              } ${isStarHolding === 2 && "star-beam-inactive"} -mb-8`}
            ></div>
            <div
              onTouchStart={() => {
                setMinimize(1);
                setIsStarHolding(1);
                isStarHold.current = true;
                setshowStarBoosters(1);
                setOrbGlow(true);
                setTapGlow(true);
              }}
              onTouchEnd={() => {
                setIsStarHolding(2);
                isStarHold.current = false;
                setshowStarBoosters(2);
              }}
              className="flex justify-center items-center relative"
            >
              <div
                fill={"white"}
                color={"white"}
                className={`font-symbols text-[18vw] text-white glow-star-${
                  mythSections[activeMyth]
                } duration-500 transition-all ${
                  showBlackOrb === 1 && "maximize-star"
                } ${showBlackOrb === 2 && "minimize-star"} ${
                  isStarHolding === 1 ? "scale-150" : "scale-100"
                }`}
              >
                s
              </div>
              <div
                className={`z-10 absolute text-center mx-auto my-auto mt-3 ml-1 text-white ${
                  showBlackOrb === 1 && "maximize-star"
                } ${showBlackOrb === 2 && "minimize-star"} ${
                  isStarHolding === 1 ? "scale-150" : "scale-100"
                } text-[7vw] text-black-contour`}
              >
                {mythStates[activeMyth].burstlvl}
              </div>
            </div>
          </div>
        )}
        {/* Star */}
        {showStarBoosters != 0 && (
          <div>
            <div
              className={`absolute  ${showStarBoosters === 2 && "popdown"} ${
                showStarBoosters === 1 && "popup"
              } bottom-0 select-none left-0 -mb-2.5 minion-button`}
            >
              <div className="relative -scale-x-100">
                <img
                  src={`${assets.boosters.alchemistPop}`}
                  alt="dwarf"
                  className="w-full h-full select-none pointer-events-none z-50"
                />
              </div>
            </div>
            {plusMinion.map((plusOne) => (
              <span
                key={plusOne.id}
                className={`plus-one glow-text-${mythSections[activeMyth]}`}
                style={{
                  bottom: `-12vh`,
                  left: `7.5vw`,
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
                  src={`${assets.boosters.automataPop}`}
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
                  bottom: `-12vh`,
                  right: `8vw`,
                  zIndex: 99,
                }}
              >
                +
                {mythStates[activeMyth].automatalvl === 0
                  ? 1
                  : mythStates[activeMyth].automatalvl *
                    (isStarHolding ? 2 : 1)}
              </span>
            ))}
          </div>
        )}
        {/* Rat */}
        {(activeCard === "rat" || activeCard === "rat-down") && (
          <div
            onTouchStart={() => {
              if (activeCard === "rat") {
                setIsHolding(true);
                handleTapHaptic(tele, platform, enableHaptic, 1000);
              }
            }}
            onTouchEnd={() => {
              if (isHolding) {
                closeRat(true);
              }
            }}
            className={`absolute  ${activeCard === "rat-down" && "popdown"} ${
              activeCard === "rat" && "popup"
            } bottom-0 select-none left-0 -mb-2.5 minion-button`}
          >
            <div className={`relative`}>
              <img
                src={`${assets.boosters.ratPop}`}
                alt="rat"
                className="w-full select-none pointer-events-none z-50"
              />
            </div>
          </div>
        )}
        {/* Rat - Deduct */}
        {showRatEffect !== 0 && (
          <div
            className={`flex  ${showRatEffect === 2 && "popdown"} ${
              showRatEffect === 1 && "popup"
            }`}
          >
            <div
              className={`absolute bottom-0 select-none left-0 -mb-2.5 minion-button`}
            >
              <div className={`relative pop-shake`}>
                <img
                  src={`${assets.boosters.ratPop}`}
                  alt="rat"
                  className={`w-full select-none pointer-events-none filter-orbs-${mythSections[activeMyth]} z-50`}
                />
              </div>
            </div>
            <div
              className={`absolute bottom-0 select-none right-0 -mb-2.5 minion-button`}
            >
              <div className="relative pop-scale">
                <img
                  src={`${assets.boosters.automataPop}`}
                  alt="automata"
                  className={`w-full h-full select-none pointer-events-none ${
                    ratEffectToggle
                      ? `filter-orbs-${mythSections[activeMyth]}`
                      : "grayscale"
                  } `}
                />
              </div>
            </div>
            {plusAutomata.map((plusOne) => (
              <span
                key={plusOne.id}
                className={`minus-one glow-text-${mythSections[activeMyth]}`}
                style={{
                  bottom: `-12vh`,
                  right: `8vw`,
                  zIndex: 99,
                }}
              >
                -x1
              </span>
            ))}
          </div>
        )}
        {/* Minion */}
        {(activeCard === "minion" || activeCard === "minion-down") && (
          <div
            onTouchStart={() => {
              if (mythStates[activeMyth].isShardsClaimActive) {
                setShowCard(
                  <BoosterClaim
                    activeCard={"minion"}
                    activeMyth={activeMyth}
                    mythData={mythStates[activeMyth]}
                    disableIcon={false}
                    closeCard={() => setShowCard(null)}
                    Button={
                      showBooster ? (
                        <Button
                          message={1}
                          handleClick={() => {
                            handleClickHaptic(tele, enableHaptic);
                            setGlowBooster(1);
                            setTimeout(() => {
                              setGlowBooster(0);
                            }, 500);
                            setShowCard(null);
                            setShowBooster(null);
                          }}
                          activeMyth={activeMyth}
                        />
                      ) : (
                        <BoosterButtom
                          activeCard={"minion"}
                          mythData={mythStates[activeMyth]}
                          handleClaim={handleClaimShards}
                          activeMyth={activeMyth}
                          t={t}
                        />
                      )
                    }
                  />
                );
                handleTapHaptic(tele, platform, enableHaptic, 500);
              } else {
                if (activeCard === "minion") {
                  isMinionHold.current = true;
                  setIsHolding(true);
                  handleTapHaptic(tele, platform, enableHaptic, 1000);
                }
              }
            }}
            onTouchEnd={() => {
              setIsHolding(false);

              isMinionHold.current = false;
            }}
            className={`absolute  ${
              activeCard === "minion-down" && "popdown"
            } ${activeCard === "minion" && "popup"} bottom-0 ${
              mythStates[activeMyth].isShardsClaimActive && "grayscale"
            } select-none ${
              minionPosition ? "left-0" : "right-0"
            } -mb-2.5 minion-button`}
          >
            <div className={`relative ${minionPosition && "-scale-x-100"}`}>
              <img
                src={`${assets.boosters.alchemistPop}`}
                alt="dwarf"
                className="w-full h-full select-none pointer-events-none z-50"
              />
            </div>
          </div>
        )}
        <div className="absolute">
          <ReactHowler
            src={`${assets.audio.forgeBg}`}
            playing={enableSound && activeMyth < 4}
            preload={true}
            loop
          />
          {(isStarHold.current === true || isMinionHold.current === true) && (
            <ReactHowler
              src={`${assets.audio.alchemistLong}`}
              playing={
                enableSound &&
                (isStarHold.current === true || isMinionHold.current === true)
              }
              preload={true}
              html5={true}
            />
          )}
          {(isStarHold.current === true || showRatEffect == 1) && (
            <ReactHowler
              src={`${assets.audio.automataLong}`}
              playing={
                enableSound &&
                (isStarHold.current === true || showRatEffect == 1)
              }
              preload={true}
              html5={true}
            />
          )}
          {(showRat === true || showRatEffect === 1) && (
            <ReactHowler
              src={`${assets.audio.rat}`}
              playing={enableSound && (showRat === true || showRatEffect === 1)}
              preload={true}
              html5={true}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Forges;
