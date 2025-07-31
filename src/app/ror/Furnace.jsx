import { useState, useEffect, useMemo } from "react";
import GridItem, {
  GridItemCopy,
  GridItemEmpty,
} from "../../components/Layouts/GridItem";
import { completeItem, joinItem } from "../../utils/api.ror";
import { gameItems } from "../../utils/gameItems";
import RoRHeader from "../../components/Layouts/Header";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { calculateRemainingTime } from "../../helpers/ror.timers.helper";
import { showToast } from "../../components/Toast/Toast";
import { useRoRGuide } from "../../hooks/useTutorial";
import BgLayout from "../../components/Layouts/BgLayout";
import { GridWrap, SecondaryFooter } from "../../components/Layouts/Wrapper";
import ItemCrd from "../../components/Cards/Relics/ItemsCrd";
import { Download } from "lucide-react";
import useDragAndDrop from "../../hooks/useDragDrop";
import { useStore } from "../../store/useStore";

const Furnace = () => {
  const gameData = useStore((s) => s.gameData);
  const setGameData = useStore((s) => s.setGameData);
  const authToken = useStore((s) => s.authToken);
  const setShowCard = useStore((s) => s.setShowCard);
  const setSection = useStore((s) => s.setSection);

  const [activeItems, setActiveItems] = useState([]);
  const [arbitaryBag, setArbitaryBag] = useState(gameData.bag);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [boxFlags, setBoxFlags] = useState([false, false, false]);
  const [enableGuide, setEnableGuide] = useRoRGuide("ror-tutorial02");
  const [boxItems, setBoxItems] = useState([{}, {}, {}]);
  const [showGrid, setShowGrid] = useState(false);

  const itemsPerPage = 9;
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

  const handleDropAction = (itemBoxIndex) => {
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
    }
  };

  const dropDisableCondn = (item) => !activeItems.includes(item.itemId);

  const {
    boxRefs,
    copyPosition,
    dragging,
    draggedItem,
    isTouched,
    scaleIcon,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useDragAndDrop({ handleDropAction, dropDisableCondn });

  const handleJoinItem = async (itemIdx, adId) => {
    try {
      const box = boxItems[itemIdx];
      const [key] = Object.keys(box);
      const value = box[key];
      const itemToTransfer = value.map((obj) => obj._id);

      await joinItem(authToken, itemToTransfer, 0);
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
      setShowCard(null);
    } catch (error) {
      showToast("join_error");
      console.error("Error completing item:", error);
    }
  };

  const handleCompleteItem = async (itemId, adId) => {
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
    } catch (error) {
      showToast("item_error");
      console.error("Error completing item:", error);
    }
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

          setTimeout(() => {
            setShowCard(
              <ItemCrd
                src={item.id}
                handleClick={() => handleJoinItem(index)}
              />
            );
          }, 0);
        }
      });
    });

    if (flagChanged) {
      setSelectedItem(null);
    }

    setBoxFlags(updatedFlags);
  }, [boxItems, dragging, gameItems]);

  return (
    <BgLayout>
      <RoRHeader
        isFurnaceBuild={boxItems.some((item) => Object.keys(item).length > 0)}
        handleClick={() => {
          if (boxItems.some((item) => Object.keys(item).length > 0)) {
            setBoxItems([{}, {}, {}]);
          }
        }}
      />

      {showGrid ? (
        <GridWrap>
          {/* bag item slots */}
          {paginatedVaultItems?.map((item) => (
            <div
              key={item._id}
              onPointerDown={(e) => handleTouchStart(e, item)}
              onPointerMove={handleTouchMove}
              onPointerUp={handleTouchEnd}
              className={`relative touch-none w-full max-w-[120px] flex flex-col  ${
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
          {Array.from({
            length: itemsPerPage - paginatedVaultItems.length,
          }).map((_, index) => (
            <GridItemEmpty idx={index} icon={8} />
          ))}

          {/* draggedItem */}
          {isTouched && draggedItem && (
            <GridItemCopy
              copyPosition={copyPosition}
              draggedItem={draggedItem}
            />
          )}
        </GridWrap>
      ) : (
        <></>
      )}

      <SecondaryFooter isGrid={showGrid} id="blacksmith">
        {/* build slots */}
        {gameData?.builder?.map((item, index) => (
          <div
            key={`builder-${index}`}
            className={`border relative max-w-[120px] w-full rounded-md overflow-hidden`}
          >
            {item?.exp - Date.now() <= 0 && (
              <div
                onClick={() => {
                  if (item?.exp - Date.now() <= 0) {
                    handleCompleteItem(item.itemId);
                  }
                }}
                className="absolute w-full h-full z-50 flex justify-center items-center bg-black/50"
              >
                <div className="flex justify-center items-center mb-8 w-12 h-12 border border-black bg-white rounded-full">
                  <Download color="black" size={30} />
                </div>
              </div>
            )}

            <GridItem
              itemObj={{
                itemId: item?.itemId,
                fragmentId: gameItems
                  ?.find((itm) => itm.id == item.itemId)
                  .fragments.map((frag) => frag.fragmentId),
                isComplete: true,
              }}
              scaleIcon={scaleIcon}
              itemsWithAllFrags={gameData?.bag.map((itm) => itm.itemId)}
              showLabel={true}
              customLabel={
                item?.exp - Date.now() <= 0
                  ? "Claim"
                  : `${calculateRemainingTime(item?.exp - Date.now())}`
              }
            />
          </div>
        ))}

        {/* forge slots */}
        {Array.from({ length: 3 - gameData.builder.length }).map((_, index) => {
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
                Object.entries(boxItems[index]).map(([itemId, fragments]) => (
                  <div
                    className={`w-full flex flex-col rounded-md border items-center ${
                      isBoxForClaim
                        ? `border-${myth}-primary text-white glow-inset-button-${myth}`
                        : "border-white"
                    }`}
                    key={itemId}
                  >
                    <GridItem
                      handleClick={() => {
                        if (isBoxForClaim) {
                          setShowCard(
                            <ItemCrd
                              src={itemId}
                              handleClick={() => {
                                handleJoinItem(index);
                              }}
                            />
                          );
                        }
                      }}
                      itemObj={{
                        itemId: itemId,
                        fragmentId: fragments.map((frag) => frag.fragmentId),
                        isComplete: (fragments?.length ?? 0) >= 2,
                      }}
                      scaleIcon={scaleIcon}
                      itemsWithAllFrags={gameData?.bag.map((itm) => itm.itemId)}
                      showLabel={true}
                    />
                  </div>
                ))
              ) : (
                <GridItemEmpty
                  idx={index}
                  icon={index == 0 ? "q" : "h"}
                  label={index == 0 ? "DROP" : "FORGE"}
                  handleClick={() => {
                    setShowGrid((prev) => !prev);
                  }}
                />
              )}
            </div>
          );
        })}
      </SecondaryFooter>

      <>
        <ToggleBack
          minimize={2}
          handleClick={() => {
            setSection(0);
          }}
          activeMyth={8}
        />
      </>
      {gameData.bag.length > itemsPerPage && (
        <>
          <ToggleLeft
            positionBottom={true}
            activeMyth={4}
            handleClick={() => {
              setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
            }}
          />
          <ToggleRight
            positionBottom={true}
            activeMyth={4}
            handleClick={() => {
              setCurrentPage((prev) => (prev + 1) % totalPages);
            }}
          />
        </>
      )}
    </BgLayout>
  );
};

export default Furnace;

// const handleActivate = async (key, value) => {
//   setShowCard(null);
//   await setStorage(tele, key, value);
// };

// useEffect(() => {
//   const checkFirstTime = async () => {
//     const isActive = await getActiveFeature(tele, "blacksmith01");

//     if (!isActive) {
//       setShowCard(
//         <MiscCard
//           id={"blacksmith"}
//           handleClick={() => handleActivate("blacksmith01", true)}
//         />
//       );
//     }
//   };
//   (async () => await checkFirstTime())();
// }, []);

// useEffect(() => {
//   if (enableGuide) {
//     setShowCard(
//       <FurnaceGuide
//         handleClick={() => {
//           setEnableGuide(false);
//           setShowCard(null);
//         }}
//       />
//     );
//   }
// }, [enableGuide]);
