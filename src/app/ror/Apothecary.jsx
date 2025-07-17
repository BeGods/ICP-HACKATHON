import React, { useState, useContext, useEffect } from "react";
import RoRHeader from "../../components/Layouts/Header";
import { gameItems } from "../../utils/gameItems";
import { RorContext } from "../../context/context";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import {
  colorByMyth,
  elementMythNames,
  elementOrder,
} from "../../utils/constants.ror";
import MiscCard from "../../components/Cards/Citadel/MiscCard";
import RoRBtn from "../../components/Buttons/RoRBtn";
import { getActiveFeature, setStorage } from "../../helpers/cookie.helper";
import { useRoRGuide } from "../../hooks/Tutorial";
import { ApothecaryGuide } from "../../components/Tutorials/RorTutorial";
import PotionBtn from "../../components/Buttons/PotionBtn";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ handleClick, assets }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${assets.boosters.gemologistHead})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      onClick={handleClick}
      className={`
            flex cursor-pointer justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-50 left-1/2 -translate-x-1/2`}
    ></div>
  );
};

const Apothecary = (props) => {
  const { assets, isTgMobile, setShowCard, setMinimize, gameData } =
    useContext(RorContext);
  const potions = gameItems
    .filter((item) => item.id.includes("potion"))
    .sort((a, b) => {
      const getElementIndex = (id) => {
        const match = elementOrder.find((element) => id.includes(element));
        return match ? elementOrder.indexOf(match) : Infinity;
      };

      return getElementIndex(a.id) - getElementIndex(b.id);
    });
  const [enableGuide, setEnableGuide] = useRoRGuide("ror-tutorial04");
  const [currentPage, setCurrentPage] = useState(0);
  const [currSection, setCurrSection] = useState(1);
  const totalPages = potions.length;
  const element = potions[currentPage].id?.split(".")[1];
  const code = potions[currentPage].id?.split(".")[2];
  const mythology = elementMythNames[element]?.toLowerCase();
  const buttonColor = colorByMyth[mythology] ?? "black";
  const firstSlot = [
    {
      style: "text-white text-black-contour",
      value: gameData.stats.whiteShards,
    },
    {
      style: `text-${mythology}-primary text-black-contour`,
      value: gameData.stats.mythologies?.find(
        (myth) => myth.name?.toLowerCase() === mythology
      ).shards,
    },
    {
      style: "text-black text-white-contour",
      value: gameData.stats.blackShards,
    },
  ];

  const secondSlot = [
    {
      style: "text-black text-white-contour",
      value: gameData.stats.blackShards,
    },
    {
      style: `${
        code.includes("A01")
          ? "text-white text-black-contour"
          : "text-black text-white-contour"
      }`,
      value: code.includes("A01")
        ? gameData.stats.whiteShards
        : gameData.stats.whiteShards,
    },
    {
      style: `text-white text-black-contour`,
      value: gameData.stats.whiteShards,
    },
  ];

  const handlePageLeft = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handlePageRight = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const showInfoCard = async () => {
    setShowCard(
      <MiscCard
        showInfo={true}
        img={assets.boosters.gemologistCard}
        icon="v"
        hideClose={true}
        sound="apothecary"
        isMulti={false}
        handleClick={() => setShowCard(null)}
        Button={
          <RoRBtn
            message={"LEAVE"}
            isNotPay={true}
            left={1}
            right={1}
            handleClick={() => setShowCard(null)}
          />
        }
      />
    );
  };

  const handleActivate = async (key, value) => {
    setShowCard(null);
    await setStorage(tele, key, value);
  };

  useEffect(() => {
    setMinimize(1);
    const checkFirstTime = async () => {
      const isActive = await getActiveFeature(tele, "gemologist01");

      if (!isActive) {
        setShowCard(
          <MiscCard
            showInfo={false}
            img={assets.boosters.gemologistCard}
            icon="v"
            hideClose={true}
            sound="apothecary"
            isMulti={false}
            handleClick={() => handleActivate("gemologist01", true)}
            Button={
              <RoRBtn
                message={"LEAVE"}
                isNotPay={true}
                left={1}
                right={1}
                handleClick={() => handleActivate("gemologist01", true)}
              />
            }
          />
        );
      }
    };
    (async () => await checkFirstTime())();
  }, []);

  useEffect(() => {
    if (enableGuide) {
      setShowCard(
        <ApothecaryGuide
          handleClick={() => {
            setEnableGuide(false);
            setShowCard(null);
          }}
        />
      );
    }
  }, [enableGuide]);

  return (
    <div className="w-full h-full">
      <RoRHeader
        CenterChild={<CenterChild assets={assets} handleClick={showInfoCard} />}
      />

      <div
        className={`${
          isTgMobile ? "tg-container-height" : "browser-container-height"
        } flex flex-col items-center justify-center`}
      >
        <div className={`grid-width h-[55dvh] mt-[7dvh] mx-auto relative p-1`}>
          <div
            className="absolute inset-0 z-0 filter-orb-white"
            style={{
              backgroundImage: `url(${assets.uxui.baseBgA})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              opacity: 0.5,
            }}
          />
          <div className="grid grid-cols-3 gap-x-1.5 w-full h-fit place-items-center place-content-between">
            {/* feature slots */}
            {[
              {
                icon: "v",
                label: "buy",
              },
              {
                icon: "v",
                label: "buy",
              },
              {
                icon: "v",
                label: `buy`,
              },
            ].map((itm, index) => (
              <div
                key={`box-${index}`}
                onClick={() => setCurrSection(index)}
                className={` border ${
                  index == 1
                    ? `border-${mythology}-primary text-${mythology}-primary text-black-contour ${
                        currSection == 1 && `glow-button-${mythology}`
                      }`
                    : index === 2
                    ? `border-white text-black text-white-contour ${
                        currSection == 2 && "glow-button-white"
                      }`
                    : `${
                        currSection == 0 &&
                        "glow-button-white text-black-contour"
                      } border-white text-white`
                }  relative  max-w-[120px] w-full rounded-md overflow-hidden `}
              >
                <div
                  className={`w-full aspect-square rounded-t-md border-b border-white/50 bg-white/20 flex justify-center items-center`}
                >
                  <span className="text-iconLg font-symbols">{itm.icon}</span>
                </div>
                <div
                  className={`w-full uppercase text-center text-sm bg-black/50 rounded-b-md leading-tight px-1 py-1.5 truncate text-white`}
                >
                  {currSection == index ? "potion" : itm.label}
                </div>
              </div>
            ))}
          </div>

          {/* potions */}
          <div className="flex transition-all duration-300 relative flex-col justify-center items-center gap-y-4 h-[68%]">
            <div className="flex  justify-between items-center text-white h-fit w-full">
              <div className="flex gap-x-2 justify-center items-center w-full h-full">
                <div
                  className={`font-symbols ${firstSlot[currSection].style} text-[2.25rem]`}
                >
                  l
                </div>
                <div
                  className={`font-fof text-[1.75rem] font-normal  text-black-contour transition-all duration-1000 text-white`}
                >
                  {firstSlot[currSection].value}
                  /900
                </div>
              </div>
              <div className="flex gap-x-2 w-full justify-center items-center">
                <div
                  className={`font-symbols text-gold text-black-contour text-[2rem]`}
                >
                  A
                </div>
                <div
                  className={`font-fof text-[1.75rem] font-normal  text-black-contour transition-all duration-1000 text-white`}
                >
                  1
                </div>
              </div>
              <div className="flex gap-x-2 w-full justify-center items-center">
                <div
                  className={`font-symbols ${secondSlot[currSection].style} text-[2.25rem]`}
                >
                  l
                </div>
                <div
                  className={`font-fof text-[1.75rem] font-normal  text-black-contour transition-all duration-1000 text-white`}
                >
                  {secondSlot[currSection].value}
                  /100
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center relative">
              <img
                src={`https://media.publit.io/file/BeGods/items/240px-${
                  currSection == 1
                    ? potions[currentPage]?.id
                    : currSection == 0
                    ? `potion.aether.A01`
                    : `potion.aether.B01`
                }.png`}
                alt="box"
                className={`glow-text-white w-[13rem]`}
              />
            </div>
          </div>
        </div>

        {/* potion btn */}
        <div className="absolute bottom-[2dvh]">
          <PotionBtn
            currSection={currSection}
            buttonColor={buttonColor}
            potion={
              currSection == 1
                ? potions[currentPage]?.id
                : currSection == 0
                ? `potion.aether.A01`
                : `potion.aether.B01`
            }
          />
        </div>
      </div>
      <>
        <ToggleLeft
          positionBottom={true}
          activeMyth={4}
          handleClick={handlePageLeft}
        />
        <ToggleRight
          positionBottom={true}
          activeMyth={4}
          handleClick={handlePageRight}
        />
      </>
    </div>
  );
};

export default Apothecary;
