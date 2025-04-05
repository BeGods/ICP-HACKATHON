import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import { overlayStyle } from "../../utils/constants.ror";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import { tradeItem } from "../../utils/api.ror";
import { gameItems } from "../../utils/gameItems";
import RoRHeader from "../../components/layouts/Header";

const CenterChild = ({ dropZoneRef }) => {
  return (
    <div
      ref={dropZoneRef}
      className={`
            flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    >
      drop here
    </div>
  );
};

const Merchant = (props) => {
  const { gameData, setGameData, authToken } = useContext(RorContext);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [scaleIcon, setScaleIcon] = useState(false);
  const dropZoneRef = useRef(null);

  const handleItemToTrade = async (item) => {
    setIsLoading(true);
    try {
      const response = await tradeItem(authToken, item);

      // remove draggedItem
      setGameData((prevItems) => {
        let updatedBagItems = prevItems.bag.filter(
          (i) => i._id !== draggedItem._id
        );
        const itemData = gameItems.find(
          (item) => item.id == draggedItem.itemId
        );
        const updatedCoins =
          prevItems.stats.gobcoin +
          (draggedItem.isComplete ? itemData.fragments.length + 1 : 1);

        return {
          ...prevItems,
          bag: updatedBagItems,
          stats: {
            ...prevItems.stats,
            gobcoin: updatedCoins,
          },
        };
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTouchStart = (e, item) => {
    if (!isLoading) {
      setDraggedItem(item);
      setDragging(true);
      setScaleIcon(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    setIsTouched(true);
    setScaleIcon(false);

    const touch = e.touches[0];
    setCopyPosition({
      x: touch.clientX - 80,
      y: touch.clientY - 100,
    });
  };

  const handleTouchEnd = () => {
    setDragging(false);
    setIsTouched(false);
    setScaleIcon(false);

    // Check if the item was dropped inside the drop zone
    const dropZone = dropZoneRef.current;
    if (dropZone) {
      const dropZoneRect = dropZone.getBoundingClientRect();

      // Increase tolerance (10% overlap required)
      const tolerance = 10;
      const adjustedDropZoneRect = {
        left: dropZoneRect.left - tolerance,
        right: dropZoneRect.right + tolerance,
        top: dropZoneRect.top - tolerance,
        bottom: dropZoneRect.bottom + tolerance,
      };

      const copyRect = {
        left: copyPosition.x,
        top: copyPosition.y,
        right: copyPosition.x + 100,
        bottom: copyPosition.y + 100,
      };

      // Calculate overlap area
      const overlapWidth = Math.max(
        0,
        Math.min(copyRect.right, adjustedDropZoneRect.right) -
          Math.max(copyRect.left, adjustedDropZoneRect.left)
      );
      const overlapHeight = Math.max(
        0,
        Math.min(copyRect.bottom, adjustedDropZoneRect.bottom) -
          Math.max(copyRect.top, adjustedDropZoneRect.top)
      );
      const overlapArea = overlapWidth * overlapHeight;

      const itemArea =
        (copyRect.right - copyRect.left) * (copyRect.bottom - copyRect.top);
      const overlapPercentage = (overlapArea / itemArea) * 100;

      console.log(`Overlap Area: ${overlapArea}px²`);
      console.log(`Item Area: ${itemArea}px²`);
      console.log(`Overlap Percentage: ${overlapPercentage.toFixed(2)}%`);

      if (overlapPercentage >= 10) {
        console.log("✅ Yes, drop it!");
        handleItemToTrade(draggedItem._id);
      } else {
        console.log("❌ Not enough overlap to drop.");
      }
    }

    setDraggedItem(null);
  };

  return (
    <div className="w-full h-full">
      <RoRHeader CenterChild={<CenterChild dropZoneRef={dropZoneRef} />} />
      <div className="w-[80%]  mt-[17dvh] h-[65dvh] mx-auto grid grid-cols-3">
        {gameData.bag.map((item) => (
          <div
            key={item._id}
            onTouchStart={(e) => handleTouchStart(e, item)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`${scaleIcon && draggedItem === item && "scale-110"}`}
          >
            <GridItem
              itemObj={item}
              scaleIcon={scaleIcon}
              itemsWithAllFrags={
                isLoading ? [] : gameData.bag.map((item) => item.itemId)
              }
            />
          </div>
        ))}
        {/* Invisble remaining  */}
        {Array.from({ length: 12 - gameData.bag.length }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="relative h-[120px] w-[120px] overflow-hidden"
          ></div>
        ))}

        {/* Copy */}
        {isTouched && draggedItem && (
          <div
            style={{
              position: "absolute",
              top: `${copyPosition.y}px`,
              left: `${copyPosition.x}px`,
              pointerEvents: "none",
              zIndex: 30,
            }}
          >
            <div className={`relative h-[120px] w-[120px] overflow-hidden`}>
              <div
                className="glow-icon-white h-full w-full"
                style={{
                  backgroundImage: `url(/assets/ror-cards/240px-${draggedItem.itemId}_on.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "100% 20%",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>

              {/* <div
                className={`absolute ${overlayStyle[2][1]} bg-gray-700 opacity-50`}
                style={{
                  maskImage: `url(/assets/320px-celtic-item-example-transparent.png)`,
                  WebkitMaskImage: `url(/assets/320px-celtic-item-example-transparent.png)`,
                  maskSize: "cover",
                  WebkitMaskSize: "cover",
                  maskPosition: "100% 20%",
                  WebkitMaskPosition: "100% 20%",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                }}
              ></div> */}
            </div>
          </div>
        )}
      </div>
      {/* <ToggleLeft activeMyth={4} handleClick={() => {}} />
      <ToggleRight activeMyth={4} handleClick={() => {}} /> */}
    </div>
  );
};

export default Merchant;
