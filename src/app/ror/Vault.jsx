import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/Layouts/GridItem";
import { RorContext } from "../../context/context";
import { tradeItem, updateBagData } from "../../utils/api.ror";
import RoRHeader from "../../components/Layouts/Header";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { mythOrder } from "../../utils/constants.ror";
import { colorByMyth } from "../../utils/constants.ror";
import MiscCard from "../../components/Cards/Citadel/MiscCard";
import RoRBtn from "../../components/Buttons/RoRBtn";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { showToast } from "../../components/Toast/Toast";
import RelicRwrdCrd from "../../components/Cards/Relics/RelicRwrdCrd";
import { gameItems } from "../../utils/gameItems";

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
            flex cursor-pointer justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-50 left-1/2 -translate-x-1/2`}
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
    isTgMobile,
    setSection,
  } = useContext(RorContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showVaultItems, setShowVaultItems] = useState(false);
  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [scaleIcon, setScaleIcon] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [currMyth, setCurrMyth] = useState(0);
  const dropZoneRef = useRef(null);
  const boxRefs = [useRef(null), useRef(null), useRef(null)];
  const [currentPage, setCurrentPage] = useState(0);
  const mythVault = gameData.bank.vault.find(
    (itm) => itm.name === mythOrder[currMyth]
  )?.items;

  const itemsPerPage = 6;
  const totalPages = Math.ceil(mythVault.length / itemsPerPage);

  const paginatedVaultItems = mythVault.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const buttonColor = colorByMyth[mythOrder[currMyth]] ?? "black";

  const handlePageLeft = () => {
    if (showVaultItems) {
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    } else {
      setCurrMyth(
        (prev) => (prev - 1 + mythOrder.length - 1) % (mythOrder.length - 1)
      );
    }
  };

  const handlePageRight = () => {
    if (showVaultItems) {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    } else {
      setCurrMyth((prev) => (prev + 1) % (mythOrder.length - 1));
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
    if (!isLoading) {
      e.target.setPointerCapture(e.pointerId);

      setDraggedItem(item);
      setDragging(true);
      setScaleIcon(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;

    setIsTouched(true);
    setScaleIcon(false);

    const touch = e;
    setCopyPosition({
      x: touch.clientX - 100,
      y: touch.clientY - 250,
    });
  };

  const handleItemToTrade = async (draggedItem) => {
    setIsLoading(true);
    try {
      const itemId = draggedItem.isPouch ? draggedItem.itemId : draggedItem._id;
      await tradeItem(authToken, itemId, draggedItem.isPouch, true);
      setShowCard(null);
      // remove draggedItem
      setGameData((prevItems) => {
        let updatedVaultItems = prevItems.bank.vault.map((group) => {
          if (group.name === draggedItem.itemId.split(".")[0]) {
            return {
              ...group,
              items: group.items.filter((item) => item._id !== draggedItem._id),
            };
          }
          return group;
        });

        const itemData = gameItems.find(
          (item) => item.id == draggedItem.itemId
        );
        const updatedCoins =
          prevItems.stats.gobcoin +
          (draggedItem.isComplete ? itemData.coins : 1);

        return {
          ...prevItems,
          bank: {
            ...prevItems.bank,
            vault: updatedVaultItems,
          },
          stats: {
            ...prevItems.stats,
            gobcoin: updatedCoins,
          },
        };
      });

      showToast("sell_success");
    } catch (error) {
      showToast("sell_error");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTouchEnd = () => {
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
      const overlapPercentage = (overlapArea / (100 * 100)) * 100;

      return overlapPercentage >= 20;
    });

    if (itemBoxIndex !== -1) {
      if (itemBoxIndex == 1) {
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
      } else if (itemBoxIndex == 0) {
        setShowCard(
          <RelicRwrdCrd
            isSell={true}
            mythology={draggedItem?.itemId?.split(".")[0]}
            itemId={draggedItem?.itemId}
            isChar={false}
            hideInfo={true}
            hideClose={true}
            fragmentId={draggedItem?.fragmentId}
            isComplete={draggedItem?.isComplete}
            ButtonFront={
              <RoRBtn
                isNotPay={true}
                handleClick={() => handleItemToTrade(draggedItem)}
                itemId={draggedItem?.itemId}
                message={"sell"}
              />
            }
          />
        );
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
        icon="A"
        hideClose={true}
        isMulti={false}
        handleClick={() => setShowCard(null)}
        Button={
          <RoRBtn
            message={"LEAVE"}
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
        handleClick={() => setShowVaultItems((prev) => !prev)}
        isOpenVault={showVaultItems}
        CenterChild={<CenterChild assets={assets} handleClick={showInfoCard} />}
      />
      <div
        className={`${
          isTgMobile ? "tg-container-height" : "browser-container-height"
        } flex flex-col items-center justify-center`}
      >
        <div className={`grid-width  h-[55dvh] mt-[7dvh] mx-auto relative p-1`}>
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
            className={`grid grid-cols-3  gap-x-1.5 w-full ${
              !showVaultItems ? "h-fit" : "h-full"
            } place-items-center place-content-between`}
          >
            {/* feature slots */}
            {[
              {
                icon: "A",
                label: "sell",
              },
              {
                icon: "8",
                label: `${dragging ? "drop" : "bag"}`,
              },
              {
                icon: ",",
                label: "keep",
              },
            ].map((itm, index) => (
              <div
                onClick={() => {
                  if (index == 1) {
                    setSection(4);
                  } else if (index == 2) {
                    setShowVaultItems((prev) => !prev);
                  }
                }}
                ref={boxRefs[index]}
                key={`box-${index}`}
                className={`relative text-white
              max-w-[120px] w-full rounded-md overflow-hidden transition-all duration-300 ${
                (!showVaultItems && index != 2) ||
                (showVaultItems && index != 2)
                  ? ""
                  : `glow-button-${mythOrder[currMyth]}`
              }  ${draggedItem && index == 2 && "opacity-50"}`}
              >
                <div
                  className={`flex flex-col rounded-md border items-center w-full ${
                    (!showVaultItems && index != 2) ||
                    (showVaultItems && index != 2)
                      ? "text-white border-white/70"
                      : `text-white border border-${mythOrder[currMyth]}-primary`
                  }`}
                >
                  <div
                    className={`w-full aspect-square ${
                      (!showVaultItems && index != 2) ||
                      (showVaultItems && index != 2)
                        ? "border-b border-white/50"
                        : `border-b border-${mythOrder[currMyth]}-primary`
                    }  flex justify-center items-center rounded-t-md bg-white/20`}
                  >
                    <span className="text-iconLg font-symbols">{itm.icon}</span>
                  </div>

                  <div className="w-full uppercase text-center text-sm bg-black/50 rounded-b-md leading-tight px-1 py-1.5 truncate">
                    {itm.label}
                  </div>
                </div>
              </div>
            ))}

            {/* item slots */}
            {showVaultItems &&
              paginatedVaultItems.map((item) => (
                <div
                  key={item._id}
                  onPointerDown={(e) => handleTouchStart(e, item)}
                  onPointerMove={handleTouchMove}
                  onPointerUp={handleTouchEnd}
                  className={`relative touch-none w-full max-w-[120px] flex flex-col ${
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

            {/* empty items */}
            {showVaultItems &&
              Array.from({ length: 6 - paginatedVaultItems.length }).map(
                (_, index) => (
                  <div
                    key={`placeholder-${index}`}
                    className="relative w-full max-w-[120px] flex flex-col opacity-60 items-center rounded-md overflow-hidden shadow-2xl"
                  >
                    <div
                      className={`flex flex-col rounded-md border items-center w-full`}
                    >
                      <div className="w-full border-b border-white/50 aspect-square bg-white/20 flex justify-center items-center">
                        <span className="text-iconLg font-symbols text-white">
                          ,
                        </span>
                      </div>
                      <div className="w-full bg-black/50 rounded-b-md uppercase text-white text-sm text-center px-1 py-1.5 leading-tight truncate">
                        Slot {paginatedVaultItems.length + index + 1}
                      </div>
                    </div>
                  </div>
                )
              )}

            {/* draggedItem */}
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

          {/* vaults */}
          {!showVaultItems && (
            <div className="flex relative flex-col justify-center items-center h-[68%]">
              <div className="flex justify-center relative">
                <img
                  src={`https://media.publit.io/file/BeGods/items/240px-${mythOrder[currMyth]}.artifact.starter00-off.png`}
                  alt="box"
                  className={`glow-text-white w-item`}
                />
              </div>
            </div>
          )}
        </div>

        {/* bottom buttons */}
        {!showVaultItems && (
          <div className="absolute bottom-[2dvh]">
            <div
              onMouseDown={() => {
                setIsClicked(true);
              }}
              onMouseUp={() => {
                setIsClicked(false);
              }}
              onMouseLeave={() => {
                setIsClicked(false);
              }}
              onTouchStart={() => {
                setIsClicked(true);
              }}
              onTouchEnd={() => {
                setIsClicked(false);
              }}
              onTouchCancel={() => {
                setIsClicked(false);
              }}
              onClick={() => setShowVaultItems((prev) => !prev)}
              className="flex justify-center items-center select-none relative h-fit"
            >
              <img
                src={
                  isClicked
                    ? assets.buttons[buttonColor]?.off
                    : assets.buttons[buttonColor]?.on
                }
                alt="button"
              />
              <div className="absolute z-50 uppercase text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
                OPEN
              </div>
            </div>
          </div>
        )}
      </div>

      {((showVaultItems && paginatedVaultItems.length > 6) ||
        !showVaultItems) && (
        <>
          <ToggleLeft
            positionBottom={true}
            activeMyth={4}
            handleClick={handlePageLeft}
          />
          <ToggleRight
            positionBottom={true}
            activeMyth={4}
            handleClick={handlePageRight}
          />
        </>
      )}
    </div>
  );
};

export default Vault;
