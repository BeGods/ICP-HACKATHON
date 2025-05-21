import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/Layouts/GridItem";
import { RorContext } from "../../context/context";
import { updateBagData } from "../../utils/api.ror";
import RoRHeader from "../../components/Layouts/Header";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { mythSections } from "../../utils/constants.fof";
import { colorByMyth } from "../../utils/constants.ror";
import MiscCard from "../../components/Cards/Citadel/MiscCard";
import RoRBtn from "../../components/Buttons/RoRBtn";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ handleClick, assets }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${assets.boosters.bankerHead})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      onClick={handleClick}
      className={`
            flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    ></div>
  );
};

const Vault = (props) => {
  const {
    gameData,
    setGameData,
    authToken,
    assets,
    setShowCard,
    setShiftBg,
    enableHaptic,
  } = useContext(RorContext);
  const [showVaultItems, setShowVaultItems] = useState(false);
  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [scaleIcon, setScaleIcon] = useState(false);
  const [currMyth, setCurrMyth] = useState(0);
  const dropZoneRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const mythVault = gameData.bank.vault.find(
    (itm) => itm.name === mythSections[currMyth]
  )?.items;

  const itemsPerPage = 6;
  const totalPages = Math.ceil(mythVault.length / itemsPerPage);

  const paginatedVaultItems = mythVault.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const buttonColor = colorByMyth[mythSections[currMyth]] ?? "black";

  const handlePageLeft = () => {
    if (showVaultItems) {
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    } else {
      setCurrMyth(
        (prev) =>
          (prev - 1 + mythSections.length - 1) % (mythSections.length - 1)
      );
    }
  };

  const handlePageRight = () => {
    if (showVaultItems) {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    } else {
      setCurrMyth((prev) => (prev + 1) % (mythSections.length - 1));
    }
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
      x: touch.clientX - 100,
      y: touch.clientY - 250,
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

      const arbitaryCopyX = copyPosition.x + 20;
      const arbitaryCopyY = copyPosition.y + 150;

      const copyRect = {
        left: arbitaryCopyX,
        top: arbitaryCopyY,
        right: arbitaryCopyX + 100,
        bottom: arbitaryCopyY + 100,
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

      if (overlapPercentage >= 10) {
        // Remove the dragged item
        setGameData((prevItems) => {
          let updatedVaultItems = prevItems.bank.vault.map((group) => {
            if (group.name === draggedItem.itemId.split(".")[0]) {
              return {
                ...group,
                items: group.items.filter(
                  (item) => item._id !== draggedItem._id
                ),
              };
            }
            return group;
          });

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

  const showInfoCard = async () => {
    handleClickHaptic(tele, enableHaptic);

    setShowCard(
      <MiscCard
        showInfo={true}
        img={assets.boosters.bankerCard}
        icon="Banker"
        isMulti={false}
        handleClick={() => setShowCard(null)}
        Button={
          <RoRBtn
            message={"Enter"}
            isNotPay={true}
            left={1}
            right={1}
            handleClick={() => setShowCard(null)}
          />
        }
      />
    );
  };

  return (
    <div className="w-full h-full">
      <RoRHeader
        CenterChild={<CenterChild assets={assets} handleClick={showInfoCard} />}
      />

      <div className="flex flex-col w-[80%] mt-[18dvh] h-[60dvh] relative mx-auto">
        <div
          className="absolute inset-0 z-0 filter-orb-white rounded-md"
          style={{
            backgroundImage: `url(${assets.uxui.baseBgA})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            opacity: 0.5,
          }}
        />
        <div
          className={`${
            !showVaultItems ? "h-fit" : "h-full"
          } w-full grid grid-cols-3 gap-x-1`}
        >
          {[
            {
              icon: "#",
              label: "banker",
            },
            {
              icon: "8",
              label: `${dragging ? "drop" : "bag"}`,
            },
            {
              icon: ",",
              label: "vault",
            },
          ].map((itm, index) => (
            <div
              ref={index === 1 ? dropZoneRef : undefined}
              key={`box-${index}`}
              className={` relative text-white
              max-w-[120px] w-full rounded-md overflow-hidden `}
            >
              <div
                className={`flex flex-col rounded-md border items-center w-full ${
                  (!showVaultItems && index != 2) ||
                  (showVaultItems && index != 2)
                    ? "text-white border-white/70"
                    : "text-white glow-inset-button-white"
                }`}
              >
                <div className="w-full aspect-square bg-white/20 flex justify-center items-center rounded-md">
                  <span className="text-iconLg font-symbols">{itm.icon}</span>
                </div>

                <div className="w-full uppercase text-center text-sm leading-tight px-1 py-1 truncate">
                  {itm.label}
                </div>
              </div>
            </div>
          ))}
          {showVaultItems &&
            paginatedVaultItems.map((item) => (
              <div
                key={item._id}
                onTouchStart={(e) => handleTouchStart(e, item)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`${
                  scaleIcon && draggedItem === item && "scale-110"
                }`}
              >
                <GridItem
                  isStage={false}
                  handleClick={() => {}}
                  itemObj={item}
                  scaleIcon={scaleIcon}
                  itemsWithAllFrags={gameData.bank.vault.map(
                    (item) => item.itemId
                  )}
                />
              </div>
            ))}
          {showVaultItems &&
            Array.from({ length: 6 - paginatedVaultItems.length }).map(
              (_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="relative w-full max-w-[120px] flex flex-col opacity-50 items-center rounded-md overflow-hidden shadow-2xl"
                >
                  <div
                    className={`flex flex-col rounded-md border items-center w-full`}
                  >
                    <div className="w-full aspect-square bg-white/20 flex justify-center items-center">
                      <span className="text-iconLg font-symbols text-white">
                        8
                      </span>
                    </div>
                    <div className="w-full text-white text-sm text-center px-1 py-1 leading-tight truncate">
                      slot{index + 1}
                    </div>
                  </div>
                </div>
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
                zIndex: 50,
              }}
            >
              <div className={`relative h-[120px] w-[120px] overflow-hidden`}>
                <div
                  className="glow-icon-white h-full w-full"
                  style={{
                    backgroundImage: `url(https://media.publit.io/file/BeGods/items/240px-${draggedItem.itemId}.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "100% 20%",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {!showVaultItems && (
          <div className="flex flex-col gap-y-4 justify-center items-center h-full">
            <div className="flex justify-center relative">
              <img
                src={`https://media.publit.io/file/BeGods/items/240px-${mythSections[currMyth]}.artifact.starter00-off.png`}
                alt="box"
                className={`glow-text-white `}
              />
            </div>
            <div
              onClick={() => setShowVaultItems((prev) => !prev)}
              className="flex justify-center items-center relative h-fit"
            >
              <img src={assets.buttons[buttonColor]?.on} alt="button" />
              <div className="absolute z-50 uppercase text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
                OPEN
              </div>
            </div>
          </div>
        )}
        {mythVault.length <= 0 && showVaultItems && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-500 text-white px-4 py-2 rounded-full text-[1rem] font-roboto shadow-lg">
            Vault is empty
          </div>
        )}
      </div>

      {((showVaultItems && gameData.bank.vault.length > 6) ||
        !showVaultItems) && (
        <>
          <ToggleLeft activeMyth={4} handleClick={handlePageLeft} />
          <ToggleRight activeMyth={4} handleClick={handlePageRight} />
        </>
      )}
    </div>
  );
};

export default Vault;
