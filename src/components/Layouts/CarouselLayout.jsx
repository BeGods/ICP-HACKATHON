import { useState } from "react";
import { Check } from "lucide-react";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { useStore } from "../../store/useStore";

const tele = window.Telegram?.WebApp;

const CarouselLayout = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);

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

  return (
    <div className={`center-section`}>
      <div
        className="wrapper  pt-[4.5rem]"
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

export default CarouselLayout;

export const ItemLayout = ({ item, handleClick, isSmall }) => {
  const enableHaptic = useStore((s) => s.enableHaptic);

  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        handleClickHaptic(tele, enableHaptic);
        handleClick();
      }}
      onMouseDown={() => {
        setIsClicked(true);
      }}
      onMouseUp={() => {
        setIsClicked(false);
      }}
      onMouseLeave={() => {
        setIsClicked(false);
      }}
      onTouchStart={() => {
        setIsClicked(true);
      }}
      onTouchEnd={() => {
        setIsClicked(false);
      }}
      onTouchCancel={() => {
        setIsClicked(false);
      }}
      className={`flex ${isClicked ? `glow-button-white` : ""} ${
        item.disable && "grayscale"
      } bg-glass-black-lg ${
        item.disable ? "text-gray-400" : "text-white"
      } items-center gap-x-2.5 border ${
        item.borderStyle && item.borderStyle
      } rounded-primary w-full cursor-pointer h-[4.65rem] px-4`}
    >
      <div
        className={`font-symbols text-iconLg ${
          isSmall ? "w-[2rem]" : "w-[3rem]"
        }`}
      >
        {item.icon}
      </div>
      <div className={`flex flex-col text-white flex-grow justify-center`}>
        <div className="text-tertiary uppercase">{item.title}</div>
        <div className="text-tertiary flex gap-x-2 -mt-1.5">
          <span className="text-tertiary">{item.desc[0]}</span>
          <span
            className={`text-tertiary ${
              item.desc[2] == "icon" ? "font-symbols" : item.desc[2]
            }`}
          >
            {item.desc[1]}
          </span>
        </div>
      </div>
      {item.showStatus && (
        <div className="flex justify-center items-center pr-1">
          {item.status === "claimed" && (
            <div className="flex justify-center items-center h-6 w-6 p-1 bg-white rounded-full">
              <Check strokeWidth={3} color="black" />
            </div>
          )}
          {item.status === "completed" && (
            <div className="flex justify-center items-center h-6 w-6 p-1 border-2 rounded-full">
              <Check strokeWidth={3} color="white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
