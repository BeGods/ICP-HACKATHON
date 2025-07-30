import { useContext, useState } from "react";
import OverlayLayout from "../../Layouts/OverlayLayout";
import { CardWrap } from "../../Layouts/Wrapper";
import { RorContext } from "../../../context/context";
import { PrimaryBtn, CoinBtnAddOn } from "../../Buttons/PrimaryBtn";
import {
  elementMythNames,
  elementOrder,
  mythElementNamesLowerCase,
} from "../../../utils/constants.ror";
import {
  CustomToggleLeft,
  ToggleLeft,
  ToggleRight,
} from "../../Common/SectionToggles";
import { gameItems } from "../../../utils/gameItems";
import { mythSections } from "../../../utils/constants.fof";
import { BookOpenText, Check, Clapperboard } from "lucide-react";
import { useOpenAd } from "../../../hooks/DappAds";
import { isItemInInventory } from "../../../helpers/ror.timers.helper";
import BookCrd from "../Citadel/BookCrd";
import { useMaskStyle } from "../../../hooks/MaskStyle";

const loadPotionDetails = (gameData, mythIndex, potionFilter) => {
  const potions = gameItems
    .filter((item) => item.id.includes("potion"))
    .sort((a, b) => {
      const getElementIndex = (id) => {
        const element = elementOrder.find((el) => id.includes(el));
        return element ? elementOrder.indexOf(element) : Infinity;
      };
      return getElementIndex(a.id) - getElementIndex(b.id);
    });

  const filteredPotions = potionFilter
    ? potions.filter((itm) => itm.id === potionFilter)
    : potions;
  const potion = filteredPotions[mythIndex];
  const [element, code] = potion.id.split(".").slice(1);
  const potionMyth = elementMythNames[element]?.toLowerCase();

  const getShards = (name) =>
    gameData.stats.mythologies?.find((m) => m.name?.toLowerCase() === name)
      ?.shards || 0;

  const firstSlot = [
    {
      style: "text-white text-black-contour",
      value: gameData.stats.whiteShards ?? 0,
    },
    {
      style: `text-${potionMyth}-primary text-black-contour`,
      value: getShards(potionMyth),
    },
    {
      style: "text-black text-white-contour",
      value: gameData.stats.blackShards ?? 0,
    },
  ];

  const secondSlot = [
    {
      style: "text-black text-white-contour",
      value: gameData.stats.blackShards ?? 0,
    },
    {
      style: code.includes("A01")
        ? "text-white text-black-contour"
        : "text-black text-white-contour",
      value: gameData.stats.whiteShards ?? 0,
    },
    {
      style: "text-white text-black-contour",
      value: gameData.stats.whiteShards ?? 0,
    },
  ];

  const filteredFirstSlot = filteredPotions?.includes("aether.A01")
    ? firstSlot[0]
    : filteredPotions?.includes("aether.B01")
    ? firstSlot[2]
    : firstSlot[1];
  const filteredSecondSlot = filteredPotions?.includes("aether.A01")
    ? secondSlot[0]
    : filteredPotions?.includes("aether.B01")
    ? secondSlot[2]
    : secondSlot[1];

  return {
    potions: filteredPotions,
    potionMyth,
    firstSlot: filteredFirstSlot,
    secondSlot: filteredSecondSlot,
  };
};

export const renderImage = (
  mode,
  src,
  itemId,
  itemDetails,
  fragmentId,
  isComplete
) => {
  const imgUrl = `https://media.publit.io/file/BeGods/items/240px-${itemId}.png`;
  const mask = useMaskStyle(itemId, itemDetails?.fragments?.length ?? 1, [
    fragmentId,
  ]);

  if (mode?.includes("artifact")) {
    return (
      <div className="relative select-none flex justify-center items-center mb-8">
        <div
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
          className="relative w-full select-none h-full"
        >
          <img
            src={imgUrl}
            alt="relic"
            draggable={false}
            style={{ userSelect: "none", WebkitUserDrag: "none" }}
            className={`w-full h-full object-contain ${
              !isComplete ? "grayscale" : ""
            }`}
          />
        </div>

        {(!isComplete || isComplete == false) && mask}
      </div>
    );
  }

  if (mode?.includes("character")) {
    return (
      <img
        src={`https://media.publit.io/file/BeGods/chars/240px-${src}.png`}
        alt="artifact"
        className="rounded-primary"
      />
    );
  }

  if (mode?.includes("non-item")) {
    return <img src={src} alt="artifact" className="rounded-primary" />;
  }
  return <img src={imgUrl} alt="artifact" className="rounded-primary mb-8" />;
};

