import React, { useContext } from "react";
import { RorContext } from "../../context/context";

const sections = [
  { title: "Citadel", leftIcon: "l", rightIcon: "2" },
  { title: "Explore", leftIcon: "l", rightIcon: "2" },
  { title: "Bag", leftIcon: "l", rightIcon: "2" },
  { title: "Blacksmith", leftIcon: "l", rightIcon: "2" },
  { title: "Merchant", leftIcon: "l", rightIcon: "2" },
  { title: "Bank", leftIcon: "l", rightIcon: "2" },
  { title: "Profile", leftIcon: "l", rightIcon: "2" },
];

const CenterChild = ({ assets, gameData }) => {
  return (
    <div className="flex absolute justify-center w-full z-20 mt-1">
      <div
        className={`flex text-center justify-center h-[36vw] w-[36vw] overflow-hidden items-center rounded-full transition-all duration-1000 `}
      >
        <div
          className={`absolute z-10 h-full w-[36vw] overflow-hidden rounded-full`}
        ></div>
        <img
          src={assets.uxui.baseorb}
          alt="base-orb"
          className={`filter-orbs- w-full h-full`}
        />
      </div>
      <div className="absolute z-20 bottom-0 text-tertiary text-white text-black-contour">
        {gameData.stats.competelvl} || {gameData.stats.dailyQuota}
      </div>
    </div>
  );
};

const TopChild = ({ section }) => {
  return (
    <div className="absolute flex w-full justify-between top-0 z-50">
      <div
        className={`font-symbols ml-[8vw] text-black-md-contour text-[12vw] transition-all duration-1000 text-white`}
      >
        {sections[section].leftIcon}
      </div>
      <div
        className={`font-symbols mr-[8vw] text-black-lg-contour  text-[12vw] transition-all duration-1000 text-white`}
      >
        {sections[section].rightIcon}
      </div>
      <div
        className={`text-head  text-white -mt-1 text-center top-0 text-black-lg-contour uppercase absolute inset-0 w-fit h-fit  mx-auto`}
      >
        {sections[section].title}
      </div>
    </div>
  );
};

const BottomChild = () => {
  const { swipes, battleData, gameData, section } = useContext(RorContext);

  const sectionData = [
    {
      left: gameData.stats.blackOrbs,
      right: gameData.stats.gobcoin,
    },
    {
      left: swipes,
      right: battleData.currentRound,
    },
    {
      left: gameData.stats.blackOrbs,
      right: gameData.stats.gobcoin,
    },
    {
      left: gameData.stats.blackOrbs,
      right: gameData.stats.gobcoin,
    },
    {
      left: gameData.stats.blackOrbs,
      right: gameData.stats.gobcoin,
    },
    {
      left: gameData.stats.blackOrbs,
      right: gameData.stats.gobcoin,
    },
    {
      left: gameData.stats.blackOrbs,
      right: gameData.stats.gobcoin,
    },
    {
      left: gameData.stats.blackOrbs,
      right: gameData.stats.gobcoin,
    },
  ];
  return (
    <div className={`flex bar-flipped justify-center mt-[9.5vh] px-7 w-full`}>
      <div
        className={`flex text-num pl-[18px] text-black-lg-contour text-white items-center border border-white justify-start h-button-primary w-full bg-black z-10 rounded-primary transform skew-x-[18deg]`}
      >
        {sectionData[section].left}
      </div>
      <div
        className={`flex text-num pr-[18px] text-black-lg-contour text-white items-center border border-white justify-end h-button-primary w-full bg-black z-10 rounded-primary transform -skew-x-[18deg]`}
      >
        {sectionData[section].right}
      </div>
    </div>
  );
};

const RoRHeader = () => {
  const { assets, section, gameData } = useContext(RorContext);

  return (
    <div className="relative  flex justify-center w-full h-auto">
      <img
        src={assets.uxui.paper}
        alt="paper"
        className={`w-full h-auto rotate-180`}
      />
      <div className="absolute w-full h-full">
        <CenterChild assets={assets} gameData={gameData} />
        <TopChild section={section} />
        <BottomChild />
      </div>
    </div>
  );
};

export default RoRHeader;
