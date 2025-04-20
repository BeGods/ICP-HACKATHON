import { RorContext } from "../../context/context";
import {
  claimItemAbility,
  claimSessionReward,
  startSession,
} from "../../utils/api.ror";
import SwipeArena from "../../components/ror/SwipeArena";
import { mythElementNames } from "../../utils/constants.ror";
import React, { useContext, useEffect, useRef, useState } from "react";
import RoRHeader from "../../components/layouts/Header";
import { gameItems } from "../../utils/gameItems";
import {
  timeLeftUntil12Hours,
  checkIsUnderworldActive,
} from "../../helpers/ror.timers.helper";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ content, mythology }) => {
  return (
    <div
      className={`
            flex justify-center items-center absolute h-symbol-primary text-white text-black-md-contour w-symbol-primary text-[20vw] rounded-full bg-black border border-${mythology}-primary top-0 z-20 left-1/2 -translate-x-1/2`}
    >
      {content}
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
  } = useContext(RorContext);
  const [currStage, setCurrStage] = useState(0);
  const [countDown, setCountDown] = useState(5);
  const [showItem, setShowItem] = useState(false);
  const [startPlay, setStartPlay] = useState(false);
  const [roundTimeElapsed, setRoundTimeElapsed] = useState(10);
  const [reward, setReward] = useState(null);
  const [digMyth, setDigMyth] = useState(null);
  const [isInside, setIsInside] = useState(false);
  const skipSessionEndRef = useRef(false);

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
        setGameData((prevData) => {
          const updatedPouch = prevData.pouch.filter((item) => item !== itemId);
          return {
            ...prevData,
            pouch: updatedPouch,
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlay = () => {
    handleClickHaptic(tele, enableHaptic);
    // const availableMyths = mythSections.filter((myth) => myth !== "other");
    const availableMyths = ["Celtic"];
    const randomIdx = Math.floor(Math.random() * availableMyths.length);
    const randomMyth = availableMyths[randomIdx];

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
      return <SwipeArena />;
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
                    src={`/assets/ror-cards/240px-${digMyth?.toLowerCase()}.artifact.common03_on.png`}
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
                    src={`/assets/ror-cards/240px-${digMyth?.toLowerCase()}.artifact.starter01_on.png`}
                    alt="item"
                    className="w-[14vw] scale-point"
                  />
                </div>
              )}
          </div>
          <div className="text-[8vw]">
            {swipes >= gameData.stats.competelvl ? "Won" : "Lost"}
          </div>
        </div>
      );
    }

    if (currStage === 3) {
      return (
        <div className="text-[6vw] w-full">
          {isInside &&
            hasItemInBag(`${digMyth?.toLowerCase()}.artifact.starter02`) && (
              <div
                onClick={() =>
                  handleClaimItem(
                    `${digMyth?.toLowerCase()}.artifact.starter02`
                  )
                }
                className="absolute mt-4 flex justify-between w-full top-0 px-4 z-50"
              >
                <img
                  src={`/assets/ror-cards/240px-${digMyth?.toLowerCase()}.artifact.starter02_on.png`}
                  alt="item"
                  className="w-[14vw] scale-point"
                />
              </div>
            )}

          {reward ? (
            <>
              {reward?.shards > 0 && (
                <div className="flex flex-col justify-center items-center text-white">
                  <img
                    src={`/assets/ror-cards/240px-shard.${mythElementNames[
                      digMyth
                    ]?.toLowerCase()}.png`}
                    alt="reward"
                  />
                  <h1 className="text-primary glow-myth-celtic uppercase mt-4">
                    {reward?.shards}
                  </h1>
                </div>
              )}
              {reward?.fragment && (
                <div className="flex flex-col justify-center items-center text-white">
                  <img
                    src={
                      reward.fragment.isChar
                        ? (() => {
                            const [mythology, typeCode, code] =
                              reward.fragment.itemId.split(".");
                            return `/assets/ror-cards/240px-${mythology}.char.${code}.png`;
                          })()
                        : `/assets/ror-cards/240px-${reward?.fragment.itemId}_on.png`
                    }
                    alt="reward"
                  />

                  <h1 className="text-primary glow-myth-celtic uppercase mt-4">
                    {
                      gameItems?.find(
                        (item) => item.id === reward.fragment.itemId
                      )?.name
                    }
                  </h1>
                </div>
              )}
              {reward?.isDragon && (
                <div className="flex flex-col justify-center items-center text-white">
                  <img
                    src={"/assets/ror-cards/240px-celtic.char.C00.png"}
                    alt="reward"
                  />
                </div>
              )}
            </>
          ) : (
            <div>Loading reward...</div>
          )}
        </div>
      );
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

      setReward(rewardResult.reward);
      const parsedReward = rewardResult.reward;

      setGameData((prevItems) => {
        const shouldAddFragment =
          parsedReward.fragment &&
          Object.keys(parsedReward.fragment).length > 0 &&
          !parsedReward.fragment.isChar;

        let updatedBagItems;

        if (parsedReward.isDragon) {
          updatedBagItems =
            prevItems.bag.filter((item) =>
              item.itemId.includes("artifact.treasure01")
            ) || [];
        } else {
          updatedBagItems = shouldAddFragment
            ? [...prevItems.bag, parsedReward.fragment]
            : [...prevItems.bag];
        }

        const updatedMythologies = prevItems.stats.mythologies.map(
          (mythology) => {
            if (mythology.name === capitalizedName) {
              return {
                ...mythology,
                shards: mythology.shards + parsedReward.shards,
              };
            }
            return mythology;
          }
        );

        return {
          ...prevItems,
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
        setIsInside(false);
        setSwipes(0);
        setMinimize(0);
        setGameData((prev) => {
          return {
            ...prev,
            stats: {
              ...prev.stats,
              isUnderWorldActive: false,
              dailyQuota: prev.stats.dailyQuota - (prev?.isBootClaimed ? 0 : 1),
            },
          };
        });
      }, 3000);
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

  return (
    <div className="h-full w-full">
      <RoRHeader
        CenterChild={
          <CenterChild
            mythology={digMyth?.toLowerCase()}
            content={
              <span className="pt-4">
                {roundTimeElapsed}
                {isInside && "*"}
              </span>
            }
          />
        }
      />
      <div className="flex relative text-white justify-center items-center mt-[14vh] h-[65vh] w-full">
        <div className="absolute  flex top-0 px-5 justify-between w-full">
          <div>
            {currStage === 0 &&
              !isInside &&
              startPlay &&
              digMyth &&
              checkIsUnderworldActive(
                gameData.stats,
                digMyth,
                gameData.pouch
              ) && (
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
                  className={`mt-4  text-[50px] text-black-contour scale-point `}
                >
                  <img
                    src={`/assets/ror-cards/240px-${digMyth?.toLowerCase()}.artifact.common02_on.png`}
                    alt="item"
                    className="w-[14vw] scale-point"
                  />
                </div>
              )}
          </div>
          <div>
            {currStage === 0 && gameData.stats.isThiefActive && (
              <div
                className={`text-[50px] font-symbols text-black-contour text-white `}
              >
                m
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
    </div>
  );
};

export default Explore;
