import React, { useContext, useEffect, useState } from "react";
import "../../styles/carousel.scss";
import { RorContext } from "../../context/context";
import CitadelItem from "./CitadelItem";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const CitadelCarousel = ({ enableGuide, mythData }) => {
  const { activeMyth, gameData, setSection, enableHaptic } =
    useContext(RorContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const boosters = [
      {
        key: "blacksmith",
        component: (
          <CitadelItem
            icon="h"
            isMulti={false}
            itemKey="furnace"
            desc="Blacksmith"
            handleClick={async () => {
              handleClickHaptic(tele, enableHaptic);

              setSection(3);
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
            desc="Banker"
            handleClick={() => {
              handleClickHaptic(tele, enableHaptic);

              setSection(4);
            }}
          />
        ),
      },
      {
        key: "library",
        component: (
          <CitadelItem
            disable={false}
            icon="+"
            isMulti={false}
            itemKey="library"
            desc="Librarian"
            handleClick={async () => {
              handleClickHaptic(tele, enableHaptic);

              setSection(12);
            }}
          />
        ),
      },
      {
        key: "rest",
        component: (
          <CitadelItem
            disable={false}
            icon="7"
            isMulti={false}
            itemKey="tavern"
            desc="Bartender"
            handleClick={() => {
              handleClickHaptic(tele, enableHaptic);

              setSection(13);
            }}
          />
        ),
      },
      {
        key: "gemologist",
        component: (
          <CitadelItem
            disable={
              gameData.stats.blackShards >= 100 ||
              gameData.stats.whiteShards >= 100
            }
            icon="v"
            isMulti={false}
            itemKey="apothecary"
            desc="Gemologist"
            handleClick={async () => {
              if (
                gameData.stats.blackShards >= 100 ||
                gameData.stats.whiteShards >= 100
              ) {
                handleClickHaptic(tele, enableHaptic);

                setSection(11);
              }
            }}
          />
        ),
      },
      {
        key: "port",
        component: (
          <CitadelItem
            disable={false}
            icon="E"
            isMulti={false}
            itemKey="port"
            desc="Port"
            handleClick={() => {}}
          />
        ),
      },
    ];

    const boosterStatus = {
      blacksmith: false,
      vault: false,
      library: false,
      rest: false,
      gemologist:
        gameData.stats.blackShards >= 100 || gameData.stats.whiteShards >= 100,
    };

    const predefinedOrder = [
      "blacksmith",
      "vault",
      "library",
      "rest",
      "gemologist",
      "port",
    ];

    const sortedItems = boosters
      .filter((item) => predefinedOrder.includes(item.key))
      .sort((a, b) => {
        const statusA = boosterStatus[a.key] || false;
        const statusB = boosterStatus[b.key] || false;

        if (statusA && !statusB) return -1;
        if (!statusA && statusB) return 1;

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