// 240px-shard.fire01.png

const ItemCrd = ({
  mode,
  isComplete,
  src,
  fragmentId,
  icon,
  label,
  showAds,
  showAdOn,
  handleClick,
  handleAdOn,
}) => {
  const { assets, gameData, setShowCard } = useContext(RorContext);
  const [myth, setMyth] = useState(
    mode?.includes("non-item") || src?.includes("aether") ? null : 0
  );
  const customItem = mythSections.some((word) => src?.includes(word));
  const currMyth =
    mode?.includes("non-item") || src?.includes("aether")
      ? "white"
      : customItem
      ? src.split(".")[0]
      : mythSections[myth];
  const mappedElement = mythElementNamesLowerCase[currMyth];
  const itemId =
    mode?.includes("shard") && src?.includes("aether")
      ? src
      : mode?.includes("multi-shard")
      ? `shard.${mappedElement}01`
      : customItem
      ? src
      : `${currMyth}.${src}`;
  const isItemClaimed =
    mode == "non-item"
      ? gameData.stats.isRestActive
      : isItemInInventory(gameData, itemId);
  const itemDetails = gameItems.find((item) => item?.id === itemId);
  const adsgramId = import.meta.env.VITE_AD_VERIFY_ID;

  const onReward = async () => {
    handleClick(itemId, adsgramId);
  };

  const { loadAd, isReady } = useOpenAd({
    callReward: onReward,
  });

  return (
    <OverlayLayout customMyth={currMyth !== "white" && currMyth}>
      {/* payment balance */}
      {mode?.includes("shard") ? (
        <div className="flex gap-4 pt-gamePanelTop w-full justify-center items-center">
          <div className="flex gap-1 justify-center items-center">
            <div
              className={`flex relative text-center justify-center max-w-orb p-0.5 items-center ${
                src?.includes("shard.aether01")
                  ? "text-white text-black-contour"
                  : src?.includes("shard.aether02")
                  ? "text-black text-white-contour"
                  : `text-${currMyth}-primary text-black-contour`
              } rounded-full text-[2.5rem] font-symbols`}
            >
              l
            </div>
            <div className="font-fof text-[2rem] font-normal text-white text-black-sm-contour transition-all duration-1000">
              {src?.includes("shard.aether01")
                ? gameData.stats.whiteShards ?? 0
                : src?.includes("shard.aether02")
                ? gameData.stats.blackShards ?? 0
                : gameData.stats.mythologies.find(
                    (itm) => itm?.name?.toLowerCase() === currMyth
                  ).shards}
            </div>
          </div>
        </div>
      ) : (
        mode?.includes("show") &&
        !isItemClaimed && (
          <div className="flex gap-4 pt-gamePanelTop w-full justify-center items-center">
            <div className="flex gap-1 justify-center items-center">
              <div className="flex relative text-center justify-center max-w-orb p-0.5 items-center rounded-full glow-icon-white">
                <img src={assets.uxui.gobcoin} alt="orb" />
              </div>
              <div className="font-fof text-[2rem] font-normal text-white text-black-sm-contour transition-all duration-1000">
                {gameData.stats.gobcoin}
              </div>
            </div>
          </div>
        )
      )}

      {/* card */}
      <div className="pointer-events-auto center-section">
        <CardWrap
          disableFlip
          Front={
            <div className="w-full h-full relative flex justify-center items-center">
              <div
                className="absolute grayscale inset-0 rounded-primary"
                style={{
                  backgroundImage: `url(${assets.uxui.bgInfo})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <div className="absolute top-2 left-3 z-10">
                {mode.includes("artifact") || mode.includes("shard") ? (
                  <CoinBtnAddOn
                    content={
                      mode.includes("shard")
                        ? 1
                        : isComplete
                        ? itemDetails.fragments.length
                        : itemDetails.fragments.length / 2
                    }
                    type={"card"}
                  />
                ) : (
                  <div className="text-primary text-black-contour font-symbols">
                    {icon}
                  </div>
                )}
              </div>

              <div className="absolute inset-0 flex justify-center items-center">
                {renderImage(
                  mode,
                  src,
                  itemId,
                  itemDetails,
                  fragmentId,
                  isComplete
                )}
              </div>

              <div
                className={`relative h-full w-full  ${
                  mode?.includes("character") ? "hidden" : "flex "
                } flex-col items-center`}
              >
                <div className="flex z-50 relative flex-col justify-center items-center h-full w-full">
                  <div className="flex relative mt-auto items-center h-[19%] w-full card-shadow-white-celtic">
                    <div
                      className={`rounded-b-primary filter-orbs-${
                        currMyth !== "white" && currMyth
                      }`}
                      style={{
                        backgroundImage: `url(${assets.uxui.footer})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: "100%",
                      }}
                    />
                    <div className="flex justify-center w-full h-full items-center px-2 z-10">
                      <div className="flex gap-x-2 uppercase glow-text-quest text-white z-10">
                        {customItem ? itemDetails?.name : label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          Back={<></>}
        />
      </div>

      {/* button */}
      {!mode.includes("show") && (
        <div className="absolute flex flex-col justify-center bottom-0 mb-safeBottom">
          {label == "book" && isItemClaimed ? (
            <PrimaryBtn
              mode={"default"}
              centerContent={<BookOpenText size={"1.75rem"} />}
              showGlow={isItemClaimed}
              customMyth={currMyth}
              onClick={() => {
                setShowCard(<BookCrd assets={assets} myth={currMyth} />);
              }}
            />
          ) : mode?.includes("claim") ? (
            <PrimaryBtn
              mode={"default"}
              centerContent={<Check size={"1.75rem"} strokeWidth={5} />}
              customMyth={currMyth}
              onClick={() => {
                handleClick(itemId);
                setShowCard(null);
              }}
            />
          ) : mode?.includes("sell") ? (
            <PrimaryBtn
              mode={"default"}
              centerContent={"V"}
              customMyth={currMyth}
              onClick={() => {
                handleClick(itemId);
                setShowCard(null);
              }}
            />
          ) : (
            <PrimaryBtn
              mode={isItemClaimed ? "info" : "default"}
              centerContent={isItemClaimed ? "CLAIMED" : "V"}
              showGlow={isItemClaimed}
              customMyth={currMyth}
              onClick={() => {
                if (mode?.includes("shard")) {
                  handleClick(currMyth);
                } else {
                  handleClick(itemId);
                }
                setShowCard(null);
              }}
              isCoin={!mode?.includes("shard") && true}
              rightContent={!mode?.includes("shard") && 1}
            />
          )}
        </div>
      )}

      <>
        {showAds && !isItemClaimed && (
          <CustomToggleLeft
            minimize={2}
            label={"Pay Via Ads"}
            src={<Clapperboard color="white" size={"2rem"} />}
            handleClick={() => {
              if (!isReady) {
                loadAd();
                setTimeout(() => {}, 9000);
              }
            }}
          />
        )}
        {showAdOn && (
          <CustomToggleLeft
            minimize={2}
            label={"Save Turn"}
            src={"F"}
            handleAdOn={handleAdOn}
          />
        )}
      </>

      {/* sides */}
      {mode?.includes("multi") && (
        <>
          <ToggleLeft
            positionBottom
            activeMyth={4}
            handleClick={() => {
              setMyth((prev) => (prev - 1 + 4) % 4);
            }}
          />
          <ToggleRight
            positionBottom
            activeMyth={4}
            handleClick={() => {
              setMyth((prev) => (prev + 1) % 4);
            }}
          />
        </>
      )}
    </OverlayLayout>
  );
};

export default ItemCrd;

// {isPotion ? (
//   <PotionBtn
//     potion={itemId}
//     myth={currMyth}
//     isClaimed={isItemClaimed}
//   />
// ) : customItem ? (
//   <PrimaryBtn
//     mode="default"
//     centerContent="V"
//     customMyth={customMyth}
//     onClick={handleClick}
//     isCoin={true}
//     rightContent={1}
//   />
// ) : isItemClaimed ? (
//   <PrimaryBtn
//     mode="info"
//     centerContent={
//       <div className="uppercase">
//         {label == "book" ? "read" : "CLAIMED"}
//       </div>
//     }
//     customMyth={customMyth}
//     onClick={() => {
//       if (label === "book") {
// setShowCard(
//   <BookCrd
//     handleClose={() => setShowCard(null)}
//     assets={assets}
//     myth={currMyth}
//   />
// );
//       }
//     }}
//   />
// ) : (
//   <PrimaryBtn
//     mode="default"
//     centerContent="V"
//     customMyth={customMyth}
//     onClick={() => {
//       handleClick(itemId);
//     }}
//     isCoin={true}
//     rightContent={1}
//   />
// )}
