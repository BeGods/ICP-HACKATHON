import { useState } from "react";
import "../../styles/carousel.scss";
import GiftItemCrd from "../Cards/Reward/GiftItemCrd";

const GiftCarousel = ({ rewards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (deltaY > 50 && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (deltaY < -50 && currentIndex < rewards.length - 4) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full -mt-3 w-[78%]">
      <div
        className="wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`carousel carousel-width transition-all duration-500 relative`}
        >
          {rewards.slice(currentIndex, currentIndex + 4).map((item, index) => {
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

            if (currentIndex + 4 < rewards.length && index === 3) {
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
                  <GiftItemCrd key={item.id} item={item} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GiftCarousel;
