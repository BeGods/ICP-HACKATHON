import React, { useContext, useEffect, useState } from "react";
import { RorContext } from "../../context/context";

const BottomChild = () => {
  const { gameData, section } = useContext(RorContext);
  const [showEffect, setShowEffect] = useState(true);

  const sections = [
    {
      left: gameData.stats.gobcoin,
      right: gameData.stats.dailyQuota,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "A",
      rIcon: "9",
    }, // 0
    {
      left: gameData.stats.gobcoin,
      right: gameData.stats.dailyQuota,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "A",
      rIcon: "9",
    }, // 0
    {
      left: gameData.stats.gobcoin,
      right: gameData.stats.dailyQuota,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "A",
      rIcon: "9",
    }, // 0
    {
      left: gameData.stats.gobcoin,
      right: gameData.stats.dailyQuota,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "A",
      rIcon: "9",
    }, // 0
    {
      left: gameData.stats.gobcoin,
      right: gameData.stats.dailyQuota,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "A",
      rIcon: "9",
    }, // 0
    {
      left: gameData.stats.gobcoin,
      right: gameData.stats.dailyQuota,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "A",
      rIcon: "9",
    }, // 0
    {}, // 6,
    {}, // 7,
    {}, // 8,
    {}, // 9,
    {}, // 10,
    {
      left: gameData.stats.gobcoin,
      right: gameData.stats.dailyQuota,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "A",
      rIcon: "9",
    }, // 0
    {
      left: gameData.stats.gobcoin,
      right: gameData.stats.dailyQuota,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "A",
      rIcon: "9",
    }, // 0
    {
      left: gameData.stats.gobcoin,
      right: gameData.stats.dailyQuota,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "A",
      rIcon: "9",
    }, // 0
  ];

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowEffect(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex h-button-primary mt-[2.5vh] absolute z-50 text-black font-symbols justify-between w-screen">
      <div
        onClick={() => {}}
        className="flex slide-header-left p-0.5 justify-end items-center w-1/4 bg-white rounded-r-full"
      >
        <div
          className={`flex ${
            showEffect && "pulse-text"
          } justify-center items-center bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full`}
        >
          {sections[section].lIcon}
        </div>
      </div>
      <div
        onClick={() => {}}
        className="flex slide-header-right p-0.5 justify-start items-center w-1/4 bg-white rounded-l-full"
      >
        <div
          className={`flex font-symbols ${
            showEffect && "pulse-text"
          } justify-center items-center bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full`}
        >
          {sections[section].rIcon}
        </div>
      </div>
      <div className="absolute flex text-white text-black-contour px-1 w-full mt-[9vh] font-fof text-[17px] uppercase">
        <div className={`mr-auto slide-in-out-left`}>
          {sections[section].hLeft}
        </div>
        <div className={`ml-auto slide-in-out-right`}>
          {sections[section].hRight}
        </div>
      </div>
    </div>
  );
};

const RoRHeader = ({ CenterChild }) => {
  return (
    <div className="z-50">
      {CenterChild}
      <BottomChild />
    </div>
  );
};

export default RoRHeader;
