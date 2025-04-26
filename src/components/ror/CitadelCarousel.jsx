import React, { useContext, useEffect, useState } from "react";
import "../../styles/carousel.scss";
import { RorContext } from "../../context/context";
import CitadelItem from "./CitadelItem";
import MiscCard from "./MiscCard";
import RoRBtn from "./RoRBtn";
import { toast } from "react-toastify";
import {
  activateBlacksmith,
  activateLibrarian,
  activateRest,
  activateVault,
} from "../../utils/api.ror";
import {
  getActiveFeature,
  getStorage,
  setStorage,
} from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const CitadelCarousel = ({ enableGuide, mythData }) => {
  const {
    assets,
    setShowCard,
    activeMyth,
    authToken,
    gameData,
    setSection,
    setGameData,
  } = useContext(RorContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);
  const [items, setItems] = useState([]);
  const [showEffect, setShowEffect] = useState(false);

  const handleActivateBank = async (isMulti) => {
    if (gameData.bank.isVaultActive) {
      setSection(4);
    } else {
      try {
        const response = await activateVault(authToken, isMulti);
        setShowCard(null);
        setGameData((prev) => {
          const newStats = { ...prev.stats };

          newStats.gobcoin = prev.stats.gobcoin - (isMulti ? 5 : 1);

          return {
            ...prev,
            stats: newStats,
            bank: {
              ...prev.bank,
              isVaultActive: true,
            },
          };
        });
        setSection(2);
        console.log(response);
        toast.success("vault activated");
      } catch (error) {
        console.log(error);
        setShowCard(null);
        toast.error("insufficient gobcoins");
      }
    }
  };

  const handleActivateRest = async () => {
    if (gameData.stats.isRestActive) {
      setSection(13);
    } else {
      try {
        const response = await activateRest(authToken);
        setShowCard(null);
        setGameData((prev) => {
          const newStats = { ...prev.stats };

          newStats.gobcoins = (prev.stats.gobcoin || 0) - 1;
          newStats.isRestActive = true;
          return {
            ...prev,
            stats: newStats,
          };
        });
        setSection(1);
        console.log(response);
        toast.success("rest activated");
      } catch (error) {
        console.log(error);
        setShowCard(null);
        toast.error("insufficient gobcoins");
      }
    }
  };

  const handleActivate = async (key, value, navigateTo) => {
    setSection(navigateTo);
    setShowCard(null);
    await setStorage(tele, key, value);
  };

  useEffect(() => {
    const boosters = [
      {
        key: "blacksmith",
        component: (
          <CitadelItem
            icon="h"
            isMulti={false}
            itemKey="furnace"
            handleClick={async () => {
              const isActive = await getActiveFeature(tele, "blacksmith");
              if (isActive) {
                setSection(3);
              } else {
                setShowCard(
                  <MiscCard
                    img={assets.boosters.minionCard}
                    icon="w"
                    isMulti={false}
                    handleClick={() => handleActivate("blacksmith", "true", 3)}
                    Button={
                      <RoRBtn
                        isNotPay={true}
                        left={1}
                        right={1}
                        handleClick={() =>
                          handleActivate("blacksmith", "true", 3)
                        }
                      />
                    }
                  />
                );
              }
            }}
          />
        ),
      },
      {
        key: "vault",
        component: (
          <CitadelItem
            icon="A"
            itemKey="bank"
            handleClick={() => {
              if (gameData.bank.isVaultActive) {
                setSection(4);
              } else {
                setShowCard(
                  <MiscCard
                    img={assets.boosters.bankerCard}
                    icon="A"
                    isMulti={false}
                    handleClick={handleActivateBank}
                    Button={
                      <RoRBtn
                        left={1}
                        right={1}
                        handleClick={handleActivateBank}
                      />
                    }
                  />
                );
              }
            }}
          />
        ),
      },
      {
        key: "gemologist",
        component: (
          <CitadelItem
            icon="v"
            isMulti={false}
            itemKey="apothecary"
            handleClick={async () => {
              const isActive = await getActiveFeature(tele, "gemologist");
              if (isActive) {
                setSection(11);
              } else {
                setShowCard(
                  <MiscCard
                    img={assets.boosters.gemologistCard}
                    icon="A"
                    isMulti={false}
                    handleClick={() => handleActivate("gemologist", "true", 11)}
                    Button={
                      <RoRBtn
                        isNotPay={true}
                        left={1}
                        right={1}
                        handleClick={() =>
                          handleActivate("gemologist", "true", 11)
                        }
                      />
                    }
                  />
                );
              }
            }}
          />
        ),
      },
      {
        key: "library",
        component: (
          <CitadelItem
            icon="+"
            isMulti={false}
            itemKey="library"
            handleClick={() => {
              if (gameData.stats.isLibrnActive) {
                setSection(12);
              } else {
                setShowCard(
                  <MiscCard
                    img={assets.boosters.libCard}
                    icon="Y"
                    isMulti={false}
                    handleClick={() => handleActivate("library", "true", 12)}
                    Button={
                      <RoRBtn
                        isNotPay={true}
                        left={1}
                        right={1}
                        handleClick={() =>
                          handleActivate("library", "true", 12)
                        }
                      />
                    }
                  />
                );
              }
            }}
          />
        ),
      },
    ];

    if (gameData.stats.isThiefActive) {
      boosters.push({
        key: "rest",
        component: (
          <CitadelItem
            icon="7"
            isMulti={false}
            itemKey="tavern"
            handleClick={() => {
              if (gameData.stats.isRestActive) {
                setSection(13);
              } else {
                setShowCard(
                  <MiscCard
                    isMulti={false}
                    handleClick={handleActivateRest}
                    Button={
                      <RoRBtn
                        left={1}
                        right={1}
                        isMulti={false}
                        handleClick={handleActivateRest}
                      />
                    }
                  />
                );
              }
            }}
          />
        ),
      });
    }

    const boosterStatus = {
      multiVault: !gameData.bank.isVaultActive,
      vault: !gameData.bank.isVaultActive,
      blacksmith: true,
      merchant: false,
      rest: false,
    };

    const predefinedOrder = [
      "blacksmith",
      "merchant",
      "multiVault",
      "vault",
      "gemologist",
      "library",
      "rest",
    ];

    const sortedItems = boosters
      .filter((item) => predefinedOrder.includes(item.key))
      .sort((a, b) => {
        const statusA = boosterStatus[a.key] || false;
        const statusB = boosterStatus[b.key] || false;

        // If status is true, prioritize it
        if (statusA && !statusB) return -1;
        if (!statusA && statusB) return 1;

        // If both statuses are equal, fall back to predefined order
        const orderA = predefinedOrder.indexOf(a.key);
        const orderB = predefinedOrder.indexOf(b.key);
        return orderA - orderB;
      })
      .map((item) => item.component);

    setItems(sortedItems);
    setCurrentIndex(0);
  }, [activeMyth, enableGuide, mythData, gameData]);

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (deltaY > 50 && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (deltaY < -50 && currentIndex < items.length - 3) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    setShowEffect(false);
    const resetTimeout = setTimeout(() => {
      setShowEffect(true);
    }, 50);

    return () => clearTimeout(resetTimeout);
  }, [activeMyth]);

  return (
    <div
      className="wrapper h-[60vh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {items.length > 3 && currentIndex >= 1 && (
        <div
          onClick={() => {
            setCurrentIndex((prevIndex) => prevIndex - 1);
          }}
          className="absolute top-[24%] mr-[2vw] w-full z-50"
        >
          <div className="arrows-up"></div>
        </div>
      )}
      <div className="carousel">
        {items.slice(currentIndex, currentIndex + 3).map((item, index) => {
          let className = "carousel__item";
          className +=
            index === 1 ? " active" : index === 0 ? " previous" : " next";

          return (
            <div className={className} key={currentIndex + index}>
              {item}
            </div>
          );
        })}
      </div>
      {currentIndex < items.length - 3 && (
        <div
          onClick={() => setCurrentIndex((prevIndex) => prevIndex + 1)}
          className="absolute bottom-[22%] w-full"
        >
          <div className="arrows-down"></div>
        </div>
      )}
    </div>
  );
};

export default CitadelCarousel;
