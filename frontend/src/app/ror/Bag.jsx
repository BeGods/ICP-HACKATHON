import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import { overlayStyle } from "../../utils/constants.ror";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import { updateVaultData } from "../../utils/api.ror";
import RoRHeader from "../../components/layouts/Header";

const CenterChild = ({ dropZoneRef, isDropActive }) => {
  return (
    <div
      ref={dropZoneRef}
      className={`
            flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    >
      {isDropActive ? "drop here" : "locked"}
    </div>
  );
};

const Bag = (props) => {
  const { gameData, setGameData, authToken } = useContext(RorContext);
  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [scaleIcon, setScaleIcon] = useState(false);
  const dropZoneRef = useRef(null);

  const handleAddToVault = async () => {
    try {
      const response = await updateVaultData(authToken, itemToTransfer);
      setItemsToTransfer([]);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTouchStart = (e, item) => {
    if (gameData.bank.isVaultActive && gameData.bank.vault.length < 24) {
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

    // check if the item was dropped inside the drop zone
    const dropZone = dropZoneRef.current;
    if (dropZone) {
      const dropZoneRect = dropZone.getBoundingClientRect();

      // add a tolerance margin
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

      // Check drop range
      if (
        copyRect.left >= adjustedDropZoneRect.left &&
        copyRect.right <= adjustedDropZoneRect.right &&
        copyRect.top >= adjustedDropZoneRect.top &&
        copyRect.bottom <= adjustedDropZoneRect.bottom
      ) {
        // Item dropped successfully
        setGameData((prevItems) => {
          let updatedBagItems = prevItems.bag.filter(
            (i) => i._id !== draggedItem._id
          );

          // Check vault space
          if (prevItems.bank.vault.length < 24) {
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
            console.log("Error, insufficient space in vault");
            return prevItems;
          }
        });
      } else {
        console.log("Dropped outside of drop zone.");
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
      <RoRHeader
        CenterChild={
          <CenterChild
            dropZoneRef={dropZoneRef}
            isDropActive={
              gameData.bank.isVaultActive && gameData.bank.vault.length < 24
            }
          />
        }
      />
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
              itemsWithAllFrags={gameData.bag.map((item) => item.itemId)}
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
                  backgroundImage: `url(/assets/ror-cards/240px-celtic.relic.B08_off.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "100% 20%",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>

              <div
                className={`absolute ${overlayStyle[2][1]} bg-gray-700 opacity-50`}
                style={{
                  backgroundImage: `url(/assets/ror-cards/240px-celtic.relic.B08_off.png)`,
                  WebkitMaskImage: `url(/assets/ror-cards/240px-celtic.relic.B08_off.png)`,
                  maskSize: "cover",
                  WebkitMaskSize: "cover",
                  maskPosition: "100% 20%",
                  WebkitMaskPosition: "100% 20%",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
      <ToggleLeft activeMyth={4} handleClick={() => {}} />
      <ToggleRight activeMyth={4} handleClick={() => {}} />
    </div>
  );
};

export default Bag;
