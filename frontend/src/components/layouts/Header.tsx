import React, { useContext, useEffect, useState } from "react";
import { RorContext } from "../../context/context";
import ArtifactCrd from "../Cards/Reward/ArtiFactCrd";
import { gameItems } from "../../utils/gameItems";
import { ChevronRight } from "lucide-react";
import { elements, mythSections } from "../../utils/constants.ror";

const getSectionDetails = (
  gobcoin,
  totalShards,
  showShards,
  showGobCoins,
  goBack,
  swipes
) => {
  return [
    {
      label: "citadel",
      left: gobcoin,
      right: totalShards,
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: "l",
      handleLeft: showGobCoins,
      handleRight: showShards,
    }, // 0
    {
      label: "",
      left: swipes ?? 0,
      right: totalShards,
      hLeft: "Swipes",
      hRight: "Shards",
      lIcon: "b",
      rIcon: "l",
      handleLeft: showGobCoins,
      handleRight: showShards,
    }, // 1
    {
      label: "bag",
      left: gobcoin,
      right: totalShards,
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: "l",
      handleLeft: showGobCoins,
      handleRight: showShards,
    }, // 2
    {
      label: "blacksmith",
      left: gobcoin,
      right: totalShards,
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: "l",
      handleLeft: showGobCoins,
      handleRight: showShards,
    }, // 3
    {
      label: "banker",
      left: gobcoin,
      right: totalShards,
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: "l",
      handleLeft: showGobCoins,
      handleRight: showShards,
    }, // 4
    {
      label: "vault",
      left: gobcoin,
      right: "",
      hLeft: "Coins",
      hRight: "Back",
      lIcon: "A",
      rIcon: <ChevronRight />,
      handleLeft: showGobCoins,
      handleRight: goBack,
    }, // 5
    {}, // 6,
    {}, // 7,
    {}, // 8,
    {}, // 9,
    {}, // 10,
    {
      label: "apothecary",
      left: gobcoin,
      right: totalShards,
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: "l",
      handleLeft: showGobCoins,
      handleRight: showShards,
    }, // 0
    {
      label: "library",
      left: gobcoin,
      right: totalShards,
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: "l",
      handleLeft: showGobCoins,
      handleRight: showShards,
    }, // 0
    {
      label: "tavern",
      left: gobcoin,
      right: totalShards,
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: "l",
      handleLeft: showGobCoins,
      handleRight: showShards,
    }, // 0
  ];
};

const BottomChild = () => {
  const {
    gameData,
    section,
    setSection,
    setShowCard,
    shardReward,
    swipes,
    isSwiping,
  } = useContext(RorContext);
  const [showEffect, setShowEffect] = useState(true);

  const getMythOrder = (itemId) => {
    const myth = itemId.split(".")[0];
    return mythSections.indexOf(myth);
  };

  const mythShards = gameData.stats.mythologies.map((myth) => myth.shards ?? 0);
  const shardMap = [
    ...mythShards,
    gameData?.stats?.blackShards ?? 0,
    gameData?.stats?.whiteShards ?? 0,
  ];

  const shards = [
    { path: "shard.fire", element: "fire" },
    { path: "shard.earth", element: "earth" },
    { path: "shard.water", element: "water" },
    { path: "shard.air", element: "air" },
    { path: "shard.black", element: "black" },
    { path: "shard.white", element: "white" },
  ].map((item, idx) => ({
    id: item.path,
    count: shardMap[idx],
    name: `${item.element} shards`,
    fragmentId: 0,
    isComplete: true,
  }));

  const coins = gameItems
    .filter((itm) => /common01/.test(itm.id) || /starter0[5-9]/.test(itm.id))
    .sort((a, b) => getMythOrder(a.id) - getMythOrder(b.id))
    .map((item) => ({
      ...item,
      fragmentId: 0,
      isComplete: true,
    }));

  const sumAllShards = () => {
    const mythShards = gameData.stats.mythologies.reduce(
      (sum, myth) => sum + (myth.shards || 0),
      0
    );

    const totalShards =
      mythShards +
      (gameData.stats.whiteShards ?? 0) +
      (gameData.stats.blackShards ?? 0);

    return totalShards;
  };

  const goBack = () => {
    setSection(4);
  };

  const showShards = () => {
    setShowCard(
      <ArtifactCrd
        isPay={false}
        category={0}
        isCurrency={true}
        items={shards}
        initalIdx={0}
        handleClick={() => setShowCard(null)}
      />
    );
  };
  const totalShards = sumAllShards();

  const showGobCoins = () => {
    setShowCard(
      <ArtifactCrd
        isPay={false}
        isCurrency={false}
        category={0}
        items={coins}
        initalIdx={0}
        handleClick={() => setShowCard(null)}
      />
    );
  };

  const sections = getSectionDetails(
    gameData.stats.gobcoin,
    totalShards,
    showShards,
    showGobCoins,
    goBack,
    swipes
  );

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowEffect(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex h-button-primary mt-[2.5vh] absolute z-20 text-black font-symbols justify-between w-screen">
      <div
        onClick={() => sections[section].handleLeft()}
        className={`flex ${
          section == 1 ? "slide-swipe-header-left" : "slide-ror-header-left"
        }  header-shadow-black p-0.5 justify-end items-center w-[32%] bg-white rounded-r-full`}
      >
        <div
          className={`text-[8vw] font-medium font-fof px-1 ${
            section != 1 && "slide-ror-title-left"
          }`}
        >
          {sections[section].left}
        </div>
        <div
          className={`flex ${
            showEffect && "pulse-text"
          } justify-center items-center bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full`}
        >
          <div className={`${isSwiping && "tut-shake"}`}>
            {sections[section].lIcon}
          </div>
        </div>
      </div>
      <div
        onClick={() => sections[section].handleRight()}
        className={`flex transition-all duration-500 ${
          section == 1 ? "slide-swipe-header-right" : "slide-ror-header-right"
        } header-shadow-black p-0.5 justify-start items-center w-[32%] ${
          shardReward && mythSections?.includes(shardReward?.myth)
            ? `bg-${shardReward?.myth}-primary`
            : `bg-white`
        } rounded-l-full`}
      >
        <div
          className={`flex font-symbols ${
            showEffect && "pulse-text"
          } justify-center items-center  bg-black text-white w-[12vw] h-[12vw] text-symbol-sm rounded-full`}
        >
          <div className={`${shardReward && "tut-shake"}`}>
            {sections[section].rIcon}
          </div>
        </div>
        <div>
          {shardReward ? (
            <div className="text-[8vw] flex items-center font-medium text-white px-1 font-fof">
              <span className="text-[4vw] font-bold">+</span>
              {shardReward?.count}
            </div>
          ) : (
            <div
              className={`text-[8vw] font-medium px-1 font-fof ${
                section != 1 && "slide-ror-title-right"
              }`}
            >
              {sections[section].right}
            </div>
          )}
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
  const { section } = useContext(RorContext);
  const sections = getSectionDetails(
    0,
    0,
    () => {},
    () => {},
    () => {},
    0
  );

  return (
    <div className="z-50">
      <div className="absolute top-0 w-full flex justify-center z-[60] text-[5vw] uppercase glow-text-black font-bold text-white">
        {sections[section].label}
      </div>
      {CenterChild}
      <BottomChild />
    </div>
  );
};

export default RoRHeader;
