import { RorContext } from "../../context/context";
import {
  claimItemAbility,
  claimSessionReward,
  startSession,
} from "../../utils/api.ror";
import SwipeArena from "../../components/ror/SwipeArena";
import React, { useContext, useEffect, useRef, useState } from "react";
import RoRHeader from "../../components/layouts/Header";
import {
  timeLeftUntil12Hours,
  checkIsUnderworldActive,
} from "../../helpers/ror.timers.helper";
import {
  getBubbleLastClaimedTime,
  handleClickHaptic,
} from "../../helpers/cookie.helper";
import gsap from "gsap";
import RelicRwrdCrd from "../../components/Cards/Reward/RelicRwrdCrd";
import ShareButton from "../../components/Buttons/ShareBtn";
import DefaultBtn from "../../components/Buttons/DefaultBtn";
import { bgLabel, mythSections } from "../../utils/constants.ror";
import { toast } from "react-toastify";
import RoRBtn from "../../components/ror/RoRBtn";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ assets, content, mythology, location }) => {
  return (
    <div
      className={`
            flex justify-center items-center absolute h-symbol-primary text-white text-black-md-contour w-symbol-primary  rounded-full bg-black border border-${mythology}-primary top-0 z-20 left-1/2 -translate-x-1/2`}
    >
      <img
        src={assets.uxui.baseorb}
        alt="base-orb"
        className={`filter-orbs-${mythology} w-full h-full rounded-full pointer-events-none`}
      />
      <div className="absolute top-0 w-full flex justify-center z-[60] text-[5vw] uppercase glow-text-black font-bold text-white">
        {bgLabel[location] ?? "Explore"}
      </div>
      <div className="absolute flex justify-center items-center inset-0 text-[16vw]">
        {content}
      </div>
    </div>
  );
};

