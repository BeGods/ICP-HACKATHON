import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import { overlayStyle } from "../../utils/constants.ror";
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
      className={`
            flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    >
      {isDropActive ? "drop here" : "locked"}
    </div>
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

    // Check if the item was dropped inside the drop zone
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

      // Check drop range
      if (
        copyRect.left >= adjustedDropZoneRect.left &&
        copyRect.right <= adjustedDropZoneRect.right &&
        copyRect.top >= adjustedDropZoneRect.top &&
        copyRect.bottom <= adjustedDropZoneRect.bottom
      ) {
        // Remove the dragged item
        setGameData((prevItems) => {
          let updatedVaultItems = prevItems.bank.vault.filter(
            (i) => i._id !== draggedItem._id
          );

          // check bag space
          if (prevItems.bag.length < 12) {
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
            console.log("Error, insufficient space in bank");
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
            isDropActive={gameData.bag.length < 12}
          />
        }
      />
      <div className="h-full w-[80%] mx-auto grid grid-cols-3">
        {gameData.bank.vault.map((item) => (
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
              itemsWithAllFrags={gameData.bank.vault.map((item) => item.itemId)}
            />
          </div>
        ))}
        {/* Invisble remaining  */}
        {Array.from({ length: 12 - gameData.bank.vault.length }).map(
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
                  backgroundImage: `url(/assets/320px-celtic-item-example-transparent.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "100% 20%",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>

              <div
                className={`absolute ${overlayStyle[2][1]} bg-gray-700 opacity-50`}
                style={{
                  maskImage: `url(/assets/320px-celtic-item-example-transparent.png)`,
                  WebkitMaskImage: `url(/320px-celtic-item-example-transparent.png)`,
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

        {/* <div
          onClick={() => {
            if (itemToTransfer.length > 0 && !dragging) {
              (async () => handleAddToBag())();
            }
          }}
          ref={dropZoneRef}
          className={`
            ${
              gameData.bag.length < 12 ? "bg-green-400" : "bg-red-400"
            } flex justify-center items-center absolute h-[36vw] w-[36vw] rounded-full top-0 z-20 left-1/2 -translate-x-1/2`}
        >
          {gameData.bank.isVaultActive || gameData.bank.vault.length < 24 ? (
            <>drop here</>
          ) : (
            "locked"
          )}
        </div> */}
      </div>
      <ToggleLeft activeMyth={4} handleClick={() => {}} />
      <ToggleRight activeMyth={4} handleClick={() => {}} />
    </div>
  );
};

export default Vault;
