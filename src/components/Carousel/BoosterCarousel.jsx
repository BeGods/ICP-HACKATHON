import React, { useContext, useState } from "react";
import "../../styles/carousel.scss";
import { MyContext } from "../../context/context";
import BoosterClaim from "../Cards/Boosters/BoosterCrd";
import BoosterItem from "../Cards/Boosters/BoosterItem";
import { useTranslation } from "react-i18next";
import BoosterBtn from "../Buttons/BoosterBtn";

const tele = window.Telegram?.WebApp;

const BoosterCarousel = ({
  enableGuide,
  mythData,
  handleClaimAutomata,
  handleClaimShards,
  handleClaimBurst,
}) => {
  const { t } = useTranslation();
  const { setShowCard, activeMyth, gameData, setSection } =
    useContext(MyContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (deltaY > 50 && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (deltaY < -50 && currentIndex < items.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const items = [
    <BoosterItem
      index={0}
      currentIndex={currentIndex}
      isGuideActive={enableGuide}
      isActive={!mythData.isAutomataActive}
      handleClick={() => {
        tele.HapticFeedback.notificationOccurred("success");
        setShowCard(
          <BoosterClaim
            activeCard={"automata"}
            activeMyth={activeMyth}
            mythData={mythData}
            closeCard={() => setShowCard(null)}
            Button={
              <BoosterBtn
                activeCard={"automata"}
                mythData={mythData}
                handleClaim={handleClaimAutomata}
                activeMyth={activeMyth}
                t={t}
              />
            }
          />
        );
      }}
      activeMyth={activeMyth}
      t={t}
      booster={0}
    />,
    <BoosterItem
      index={1}
      currentIndex={currentIndex}
      isActive={mythData.isShardsClaimActive}
      handleClick={() => {
        tele.HapticFeedback.notificationOccurred("success");
        setShowCard(
          <BoosterClaim
            activeCard={"minion"}
            activeMyth={activeMyth}
            mythData={mythData}
            closeCard={() => setShowCard(null)}
            Button={
              <BoosterBtn
                activeCard={"minion"}
                mythData={mythData}
                handleClaim={handleClaimShards}
                activeMyth={activeMyth}
                t={t}
              />
            }
          />
        );
      }}
      activeMyth={activeMyth}
      t={t}
      booster={2}
    />,
    <BoosterItem
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
      index={3}
      currentIndex={currentIndex}
      isActive={
        !gameData.mythologies[activeMyth].boosters.isBurstActive &&
        gameData.mythologies[activeMyth].boosters.isBurstActiveToClaim
      }
      handleClick={() => {
        if (gameData.mythologies[activeMyth].isEligibleForBurst) {
          tele.HapticFeedback.notificationOccurred("success");
          setShowCard(
            <BoosterClaim
              activeCard={"burst"}
              activeMyth={activeMyth}
              mythData={mythData}
              closeCard={() => setShowCard(null)}
              Button={
                <BoosterBtn
                  activeCard={"burst"}
                  mythData={mythData}
                  handleClaim={handleClaimBurst}
                  activeMyth={activeMyth}
                  t={t}
                />
              }
            />
          );
        }
      }}
      mythData={mythData}
      isGuideActive={enableGuide}
      activeMyth={activeMyth}
      t={t}
      booster={6}
    />,
  ];

  return (
    <div
      className="wrapper h-[60vh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="carousel">
        {items.map((item, index) => {
          let className = "carousel__item";
          const offset = index - currentIndex;

          if (currentIndex === 0 && index === items.length - 1) {
            className += " previous";
          } else if (currentIndex === items.length - 1 && index === 0) {
            className += " next";
          } else if (offset === 0) {
            className += " active";
          } else if (
            offset === 1 ||
            (currentIndex === items.length - 1 && offset === -items.length + 1)
          ) {
            className += " next";
          } else if (
            offset === -1 ||
            (currentIndex === 0 && offset === items.length - 1)
          ) {
            className += " previous";
          }

          return (
            <div className={className} key={index}>
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoosterCarousel;