const Explore = () => {
  const {
    battleData,
    setBattleData,
    gameData,
    setGameData,
    setSwipes,
    swipes,
    setMinimize,
    authToken,
    enableHaptic,
    setSection,
    setShowCard,
    isTelegram,
    assets,
    setShardReward,
    rewards,
    setRewards,
    setActiveReward,
    setRewardsClaimedInLastHr,
    rewardsClaimedInLastHr,
  } = useContext(RorContext);
  const [currStage, setCurrStage] = useState(0);
  const [countDown, setCountDown] = useState(5);
  const [showItem, setShowItem] = useState(false);
  const [startPlay, setStartPlay] = useState(false);
  const [mythBg, setMythBg] = useState(null);
  const [roundTimeElapsed, setRoundTimeElapsed] = useState(10);
  const [digMyth, setDigMyth] = useState(null);
  const [isInside, setIsInside] = useState(false);
  const skipSessionEndRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [showPartner, setShowPartner] = useState(false);
  const [randomReward, setRandomReward] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const [counter, setCounter] = useState(1);
  const direction = useRef({ x: 1, y: 1 });
  const ballRef = useRef(null);
  const [holdTime, setHoldTime] = useState({
    holdStartTime: 0,
    holdEndTime: 0,
  });

  const images = [
    "celtic.earth01",
    "celtic.earth02",
    "egyptian.air01",
    "egyptian.air02",
    "greek.fire01",
    "greek.fire02",
    "norse.water01",
    "norse.water02",
    "underworld01",
    "underworld02",
  ];

  const hasItemInBag = (itemId) => gameData?.pouch?.includes(itemId);

  const handleClaimItem = async (itemId) => {
    handleClickHaptic(tele, enableHaptic);

    try {
      if (!hasItemInBag(itemId)) {
        console.log("Item doesn't exist. Invalid item passed.");
      }

      if (
        (itemId === "artifact.starter01" || itemId === "artifact.starter02 ") &&
        !isInside
      ) {
        console.log("Invalid claim. Undeworld is inactive");
      }

      await claimItemAbility(authToken, itemId);

      if (itemId?.includes("artifact.starter02")) {
        // boots
        setGameData((prevData) => {
          return {
            ...prevData,
            isBootClaimed: true,
          };
        });
        setSection(0);
        setShowItem(false);
      } else if (itemId?.includes("artifact.common03")) {
        // map
        if (battleData.currentRound == 3) {
          skipSessionEndRef.current = true;
        }

        setBattleData((prev) => {
          const updatedRoundData = prev.roundData.slice(0, -1);
          return {
            ...prev,
            currentRound: prev.currentRound - 1,
            roundData: updatedRoundData,
          };
        });
        setShowItem(false);
      } else if (itemId?.includes("artifact.starter01") && isInside) {
        // statue
        setBattleData((prev) => {
          const updatedRoundData = prev.roundData.slice(0, -1);
          return {
            ...prev,
            currentRound: prev.currentRound - 1,
            roundData: updatedRoundData,
          };
        });
        setShowItem(false);
      } else if (itemId?.includes("artifact.treasure02")) {
        // sun amulet
        setGameData((prevData) => {
          const updatedPouch = prevData.pouch.filter((item) => item !== itemId);
          return {
            ...prevData,
            pouch: updatedPouch,
          };
        });
      } else if (itemId?.includes("artifact.treasure03")) {
        // moon amulet
      }

      setGameData((prevData) => {
        const updatedPouch = prevData.pouch.filter((item) => item !== itemId);
        return {
          ...prevData,
          pouch: updatedPouch,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlay = () => {
    handleClickHaptic(tele, enableHaptic);
    const availableMyths = mythSections.filter((myth) => myth !== "other");
    const randomIdx = Math.floor(Math.random() * availableMyths.length);
    const randomMyth = availableMyths[randomIdx];

    const matchingImages = images.filter((img) =>
      img.includes(randomMyth?.toLowerCase() || "")
    );

    const randomImage =
      matchingImages[Math.floor(Math.random() * matchingImages.length)];

    setMythBg(randomImage);
    setDigMyth(randomMyth);
    setStartPlay(true);
  };

  const renderStageContent = () => {
    if (!startPlay) {
      return (
        <div
          onClick={handlePlay}
          className="bg-white text-black text-[6vw] p-3"
        >
          PLAY
        </div>
      );
    }

    if (currStage === 0) {
      if (gameData.bag.length >= 9 || gameData.stats.dailyQuota <= 0) {
        return (
          <div className="text-[6vw]">
            {gameData.bag.length >= 9
              ? "Your bag is full!"
              : "Daily quota exhausted"}
          </div>
        );
      }
      return <div className="text-[12vw]">{countDown}</div>;
    }

    if (currStage === 1) {
      return (
        <SwipeArena
          digMyth={digMyth}
          roundTimeElapsed={roundTimeElapsed}
          battleData={battleData}
        />
      );
    }

    if (currStage === 2) {
      return (
        <div className="flex relative justify-center items-center h-full w-full">
          <div className="absolute mt-4 flex justify-between w-full top-0 px-4">
            {!isInside &&
              showItem &&
              battleData.roundData.at(-1)?.status === 0 &&
              hasItemInBag(`${digMyth?.toLowerCase()}.artifact.common03`) && (
                <div
                  onClick={() =>
                    handleClaimItem(
                      `${digMyth?.toLowerCase()}.artifact.common03`
                    )
                  }
                >
                  <img
                    src={`https://media.publit.io/file/BeGods/items/240px-${digMyth?.toLowerCase()}.artifact.common03.png`}
                    alt="item"
                    className="w-[14vw] scale-point"
                  />
                </div>
              )}
            {isInside &&
              showItem &&
              battleData.roundData.at(-1)?.status === 0 &&
              hasItemInBag(`${digMyth?.toLowerCase()}.artifact.starter01`) && (
                <div
                  onClick={() =>
                    handleClaimItem(
                      `${digMyth?.toLowerCase()}.artifact.starter01`
                    )
                  }
                >
                  <img
                    src={`https://media.publit.io/file/BeGods/items/240px-${digMyth?.toLowerCase()}.artifact.starter01.png`}
                    alt="item"
                    className="w-[14vw] scale-point"
                  />
                </div>
              )}
          </div>

          <div className="text-[20vw] reward-pop-in text-gold text-black-contour uppercase">
            {swipes >= gameData.stats.competelvl ? "Won" : "Lost"}
          </div>
        </div>
      );
    }

    if (currStage === 3) {
      return <></>;
    }

    return null;
  };

  const handleStateSession = async () => {
    setCurrStage(1);
    setMinimize(1);
    try {
      await startSession(authToken, isInside);
      setGameData((prev) => {
        return {
          ...prev,
          stats: {
            ...prev.stats,
            dailyQuota: prev.stats.dailyQuota - 1,
          },
        };
      });
      setShowItem(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSessionEnd = async (roundData) => {
    setCurrStage(3);

    try {
      const capitalizedName =
        digMyth?.charAt(0).toUpperCase() + digMyth?.slice(1);

      const rewardResult = await claimSessionReward(authToken, {
        battleData: roundData,
        mythology: capitalizedName,
        isInside: isInside,
      });

      setMinimize(2);
      setBattleData({
        currentRound: 1,
        roundData: [],
      });
      setSwipes(0);

      let parsedReward = rewardResult.reward;

      const destrItemIds = parsedReward?.fragment?.itemId?.split(".");
      const id = parsedReward?.isDragon
        ? `${destrItemIds[0]}.char.00`
        : parsedReward?.fragment?.isChar
        ? `${destrItemIds[0]}.char.${destrItemIds[2]}`
        : parsedReward?.fragment?.itemId;

      if (parsedReward?.isDragon) {
        parsedReward.fragment.isChar = true;
      }

      if (
        parsedReward?.fragment &&
        Object.keys(parsedReward.fragment).length > 0
      ) {
        setShowCard(
          <RelicRwrdCrd
            claimBoots={async () => {
              await handleClaimItem(
                `${digMyth?.toLowerCase()}.artifact.starter02`
              );
              setShowCard(null);
            }}
            showBoots={
              isInside &&
              hasItemInBag(`${digMyth?.toLowerCase()}.artifact.starter02`)
            }
            itemId={id}
            isChar={parsedReward?.fragment?.isChar}
            fragmentId={parsedReward?.fragment?.fragmentId}
            isComplete={parsedReward?.fragment?.isComplete}
            hasShards={parsedReward?.shards ?? 0}
            mythology={parsedReward?.shardType ?? digMyth}
            ButtonBack={
              <ShareButton
                isShared={false}
                isInfo={false}
                handleClaim={() => {}}
                activeMyth={1}
                isCoin={true}
                link={"sdjkfds"}
              />
            }
            ButtonFront={
              <RoRBtn
                isNotPay={true}
                message={"claim"}
                itemId={id}
                disable={false}
                handleClick={() => {
                  setShowCard(null);
                  setShardReward({
                    myth:
                      parsedReward?.shardType?.toLowerCase() ??
                      digMyth?.toLowerCase(),
                    count: parsedReward?.shards,
                  });
                  setTimeout(() => {
                    setShardReward(null);
                  }, 2000);
                }}
              />
            }
          />
        );
      } else {
        if (parsedReward?.shards > 0) {
          // toast.success(`You earned ${parsedReward?.shards} shards`);
          setShardReward({
            myth:
              parsedReward?.shardType?.toLowerCase() ?? digMyth?.toLowerCase(),
            count: parsedReward?.shards,
          });
          setTimeout(() => {
            setShardReward(null);
          }, 2000);
        }
      }

      setGameData((prevItems) => {
        const shouldAddFragment =
          parsedReward.fragment &&
          Object.keys(parsedReward.fragment).length > 0 &&
          !parsedReward.fragment.isChar;

        let updatedBagItems;
        let updatedPouch = [...prevItems.pouch];

        const ignoredItems = [
          "artifact.treasure03",
          "artifact.treasure02",
          "artifact.treasure01",
        ];

        if (parsedReward?.isDragon) {
          updatedBagItems = [];
        } else if (
          parsedReward?.fragment &&
          ignoredItems?.some((item) =>
            parsedReward?.fragment?.itemId?.includes(item)
          )
        ) {
          updatedBagItems = [...prevItems.bag];
          updatedPouch = [...prevItems.pouch, parsedReward?.fragment.itemId];
        } else {
          updatedBagItems = shouldAddFragment
            ? [...prevItems.bag, parsedReward?.fragment]
            : [...prevItems.bag];
        }

        const updatedMythologies = prevItems.stats.mythologies.map(
          (mythology) => {
            if (mythology?.name === rewardResult?.reward?.shardType) {
              return {
                ...mythology,
                shards: mythology.shards + parsedReward?.shards,
              };
            }

            return mythology;
          }
        );

        // if white or blackShards
        if (
          rewardResult.reward.shardType == "blackShards" ||
          rewardResult.reward.shardType == "whiteShards"
        ) {
          prevItems.stats[rewardResult.reward.shardType] =
            prevItems.stats[rewardResult.reward.shardType] +
            parsedReward?.shards;
        }

        return {
          ...prevItems,
          pouch: updatedPouch,
          bag: updatedBagItems,
          stats: {
            ...prevItems.stats,
            mythologies: updatedMythologies,
          },
        };
      });

      setTimeout(() => {
        setCurrStage(0);
        setStartPlay(false);
        setCountDown(3);
        setRoundTimeElapsed(10);
        setDigMyth(null);
        setBattleData({
          currentRound: 1,
          roundData: [],
        });
        setMythBg(null);
        setIsInside(false);
        setSwipes(0);
        setMinimize(0);
        setGameData((prev) => {
          return {
            ...prev,
            stats: {
              ...prev.stats,
              dailyQuota: prev.stats.dailyQuota - (prev?.isBootClaimed ? 0 : 1),
            },
          };
        });
      }, 3500);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateRoundData = async () => {
    const result = swipes >= gameData.stats.competelvl ? 1 : 0;
    let currRoundData = null;

    setBattleData((prev) => {
      currRoundData = [...prev.roundData, { swipes: swipes, status: result }];
      return {
        currentRound: prev.currentRound + 1,
        roundData: currRoundData,
      };
    });

    setCurrStage(2);
    setTimeout(() => {
      setSwipes(0);
      setRoundTimeElapsed(10);
      setCurrStage(1);

      setGameData((prev) => {
        const newCompeteLvl = Math.max(
          5,
          Math.min(40, prev.stats.competelvl + (result === 1 ? 5 : -5))
        );

        return {
          ...prev,
          stats: {
            ...prev.stats,
            competelvl: newCompeteLvl,
          },
        };
      });

      setBattleData((prev) => {
        const updatedRoundCount = prev.roundData.length;

        if (updatedRoundCount === 3 && startPlay) {
          if (!skipSessionEndRef.current) {
            handleSessionEnd(prev.roundData); // use freshest round data
          } else {
            skipSessionEndRef.current = false;
          }
        }

        return prev;
      });
    }, 3000);
  };

  const storeBubbleLastClaimedTime = () => {
    const currentTime = Date.now();

    localStorage.setItem("bubbleLastClaimed", currentTime.toString());
  };

  // useEffect(() => {
  //   const filteredRewards = rewards.filter(
  //     (reward) =>
  //       !rewardsClaimedInLastHr.includes(reward.id) &&
  //       reward.tokensCollected < 12
  //   );

  //   const lastBubbleClaimedTime = getBubbleLastClaimedTime();
  //   const bubbleCooldown = 2 * 30 * 1000;
  //   const canShowBubble =
  //     !lastBubbleClaimedTime ||
  //     Date.now() - lastBubbleClaimedTime >= bubbleCooldown;

  //   if (filteredRewards.length > 0 && counter === 1) {
  //     const randomIndex = Math.floor(Math.random() * filteredRewards.length);
  //     const randomReward = filteredRewards[randomIndex];
  //     setRandomReward(randomReward);
  //     setShowBubble(true);
  //     setShowPartner(true);
  //     storeBubbleLastClaimedTime();
  //   }
  // }, []);

  useEffect(() => {
    if (
      startPlay &&
      countDown > 0 &&
      gameData.stats.dailyQuota > 0 &&
      gameData.bag.length < 9 &&
      currStage === 0
    ) {
      const timer = setTimeout(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (countDown === 0) {
      handleStateSession();
    }
  }, [countDown, startPlay]);

  useEffect(() => {
    if (currStage === 1 && roundTimeElapsed > 0) {
      const timer = setTimeout(() => {
        setRoundTimeElapsed((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currStage === 1 && roundTimeElapsed === 0) {
      handleUpdateRoundData();
    }
  }, [currStage, roundTimeElapsed]);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (digMyth) return;

    const interval = setInterval(() => {
      setPrevIndex(currentIndex);
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentIndex(randomIndex);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, digMyth]);

  // useEffect(() => {
  //   if (showPartner) {
  //     const ball = ballRef.current;
  //     const parent = ball.parentNode;

  //     const parentRect = parent.getBoundingClientRect();
  //     const ballRect = ball.getBoundingClientRect();

  //     const getRandomCornerPosition = () => {
  //       const positions = [
  //         { x: 0, y: 0 },
  //         { x: parentRect.width - ballRect.width, y: 0 },
  //         { x: 0, y: parentRect.height - ballRect.height },
  //         {
  //           x: parentRect.width - ballRect.width,
  //           y: parentRect.height - ballRect.height,
  //         },
  //       ];
  //       return positions[Math.floor(Math.random() * positions.length)];
  //     };

  //     const initialPosition = getRandomCornerPosition();

  //     gsap.set(ball, {
  //       x: initialPosition.x,
  //       y: initialPosition.y,
  //     });

  //     const getRandomDirection = () => {
  //       const angle = Math.random() * 2 * Math.PI;
  //       return { x: Math.cos(angle), y: Math.sin(angle) };
  //     };

  //     const clampPosition = (pos, min, max) => {
  //       return Math.min(Math.max(pos, min), max);
  //     };

  //     const updateDirection = (position) => {
  //       if (
  //         position.x <= 0 ||
  //         position.x >= parentRect.width - ballRect.width
  //       ) {
  //         direction.current = getRandomDirection();
  //       }
  //       if (
  //         position.y <= 0 ||
  //         position.y >= parentRect.height - ballRect.height
  //       ) {
  //         direction.current = getRandomDirection();
  //       }
  //     };

  //     const animateBall = () => {
  //       const ballCurrentX = gsap.getProperty(ball, "x");
  //       const ballCurrentY = gsap.getProperty(ball, "y");
  //       const speed = 10;

  //       let newPosX = ballCurrentX + speed * direction.current.x;
  //       let newPosY = ballCurrentY + speed * direction.current.y;

  //       newPosX = clampPosition(newPosX, 0, parentRect.width - ballRect.width);
  //       newPosY = clampPosition(
  //         newPosY,
  //         0,
  //         parentRect.height - ballRect.height
  //       );

  //       updateDirection({ x: newPosX, y: newPosY });

  //       gsap.set(ball, { x: newPosX, y: newPosY });
  //       animationFrameId.current = requestAnimationFrame(animateBall);
  //     };

  //     let animationFrameId = { current: null };
  //     direction.current = getRandomDirection();
  //     animateBall();

  //     // Stop animation after 9 seconds
  //     const timeoutId = setTimeout(() => {
  //       setShowBubble(false);
  //       setShowPartner(false);
  //       autoCloseTimeoutId.current = setTimeout(() => {
  //         handleSubmitSessionData();
  //       }, 1500);
  //       cancelAnimationFrame(animationFrameId.current);
  //     }, 9000);

  //     // SWIPE DETECTION
  //     let startX = 0;
  //     let startY = 0;
  //     let isSwiping = false;

  //     const onPointerDown = (e) => {
  //       startX = e.clientX || (e.touches && e.touches[0].clientX);
  //       startY = e.clientY || (e.touches && e.touches[0].clientY);
  //       isSwiping = true;
  //     };

  //     const onPointerMove = (e) => {
  //       if (!isSwiping) return;
  //       const currentX = e.clientX || (e.touches && e.touches[0].clientX);
  //       const currentY = e.clientY || (e.touches && e.touches[0].clientY);

  //       const deltaX = currentX - startX;
  //       const deltaY = currentY - startY;
  //       const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  //       if (distance > 50) {
  //         // Threshold to consider it a swipe
  //         isSwiping = false;
  //         burstBubble();
  //       }
  //     };

  //     const onPointerUp = () => {
  //       isSwiping = false;
  //     };

  //     const burstBubble = () => {
  //       cancelAnimationFrame(animationFrameId.current);
  //       gsap.to(ball, { scale: 1.5, duration: 0.2 }).then(() => {
  //         alert("Bubble burst!");

  //         setShowPartner(false);
  //         setActiveReward(randomReward);

  //         const incrementedReward = {
  //           ...randomReward,
  //           tokensCollected: randomReward.tokensCollected + 1,
  //         };

  //         const updatedRewards = rewards.map((reward) => {
  //           if (reward.id === randomReward.id) {
  //             if (reward.tokensCollected + 1 === 12) {
  //               setTriggerConf(true);
  //             }
  //             return {
  //               ...reward,
  //               tokensCollected: reward.tokensCollected + 1,
  //             };
  //           }
  //           return reward;
  //         });

  //         trackEvent("action", "bubble_captured", "success");
  //         setRewards(updatedRewards);
  //         setActiveReward(incrementedReward);
  //         setSection(6);
  //       });
  //     };

  //     // Add swipe event listeners
  //     ball.addEventListener("pointerdown", onPointerDown);
  //     ball.addEventListener("pointermove", onPointerMove);
  //     ball.addEventListener("pointerup", onPointerUp);
  //     ball.addEventListener("touchstart", onPointerDown);
  //     ball.addEventListener("touchmove", onPointerMove);
  //     ball.addEventListener("touchend", onPointerUp);

  //     return () => {
  //       clearTimeout(timeoutId);
  //       cancelAnimationFrame(animationFrameId.current);
  //       gsap.killTweensOf(ball);

  //       // Clean up swipe events
  //       ball.removeEventListener("pointerdown", onPointerDown);
  //       ball.removeEventListener("pointermove", onPointerMove);
  //       ball.removeEventListener("pointerup", onPointerUp);
  //       ball.removeEventListener("touchstart", onPointerDown);
  //       ball.removeEventListener("touchmove", onPointerMove);
  //       ball.removeEventListener("touchend", onPointerUp);
  //     };
  //   }
  // }, [showPartner]);

  return (
    <div
      style={{
        top: 0,
        left: 0,
        width: "100vw",
      }}
      className={`flex ${
        isTelegram ? "tg-container-height" : "browser-container-height"
      } flex-col overflow-hidden m-0 relative`}
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
        className="background-wrapper transition-all duration-100"
      >
        {!mythBg ? (
          <div className="background-container transition-all duration-300 blur-[2px]">
            <img
              src={`/assets/locations/1280px-ror.${images[prevIndex]}_wide.jpg`}
              key={images[prevIndex]}
              className="bg-image bg-image--prev"
              alt="background previous"
            />
            <img
              src={`/assets/locations/1280px-ror.${images[currentIndex]}_wide.jpg`}
              key={images[currentIndex]}
              className="bg-image bg-image--current"
              alt="background current"
            />
          </div>
        ) : (
          <div className="background-container transition-all duration-300">
            <img
              src={`/assets/locations/1280px-ror.${mythBg}_wide.jpg`}
              className="bg-image bg-image--current"
              alt="background current"
            />
          </div>
        )}
      </div>
      <RoRHeader
        CenterChild={
          <CenterChild
            assets={assets}
            location={mythBg?.split(".")[1] ?? "Explore"}
            mythology={digMyth?.toLowerCase()}
            content={gameData.stats.dailyQuota}
          />
        }
      />

      {showPartner ? (
        <div className="h-[155dvw] mt-[18dvw] w-full absolute">
          <div ref={ballRef} className="h-20 w-20 shadow-2xl rounded-full">
            <div className="bubble-spin-effect">
              <img
                src={
                  randomReward?.partnerType == "playsuper"
                    ? `${randomReward?.metadata?.campaignCoverImage}`
                    : `https://media.publit.io/file/BattleofGods/FoF/Assets/PARTNERS/160px-${randomReward?.metadata?.campaignCoverImage}.bubble.png`
                }
                alt="icon"
                className="pointer-events-none h-20 w-20 rounded-full bg-white z-50"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex relative text-white justify-center items-center mt-[14vh] h-[65vh] w-full z-50">
          <div className="absolute flex top-0 px-5 justify-between w-full">
            <div>
              {currStage === 0 &&
                !isInside &&
                startPlay &&
                digMyth &&
                checkIsUnderworldActive(
                  gameData.stats,
                  digMyth,
                  gameData.pouch
                ) > 0 && (
                  <div
                    onClick={() => {
                      handleClickHaptic(tele, enableHaptic);
                      setIsInside(true);
                      setGameData((prev) => {
                        return {
                          ...prev,
                          stats: {
                            ...prev.stats,
                            dailyQuota: prev.stats.dailyQuota - 1,
                          },
                        };
                      });
                    }}
                    className={`mt-4 text-[50px] font-symbols text-black-contour scale-point`}
                  >
                    {checkIsUnderworldActive(
                      gameData.stats,
                      digMyth,
                      gameData.pouch
                    ) == 1
                      ? "a"
                      : "Z"}
                  </div>
                )}
            </div>
          </div>
          <>
            {gameData.stats.dailyQuota == 0 && !startPlay ? (
              <div className="text-[2rem] text-center">
                Daily Turns Exhausted <br />
                {timeLeftUntil12Hours(gameData.stats.sessionStartAt).countdown}
              </div>
            ) : gameData.bag.length >= 12 && !startPlay ? (
              <div className="text-[2rem]">Your Bag is Full</div>
            ) : (
              <>{renderStageContent()}</>
            )}
          </>
        </div>
      )}
    </div>
  );
};

export default Explore;

// reward-pop-in
