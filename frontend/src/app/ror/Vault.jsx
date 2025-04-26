import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import { RorContext } from "../../context/context";
import { updateBagData } from "../../utils/api.ror";
import RoRHeader from "../../components/layouts/Header";
import { ArrowLeft } from "lucide-react";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { toggleBackButton } from "../../utils/teleBackButton";

const CenterChild = ({}) => {
  return (
    <div
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
  const { gameData, setGameData, authToken, setSection } =
    useContext(RorContext);
  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [scaleIcon, setScaleIcon] = useState(false);
  const dropZoneRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 6;
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

      const toleranceX = dropZoneRect.width * 0.05;
      const toleranceY = dropZoneRect.height * 0.05;

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

      if (overlapPercentage >= 20) {
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

  useEffect(() => {
    (async () =>
      await toggleBackButton(tele, () => {
        setSection(4);
      }))();
  }, []);

  return (
    <div className="w-full h-full">
      <RoRHeader
        CenterChild={
          <CenterChild
            dropZoneRef={dropZoneRef}
            isDropActive={gameData.bag.length < 9}
          />
        }
      />
      <div className="w-[80%] mt-[20dvh] h-[60dvh] mx-auto grid grid-cols-3 gap-x-1">
        {["#", "8", "6"].map((itm, index) => (
          <div
            ref={index === 1 ? dropZoneRef : undefined}
            key={`box-${index}`}
            className="w-[100%] relative flex flex-col gap-1 justify-center items-center aspect-square max-w-[120px] bg-gray-100/10 border border-white/10 shadow-2xl rounded-md overflow-auto"
          >
            <div
              className={`text-booster font-symbols ${
                index !== 1 ? "text-white/20" : "text-white"
              }`}
            >
              {itm}
            </div>
          </div>
        ))}
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
        {Array.from({ length: 6 - paginatedVaultItems.length }).map(
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
      {gameData.bank.vault.length > 6 && (
        <>
          <ToggleLeft activeMyth={4} handleClick={handlePageLeft} />
          <ToggleRight activeMyth={4} handleClick={handlePageRight} />
        </>
      )}
    </div>
  );
};

export default Vault;
