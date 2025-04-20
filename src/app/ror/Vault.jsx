import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import { updateBagData } from "../../utils/api.ror";
import RoRHeader from "../../components/layouts/Header";

const CenterChild = ({ dropZoneRef, isDropActive, handleClick }) => {
  return (
    <div
      ref={dropZoneRef}
      onClick={handleClick}
      style={{
        backgroundImage: `url('/assets/240px-banker_head.jpg')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className={`
            flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    ></div>
  );
};

const Vault = (props) => {
  const { gameData, setGameData, authToken } = useContext(RorContext);
  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [scaleIcon, setScaleIcon] = useState(false);
  const dropZoneRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(gameData.bank.vault.length / itemsPerPage);

  const paginatedVaultItems = gameData.bank.vault.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageLeft = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handlePageRight = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handleAddToBag = async () => {
    try {
      const response = await updateBagData(authToken, itemToTransfer);
      setItemsToTransfer([]);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTouchStart = (e, item) => {
    setDraggedItem(item);
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
    setDragging(false);
    setIsTouched(false);
    setScaleIcon(false);

    const dropZone = dropZoneRef.current;
    if (dropZone) {
      const dropZoneRect = dropZone.getBoundingClientRect();
      const tolerance = 15;
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

      console.log(`📌 Overlap Area: ${overlapArea}px²`);
      console.log(`📌 Item Area: ${itemArea}px²`);
      console.log(`📌 Overlap Percentage: ${overlapPercentage.toFixed(2)}%`);

      if (overlapPercentage >= 10) {
        console.log("✅ Item successfully dropped inside!");
        // Remove the dragged item
        setGameData((prevItems) => {
          let updatedVaultItems = prevItems.bank.vault.filter(
            (i) => i._id !== draggedItem._id
          );

          // Check bag space
          if (prevItems.bag.length < 9) {
            let updatedBagItems = [...prevItems.bag, draggedItem];
            itemToTransfer.push(draggedItem._id);
            return {
              ...prevItems,
              bag: updatedBagItems,
              bank: {
                ...prevItems.bank,
                vault: updatedVaultItems,
              },
            };
          } else {
            console.log("❌ Error: Insufficient space in the bag");
            return prevItems;
          }
        });
      } else {
        console.log("❌ Drop invalid: Not enough overlap.");
      }
    }

    setDraggedItem(null);
  };

  useEffect(() => {
    return () => {
      if (itemToTransfer.length != 0) {
        (async () => handleAddToBag())();
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <RoRHeader
        CenterChild={
          <CenterChild
            dropZoneRef={dropZoneRef}
            handleClick={() => {
              if (itemToTransfer.length > 0 && !dragging) {
                (async () => handleAddToBag())();
              }
            }}
            isDropActive={gameData.bag.length < 9}
          />
        }
      />
      <div className="w-[80%]  mt-[20dvh] h-[65dvh] mx-auto grid grid-cols-3">
        {paginatedVaultItems.map((item) => (
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
              itemsWithAllFrags={gameData.bank.vault.map((item) => item.itemId)}
            />
          </div>
        ))}
        {/* Invisble remaining  */}
        {Array.from({ length: 9 - paginatedVaultItems.length }).map(
          (_, index) => (
            <div
              key={`placeholder-${index}`}
              className="relative h-[120px] w-[120px] overflow-hidden"
            ></div>
          )
        )}

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
            </div>
          </div>
        )}
      </div>
      {gameData.bank.vault.length > 9 && (
        <>
          <ToggleLeft activeMyth={4} handleClick={handlePageLeft} />
          <ToggleRight activeMyth={4} handleClick={handlePageRight} />
        </>
      )}
    </div>
  );
};

export default Vault;
