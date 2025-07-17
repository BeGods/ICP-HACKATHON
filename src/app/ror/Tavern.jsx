import React, { useContext, useEffect, useState } from "react";
import RoRHeader from "../../components/Layouts/Header";
import { RorContext } from "../../context/context";
import { gameItems } from "../../utils/gameItems";
import MiscCard from "../../components/Cards/Citadel/MiscCard";
import RoRBtn from "../../components/Buttons/RoRBtn";
import { getActiveFeature, setStorage } from "../../helpers/cookie.helper";
import { activateRest, claimArtifact } from "../../utils/api.ror";
import { showToast } from "../../components/Toast/Toast";
import { useNavigate } from "react-router-dom";
import { useRoRGuide } from "../../hooks/Tutorial";
import { TavernGuide } from "../../components/Tutorials/RorTutorial";
import { colorByMyth } from "../../utils/constants.ror";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ handleClick, assets }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${assets.boosters.tavernHead})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      onClick={handleClick}
      className="flex z-50 cursor-pointer justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 left-1/2 -translate-x-1/2"
    ></div>
  );
};

const Tavern = () => {
  const navigate = useNavigate();
  const { gameData, setGameData, setShowCard, assets, authToken, isTgMobile } =
    useContext(RorContext);
  const [enableGuide, setEnableGuide] = useRoRGuide("ror-tutorial05");
  const [currSection, setCurrSection] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const shoes = gameItems.filter((itm) => itm.id.includes("artifact.common03"));
  const keys = gameItems.filter((itm) => itm.id.includes("artifact.common02"));
  const [isClicked, setIsClicked] = useState(false);
  const currItems = currSection == 2 ? keys : shoes;
  const totalPages = currItems.length;
  const mythology = currItems[currentPage].id?.split(".")[0];
  const buttonColor = colorByMyth[mythology] ?? "black";
  const isClaimed =
    currSection === 1
      ? gameData.stats.isRestActive
      : gameData.pouch.find((id) => id == currItems[currentPage].id);

  const buttonLabel = isClaimed ? "CLAIMED" : "PAY";

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
        img={assets.boosters.tavernCard}
        icon="7"
        hideClose={true}
        sound="tavernist"
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

  const handleActivateRest = async () => {
    if (gameData.stats.isRestActive) {
    } else {
      try {
        const response = await activateRest(authToken);
        setShowCard(null);
        setGameData((prev) => {
          const newStats = { ...prev.stats };

          newStats.gobcoin = (prev.stats.gobcoin || 0) - 1;
          newStats.isRestActive = true;
          newStats.digLvl += 1;

          return {
            ...prev,
            stats: newStats,
          };
        });
        console.log(response);
        showToast("meal_success");
      } catch (error) {
        console.log(error);
        setShowCard(null);
        showToast("meal_error");
      }
    }
  };

  useEffect(() => {
    const checkFirstTime = async () => {
      const isActive = await getActiveFeature(tele, "tavern01");

      if (!isActive) {
        setShowCard(
          <MiscCard
            showInfo={false}
            img={assets.boosters.tavernCard}
            icon="7"
            hideClose={true}
            sound="tavernist"
            isMulti={false}
            handleClick={() => handleActivate("tavern01", true)}
            Button={
              <RoRBtn
                isNotPay={true}
                message={"LEAVE"}
                left={1}
                right={1}
                handleClick={() => handleActivate("tavern01", true)}
              />
            }
          />
        );
      }
    };
    (async () => await checkFirstTime())();
  }, []);

  const handleClaimItem = async (itemId) => {
    try {
      await claimArtifact(authToken, itemId);
      setShowCard(null);
      setGameData((prev) => {
        let updatedPouch = [...prev.pouch, itemId];
        let updatdStats = { ...prev.stats };

        updatdStats.gobcoin -= 1;

        return {
          ...prev,
          pouch: updatedPouch,
          stats: updatdStats,
        };
      });
      showToast("item_success_pouch");
    } catch (error) {
      showToast("item_error");
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    if (enableGuide) {
      setShowCard(
        <TavernGuide
          handleClick={() => {
            setShowCard(null);
            setEnableGuide(false);
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
            {[
              { icon: "F", label: "walk" },
              { icon: ")", label: `eat` },
              { icon: "Z", label: "unlock" },
            ].map((itm, index) => (
              <div
                key={`box-${index}`}
                onClick={() => setCurrSection(index)}
                className={` border ${
                  currSection == index && index === 1
                    ? `border-white text-white glow-button-white text-black-contour`
                    : currSection == index
                    ? `border-${mythology}-primary text-${mythology}-primary text-black-contour glow-button-${mythology}`
                    : `border-white text-white`
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
                  {itm.label}
                </div>
              </div>
            ))}
          </div>

          {/* items */}
          <div className="flex relative flex-col justify-center items-center gap-y-4 h-[68%]">
            <div className="flex justify-center items-center text-center text-white h-fit w-full">
              <div className="flex gap-x-2 justify-center items-center w-full">
                <div
                  className={`font-symbols text-gold text-black-contour  text-[2rem]`}
                >
                  A
                </div>
                <div
                  className={`font-fof text-[1.75rem] font-normal  text-black-contour transition-all duration-1000 text-white`}
                >
                  1
                </div>
              </div>
            </div>

            <div className="flex justify-center relative">
              <img
                src={`${
                  currSection !== 1
                    ? `https://media.publit.io/file/BeGods/items/240px-${currItems[currentPage].id}.png`
                    : assets.items.meal
                }`}
                alt="box"
                className={`glow-text-white w-item ${
                  currSection == 1 && "h-[13rem]"
                }`}
              />

              {currSection == 1 && (
                <div className="absolute z-50 text-[2.5rem] text-gold text-black-contour bottom-0 -mb-2 right-2">
                  {gameData.stats.digLvl ?? 1}
                  <span>x</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* bottom buttons */}
        <div className="absolute bottom-[2dvh]">
          <div
            onMouseDown={() => {
              setIsClicked(true);
            }}
            onMouseUp={() => {
              setIsClicked(false);
            }}
            onMouseLeave={() => {
              setIsClicked(false);
            }}
            onTouchStart={() => {
              setIsClicked(true);
            }}
            onTouchEnd={() => {
              setIsClicked(false);
            }}
            onTouchCancel={() => {
              setIsClicked(false);
            }}
            onClick={() => {
              if (
                currSection !== 1 &&
                !gameData.pouch.find((id) => id == currItems[currentPage].id)
              ) {
                handleClaimItem(currItems[currentPage].id);
              } else if (currSection == 1 && !gameData.stats.isRestActive) {
                handleActivateRest();
              }
            }}
            className="flex justify-center items-center relative h-fit"
          >
            <img
              src={
                currSection !== 1
                  ? isClicked || isClaimed
                    ? assets.buttons[buttonColor]?.off
                    : assets.buttons[buttonColor]?.on
                  : isClicked || isClaimed
                  ? assets.buttons.black.off
                  : assets.buttons.black.on
              }
              alt="button"
            />
            <div className="absolute z-50 uppercase text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
              {buttonLabel}
            </div>
          </div>
        </div>
      </div>
      {currSection !== 1 && (
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
      )}
    </div>
  );
};

export default Tavern;
