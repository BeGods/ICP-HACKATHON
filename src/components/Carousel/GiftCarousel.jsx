import React, { useState } from "react";
import "../../styles/carousel.scss";
import { useTranslation } from "react-i18next";
import GiftItemCrd from "../Cards/Reward/GiftItemCrd";

const tele = window.Telegram?.WebApp;

const GiftCarousel = ({ rewards }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (deltaY > 50 && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (deltaY < -50 && currentIndex < rewards.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div
      className="wrapper h-[60vh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="carousel">
        {rewards.map((item, index) => {
          let className = "carousel__item";
          const offset = index - currentIndex;

          if (currentIndex === 0 && index === rewards.length - 1) {
            className += " previous";
          } else if (currentIndex === rewards.length - 1 && index === 0) {
            className += " next";
          } else if (offset === 0) {
            className += " active";
          } else if (
            offset === 1 ||
            (currentIndex === rewards.length - 1 &&
              offset === -rewards.length + 1)
          ) {
            className += " next";
          } else if (
            offset === -1 ||
            (currentIndex === 0 && offset === rewards.length - 1)
          ) {
            className += " previous";
          }

          return (
            <div className={className} key={index}>
              <GiftItemCrd key={item.id} item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GiftCarousel;
