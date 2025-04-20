import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import { RorContext } from "../../context/context";
import { completeItem } from "../../utils/api.ror";
import { gameItems } from "../../utils/gameItems";
import MiscCard from "../../components/ror/MiscCard";
import JoinButton from "../../components/ror/JoinButton";
import RoRHeader from "../../components/layouts/Header";

// {isDropActive ? "drop here" : "locked"}

const CenterChild = ({ dropZoneRef, isDropActive, handleClick }) => {
  return (
    <div
      ref={dropZoneRef}
      onClick={handleClick}
      style={{
        backgroundImage: `url('/assets/240px-blacksmith_head.jpg')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className={`
           flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    ></div>
  );
};

const Blacksmith = () => {
  const { gameData, setGameData, authToken, setShowCard, setSection } =
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
  const [selectedItem, setSelectedItem] = useState(null);
  const dropZoneRef = useRef(null);
  const disableClick = useRef(null);

  const getGameItemFragmentLength = (itemId) =>
    gameItems.find((gameItem) => gameItem.id === itemId)?.fragments.length ?? 0;

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

    let itemsWithAllFrags;

    itemsWithAllFrags = combinedFragItms
      .filter((item) => {
        const hasAllFrags =
          item.fragments.length === getGameItemFragmentLength(item.itemId);
        const matchesSelected = !selectedItem || item.itemId === selectedItem;
        return hasAllFrags && !item.isComplete && matchesSelected;
      })
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
        setShowCard(null);
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
    if (!activeItems.includes(item.itemId)) return;

    setDraggedItem(item);
    setLastDraggedItem(item);
    setDragging(true);
    setScaleIcon(true);
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
    if (!draggedItem) return;

    setDragging(false);
    setIsTouched(false);
    setScaleIcon(false);

    if (draggedItem?.itemId && !activeItems.includes(draggedItem.itemId))
      return;

    const dropZone = dropZoneRef.current;
    if (dropZone) {
      const dropZoneRect = dropZone.getBoundingClientRect();

      // Increase tolerance margin (10% of drop zone size)
      const toleranceX = dropZoneRect.width * 0.1;
      const toleranceY = dropZoneRect.height * 0.1;

      const adjustedDropZoneRect = {
        left: dropZoneRect.left - toleranceX,
        right: dropZoneRect.right + toleranceX,
        top: dropZoneRect.top - toleranceY,
        bottom: dropZoneRect.bottom + toleranceY,
      };

      const copyRect = {
        left: copyPosition.x,
        top: copyPosition.y,
        right: copyPosition.x + 100,
        bottom: copyPosition.y + 100,
      };

      // overalp area
      const overlapX = Math.max(
        0,
        Math.min(copyRect.right, adjustedDropZoneRect.right) -
          Math.max(copyRect.left, adjustedDropZoneRect.left)
      );
      const overlapY = Math.max(
        0,
        Math.min(copyRect.bottom, adjustedDropZoneRect.bottom) -
          Math.max(copyRect.top, adjustedDropZoneRect.top)
      );
      const overlapArea = overlapX * overlapY;
      const draggedItemArea = 100 * 100; // Item is 100x100 px
      const overlapPercentage = (overlapArea / draggedItemArea) * 100;

      console.log(`📌 Overlap Percentage: ${overlapPercentage.toFixed(2)}%`);

      if (overlapPercentage >= 10) {
        console.log("✅ Valid drop: Removing item from bag");

        setArbitaryBag((prevItems) =>
          prevItems.filter((i) => i._id !== draggedItem._id)
        );

        if (itemToTransfer == 0) {
          setSelectedItem(draggedItem.itemId);
        }

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
  }, [selectedItem]);

  useEffect(() => {
    if (selectedItem && !dragging) {
      const allItemsTransfered =
        gameItems.find((item) => item.id === selectedItem).fragments.length ===
        itemToTransfer.length;
      if (allItemsTransfered) {
        setShowCard(
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
    }
  }, [itemToTransfer]);

  return (
    <div className="w-full h-fit">
      <RoRHeader
        CenterChild={
          <CenterChild
            dropZoneRef={dropZoneRef}
            isDropActive={itemToTransfer.length === 0 || dragging}
          />
        }
      />
      <div className="w-[80%] mt-[20dvh] h-[65dvh] mx-auto grid grid-cols-3">
        {arbitaryBag.map((item) => (
          <div
            key={item._id}
            onTouchStart={(e) => handleTouchStart(e, item)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`${scaleIcon && draggedItem === item && "scale-110"}`}
          >
            <GridItem
              handleClick={() => {}}
              itemObj={item}
              scaleIcon={scaleIcon}
              itemsWithAllFrags={activeItems}
            />
          </div>
        ))}
        {/* remaining places */}
        {Array.from({ length: 9 - arbitaryBag.length }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="relative h-[120px] w-[120px] overflow-hidden"
          ></div>
        ))}

        {/* dragged copy of item */}
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
