import React, { useState, useContext, useEffect } from "react";
import RoRHeader from "../../components/Layouts/Header";
import { gameItems } from "../../utils/gameItems";
import { RorContext } from "../../context/context";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { colorByMyth, elementMythNames } from "../../utils/constants.ror";
import PotionCard from "../../components/Cards/Citadel/PotionCrd";
import MiscCard from "../../components/Cards/Citadel/MiscCard";
import RoRBtn from "../../components/Buttons/RoRBtn";
import { getActiveFeature, setStorage } from "../../helpers/cookie.helper";

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
            flex cursor-pointer justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    ></div>
  );
};

const Apothecary = (props) => {
  const { assets, setShowCard } = useContext(RorContext);
  const potions = gameItems.filter((item) => item.id.includes("potion"));
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = potions.length;
  const element = potions[currentPage].id?.split(".")[1];
  const mythology = elementMythNames[element]?.toLowerCase();
  const buttonColor = colorByMyth[mythology] ?? "black";

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
        icon="Gemologist"
        sound="apothecary"
        isMulti={false}
        handleClick={() => setShowCard(null)}
        Button={
          <RoRBtn
            message={"Close"}
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
    const checkFirstTime = async () => {
      const isActive = await getActiveFeature(tele, "gemologist01");

      if (!isActive) {
        setShowCard(
          <MiscCard
            showInfo={false}
            img={assets.boosters.gemologistCard}
            icon="Gemologist"
            sound="apothecary"
            isMulti={false}
            handleClick={() => handleActivate("gemologist01", true)}
            Button={
              <RoRBtn
                message={"Enter"}
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

  return (
    <div className="w-full h-full">
      <RoRHeader
        CenterChild={<CenterChild assets={assets} handleClick={showInfoCard} />}
      />
      <div className="flex flex-col relative w-[80%]  mt-[18dvh] h-[60dvh] mx-auto">
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
        <div className="grid grid-cols-3 gap-x-1 w-full h-fit place-items-center mt-[1rem]">
          {["", "v", ""].map((itm, index) => (
            <div
              key={`box-${index}`}
              className={` border ${
                index !== 1
                  ? "text-white border-white/70"
                  : `border-${mythology}-primary text-white glow-button-${mythology}`
              }  relative text-white max-w-[120px] w-full rounded-md overflow-hidden `}
            >
              <div
                className={`w-full aspect-square rounded-md bg-white/20 flex justify-center items-center`}
              >
                <span className="text-iconLg font-symbols">{itm}</span>
              </div>

              <div className="w-full uppercase text-center text-sm leading-tight px-1 py-1 truncate">
                potion
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-y-4 justify-center items-center h-full">
          <div className="flex justify-center relative">
            <img
              src={`https://media.publit.io/file/BeGods/items/240px-${potions[currentPage]?.id}.png`}
              alt="potion"
              className="glow-text-white"
            />
          </div>
          <div
            onClick={() =>
              setShowCard(<PotionCard potion={potions[currentPage]?.id} />)
            }
            className="flex cursor-pointer justify-center items-center relative h-fit"
          >
            <img src={assets.buttons[buttonColor]?.on} alt="button" />
            <div className="absolute z-50 uppercase text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
              OPEN
            </div>
          </div>
        </div>
      </div>

      <>
        <ToggleLeft activeMyth={4} handleClick={handlePageLeft} />
        <ToggleRight activeMyth={4} handleClick={handlePageRight} />
      </>
    </div>
  );
};

export default Apothecary;
