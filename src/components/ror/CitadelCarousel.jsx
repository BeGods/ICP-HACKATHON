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
            desc="Blacksmith"
            handleClick={async () => {
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
              setSection(4);
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
            desc="Gemologist"
            handleClick={async () => {
              setSection(11);
              // setShowCard(
              //   <MiscCard
              //     showInfo={false}
              //     img={assets.boosters.gemologistCard}
              //     icon="Gemologist"
              //     isMulti={false}
              //     handleClick={() => handleActivate("gemologist", "true", 11)}
              //     Button={
              //       <RoRBtn
              //         isNotPay={true}
              //         left={1}
              //         right={1}
              //         handleClick={() =>
              //           handleActivate("gemologist", "true", 11)
              //         }
              //       />
              //     }
              //   />
              // );
              // const isActive = await getActiveFeature(tele, "gemologist");
              // if (!isActive) {
              //   setShowCard(
              //     <MiscCard
              //       img={assets.boosters.gemologistCard}
              //       icon="A"
              //       isMulti={false}
              //       handleClick={() => handleActivate("gemologist", "true", 11)}
              //       Button={
              //         <RoRBtn
              //           isNotPay={true}
              //           left={1}
              //           right={1}
              //           handleClick={() =>
              //             handleActivate("gemologist", "true", 11)
              //           }
              //         />
              //       }
              //     />
              //   );
              // }
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
            desc="Librarian"
            handleClick={async () => {
              setSection(12);

              // const isActive = await getActiveFeature(tele, "library");

              // if (isActive) {
              //   setSection(12);
              // } else {
              //   setShowCard(
              //     <MiscCard
              //       img={assets.boosters.libCard}
              //       icon="Librarian"
              //       isMulti={false}
              //       handleClick={() => handleActivate("library", "true", 12)}
              //       Button={
              //         <RoRBtn
              //           isNotPay={true}
              //           left={1}
              //           right={1}
              //           handleClick={() =>
              //             handleActivate("library", "true", 12)
              //           }
              //         />
              //       }
              //     />
              //   );
              // }
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
            desc="Bartender"
            handleClick={() => {
              setSection(13);

              // if (gameData.stats.isRestActive) {
              //   setSection(13);
              // } else {
              //   setShowCard(
              //     <MiscCard
              //       img={assets.boosters.tavernCard}
              //       isMulti={false}
              //       handleClick={handleActivateRest}
              //       Button={
              //         <RoRBtn
              //           left={1}
              //           right={1}
              //           isMulti={false}
              //           handleClick={handleActivateRest}
              //         />
              //       }
              //     />
              //   );
              // }
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
