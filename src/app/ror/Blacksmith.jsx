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
import { getActiveFeature, setStorage } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

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
      x: touch.clientX - 100,
      y: touch.clientY - 220,
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

      const arbitaryCopyX = copyPosition.x + 20;
      const arbitaryCopyY = copyPosition.y + 120;

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
    if (gameData?.bag) {
      const sorted =
        [...gameData.bag].sort((a, b) => {
          const aActive = activeItems.includes(a.itemId);
          const bActive = activeItems.includes(b.itemId);
          return aActive === bActive ? 0 : aActive ? -1 : 1;
        }) ?? [];
      setArbitaryBag(sorted);
    }

    // const isActive = await getActiveFeature(tele, "blacksmith");

    // if(!isActive){
    //   showInfoCard()
    // }
  }, []);

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

  const showInfoCard = async () => {
    setShowCard(
      <MiscCard
        showInfo={true}
        img={assets.boosters.minionCard}
        icon="Blacksmith"
        isMulti={false}
        handleClick={() => setShowCard(null)}
        Button={
          <RoRBtn
            isNotPay={true}
            left={1}
            right={1}
            handleClick={() => setShowCard(null)}
          />
        }
      />
    );
  };

  const handleActivate = async (key, value) => {
    setShowCard(null);
    await setStorage(tele, key, value);
  };

  useEffect(() => {
    const checkFirstTime = async () => {
      const isActive = await getActiveFeature(tele, "blacksmith01");

      if (!isActive) {
        setShowCard(
          <MiscCard
            showInfo={false}
            img={assets.boosters.minionCard}
            icon="Blacksmith"
            isMulti={false}
            handleClick={() => handleActivate("blacksmith01", true)}
            Button={
              <RoRBtn
                isNotPay={true}
                left={1}
                right={1}
                handleClick={() => handleActivate("blacksmith01", true)}
              />
            }
          />
        );
      }
    };
    (async () => await checkFirstTime())();
  }, []);

  return (
    <div className="w-full h-fit">
      <RoRHeader CenterChild={<CenterChild handleClick={showInfoCard} />} />

      <div className="w-[80%] mt-[18dvh] h-[60dvh] relative mx-auto">
        <div
          className="absolute inset-0 z-0 filter-orb-white"
          style={{
            backgroundImage: `url(${assets.uxui.basebg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            opacity: 0.5,
          }}
        />
        <div className="grid grid-cols-3 gap-2 p-1 w-full h-full overflow-y-auto">
          {/* reserved slots */}
          {gameData?.builder?.map((item, index) => (
            <div
              key={`builder-${index}`}
              className={`relative border border-${
                item?.itemId?.split(".")[0]
              }-primary text-white glow-button-${
                item?.itemId?.split(".")[0]
              } flex flex-col items-center aspect-square shadow-2xl max-w-[120px] w-full h-full max-h-[140px] rounded-md overflow-hidden`}
            >
              <div className="w-full">
                <GridItem
                  showClaim={item?.exp - Date.now() < 0}
                  timer={item.exp}
                  handleClick={() => {
                    if (item?.exp - Date.now() <= 0) {
                      handleCompleteItem(item.itemId);
                    }
                  }}
                  itemObj={{
                    itemId: item?.itemId,
                    fragmentId: gameItems
                      ?.find((itm) => itm.id == item.itemId)
                      .fragments.map((frag) => frag.fragmentId),
                    isComplete: true,
                  }}
                  scaleIcon={scaleIcon}
                  itemsWithAllFrags={gameData?.bag.map((itm) => itm.itemId)}
                />
              </div>
            </div>
          ))}

          {Array.from({ length: 3 - gameData.builder.length }).map(
            (_, index) => {
              const isBoxFilled = Object.keys(boxItems[index]).length > 0;
              const isBoxForClaim = boxFlags[index];
              let myth;
              if (isBoxForClaim) {
                const itm = Object.entries(boxItems[index]).map(
                  ([itemId]) => itemId
                );
                myth = itm.toString().split(".")[0];
              }

              return (
                <div
                  key={`reserved-${index}`}
                  ref={!isBoxForClaim ? boxRefs[index] : null}
                  className={`relative border ${
                    isBoxForClaim
                      ? `border-${myth}-primary text-white glow-button-${myth}`
                      : "border-white"
                  } flex flex-col items-center aspect-square shadow-2xl max-w-[120px] w-full h-full max-h-[140px] rounded-md overflow-hidden`}
                >
                  {isBoxFilled ? (
                    Object.entries(boxItems[index]).map(
                      ([itemId, fragments]) => (
                        <div className="w-full" key={itemId}>
                          <GridItem
                            showClaim={isBoxForClaim}
                            handleClick={() => {
                              if (isBoxForClaim) {
                                const box = boxItems[index];
                                const [key] = Object.keys(box);
                                const value = box[key];
                                setShowCard(
                                  <MiscCard
                                    img={assets.boosters.minionCard}
                                    icon="blacksmith"
                                    Button={
                                      <RoRBtn
                                        left={value.length}
                                        right={value.length - 1}
                                        handleClick={() =>
                                          handleJoinItem(index, 0)
                                        }
                                      />
                                    }
                                  />
                                );
                              }
                            }}
                            itemObj={{
                              itemId: itemId,
                              fragmentId: fragments.map(
                                (frag) => frag.fragmentId
                              ),
                              isComplete: fragments?.length >= 2 ?? 0,
                            }}
                            scaleIcon={scaleIcon}
                            itemsWithAllFrags={gameData?.bag.map(
                              (itm) => itm.itemId
                            )}
                          />
                        </div>
                      )
                    )
                  ) : (
                    <>
                      <div className="w-full aspect-square  rounded-md bg-white/20 flex justify-center items-center">
                        <span className="text-iconLg font-symbols text-white">
                          h
                        </span>
                      </div>
                      <div className="w-full text-center text-white text-[1rem] mt-1 break-words px-1">
                        Drop
                      </div>
                    </>
                  )}
                </div>
              );
            }
          )}

          {/* bag item slots */}
          {paginatedVaultItems?.map((item) => (
            <div
              key={item._id}
              onTouchStart={(e) => handleTouchStart(e, item)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative flex flex-col justify-center items-center aspect-square max-w-[120px] max-h-[140px] h-full w-full ${
                scaleIcon && draggedItem === item ? "scale-110" : ""
              }`}
            >
              <GridItem
                hideBg={false}
                handleClick={() => {}}
                itemObj={item}
                isStage={true}
                scaleIcon={scaleIcon}
                itemsWithAllFrags={activeItems}
              />
            </div>
          ))}

          {/* empty slots */}
          {Array.from({ length: 6 - paginatedVaultItems.length }).map(
            (_, index) => (
              <div
                key={`placeholder-${index}`}
                className="relative flex flex-col items-center aspect-square shadow-2xl max-w-[120px] w-full h-full max-h-[140px] rounded-md overflow-hidden"
              >
                <div className="w-full aspect-square bg-white/20 flex justify-center items-center">
                  <span className="text-iconLg font-symbols text-white">8</span>
                </div>
                <div className="w-full text-center text-white text-[1rem] mt-1 break-words px-1">
                  slot {index + 1}
                </div>
              </div>
            )
          )}
        </div>

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

{
  /* {boxFlags[index] && (
                    <div className="absolute w-full h-full flex justify-center items-center backdrop-blur-sm">
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
                    </div>
                  )} */
}
