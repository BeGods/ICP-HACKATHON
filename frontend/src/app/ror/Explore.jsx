import { RorContext } from "../../context/context";
import {
  activateInside,
  claimSessionReward,
  deactivateInside,
  startSession,
} from "../../utils/api.ror";
import SwipeArena from "../../components/ror/SwipeArena";

import React, { useContext, useEffect, useState } from "react";
import RoRHeader from "../../components/layouts/Header";
import { gameItems } from "../../utils/gameItems";

const CenterChild = ({ content }) => {
  return (
    <div
      className={`
            flex justify-center items-center absolute h-symbol-primary text-white text-black-md-contour w-symbol-primary text-[20vw] rounded-full bg-black border border-white top-0 z-20 left-1/2 -translate-x-1/2`}
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
  } = useContext(RorContext);
  const [currStage, setCurrStage] = useState(0);
  const [countDown, setCountDown] = useState(3);
  const [startPlay, setStartPlay] = useState(false);
  const [roundTimeElapsed, setRoundTimeElapsed] = useState(10);
  const [reward, setReward] = useState(null);

  const stages = [
    !startPlay ? (
      <div
        onClick={() => {
          setStartPlay(true);
        }}
        className="bg-white text-black text-[6vw] p-3"
      >
        PLAY
      </div>
    ) : startPlay &&
      currStage === 0 &&
      gameData.bag.length < 12 &&
      gameData.stats.dailyQuota > 0 ? (
      <div className="text-[12vw]">{countDown}</div>
    ) : (
      <div className="text-[6vw]">
        Your{" "}
        {gameData.bag.length < 12
          ? "daily quota is exhausted"
          : " bag is full!"}
      </div>
    ),
    <SwipeArena />,
    <div className="text-[6vw]">
      {swipes >= gameData.stats.competelvl ? "Won" : "Lost"}
    </div>,
    <div className="text-[6vw]">
      {reward ? (
        <>
          {reward?.shards > 0 && (
            <div className="flex flex-col justify-center items-center text-white">
              <img
                src={`/assets/ror-cards/240px-shard.green.png`}
                alt="reward"
              />
              <h1 className="text-primary glow-myth-celtic uppercase mt-4">
                {reward?.shards}
              </h1>
            </div>
          )}
          {reward?.fragment?.length > 0 && (
            <div className="flex flex-col justify-center items-center text-white">
              <img
                src={`/assets/ror-cards/240px-${reward?.fragment.itemId}_on.png`}
                alt="reward"
              />
              <h1 className="text-primary glow-myth-celtic uppercase mt-4">
                {
                  gameItems?.find((item) => item.id === reward.fragment.itemId)
                    ?.name
                }
              </h1>
            </div>
          )}
        </>
      ) : (
        <div>Loading reward...</div>
      )}
    </div>,
  ];

  const handleStateSession = async () => {
    setCurrStage(1);
    setMinimize(1);

    try {
      await startSession(authToken);
      setGameData((prev) => {
        return {
          ...prev,
          stats: {
            ...prev.stats,
            dailyQuota: prev.stats.dailyQuota - 1,
          },
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSessionEnd = async (roundData) => {
    try {
      const rewardResult = await claimSessionReward(authToken, {
        battleData: roundData,
        mythology: "Celtic",
      });
      setCurrStage(3);
      setMinimize(2);
      setBattleData({
        currentRound: 1,
        roundData: [],
      });
      setSwipes(0);

      const parsedReward = rewardResult.reward.reduce(
        (acc, item) => {
          if (item.fragment) acc.fragment = item.fragment;
          if (item.shards) acc.shards += item.shards;
          return acc;
        },
        { fragment: null, shards: 0 }
      );

      setReward(parsedReward);

      setGameData((prevItems) => {
        const updatedBagItems = [
          ...prevItems.bag,
          ...(parsedReward.fragment ? [parsedReward.fragment] : []),
        ];

        const updatedMythologies = prevItems.stats.mythologies.map(
          (mythology) => {
            if (mythology.name === "Celtic") {
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
        setBattleData({
          currentRound: 1,
          roundData: [],
        });
        setSwipes(0);
        setMinimize(0);
      }, 4000);
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

    if (battleData.currentRound < 3 && startPlay) {
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
      }, 2000);
    } else {
      handleSessionEnd(currRoundData);
    }
  };

  const activateUnderworld = async () => {
    try {
      await activateInside(authToken);
      setGameData((prev) => {
        return {
          ...prev,
          stats: {
            ...prev.stats,
            isUnderWorldActive: true,
            dailyQuota: prev.stats.dailyQuota - 1,
          },
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deactivateUnderworld = async () => {
    try {
      await deactivateInside(authToken);
      setGameData((prev) => {
        return {
          ...prev,
          stats: {
            ...prev.stats,
            isUnderWorldActive: false,
            dailyQuota: prev.stats.dailyQuota - 1,
          },
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      startPlay &&
      countDown > 0 &&
      gameData.stats.dailyQuota > 0 &&
      gameData.bag.length < 12 &&
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
            content={
              <span className="pt-4">
                {roundTimeElapsed}
                {gameData.stats.isUnderWorldActive && "*"}
              </span>
            }
          />
        }
      />
      <div className="flex relative text-white justify-center items-center mt-[14vh] h-[65vh] w-full">
        {currStage === 0 && !gameData.stats.isUnderWorldActive && (
          <div
            onClick={activateUnderworld}
            className={`font-symbols absolute text-[50px] left-5 top-0 text-black-contour ${
              gameData.stats.dailyQuota < 5
                ? "scale-point text-white"
                : "text-gray-400"
            } `}
          >
            a
          </div>
        )}
        {currStage === 0 && gameData.stats.isUnderWorldActive && (
          <div
            onClick={deactivateUnderworld}
            className={`absolute text-[50px] left-5 top-0 text-black-contour ${
              gameData.stats.dailyQuota > 1 ? " text-white" : "text-gray-400"
            } `}
          >
            X
          </div>
        )}
        {stages[currStage]}
      </div>
    </div>
  );
};

export default Explore;
