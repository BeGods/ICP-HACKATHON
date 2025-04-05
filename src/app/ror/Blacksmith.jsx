import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import { overlayStyle } from "../../utils/constants.ror";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import { completeItem } from "../../utils/api.ror";
import { gameItems } from "../../utils/gameItems";
import MiscCard from "../../components/ror/MiscCard";
import JoinButton from "../../components/ror/JoinButton";
import RoRHeader from "../../components/layouts/Header";

const CenterChild = ({ dropZoneRef, isDropActive, handleClick }) => {
  return (
    <div
      ref={dropZoneRef}
      onClick={handleClick}
      className={`
           flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    >
      {isDropActive ? "drop here" : "locked"}
    </div>
  );
};

const Blacksmith = () => {
  const { gameData, setGameData, authToken, setShowOverlayItem, setSection } =
    useContext(RorContext);
  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [lastDraggedItem, setLastDraggedItem] = useState(null);
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [scaleIcon, setScaleIcon] = useState(false);
  const [activeItems, setActiveItems] = useState([]);
  const [arbitaryBag, setArbitaryBag] = useState([]);
  const dropZoneRef = useRef(null);
  const disableClick = useRef(null);

  const initializeActiveItems = () => {
    const combinedFragItms = gameData.bag.reduce((acc, item) => {
      const existingItem = acc.find((obj) => obj.itemId === item.itemId);
      if (existingItem) {
        existingItem.fragments.push(item.fragmentId);
      } else {
        acc.push({
          itemId: item.itemId,
          fragments: [item.fragmentId],
          isComplete: item.isComplete,
          updatedAt: item.updatedAt,
        });
      }
      return acc;
    }, []);

    const itemsWithAllFrags = combinedFragItms
      .filter(
        (item) =>
          item.fragments.length ===
            gameItems.find((gameItem) => gameItem.id === item.itemId).fragments
              .length && item.isComplete === false
      )
      .map((item) => item.itemId);

    setActiveItems(itemsWithAllFrags);
    setArbitaryBag(gameData.bag);
  };

  const handleCompleteItem = async (payMethod) => {
    if (!disableClick.current) {
      disableClick.current = true;
      try {
        const response = await completeItem(
          authToken,
          itemToTransfer,
          payMethod
        );
        setShowOverlayItem(null);
        setGameData((prevItems) => {
          let updatedBagItems = prevItems.bag.filter(
            (item) => !itemToTransfer.includes(item._id)
          );
          lastDraggedItem.isComplete = true;
          lastDraggedItem.fragmentId = 0;
          updatedBagItems.push(lastDraggedItem);
          return {
            ...prevItems,
            bag: updatedBagItems,
          };
        });
        console.log(response);
        setItemsToTransfer([]);
        setSection(2);
        disableClick.current = false;
      } catch (error) {
        setItemsToTransfer([]);
        setShowOverlayItem(null);
        console.error("Error completing item:", error);
        disableClick.current = false;
      }
    }
  };

  const handleTouchStart = (e, item) => {
    if (activeItems.includes(item.itemId)) {
      setDraggedItem(item);
      setLastDraggedItem(item);
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

    const dropZone = dropZoneRef.current;
    if (dropZone) {
      const dropZoneRect = dropZone.getBoundingClientRect();
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

      console.log(`📌 Overlap Percentage: ${overlapPercentage.toFixed(2)}%`);

      if (overlapPercentage >= 10) {
        console.log("✅ Valid drop: Removing item from bag");

        setArbitaryBag((prevItems) =>
          prevItems.filter((i) => i._id !== draggedItem._id)
        );

        setItemsToTransfer((prev) =>
          prev.includes(draggedItem._id) ? prev : [...prev, draggedItem._id]
        );
      } else {
        console.log("❌ Drop rejected: Not enough overlap.");
      }
    }

    setDraggedItem(null);
  };

  useEffect(() => {
    initializeActiveItems();
  }, []);

  return (
    <div className="w-full h-fit">
      <RoRHeader
        CenterChild={
          <CenterChild
            dropZoneRef={dropZoneRef}
            onClick={() => {
              if (itemToTransfer.length > 0 && !dragging) {
                setShowOverlayItem(
                  <MiscCard
                    Button={
                      <JoinButton
                        payWithOrb={() => handleCompleteItem(1)}
                        payWithCoin={() => handleCompleteItem(0)}
                      />
                    }
                  />
                );
              }
            }}
            isDropActive={itemToTransfer.length === 0 || dragging}
          />
        }
      />
      <div className="w-[80%]  mt-[17dvh] h-[65dvh] mx-auto grid grid-cols-3">
        {arbitaryBag.map((item) => (
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
              itemsWithAllFrags={activeItems}
            />
          </div>
        ))}
        {/* Invisble remaining  */}
        {Array.from({ length: 12 - arbitaryBag.length }).map((_, index) => (
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
                  maskImage: `url(/320px-celtic-item-example-transparent.png)`,
                  WebkitMaskImage: `url(/320px-celtic-item-example-transparent.png)`,
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

export default Blacksmith;
