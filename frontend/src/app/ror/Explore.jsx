import { RorContext } from "../../context/context";
import {
  claimItemAbility,
  claimSessionReward,
  startSession,
} from "../../utils/api.ror";
import SwipeArena from "../../components/Common/SwipeArena";
import React, { useContext, useEffect, useRef, useState } from "react";
import RoRHeader from "../../components/Layouts/Header";
import {
  timeLeftUntil12Hours,
  checkIsUnderworldActive,
} from "../../helpers/ror.timers.helper";
import {
  getBubbleLastClaimedTime,
  handleClickHaptic,
} from "../../helpers/cookie.helper";
import gsap from "gsap";
import RelicRwrdCrd from "../../components/Cards/Relics/RelicRwrdCrd";
import ShareButton from "../../components/Buttons/ShareBtn";
import DefaultBtn from "../../components/Buttons/DefaultBtn";
import {
  bgLabel,
  colorByMyth,
  elementFileType,
  mythElementNamesLowerCase,
  mythSections,
} from "../../utils/constants.ror";
import RoRBtn from "../../components/Buttons/RoRBtn";
import CurrencyCrd from "../../components/Cards/Relics/CurrencyCrd";
import { showToast } from "../../components/Toast/Toast";
import ReactHowler from "react-howler";
import { useRoRGuide } from "../../hooks/Tutorial";
import { ExploreGuide } from "../../components/Common/RorTutorial.";
import { isCoin } from "../../helpers/game.helper";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ assets, content, mythology, location, gameData }) => {
  return (
    <div className="flex cursor-pointer justify-center items-center absolute w-[8rem] h-[8rem] shadow-lg rounded-full text-white text-[5rem] top-0 z-20 left-1/2 -translate-x-1/2">
      <div className="relative w-full h-full">
        <img
          src={assets.uxui.sundial}
          alt="sundial"
          className={`absolute ${
            gameData.stats.dailyQuota < 4 && "grayscale"
          } z-30 w-auto h-auto max-w-full max-h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
        />

        <img
          src={
            assets.items[
              `amulet.${gameData.stats.dailyQuota < 4 ? "moon" : "sun"}`
            ]
          }
          alt="amulet"
          className="w-full h-full rounded-full shadow-2xl pointer-events-none z-40 relative"
        />

        <div className="absolute z-40 flex justify-center items-center inset-0 text-[5rem] text-black-contour">
          {content}
        </div>
      </div>

      <div className="absolute top-0 w-full flex text-center leading-6 mt-[7rem] justify-center z-[60] text-[1.5rem] uppercase glow-text-black font-bold text-white">
        TURNS
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
    isTgMobile,
    assets,
    setShardReward,
    setIsSwiping,
    rewards,
    setRewards,
    setActiveReward,
    setRewardsClaimedInLastHr,
    rewardsClaimedInLastHr,
    enableSound,
  } = useContext(RorContext);
  const [currStage, setCurrStage] = useState(0);
  const [countDown, setCountDown] = useState(3);
  const [showItem, setShowItem] = useState(false);
  const [startPlay, setStartPlay] = useState(false);
  const [mythBg, setMythBg] = useState(null);
  const [roundTimeElapsed, setRoundTimeElapsed] = useState(9);
  const [digMyth, setDigMyth] = useState(null);
  const [isInside, setIsInside] = useState(false);
  const skipSessionEndRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [showPartner, setShowPartner] = useState(false);
  const [randomReward, setRandomReward] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const [counter, setCounter] = useState(1);
  const [playSound, setPlaySound] = useState(0);
  const direction = useRef({ x: 1, y: 1 });
  const ballRef = useRef(null);
  const [enableGuide, setEnableGuide] = useRoRGuide("ror-tutorial06");
  const [holdTime, setHoldTime] = useState({
    holdStartTime: 0,
    holdEndTime: 0,
  });
  const cardHeight = isTgMobile ? "h-[47vh] mt-[4.5vh]" : "h-[50dvh] mt-[2vh]";

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
      } else if (itemId?.includes("artifact.common02")) {
        // key
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

    setMinimize(1);
    setMythBg(randomImage);
    setDigMyth(randomMyth);
    setPlaySound(1);
    setStartPlay(true);
  };

  useEffect(() => {
    if (enableGuide) {
      setShowCard(
        <ExploreGuide
          currTut={0}
          handleClick={() => {
            setShowCard(
              <ExploreGuide
                currTut={1}
                handleClick={() => {
                  setShowCard(
                    <ExploreGuide
                      currTut={2}
                      handleClick={() => {
                        setEnableGuide(false);
                        setShowCard(null);
                      }}
                    />
                  );
                }}
              />
            );
          }}
        />
      );
    }
  }, [enableGuide]);

  const renderStageContent = () => {
    if (!startPlay) {
      return (
        <div
          onPointerDown={handlePlay}
          className="flex justify-center items-center text-center h-full w-full relative cursor-pointer font-medium uppercase text-black-contour text-white text-[3rem]"
        >
          {!enableGuide && (
            <span className="font-symbols lowercase text-[6rem] swipe-dig-hand absolute text-black-contour mb-[18vh] mr-[18vw]">
              b
            </span>
          )}
        </div>
      );
    }

    if (currStage === 0) {
      if (gameData.bag.length >= 9 || gameData.stats.dailyQuota <= 0) {
        return (
          <div className="text-[3rem] break-words">
            {gameData.bag.length >= 9
              ? "Your bag is full!"
              : "Daily quota exhausted"}
          </div>
        );
      }
      return (
        <div className="flex justify-center items-center text-center h-full w-full relative  uppercase text-black-contour text-white">
          <div className="text-[15rem] text-black-contour">{countDown}</div>
          <div
            className={`absolute bottom-0 text-[2.5rem] -mb-[8vh] text-white glow-text-${digMyth} mx-auto w-full flex justify-center items-center text-center`}
          >
            {bgLabel[mythBg?.split(".")[1] ?? "Explore"] ?? ""}
          </div>
        </div>
      );
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
              hasItemInBag(`${digMyth?.toLowerCase()}.artifact.starter02`) && (
                <div
                  onClick={() =>
                    handleClaimItem(
                      `${digMyth?.toLowerCase()}.artifact.starter02`
                    )
                  }
                  className={`mt-4 text-[50px] text-${digMyth?.toLowerCase()}-primary font-symbols text-black-contour scale-point`}
                >
                  *
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
                  className={`mt-4 text-[50px] text-${digMyth?.toLowerCase()}-primary font-symbols text-black-contour scale-point`}
                >
                  Y
                </div>
              )}
          </div>

          <div className="text-[4rem] text-center reward-pop-in text-gold text-black-contour uppercase break-normal whitespace-normal">
            {swipes >= gameData.stats.competelvl ? "Win" : "SO CLOSE"}
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
      setIsSwiping(true);
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
      setSwipes(gameData?.stats?.digLvl ?? 1);

      let parsedReward = rewardResult.reward;

      const destrItemIds = parsedReward?.fragment?.itemId?.split(".");
      const id = parsedReward?.isDragon
        ? `${parsedReward?.mythology?.toLowerCase()}.char.C00`
        : parsedReward?.fragment?.isChar
        ? `${destrItemIds[0]}.char.${destrItemIds[2]}`
        : parsedReward?.fragment?.itemId;

      if (id?.includes("C00")) {
        setPlaySound(4);
      } else if (
        id?.includes("C06") ||
        id?.includes("C07") ||
        id?.includes("C08")
      ) {
        setPlaySound(5);
      } else {
        setPlaySound(6);
      }

      if (parsedReward?.isDragon) {
        setPlaySound(4);
        parsedReward.fragment = parsedReward.fragment || {};
        parsedReward.fragment.isChar = true;
      }

      const showRelic =
        parsedReward?.fragment &&
        Object.keys(parsedReward?.fragment).length > 0;
      const showCurrency = parsedReward?.shards > 0;

      const handleShowCurrencyCard = () => {
        const shardType = parsedReward?.shardType?.toLowerCase();

        let element = mythElementNamesLowerCase[shardType];

        if (!element) {
          if (shardType === "whiteshards") {
            element = "white";
          } else if (shardType === "blackshards") {
            element = "black";
          }
        }

        alert(parsedReward?.shards);

        setShowCard(null);
        setTimeout(() => {
          setShardReward({
            myth:
              parsedReward?.shardType?.toLowerCase() ?? digMyth?.toLowerCase(),
            count: parsedReward?.shards,
          });

          setTimeout(() => {
            setShardReward(null);
          }, 3000);
        }, 2500);
      };

      if (showRelic) {
        setShowCard(
          <RelicRwrdCrd
            claimBoots={async () => {
              await handleClaimItem(
                `${digMyth?.toLowerCase()}.artifact.starter02`
              );
              setShowCard(null);

              if (showCurrency) {
                setTimeout(() => {
                  handleShowCurrencyCard();
                }, 100);
              }
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

                  // if outside and encounter then show char after it
                  if (!isInside && parsedReward?.fragment?.isChar) {
                    <RelicRwrdCrd
                      claimBoots={async () => {}}
                      showBoots={false}
                      itemId={id}
                      isChar={false}
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

                            if (showCurrency) {
                              setTimeout(() => {
                                handleShowCurrencyCard();
                              }, 300);
                            }
                          }}
                        />
                      }
                    />;
                  } else {
                    if (showCurrency) {
                      setTimeout(() => {
                        handleShowCurrencyCard();
                      }, 300);
                    }
                  }
                }}
              />
            }
          />
        );
      } else if (showCurrency) {
        handleShowCurrencyCard();
      }

      setGameData((prevItems) => {
        const shouldAddFragment =
          parsedReward.fragment &&
          Object.keys(parsedReward.fragment).length > 0 &&
          !parsedReward.fragment.isChar;

        let updatedBagItems;
        let updatedPouch = [...prevItems.pouch];

        if (parsedReward?.isDragon) {
          updatedBagItems = [];
          updatedPouch = updatedPouch.filter((itm) =>
            itm.includes("artifact.treasure01")
          );
        } else if (
          parsedReward?.fragment &&
          (/common02/?.test(parsedReward?.fragment.itemId) ||
            isCoin(parsedReward?.fragment.itemId))
        ) {
          showToast("item_success_bag");
          updatedBagItems = [...prevItems.bag];
          updatedPouch = [...prevItems.pouch, parsedReward?.fragment.itemId];
        } else {
          updatedBagItems = shouldAddFragment
            ? [...prevItems.bag, parsedReward?.fragment]
            : [...prevItems.bag];
        }
        showToast("item_success_pouch");
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

      setIsSwiping(false);
      setTimeout(() => {
        setCurrStage(0);
        setStartPlay(false);
        setCountDown(3);
        setRoundTimeElapsed(9);
        setDigMyth(null);
        setBattleData({
          currentRound: 1,
          roundData: [],
        });
        setMythBg(null);
        setIsInside(false);
        setSwipes(gameData?.stats?.digLvl ?? 1);
        setMinimize(0);
        setGameData((prev) => {
          return {
            ...prev,
            stats: {
              ...prev.stats,
              dailyQuota:
                prev.stats.dailyQuota -
                (!prev?.isBootClaimed && isInside ? 1 : 0),
            },
          };
        });
        setPlaySound(0);
      }, 3500);
    } catch (error) {
      console.log(error);
      showToast("item_error");
    }
  };

  // toast.success(`You earned ${parsedReward?.shards} shards`);

  // setShardReward({
  //   myth:
  //     parsedReward?.shardType?.toLowerCase() ?? digMyth?.toLowerCase(),
  //   count: parsedReward?.shards,
  // });
  // setTimeout(() => {
  //   setShardReward(null);
  // }, 2000);

  const handleUpdateRoundData = async () => {
    const result = swipes >= gameData.stats.competelvl ? 1 : 0;

    if (swipes >= gameData.stats.competelvl) {
      setPlaySound(2);
    } else {
      setPlaySound(3);
    }

    let currRoundData = null;
    setIsSwiping(false);

    setBattleData((prev) => {
      currRoundData = [...prev.roundData, { swipes: swipes, status: result }];
      return {
        currentRound: prev.currentRound + 1,
        roundData: currRoundData,
      };
    });

    setCurrStage(2);
    setTimeout(() => {
      setSwipes(gameData?.stats?.digLvl ?? 1);
      setRoundTimeElapsed(9);
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
            handleSessionEnd(prev.roundData);
          } else {
            skipSessionEndRef.current = false;
          }
        }

        return prev;
      });
      setIsSwiping(true);
      setPlaySound(1);
    }, 3000);
  };

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

  return (
    <div
      style={{
        top: 0,
        left: 0,
        width: "100vw",
      }}
      className={`flex ${
        isTgMobile ? "tg-container-height" : "browser-container-height"
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
              src={`https://media.publit.io/file/BeGods/locations/1280px-ror.${images[prevIndex]}-wide.jpg`}
              key={images[prevIndex]}
              className="bg-image bg-image--prev"
              alt="background previous"
            />
            <img
              src={`https://media.publit.io/file/BeGods/locations/1280px-ror.${images[currentIndex]}-wide.jpg`}
              key={images[currentIndex]}
              className="bg-image bg-image--current"
              alt="background current"
            />
          </div>
        ) : (
          <div className="background-container transition-all duration-300">
            <img
              src={`https://media.publit.io/file/BeGods/locations/1280px-ror.${mythBg}-wide.jpg`}
              className="bg-image bg-image--current"
              alt="background current"
            />
          </div>
        )}
      </div>
      <RoRHeader
        CenterChild={
          <CenterChild
            gameData={gameData}
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
                    : `https://media.publit.io/file/Partners/160px-${randomReward?.metadata?.campaignCoverImage}.bubble.png`
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
            {/* keys // demoncoin */}
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
                      const underworldLocs = images.filter((itm) =>
                        itm.includes("underworld")
                      );
                      const randomIdx = Math.floor(
                        Math.random() * underworldLocs.length
                      );
                      setMythBg(underworldLocs[randomIdx]);
                      setGameData((prev) => {
                        return {
                          ...prev,
                          stats: {
                            ...prev.stats,
                            dailyQuota: prev.stats.dailyQuota - 1,
                          },
                        };
                      });

                      // claim key
                      if (
                        checkIsUnderworldActive(
                          gameData.stats,
                          digMyth,
                          gameData.pouch
                        ) == 2
                      ) {
                        handleClaimItem(
                          `${digMyth?.toLowerCase()}.artifact.common02`
                        );
                      }
                    }}
                    className={`mt-4 text-[50px] text-${digMyth?.toLowerCase()}-primary font-symbols text-black-contour scale-point`}
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

      <div className="absolute">
        {playSound != 0 && (
          <>
            <ReactHowler
              src={
                assets.audio[
                  playSound == 1
                    ? `${mythBg}`
                    : playSound == 2
                    ? "won"
                    : playSound == 3
                    ? "lost"
                    : playSound == 4
                    ? "dragon"
                    : playSound == 5
                    ? "monster"
                    : playSound == 6
                    ? "unique"
                    : ""
                ]
              }
              playing={enableSound}
              loop
              preload={true}
              onEnd={() => setPlaySound(0)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;

// reward-pop-in
