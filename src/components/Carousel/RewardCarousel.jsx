import { useState } from "react";
import "../../styles/carousel.scss";
import GiftItemCrd from "../Cards/Reward/GiftItemCrd";
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
    } else if (deltaY < -50 && currentIndex < rewards.length - 3) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div
      className="wrapper h-[60vh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {rewards.length > 3 && currentIndex >= 1 && (
        <div
          onClick={() => {
            setCurrentIndex((prevIndex) => prevIndex - 1);
          }}
          className="absolute cursor-pointer top-[24%] mr-[2vw] w-full z-50"
        >
          <div className="arrows-up"></div>
        </div>
      )}
      <div className={`carousel carousel-width`}>
        {rewards
          .slice(currentIndex, currentIndex + 3)
          .sort((a, b) => {
            if (a.isClaimed !== b.isClaimed) {
              return Number(a.isClaimed) - Number(b.isClaimed);
            }
            return b.limit - a.limit;
          })
          .map((item, index) => {
            let className = "carousel__item";
            if (index === 0) {
              className += " previous";
            } else if (index === 1) {
              className += " active";
            } else if (index === 2) {
              className += " next";
            }

            return (
              <div className={className} key={currentIndex + index}>
                <PayoutItem key={item.id} item={item} />
              </div>
            );
          })}
      </div>
      {currentIndex < rewards.length - 3 && (
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

export default RewardCarousel;
