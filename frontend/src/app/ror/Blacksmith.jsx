import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
import GridItem from "../../components/ror/GridItem";
import { RorContext } from "../../context/context";
import { completeItem, joinItem } from "../../utils/api.ror";
import { gameItems } from "../../utils/gameItems";
import RoRHeader from "../../components/layouts/Header";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import MiscCard from "../../components/ror/MiscCard";
import RoRBtn from "../../components/ror/RoRBtn";
import { calculateRemainingTime } from "../../helpers/ror.timers.helper";

// {isDropActive ? "drop here" : "locked"}

const CenterChild = ({ handleClick }) => {
  return (
    <div
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
  const { gameData, setGameData, authToken, setShowCard, assets } =
    useContext(RorContext);
  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [scaleIcon, setScaleIcon] = useState(false);
  const [activeItems, setActiveItems] = useState([]);
  const [arbitaryBag, setArbitaryBag] = useState(gameData.bag);
  const [selectedItem, setSelectedItem] = useState(null);
  const disableClick = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [boxFlags, setBoxFlags] = useState([false, false, false]);
  const boxRefs = [useRef(null), useRef(null), useRef(null)];
  const [boxItems, setBoxItems] = useState([{}, {}, {}]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(
    arbitaryBag.sort((a, b) => {
      const aActive = activeItems.includes(a.itemId);
      const bActive = activeItems.includes(b.itemId);
      return aActive === bActive ? 0 : aActive ? -1 : 1;
    }).length / itemsPerPage
  );

  const sortedBag = useMemo(() => {
    return (
      arbitaryBag.sort((a, b) => {
        const aActive = activeItems.includes(a.itemId);
        const bActive = activeItems.includes(b.itemId);
        return aActive === bActive ? 0 : aActive ? -1 : 1;
      }) ?? []
    );
  }, [arbitaryBag, activeItems]);

  const paginatedVaultItems = useMemo(() => {
    return (
      sortedBag.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      ) ?? []
    );
  }, [sortedBag, currentPage]);

  useEffect(() => {
    if (gameData?.bag) {
      const sorted =
        [...gameData.bag].sort((a, b) => {
          const aActive = activeItems.includes(a.itemId);
          const bActive = activeItems.includes(b.itemId);
          return aActive === bActive ? 0 : aActive ? -1 : 1;
        }) ?? [];
      setArbitaryBag(sorted);
    }
  }, []);

  const handlePageLeft = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handlePageRight = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

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
        return (
          item.fragments.length !== 1 &&
          hasAllFrags &&
          !item.isComplete &&
          matchesSelected
        );
      })
      .map((item) => item.itemId);

    setActiveItems(itemsWithAllFrags);
  };

  const handleJoinItem = async (itemIdx, payMethod = 0) => {
    if (!disableClick.current) {
      disableClick.current = true;
      try {
        const box = boxItems[itemIdx];
        const [key] = Object.keys(box);
        const value = box[key];
        const itemToTransfer = value.map((obj) => obj._id);

        await joinItem(authToken, itemToTransfer, payMethod);
        setBoxItems((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems[itemIdx] = {};
          return updatedItems;
        });

        setBoxFlags((prevFlags) => {
          const updatedFlags = [...prevFlags];
          updatedFlags[itemIdx] = false;
          return updatedFlags;
        });

        setGameData((prevItems) => {
          let updatedStats = { ...prevItems.stats };
          let updatedBagItems = prevItems.bag.filter(
            (item) => !itemToTransfer.includes(item._id)
          );

          const exp = Date.now() + (value.length - 1) * 60 * 60 * 1000;
          const combinedItem = {
            itemId: key,
            exp: exp,
            _id: "sdfsdkjfj",
          };

          updatedStats.gobcoins -= value.length - 1;
          const updatedBuilder = [...prevItems.builder, combinedItem];

          setArbitaryBag(updatedBagItems);

          return {
            ...prevItems,
            builder: updatedBuilder,
            bag: updatedBagItems,
            stats: updatedStats,
          };
        });

        setItemsToTransfer([]);
        setShowCard(null);
        disableClick.current = false;
      } catch (error) {
        setItemsToTransfer([]);
        console.error("Error completing item:", error);
        disableClick.current = false;
      }
    }
  };

  const handleCompleteItem = async (itemId) => {
    if (!disableClick.current) {
      disableClick.current = true;
      try {
        await completeItem(authToken, itemId);
        setGameData((prevItems) => {
          const combinedItem = {
            itemId: itemId,
            fragmentId: 0,
            isComplete: true,
            _id: "sdfsdkjfj",
          };

          const updatedBagItems = [...prevItems.bag, combinedItem];
          const updatedBuilder = prevItems?.builder?.filter(
            (itm) => itm.itemId !== itemId
          );
          setArbitaryBag(updatedBagItems);

          return {
            ...prevItems,
            bag: updatedBagItems,
            builder: updatedBuilder,
          };
        });

        setShowCard(null);
        disableClick.current = false;
      } catch (error) {
        console.error("Error completing item:", error);
        disableClick.current = false;
      }
    }
  };

  const handleTouchStart = (e, item) => {
    if (!activeItems.includes(item.itemId)) return;

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

    console.log("itemBoxIndex", itemBoxIndex);

    if (itemBoxIndex !== -1) {
      setBoxItems((prevBoxes) => {
        const newBoxes = [...prevBoxes];
        const targetBox = { ...newBoxes[itemBoxIndex] };
        const fragmentData = {
          _id: draggedItem._id,
          fragmentId: draggedItem.fragmentId,
        };

        let itemInserted = false;

        // check if exists in one of the boxes
        for (let i = 0; i < newBoxes.length; i++) {
          const box = newBoxes[i];
          if (box[draggedItem.itemId]) {
            const alreadyExists = box[draggedItem.itemId].some(
              (frag) => frag._id === draggedItem._id
            );

            if (!alreadyExists) {
              box[draggedItem.itemId].push(fragmentData);
            }

            itemInserted = true;
            break;
          }
        }

        // if not then insert in target box
        if (!itemInserted) {
          // if target box: chekc already itenm set
          const hasAnyItemAssigned = Object.keys(targetBox).length > 0;

          if (hasAnyItemAssigned) {
            alert("Invalid drop: This box already contains an item.");
            return prevBoxes;
          }
          if (!targetBox[draggedItem.itemId]) {
            targetBox[draggedItem.itemId] = [];
          }

          const alreadyExists = targetBox[draggedItem.itemId].some(
            (frag) => frag._id === draggedItem._id
          );

          if (!alreadyExists) {
            targetBox[draggedItem.itemId].push(fragmentData);
          }

          newBoxes[itemBoxIndex] = targetBox;
        }

        return newBoxes;
      });
      const updatedBag = arbitaryBag.filter((i) => i._id !== draggedItem._id);
      setArbitaryBag(updatedBag);
      setSelectedItem(draggedItem.itemId);
      setDraggedItem(null);
    }
    setDraggedItem(null);
  };

  useEffect(() => {
    initializeActiveItems();
  }, [selectedItem]);

  useEffect(() => {
    if (dragging) return;

    const updatedFlags = [...boxFlags];
    const allBoxes = boxItems || [];
    let flagChanged = false;

    gameItems.forEach((item) => {
      const fragmentCount = item.fragments?.length || 0;

      allBoxes.forEach((box, index) => {
        const boxItemsForItem = box[item.id] || [];

        if (boxItemsForItem.length === fragmentCount && !updatedFlags[index]) {
          updatedFlags[index] = true;
          flagChanged = true;
        }
      });
    });

    if (flagChanged) {
      setSelectedItem(null);
      0;
    }

    setBoxFlags(updatedFlags);
  }, [boxItems, dragging, gameItems]);

  return (
    <div className="w-full h-fit">
      <RoRHeader
        CenterChild={
          <CenterChild isDropActive={itemToTransfer.length === 0 || dragging} />
        }
      />

      <div className="w-[80%] mt-[20dvh] h-[60dvh] mx-auto">
        <div className="grid grid-cols-3 gap-x-1 p-1">
          {/* items in build (reserved) */}
          {gameData?.builder?.map((item, index) => (
            <div
              key={`box-${index}`}
              className="w-[100%] relative flex flex-col gap-1 justify-center items-center aspect-square max-w-[120px] bg-gray-100/10 border border-white/10 shadow-2xl rounded-md overflow-auto"
            >
              <div className="w-full p-0.5" key={index}>
                <GridItem
                  isStage={true}
                  handleClick={() => {}}
                  itemObj={{
                    itemId: item?.itemId,
                    fragmentId: gameItems
                      ?.find((itm) => itm.id == item.itemId)
                      .fragments.map((frags) => frags.fragmentId),
                    isComplete: true,
                  }}
                  scaleIcon={scaleIcon}
                  itemsWithAllFrags={gameData?.bag.map((item) => item.itemId)}
                />
              </div>
              {item?.exp - Date.now() > 0 ? (
                <div className="absolute z-50 text-white text-2xl font-bold p-2">
                  {calculateRemainingTime(item.exp - Date.now())}
                </div>
              ) : (
                <div
                  onClick={() => {
                    handleCompleteItem(item.itemId);
                  }}
                  className="absolute z-50 bg-orange-600 font-bold p-2"
                >
                  Claim
                </div>
              )}
            </div>
          ))}

          {/* reserved positions (reserved)  */}
          {Array.from(
            { length: 3 - gameData.builder.length },
            (_, index) => index
          ).map((index) => {
            const isBoxFilled = Object.keys(boxItems[index]).length > 0;
            const isBoxForClaim = boxFlags[index];
            const x = Object.entries(boxItems[index]).map(
              ([itemId, fragments]) => fragments
            );

            // this works
            console.log(x[0]?.map((frags) => frags.fragmentId));

            return (
              <div
                key={`box-${index}`}
                ref={!isBoxForClaim ? boxRefs[index] : null}
                className="w-[100%] relative flex flex-col gap-1 justify-center items-center aspect-square max-w-[120px] bg-gray-100/20 border border-white/10 shadow-2xl rounded-md overflow-auto"
              >
                {isBoxFilled ? (
                  Object.entries(boxItems[index]).map(([itemId, fragments]) => (
                    <div className="w-full p-0.5" key={itemId}>
                      <GridItem
                        handleClick={() => {}}
                        itemObj={{
                          itemId: itemId,
                          fragmentId: (fragments || [])
                            .map((frags) => frags.fragmentId)
                            .sort((a, b) => a - b),

                          isComplete: false,
                        }}
                        scaleIcon={scaleIcon}
                        itemsWithAllFrags={gameData.bag.map(
                          (item) => item.itemId
                        )}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-booster font-symbols text-white">h</div>
                )}

                {boxFlags[index] && (
                  <div
                    onClick={() => {
                      const box = boxItems[index];
                      const [key] = Object.keys(box);
                      const value = box[key];
                      setShowCard(
                        <MiscCard
                          img={assets.boosters.minionCard}
                          icon="w"
                          Button={
                            <RoRBtn
                              left={value.length}
                              right={value.length - 1}
                              handleClick={() => handleJoinItem(index, 0)}
                            />
                          }
                        />
                      );
                    }}
                    className="absolute z-50 bg-orange-600 font-bold p-2"
                  >
                    MINT
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col justify-center h-[80%]">
          <div className="relative grid grid-cols-3 gap-x-1 gap-y-16 p-1 border border-white/40 shadow-2xl rounded-md">
            <div className="flex justify-center items-center absolute w-full h-full">
              <div className="font-symbols text-[30vw] text-white/40">8</div>
            </div>
            {/* items */}
            {paginatedVaultItems?.map((item) => (
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
                  handleClick={() => {}}
                  itemObj={item}
                  scaleIcon={scaleIcon}
                  itemsWithAllFrags={activeItems}
                />
              </div>
            ))}

            {/* remaining pieces */}
            {Array?.from({ length: 6 - paginatedVaultItems?.length }).map(
              (_, index) => (
                <div
                  key={`box-${index}`}
                  className="relative w-[100%] aspect-square max-w-[120px] overflow-hidden"
                ></div>
              )
            )}
          </div>
        </div>

        {/* copy */}
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

export default Blacksmith;
