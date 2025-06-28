import React, { useContext, useEffect, useState } from "react";
import "../../styles/carousel.scss";
import { FofContext } from "../../context/context";
import BoosterClaim from "../Cards/Boosters/BoosterCrd";
import BoosterItem from "../Cards/Boosters/BoosterItem";
import { useTranslation } from "react-i18next";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { hasTimeElapsed } from "../../helpers/booster.helper";
import { mythologies, mythSections } from "../../utils/constants.fof";

const tele = window.Telegram?.WebApp;

const BoosterCarousel = ({ enableGuide, mythData }) => {
  const { t } = useTranslation();
  const {
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
            handleClick={() => handleBoosterClick("automata", 0, false)}
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
      .filter((item) => predefinedOrder.includes(item.key)) // Ensure only relevant keys
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
    } else if (deltaY < -50 && currentIndex < items.length - 3) {
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
    <div
      className="wrapper h-[60dvh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {items.length > 3 && currentIndex >= 1 ? (
        <div
          onClick={() => {
            setCurrentIndex((prevIndex) => prevIndex - 1);
          }}
          className="absolute cursor-pointer top-[24%] mr-[2vw] w-full z-50"
        >
          <div className="arrows-up"></div>
        </div>
      ) : (
        <div
          className={`flex absolute ${
            showEffect && "disappear"
          } opacity-100 text-[4.5dvh] uppercase text-white glow-icon-${
            mythSections[activeMyth]
          } h-fit justify-center items-start mt-[1.75vh]`}
        >
          {mythologies[activeMyth]}
        </div>
      )}

      <div className={`carousel carousel-width`}>
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
          className="absolute cursor-pointer bottom-[22%] w-full"
        >
          <div className="arrows-down"></div>
        </div>
      )}
    </div>
  );
};

export default BoosterCarousel;
