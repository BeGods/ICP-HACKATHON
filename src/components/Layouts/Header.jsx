import { useContext, useEffect } from "react";
import { MainContext, RorContext } from "../../context/context";
import { gameItems } from "../../utils/gameItems";
import { mythSections } from "../../utils/constants.ror";
import HeaderLayout, { HeadbarLayout } from "./HeaderLayout";
import MiscCard from "../Cards/Citadel/MiscCard";
import ShardInfoCrd from "../Cards/Info/ShardInfoCrd";
import { formatThreeNums } from "../../helpers/leaderboard.helper";

const RoRHeader = ({ isOpenVault, isFurnaceBuild, handleClick }) => {
  const { section, setSection, setShowCard, setMinimize } =
    useContext(MainContext);
  const { gameData, swipes, assets, shardReward, isSwiping } =
    useContext(RorContext);

  const shardMap = [
    ...gameData.stats.mythologies.map((myth) => myth.shards ?? 0),
    gameData.stats.blackShards ?? 0,
    gameData.stats.whiteShards ?? 0,
  ];

  const shards = ["fire", "earth", "water", "air", "black", "white"].map(
    (element, idx) => ({
      id: `shard.${element}`,
      count: shardMap[idx],
      element,
      name: `${element} shards`,
      fragmentId: 0,
      isComplete: true,
    })
  );

  const totalShards = shardMap.reduce((acc, val) => acc + val, 0);

  const goBack = () => {
    if (isOpenVault || isFurnaceBuild) {
      handleClick();
    } else if (section === 5) {
      setSection(4);
    } else {
      setSection(0);
      setMinimize(2);
    }
  };

  const showShards = () => {
    setShowCard(<ShardInfoCrd gameData={gameData} />);
  };

  const getSections = () => [
    {
      label: "Turns",
      left: totalShards,
      right: gameData.stats.gobcoin,
      labelLeft: "Shards",
      labelRight: "Coins",
      iconLeft: "l",
      iconRight: "A",
      handleLeft: showShards,
      handleRight: () => {},
      handleCenter: () => {},
    },
    {
      label: "Turns",
      left: 0,
      right: swipes ?? 0,
      labelLeft: "Shards",
      labelRight: "Swipes",
      iconLeft: "l",
      iconRight: <div className={isSwiping && "tut-shake"}>b</div>,
      handleLeft: showShards,
      handleRight: () => {},
      handleCenter: () => {},
    },
    {
      label: "Turns",
      left: 0,
      right: swipes ?? 0,
      labelLeft: "Shards",
      labelRight: "Swipes",
      iconLeft: "l",
      iconRight: "b",
      handleLeft: showShards,
      handleRight: () => {},
      handleCenter: () => {},
    },
    {
      label: "blacksmith",
      left: totalShards,
      right: gameData.stats.gobcoin,
      labelLeft: "Shards",
      labelRight: "Coins",
      iconLeft: "l",
      iconRight: "A",
      handleLeft: showShards,
      handleRight: () => {},
      handleCenter: () =>
        setShowCard(
          <MiscCard id="blacksmith" handleClick={() => setShowCard(null)} />
        ),
    },
    {
      label: "banker",
      left: totalShards,
      right: gameData.stats.gobcoin,
      labelLeft: "Shards",
      labelRight: "Coins",
      iconLeft: "l",
      iconRight: "A",
      handleLeft: showShards,
      handleRight: () => {},
      handleCenter: () =>
        setShowCard(
          <MiscCard id="banker" handleClick={() => setShowCard(null)} />
        ),
    },
    {
      label: "vault",
      left: totalShards,
      right: gameData.stats.gobcoin,
      labelLeft: "Shards",
      labelRight: "Coins",
      iconLeft: "l",
      iconRight: "A",
      handleLeft: showShards,
      handleRight: () => {},
      handleCenter: () =>
        setShowCard(
          <MiscCard id="banker" handleClick={() => setShowCard(null)} />
        ),
    },
    {
      label: "alchemist",
      left: totalShards,
      right: gameData.stats.gobcoin,
      labelLeft: "Shards",
      labelRight: "Coins",
      iconLeft: "l",
      iconRight: "A",
      handleLeft: showShards,
      handleRight: () => {},
      handleCenter: () =>
        setShowCard(
          <MiscCard id="apothecary" handleClick={() => setShowCard(null)} />
        ),
    },
    {
      label: "librarian",
      left: totalShards,
      right: gameData.stats.gobcoin,
      labelLeft: "Shards",
      labelRight: "Coins",
      iconLeft: "l",
      iconRight: "A",
      handleLeft: showShards,
      handleRight: () => {},
      handleCenter: () =>
        setShowCard(
          <MiscCard id="librarian" handleClick={() => setShowCard(null)} />
        ),
    },
    {
      label: "tavernist",
      left: totalShards,
      right: gameData.stats.gobcoin,
      labelLeft: "Shards",
      labelRight: "Coins",
      iconLeft: "l",
      iconRight: "A",
      handleLeft: showShards,
      handleRight: () => {},
      handleCenter: () =>
        setShowCard(
          <MiscCard id="tavernist" handleClick={() => setShowCard(null)} />
        ),
    },
  ];

  const sections = getSections();
  const current = sections[section] || {};

  useEffect(() => {}, [shardReward]);

  return (
    <HeaderLayout
      title={current.label || ""}
      BottomChild={
        <HeadbarLayout
          data={[
            {
              icon: (
                <div
                  className={`font-symbols  ${
                    shardReward?.myth &&
                    `tut-shake text-${shardReward?.myth}-primary`
                  } transition-all duration-500`}
                >
                  l
                </div>
              ),
              value: shardReward?.count
                ? `+${formatThreeNums(shardReward?.count)}`
                : formatThreeNums(0),
              label: current.labelLeft,
              handleClick: current.handleLeft,
            },
            {
              icon: current.iconRight,
              value: formatThreeNums(current.right),
              label: current.labelRight,
              handleClick: current.handleRight,
            },
          ]}
        />
      }
      CenterChild={
        <div
          onClick={() => {
            current.handleCenter?.();
          }}
          className="flex cursor-pointer absolute justify-center w-full top-0 -mt-2 z-50"
        >
          {section === 0 || section === 1 ? (
            <SundialHeader gameData={gameData} assets={assets} />
          ) : (
            <div
              style={{
                backgroundImage: `url(${
                  section == 2
                    ? assets.items.bag
                    : assets.boosters[
                        [
                          "",
                          "",
                          "",
                          "minionHead",
                          "bankerHead",
                          "bankerHead",
                          "gemologistHead",
                          "libHead",
                          "tavernHead",
                        ][section]
                      ]
                })`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
              className="flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 left-1/2 -translate-x-1/2"
            ></div>
          )}
        </div>
      }
    />
  );
};

const SundialHeader = ({ gameData, assets }) => (
  <div className="relative h-symbol-primary w-symbol-primary">
    <img
      src={assets.uxui.sundial}
      alt="sundial"
      className={`absolute ${
        gameData.stats.dailyQuota < 4 ? "grayscale" : ""
      } z-30 w-auto h-auto max-w-full max-h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
    />
    <img
      src={
        assets.items[`amulet.${gameData.stats.dailyQuota < 4 ? "moon" : "sun"}`]
      }
      alt="amulet"
      className="w-full h-full rounded-full shadow-2xl pointer-events-none z-40 relative"
    />
    <div className="absolute z-40 flex justify-center items-center inset-0 text-[5rem] text-white text-black-contour">
      {gameData.stats.dailyQuota}
    </div>
  </div>
);

export default RoRHeader;
