import React, { useContext, useEffect, useState } from "react";
import "../../styles/carousel.scss";
import { FofContext } from "../../context/context";
import BoosterClaim from "../Cards/Boosters/BoosterCrd";
import BoosterItem from "../Cards/Boosters/BoosterItem";
import { useTranslation } from "react-i18next";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { hasTimeElapsed } from "../../helpers/booster.helper";
import { mythologies } from "../../utils/constants.fof";

const tele = window.Telegram?.WebApp;

const BoosterCarousel = ({ enableGuide, mythData }) => {
  const { t } = useTranslation();
  const {
    showCard,
    setShowCard,
    activeMyth,
    gameData,
    setSection,
    enableHaptic,
    questsData,
  } = useContext(FofContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);
  const [items, setItems] = useState([]);
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    const boosters = [
      {
        key: "automata",
        component: (
          <BoosterItem
            key="automata"
            index={0}
            currentIndex={currentIndex}
            isGuideActive={enableGuide}
            isActive={!mythData.isAutomataActive}
            handleClick={() => {
              handleBoosterClick("automata", 0, false);
            }}
            activeMyth={activeMyth}
            t={t}
            booster={0}
          />
        ),
      },
      {
        key: "minion",
        component: (
          <BoosterItem
            key="minion"
            index={1}
            currentIndex={currentIndex}
            isActive={mythData.isShardsClaimActive}
            handleClick={() => handleBoosterClick("minion", 2, false)}
            activeMyth={activeMyth}
            t={t}
            booster={2}
          />
        ),
      },
      {
        key: "quests",
        component: (
          <BoosterItem
            key="quests"
            index={2}
            currentIndex={currentIndex}
            isGuideActive={enableGuide}
            isActive={true}
            handleClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setSection(1);
            }}
            activeMyth={activeMyth}
            t={t}
            booster={1}
          />
        ),
      },
      {
        key: "burst",
        component: (
          <BoosterItem
            key="burst"
            index={3}
            currentIndex={currentIndex}
            isActive={
              !gameData.mythologies[activeMyth].boosters.isBurstActive ||
              gameData.mythologies[activeMyth].boosters.isBurstActiveToClaim
            }
            handleClick={() => handleBoosterClick("burst", 6, false)}
            mythData={mythData}
            isGuideActive={enableGuide}
            activeMyth={activeMyth}
            t={t}
            booster={6}
          />
        ),
      },
    ];

    // Add conditional boosters
    if (gameData.isBurstAutoPayActive) {
      boosters.push({
        key: "multiBurst",
        component: (
          <BoosterItem
            key="multiBurst"
            index={0}
            currentIndex={currentIndex}
            isGuideActive={enableGuide}
            isActive={true}
            handleClick={() => handleBoosterClick("burst", 8, true)}
            activeMyth={activeMyth}
            t={t}
            booster={8}
          />
        ),
      });
    }

    if (gameData.isEligibleToAutomataAuto) {
      boosters.push({
        key: "multiAutomata",
        component: (
          <BoosterItem
            key="multiAutomata"
            index={0}
            currentIndex={currentIndex}
            isGuideActive={enableGuide}
            isActive={true}
            handleClick={() => handleBoosterClick("automata", 7, true)}
            activeMyth={activeMyth}
            t={t}
            booster={7}
          />
        ),
      });
    }

    const dailyQuest = questsData.find((quest) => quest.status === "Active");
    const boosterStatus = {
      quests:
        dailyQuest &&
        !dailyQuest.isClaimed &&
        dailyQuest.mythology === mythologies[activeMyth],
      multiAutomata: gameData?.isAutomataAutoActive === -1,
      multiBurst: hasTimeElapsed(gameData.autoPayBurstExpiry),
      moon: !gameData.isMoonActive,
      automata: !gameData.mythologies[activeMyth].boosters.isAutomataActive,
      burst: gameData.mythologies[activeMyth].boosters.isBurstActiveToClaim,
      minion: gameData.mythologies[activeMyth].boosters.isShardsClaimActive,
    };

    const predefinedOrder = [
      "quests",
      "multiAutomata",
      "multiBurst",
      "moon",
      "automata",
      "burst",
      "minion",
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

  const handleBoosterClick = (activeCard, booster, isAutoPay) => {
    if (
      activeCard === "burst" &&
      !isAutoPay &&
      !gameData.mythologies[activeMyth].isEligibleForBurst
    ) {
    } else {
      setShowCard(
        <BoosterClaim
          booster={booster}
          isAutoPay={isAutoPay}
          activeCard={activeCard}
          activeMyth={activeMyth}
          mythData={mythData}
          closeCard={() => setShowCard(null)}
          t={t}
        />
      );
    }
  };

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (deltaY > 50 && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (deltaY < -50 && currentIndex < items.length - 4) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    setShowEffect(false);
    const resetTimeout = setTimeout(() => {
      setShowEffect(true);
    }, 500);

    return () => clearTimeout(resetTimeout);
  }, [activeMyth]);

  return (
    <div className="flex flex-col justify-center items-center h-full w-[78%] mt-[4.5rem]">
      <div
        className="wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`carousel carousel-width transition-all duration-500 relative`}
        >
          {items.slice(currentIndex, currentIndex + 4).map((item, index) => {
            let className = "carousel__item";
            let onClick = null;

            if (index === 2) className += " active";
            else if (index === 1) className += " previous";
            else if (index === 0) className += " previous2";
            else if (index === 3) className += " next";

            if (currentIndex > 0 && index === 0) {
              className += " fade-top fade-click-overlay";
              onClick = (e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => prev - 1);
              };
            }

            if (currentIndex + 4 < items.length && index === 3) {
              className += " fade-bottom fade-click-overlay";
              onClick = (e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => prev + 1);
              };
            }

            return (
              <div
                className={className}
                key={currentIndex + index}
                onClick={onClick}
              >
                <div
                  className={onClick ? "pointer-events-none w-full" : "w-full"}
                >
                  {item}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BoosterCarousel;

// {
//   key: "moon",
//   component: (
//     <BoosterItem
//       key="moon"
//       index={0}
//       currentIndex={currentIndex}
//       isGuideActive={enableGuide}
//       isActive={gameData.isMoonActive}
//       handleClick={() => handleBoosterClick("moon", false)}
//       activeMyth={activeMyth}
//       t={t}
//       booster={9}
//     />
//   ),
// },
