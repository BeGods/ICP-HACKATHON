import React, { useContext, useEffect, useState } from "react";
import "../../styles/carousel.scss";
import { MyContext } from "../../context/context";
import BoosterClaim from "../Cards/Boosters/BoosterCrd";
import BoosterItem from "../Cards/Boosters/BoosterItem";
import { useTranslation } from "react-i18next";

const tele = window.Telegram?.WebApp;

const BoosterCarousel = ({ enableGuide, mythData }) => {
  const { t } = useTranslation();
  const { setShowCard, activeMyth, gameData, setSection } =
    useContext(MyContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const newItems = [
      <BoosterItem
        key="automata"
        index={0}
        currentIndex={currentIndex}
        isGuideActive={enableGuide}
        isActive={!mythData.isAutomataActive}
        handleClick={() => handleBoosterClick("automata", false)}
        activeMyth={activeMyth}
        t={t}
        booster={0}
      />,
      <BoosterItem
        key="minion"
        index={1}
        currentIndex={currentIndex}
        isActive={mythData.isShardsClaimActive}
        handleClick={() => handleBoosterClick("minion", false)}
        activeMyth={activeMyth}
        t={t}
        booster={2}
      />,
      <BoosterItem
        key="guide"
        index={2}
        currentIndex={currentIndex}
        isGuideActive={enableGuide}
        isActive={true}
        handleClick={() => {
          tele.HapticFeedback.notificationOccurred("success");
          setSection(1);
        }}
        activeMyth={activeMyth}
        t={t}
        booster={1}
      />,
      <BoosterItem
        key="burst"
        index={3}
        currentIndex={currentIndex}
        isActive={
          !gameData.mythologies[activeMyth].boosters.isBurstActive ||
          gameData.mythologies[activeMyth].boosters.isBurstActiveToClaim
        }
        handleClick={() => handleBoosterClick("burst", false)}
        mythData={mythData}
        isGuideActive={enableGuide}
        activeMyth={activeMyth}
        t={t}
        booster={6}
      />,
    ];

    if (gameData.isAutoPayActive) {
      newItems.push(
        <BoosterItem
          key="automata"
          index={0}
          currentIndex={currentIndex}
          isGuideActive={enableGuide}
          isActive={true}
          handleClick={() => handleBoosterClick("automata", true)}
          activeMyth={activeMyth}
          t={t}
          booster={7}
        />
      );
    }

    setItems(newItems);
    setCurrentIndex(0);
  }, [activeMyth, enableGuide, mythData, gameData]);

  const handleBoosterClick = (activeCard, isAutoPay) => {
    setShowCard(
      <BoosterClaim
        isAutoPay={isAutoPay}
        activeCard={activeCard}
        activeMyth={activeMyth}
        mythData={mythData}
        closeCard={() => setShowCard(null)}
        t={t}
      />
    );
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
          className="absolute top-[26%] mr-[2vw] w-full z-50"
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
          className="absolute bottom-[24%] w-full"
        >
          <div className="arrows-down"></div>
        </div>
      )}
    </div>
  );
};

export default BoosterCarousel;
