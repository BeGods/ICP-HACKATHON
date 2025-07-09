import { useState } from "react";
import "../../styles/carousel.scss";
import PayoutItem from "../Cards/Reward/PayoutItm";

const RewardCarousel = ({ rewards }) => {
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
    <div className="flex flex-col justify-center items-center h-full w-[78%] mt-[2.65rem]">
      <div
        className="wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`carousel carousel-width`}>
          {rewards
            .sort((a, b) => {
              if (a.limit === 0 && b.limit !== 0) return 1;
              if (a.limit !== 0 && b.limit === 0) return -1;
              if (a.isClaimed !== b.isClaimed) {
                return Number(a.isClaimed) - Number(b.isClaimed);
              }
              return b.limit - a.limit;
            })
            .filter((itm) => itm.limit > 0 || itm.isClaimed)
            .slice(currentIndex, currentIndex + 4)
            .map((item, index) => {
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
                    className={
                      onClick ? "pointer-events-none w-full" : "w-full"
                    }
                  >
                    <PayoutItem key={item.id} item={item} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RewardCarousel;
