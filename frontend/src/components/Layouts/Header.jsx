import { useContext, useEffect, useState } from "react";
import { RorContext } from "../../context/context";
import ArtifactCrd from "../Cards/Relics/ArtiFactCrd";
import { gameItems } from "../../utils/gameItems";
import { LogOut, X } from "lucide-react";
import { mythSections } from "../../utils/constants.ror";

const getSectionDetails = (
  gobcoin,
  totalShards,
  showShards,
  showGobCoins,
  goBack,
  swipes,
  isFurnaceBuild
) => {
  return [
    {
      label: "",
      left: gobcoin,
      right: totalShards,
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: "l",
      handleLeft: () => {},
      handleRight: showShards,
    }, // 0
    {
      label: "",
      left: 0,
      right: swipes ?? 0,
      hleft: "Shards",
      hRight: "Swipes",
      lIcon: "l",
      rIcon: "b",
      handleLeft: () => {},
      handleRight: () => {},
    }, // 1
    {
      label: "",
      left: gobcoin,
      right: "",
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: <LogOut />,
      handleLeft: () => {},
      handleRight: goBack,
    }, // 2
    {
      label: "blacksmith",
      left: gobcoin,
      right: "",
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: isFurnaceBuild ? <X /> : <LogOut />,
      handleLeft: () => {},
      handleRight: goBack,
    }, // 3
    {
      label: "banker",
      left: gobcoin,
      right: "",
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: <LogOut />,
      handleLeft: () => {},
      handleRight: goBack,
    }, // 4
    {
      label: "vault",
      left: gobcoin,
      right: "",
      hLeft: "Coins",
      hRight: "Back",
      lIcon: "A",
      rIcon: <LogOut />,
      handleLeft: () => {},
      handleRight: goBack,
    }, // 5
    {}, // 6,
    {}, // 7,
    {}, // 8,
    {}, // 9,
    {}, // 10,
    {
      label: "alchemist",
      left: gobcoin,
      right: "",
      hLeft: "Coins",
      hRight: "Back",
      lIcon: "A",
      rIcon: <LogOut />,
      handleLeft: showGobCoins,
      handleRight: goBack,
    }, // 11
    {
      label: "librarian",
      left: gobcoin,
      right: "",
      hLeft: "Coins",
      hRight: "Back",
      lIcon: "A",
      rIcon: <LogOut />,
      handleLeft: () => {},
      handleRight: goBack,
    }, // 12
    {
      label: "tavernist",
      left: gobcoin,
      right: "",
      hLeft: "Coins",
      hRight: "Shards",
      lIcon: "A",
      rIcon: <LogOut />,
      handleLeft: () => {},
      handleRight: goBack,
    }, // 13
  ];
};

const BottomChild = ({ isGuide, isOpenVault, isFurnaceBuild, handleClick }) => {
  const {
    gameData,
    section,
    setSection,
    setShowCard,
    shardReward,
    swipes,
    isSwiping,
    setMinimize,
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
    { path: "shard.blackShards", element: "black" },
    { path: "shard.whiteShards", element: "white" },
  ].map((item, idx) => ({
    id: item.path,
    count: shardMap[idx],
    element: item.element,
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
    if (isOpenVault) {
      handleClick();
    } else if (isFurnaceBuild) {
      handleClick();
    } else if (section == 5) {
      setSection(4);
    } else {
      setSection(0);
      setMinimize(2);
    }
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
    swipes,
    isFurnaceBuild
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
    <div className="flex h-button-primary mt-[1.5dvh] absolute z-20 text-black font-symbols justify-between w-screen">
      <div
        onClick={() => sections[section].handleLeft()}
        className={`flex cursor-pointer slide-ror-header-left  header-shadow-black p-0.5 justify-end items-center w-[32%] ${
          shardReward && mythSections?.includes(shardReward?.myth)
            ? `bg-${shardReward?.myth}-primary`
            : `bg-white`
        }  rounded-r-full`}
      >
        <div>
          {shardReward ? (
            <div className="text-[2rem] flex items-center font-medium text-white px-1 font-fof">
              <span className="text-[1rem] font-bold">+</span>
              {shardReward?.count}
            </div>
          ) : (
            <div className={`text-[2rem] font-medium font-fof px-1`}>
              {sections[section].left}
            </div>
          )}
        </div>
        <div
          className={`flex ${
            showEffect && "pulse-text"
          } justify-center items-center bg-black  text-white w-[3rem] h-[3rem] aspect-square text-symbol-sm rounded-full`}
        >
          <div className={`${shardReward && "tut-shake"}`}>
            {sections[section].lIcon}
          </div>
        </div>
      </div>
      <div
        onClick={() => sections[section].handleRight()}
        className={`flex cursor-pointer transition-all duration-500 slide-ror-header-right header-shadow-black p-0.5 justify-start items-center w-[32%] bg-white rounded-l-full`}
      >
        <div
          className={`flex font-symbols ${
            showEffect && "pulse-text"
          } justify-center items-center  bg-black text-white w-[3rem] h-[3rem] aspect-square text-symbol-sm rounded-full`}
        >
          <div className={`${(isSwiping || isGuide) && "tut-shake"}`}>
            {sections[section].rIcon}
          </div>
        </div>
        <div className={`text-[2rem] font-medium px-1 font-fof`}>
          {sections[section].right}
        </div>
      </div>
      <div className="absolute flex text-white text-black-contour px-1 w-full mt-[9vh] font-fof text-[2dvh] uppercase">
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

const RoRHeader = ({
  CenterChild,
  isGuide,
  isOpenVault,
  isFurnaceBuild,
  handleClick,
}) => {
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
      <div className="absolute mt-[7rem] w-full flex justify-center z-[70] text-[1.25rem] uppercase glow-text-black font-bold text-white">
        {sections[section].label}
      </div>
      {CenterChild}
      <BottomChild
        handleClick={handleClick}
        isOpenVault={isOpenVault}
        isGuide={isGuide}
        isFurnaceBuild={isFurnaceBuild}
      />
    </div>
  );
};

export default RoRHeader;
