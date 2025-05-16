import React, { useContext, useState } from "react";
import { RorContext } from "../../context/context";

const SwipeArena = ({ roundTimeElapsed, digMyth }) => {
  const { battleData, setSwipes, swipes, gameData } = useContext(RorContext);
  const [swipeCount, setSwipeCount] = useState({ left: 0, right: 0 });
  const [touchStartX, setTouchStartX] = useState(null);
  const [lastDirection, setLastDirection] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const digLvl = gameData?.stats?.digLvl ?? 1;
    if (touchStartX === null) return;

    const touchX = e.touches[0].clientX;
    const deltaX = touchX - touchStartX;

    // right swipe
    if (deltaX > 20) {
      // direction left to right
      if (swipeCount.left > 5 && lastDirection === "left") {
        setSwipes((count) => count + digLvl);
        setSwipeCount((prev) => ({ ...prev, right: prev.right + 1, left: 0 }));
      } else {
        setSwipeCount((prev) => ({ ...prev, right: prev.right + 1 }));
      }
      setLastDirection("right");
      setTouchStartX(touchX);

      // left swipe
    } else if (deltaX < -20) {
      // direction right to left
      if (swipeCount.right > 5 && lastDirection === "right") {
        setSwipes((count) => count + digLvl);
        setSwipeCount((prev) => ({ ...prev, left: prev.left + 1, right: 0 }));
      } else {
        setSwipeCount((prev) => ({ ...prev, left: prev.left + 1 }));
      }
      setLastDirection("left");
      setTouchStartX(touchX);
    }
  };

  const handleTouchEnd = () => {
    setSwipeCount({ left: 0, right: 0 });
    setTouchStartX(null);
    setLastDirection(null);
  };

  return (
    <div className="flex relative flex-col mt-[6vh] justify-center items-center h-[65vh] w-full">
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-[95%] h-full"
      >
        {/* <div>
          <p>Left swipes: {swipeCount.left}</p>
          <p>Right swipes: {swipeCount.right}</p>
          <p>Swipe count: {swipes}</p>
        </div> */}
      </div>

      <div className="flex items-center justify-between absolute bottom-0 w-full px-2 h-[6vh] -mb-[8vh]">
        <div className="text-[5vh]">{roundTimeElapsed}s</div>
        <div className="flex gap-x-4">
          {[0, 1, 2].map((_, index) => {
            const round = battleData.roundData[index];
            const isOngoing = index + 1 === battleData.currentRound;

            let styleClass = "text-white/20";
            let extraClass = "";

            if (round !== undefined) {
              if (round.status === 1) {
                styleClass = `text-${digMyth}-primary `; // win
              } else if (round.status === 0) {
                styleClass = "text-white"; // loss
              }
            } else if (isOngoing) {
              styleClass = "text-white";
              extraClass = `glow-text-${digMyth} text-[4vh]`; // ongoing
            }

            return (
              <div
                key={index}
                className={`text-[4vh] font-symbols ${styleClass} ${extraClass}`}
              >
                5
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SwipeArena;
