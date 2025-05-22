import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
import GridItem from "../../components/Layouts/GridItem";
import { RorContext } from "../../context/context";
import { completeItem, joinItem } from "../../utils/api.ror";
import { gameItems } from "../../utils/gameItems";
import RoRHeader from "../../components/Layouts/Header";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import MiscCard from "../../components/Cards/Citadel/MiscCard";
import RoRBtn from "../../components/Buttons/RoRBtn";
import {
  getActiveFeature,
  handleClickHaptic,
  setStorage,
} from "../../helpers/cookie.helper";
import { calculateRemainingTime } from "../../helpers/ror.timers.helper";
import { showToast } from "../../components/Toast/Toast";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ handleClick, assets }) => {
  return (
    <div
      onClick={handleClick}
      style={{
        backgroundImage: `url(${assets.boosters.minionHead})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className={`
           flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-50 left-1/2 -translate-x-1/2`}
    ></div>
  );
};

const Blacksmith = () => {
  const {
    gameData,
    setGameData,
    authToken,
    setShowCard,
    assets,
    enableHaptic,
  } = useContext(RorContext);
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
      handleClickHaptic(tele, enableHaptic);

      try {
        const box = boxItems[itemIdx];
        const [key] = Object.keys(box);
        const value = box[key];
        const itemToTransfer = value.map((obj) => obj._id);

        await joinItem(authToken, itemToTransfer, payMethod);
        setBoxItems((prevItems) => {
          const updatedItems = prevItems.filter((_, idx) => idx !== itemIdx);
          updatedItems.push({});
          return updatedItems;
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

          updatedStats.gobcoin -= value.length - 1;
          const updatedBuilder = [...prevItems.builder, combinedItem];

          setArbitaryBag(updatedBagItems);

          return {
            ...prevItems,
            builder: updatedBuilder,
            bag: updatedBagItems,
            stats: updatedStats,
          };
        });

        showToast("join_success");
        setItemsToTransfer([]);
        setShowCard(null);
        disableClick.current = false;
      } catch (error) {
        showToast("join_error");
        setItemsToTransfer([]);
        console.error("Error completing item:", error);
        disableClick.current = false;
      }
    }
  };

  const handleCompleteItem = async (itemId) => {
    if (!disableClick.current) {
      disableClick.current = true;
      handleClickHaptic(tele, enableHaptic);

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

        showToast("item_success_bag");
        setShowCard(null);
        disableClick.current = false;
      } catch (error) {
        showToast("item_error");
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
      y: touch.clientY - 250,
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

      return overlapPercentage >= 15;
    });

    if (itemBoxIndex !== -1) {
      setBoxItems((prevBoxes) => {
        const newBoxes = [...prevBoxes];
        const fragmentData = {
          _id: draggedItem._id,
          fragmentId: draggedItem.fragmentId,
        };

        let itemInserted = false;

        // case1: check if exists in one of the boxes
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

        // case2: if not then insert in the first empty box
        if (!itemInserted) {
          let insertedInEmptyBox = false;

          for (let i = 0; i < newBoxes.length; i++) {
            const box = newBoxes[i];
            const isEmpty = Object.keys(box).length === 0;

            if (isEmpty) {
              const newBox = { ...box };
              newBox[draggedItem.itemId] = [fragmentData];
              newBoxes[i] = newBox;
              insertedInEmptyBox = true;
              break;
            }
          }

          if (!insertedInEmptyBox) {
            alert("No empty box available to insert the item.");
            return prevBoxes;
          }
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
    handleClickHaptic(tele, enableHaptic);

    setShowCard(
      <MiscCard
        showInfo={true}
        img={assets.boosters.minionCard}
        icon="Blacksmith"
        isMulti={false}
        handleClick={() => setShowCard(null)}
        Button={
          <RoRBtn
            message={"Close"}
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
                message={"Enter"}
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
      <RoRHeader
        CenterChild={<CenterChild assets={assets} handleClick={showInfoCard} />}
      />

      <div className="w-[80%] mt-[18dvh] h-[60dvh] relative mx-auto">
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
        <div className="grid grid-cols-3 gap-2 p-1 w-full h-full overflow-y-auto">
          {/* reserved slots */}
          {gameData?.builder?.map((item, index) => (
            <div
              key={`builder-${index}`}
              className={`relative border border-${
                item?.itemId?.split(".")[0]
              }-primary text-white glow-inset-button-${
                item?.itemId?.split(".")[0]
              } flex flex-col items-center aspect-square shadow-2xl max-w-[120px] w-full h-full max-h-[140px] rounded-md overflow-hidden`}
            >
              <div className="w-full">
                <GridItem
                  showClaim={
                    item?.exp - Date.now() <= 0
                      ? "Claim"
                      : `${calculateRemainingTime(item?.exp - Date.now())}`
                  }
                  handleClick={() => {
                    if (item?.exp - Date.now() <= 0) {
                      handleCompleteItem(item.itemId);
                    } else {
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
                  className={` relative text-white
                    max-w-[120px] w-full rounded-md overflow-hidden `}
                >
                  {isBoxFilled ? (
                    Object.entries(boxItems[index]).map(
                      ([itemId, fragments]) => (
                        <div
                          className={`w-full flex flex-col rounded-md border items-center ${
                            isBoxForClaim
                              ? `border-${myth}-primary text-white glow-inset-button-${myth}`
                              : "border-white"
                          }`}
                          key={itemId}
                        >
                          <GridItem
                            showClaim={
                              isBoxForClaim ? (
                                <>
                                  <span className="font-symbols px-2">A</span>1
                                </>
                              ) : undefined
                            }
                            handleClick={() => {
                              handleJoinItem(index, 0);
                            }}
                            itemObj={{
                              itemId: itemId,
                              fragmentId: fragments.map(
                                (frag) => frag.fragmentId
                              ),
                              isComplete: (fragments?.length ?? 0) >= 2,
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
                    <div
                      className={`flex flex-col rounded-md border items-center w-full`}
                    >
                      <div className="w-full aspect-square bg-white/20 flex justify-center items-center">
                        <span className="text-iconLg font-symbols text-white">
                          h
                        </span>
                      </div>
                      <div className="w-full text-white text-sm uppercase text-center px-1 py-1 leading-tight truncate">
                        Drop
                      </div>
                    </div>
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
              className={`relative  ${
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
                    slot{gameData.bag.length - index + 1}
                  </div>
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
                  backgroundImage: `url(https://media.publit.io/file/BeGods/items/240px-${draggedItem.itemId}.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "100% 20%",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </div>
          </div>
        )}
        {gameData.bag.length <= 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-500 text-white px-4 py-2 rounded-full text-[1rem] font-roboto shadow-lg">
            Bag is empty
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
