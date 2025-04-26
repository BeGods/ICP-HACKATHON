import React, { useContext, useState } from "react";
import { RorContext } from "../../context/context";

const SwipeArena = (props) => {
  const { battleData, setSwipes, swipes } = useContext(RorContext);
  const [swipeCount, setSwipeCount] = useState({ left: 0, right: 0 });
  const [touchStartX, setTouchStartX] = useState(null);
  const [lastDirection, setLastDirection] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;

    const touchX = e.touches[0].clientX;
    const deltaX = touchX - touchStartX;

    // right swipe
    if (deltaX > 20) {
      // direction left to right
      if (swipeCount.left > 5 && lastDirection === "left") {
        setSwipes((count) => count + 1);
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
        setSwipes((count) => count + 1);
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
    <div className="flex justify-center items-center h-full w-full">
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-5/6  h-full "
      >
        <div>
          <p>Left swipes: {swipeCount.left}</p>
          <p>Right swipes: {swipeCount.right}</p>
          <p>Swipe count: {swipes}</p>
        </div>
      </div>
    </div>
  );
};

export default SwipeArena;
