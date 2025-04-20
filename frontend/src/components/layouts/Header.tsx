import React, { useContext } from "react";
import { RorContext } from "../../context/context";

const BottomChild = () => {
  const { gameData, section } = useContext(RorContext);

  const sections = [
    {
      left: gameData.stats.dailyQuota,
      right: gameData.stats.gobcoin,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "9",
      rIcon: "A",
    }, // 0
    {
      left: gameData.stats.dailyQuota,
      right: gameData.stats.competelvl,
      hLeft: "Sessions",
      hRight: "Competelvl",
      lIcon: "9",
      rIcon: "n",
    }, // 1
    {
      left: gameData.stats.dailyQuota,
      right: gameData.stats.gobcoin,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "9",
      rIcon: "A",
    }, // 2
    {
      left: gameData.stats.dailyQuota,
      right: gameData.stats.gobcoin,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "9",
      rIcon: "A",
    }, // 3
    {
      left: gameData.stats.dailyQuota,
      right: gameData.stats.gobcoin,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "9",
      rIcon: "A",
    }, // 4
    {
      left: gameData.stats.dailyQuota,
      right: gameData.stats.gobcoin,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "9",
      rIcon: "A",
    }, // 5,
    {}, // 6,
    {}, // 7,
    {}, // 8,
    {}, // 9,
    {}, // 10,
    {
      left: gameData.stats.dailyQuota,
      right: gameData.stats.gobcoin,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "9",
      rIcon: "A",
    }, // 11
    {
      left: gameData.stats.dailyQuota,
      right: gameData.stats.gobcoin,
      hLeft: "Sessions",
      hRight: "Coins",
      lIcon: "9",
      rIcon: "A",
    }, // 12
  ];

  return (
    <div className="flex w-full justify-center px-2 mt-4 top-0 absolute">
      <div className="flex relative w-full px-7">
        <div
          className={`flex border-white  gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="flex items-center text-primary font-medium pl-headSides">
            {sections[section].left}
          </div>
        </div>
        <div
          className={`flex justify-end border-white gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="flex text-black-contour items-center text-primary font-medium pr-headSides">
            {sections[section].right}
          </div>
        </div>
      </div>
      <div className="flex text-white justify-between absolute w-[98%] top-0 -mt-4">
        <div
          className={`font-symbols text-iconLg text-black-lg-contour text-white`}
        >
          {sections[section].lIcon}
        </div>
        <div
          className={`font-symbols text-iconLg text-black-contour text-white`}
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
    <div>
      {CenterChild}
      <BottomChild />
    </div>
  );
};

export default RoRHeader;
