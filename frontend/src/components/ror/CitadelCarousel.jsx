import React, { useContext, useEffect, useState } from "react";
import "../../styles/carousel.scss";
import { RorContext } from "../../context/context";
import CitadelItem from "./CitadelItem";
import MiscCard from "./MiscCard";
import RoRBtn from "./RoRBtn";
import { toast } from "react-toastify";
import { activateRest, activateVault } from "../../utils/api.ror";

const CitadelCarousel = ({ enableGuide, mythData }) => {
  const {
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

  const handleActivateBank = async () => {
    if (gameData.bank.isVaultActive) {
      setSection(2);
    } else {
      try {
        const response = await activateVault(authToken);
        setShowCard(null);
        setGameData((prev) => {
          return {
            ...prev,
            bank: {
              ...prev.bank,
              isVaultActive: true,
            },
          };
        });
        setSection(0);
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
      setSection(2);
    } else {
      try {
        const response = await activateRest(authToken);
        setShowCard(null);
        setGameData((prev) => {
          return {
            ...prev,
            stats: {
              ...prev.stats,
              isRestActive: true,
            },
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

  useEffect(() => {
    const boosters = [
      {
        key: "blacksmith",
        component: (
          <CitadelItem
            isMulti={false}
            itemKey="blacksmith"
            handleClick={() => {
              setSection(3);
            }}
          />
        ),
      },
      {
        key: "merchant",
        component: (
          <CitadelItem
            isMulti={false}
            itemKey="merchant"
            handleClick={() => {
              setSection(4);
            }}
          />
        ),
      },
      {
        key: "vault",
        component: (
          <CitadelItem
            itemKey="vault"
            handleClick={() => {
              if (gameData.bank.isVaultActive) {
                setSection(5);
              } else {
                setShowCard(
                  <MiscCard
                    isMulti={false}
                    handleClick={handleActivateBank}
                    Button={<RoRBtn handleClick={handleActivateBank} />}
                  />
                );
              }
            }}
          />
        ),
      },
    ];

    if (!gameData.bank.isVaultActive) {
      boosters.push({
        key: "multiVault",
        component: (
          <CitadelItem
            isMulti={true}
            itemKey="multiVault"
            handleClick={() => {
              if (gameData.bank.isVaultActive) {
                setSection(5);
              } else {
                setShowCard(
                  <MiscCard
                    isMulti={true}
                    handleClick={handleActivateBank}
                    Button={
                      <RoRBtn isMulti={true} handleClick={handleActivateBank} />
                    }
                  />
                );
              }
            }}
          />
        ),
      });
    }

    if (!gameData.stats.isRestActive) {
      boosters.push({
        key: "rest",
        component: (
          <CitadelItem
            isMulti={false}
            itemKey="rest"
            handleClick={() => {
              setShowCard(
                <MiscCard
                  isMulti={false}
                  handleClick={handleActivateRest}
                  Button={
                    <RoRBtn isMulti={false} handleClick={handleActivateRest} />
                  }
                />
              );
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
