import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import { tradeItem, updateVaultData } from "../../utils/api.ror";
import { gameItems } from "../../utils/gameItems";
import RoRHeader from "../../components/layouts/Header";

const tele = window.Telegram?.WebApp;

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

const Merchant = (props) => {
  const { gameData, setGameData, authToken, setSection } =
    useContext(RorContext);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [scaleIcon, setScaleIcon] = useState(false);
  const boxRefs = [useRef(null), useRef(null), useRef(null)];
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(gameData.bag.length / itemsPerPage);

  const paginatedVaultItems = gameData.bag.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageLeft = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handlePageRight = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handleAddToVault = async () => {
    try {
      const response = await updateVaultData(authToken, itemToTransfer);
      setItemsToTransfer([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleItemToTrade = async (item) => {
    setIsLoading(true);
    try {
      await tradeItem(authToken, item);

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
          (draggedItem.isComplete ? itemData.coins : 1);

        return {
          ...prevItems,
          bag: updatedBagItems,
          stats: {
            ...prevItems.stats,
            gobcoin: updatedCoins,
          },
        };
      });
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
    if (!draggedItem) return;

    setDragging(false);
    setIsTouched(false);
    setScaleIcon(false);

    const itemBoxIndex = boxRefs.findIndex((ref) => {
      const dropZone = ref.current;
      if (!dropZone) return false;

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
      const overlapPercentage = (overlapArea / (100 * 100)) * 100;

      return overlapPercentage >= 20;
    });

    if (itemBoxIndex !== -1) {
      if (itemBoxIndex == 0) {
        handleItemToTrade(draggedItem._id);
      } else if (itemBoxIndex == 2) {
        setGameData((prevItems) => {
          let updatedBagItems = prevItems.bag.filter(
            (i) => i._id !== draggedItem._id
          );

          // Check vault space
          if (prevItems.bank.vault.length < 27) {
            let updatedVaultItems = [...prevItems.bank.vault, draggedItem];
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
            console.log("Error: Insufficient space in vault");
            return prevItems;
          }
        });
      }
    }
    setDraggedItem(null);
  };

  useEffect(() => {
    return () => {
      if (itemToTransfer.length != 0) {
        (async () => handleAddToVault())();
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <RoRHeader CenterChild={<CenterChild />} />
      <div className="w-[80%] mt-[20dvh] h-[60dvh] mx-auto grid grid-cols-3 gap-x-1">
        {["#", "8", "6"].map((itm, index) => (
          <div
            ref={boxRefs[index]}
            key={`box-${index}`}
            onClick={() => {
              if (index === 2) {
                setSection(5);
              }
            }}
            className="w-[100%] relative flex flex-col gap-1 justify-center items-center aspect-square max-w-[120px] bg-gray-100/10 border border-white/10 shadow-2xl rounded-md overflow-auto"
          >
            <div
              className={`text-booster font-symbols ${
                index == 1 ? "text-white/20" : "text-white"
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
              itemsWithAllFrags={
                isLoading ? [] : gameData.bag.map((item) => item.itemId)
              }
            />
          </div>
        ))}

        {Array.from({ length: 6 - paginatedVaultItems.length }).map(
          (_, index) => (
            <div
              key={`placeholder-${index}`}
              className="relative w-[100%] aspect-square max-w-[120px] overflow-hidden"
            ></div>
          )
        )}

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
      {gameData.bag.length > 6 && (
        <>
          <ToggleLeft activeMyth={4} handleClick={handlePageLeft} />
          <ToggleRight activeMyth={4} handleClick={handlePageRight} />
        </>
      )}
    </div>
  );
};

export default Merchant;
