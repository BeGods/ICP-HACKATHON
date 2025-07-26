import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem, {
  GridItemCopy,
  GridItemEmpty,
} from "../../components/Layouts/GridItem";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import {
  activateVault,
  tradeItem,
  updateBagData,
  updateVaultData,
} from "../../utils/api.ror";
import { gameItems } from "../../utils/gameItems";
import RoRHeader from "../../components/Layouts/Header";
import { toast } from "react-toastify";
import { elementMythNames, mythOrder } from "../../utils/constants.ror";
import MiscCard from "../../components/Cards/Citadel/MiscCard";
import { showToast } from "../../components/Toast/Toast";
import { isCoin } from "../../helpers/game.helper";
import BgLayout from "../../components/Layouts/BgLayout";
import { GridWrap, SecondaryFooter } from "../../components/Layouts/Wrapper";
import useDragAndDrop from "../../hooks/DragDrop";
import ItemCrd from "../../components/Cards/Relics/ItemsCrd";

//const [enableGuide, setEnableGuide] = useRoRGuide("ror-tutorial01");

const Bank = (props) => {
  const { gameData, setGameData, authToken, setSection, setShowCard } =
    useContext(RorContext);
  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showGrid, setShowGrid] = useState(0);
  const prevGridRef = useRef(showGrid);
  const [showVaultItems, setShowVaultItems] = useState(false);
  const [currVaultMyth, setCurrVaultMyth] = useState(0);
  const mythVault =
    gameData.bank.vault
      .find((itm) => itm.name === mythOrder[currVaultMyth])
      ?.items.map((item) => ({ ...item, isVault: true })) ?? [];

  const pouchItems =
    gameData.pouch
      .filter(
        (itm) =>
          /common02/?.test(itm) ||
          isCoin(itm) === true ||
          itm?.includes("potion")
      )
      .map((itm, idx) => {
        return {
          _id: `daskjfjk${idx}`,
          itemId: itm,
          fragmentId: 0,
          isComplete: true,
          isPouch: true,
        };
      }) ?? [];

  const inventoryItems = [...(gameData.bag ?? []), ...pouchItems];
  const gridItems =
    showVaultItems && showGrid == 3 ? mythVault : inventoryItems;
  const itemsPerPage = 9;
  const totalPages = Math.ceil(gridItems.length / itemsPerPage);
  const paginatedVaultItems = [...gridItems].slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const isGridActive =
    showGrid === 1 || showGrid == 2 || (showGrid == 3 && showVaultItems);

  const handleDropAction = (itemBoxIndex) => {
    if (itemBoxIndex !== -1) {
      if (itemBoxIndex == 0) {
        setShowCard(
          <ItemCrd
            mode={"artifact-sell"}
            src={draggedItem?.itemId}
            isComplete={draggedItem?.isComplete}
            fragmentId={draggedItem?.fragmentId}
            handleClick={() => {
              handleItemToTrade(draggedItem);
            }}
          />
        );
      } else if (itemBoxIndex == 1) {
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
      } else if (itemBoxIndex == 2) {
        if (draggedItem.isPouch) {
          showToast("pouch_error");
        } else if (!gameData.bank.isVaultActive) {
          setShowCard(
            <MiscCard
              id={"banker"}
              isPay={4}
              handleClick={handleActivateBank}
              handleButtonClick={handleActivateBank}
            />
          );
        } else {
          setGameData((prevItems) => {
            let updatedBagItems = prevItems.bag.filter(
              (i) => i._id !== draggedItem._id
            );

            const mythology = draggedItem.itemId.includes("potion")
              ? elementMythNames[
                  draggedItem.itemId?.split(".")[1]
                ]?.toLowerCase()
              : draggedItem.itemId?.split(".")[0];

            let updatedVault = prevItems.bank.vault.map((vaultGroup) => {
              if (vaultGroup.name === mythology) {
                if (vaultGroup.items.length < 27) {
                  itemToTransfer.push(draggedItem._id);
                  return {
                    ...vaultGroup,
                    items: [...vaultGroup.items, draggedItem],
                  };
                } else {
                  toast.error("Error: Insufficient space in vault");
                }
              }
              return vaultGroup;
            });

            return {
              ...prevItems,
              bag: updatedBagItems,
              bank: {
                ...prevItems.bank,
                vault: updatedVault,
              },
            };
          });
        }
      }
    }
  };

  const {
    boxRefs,
    copyPosition,
    dragging,
    draggedItem,
    isLoading,
    setIsLoading,
    isTouched,
    scaleIcon,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useDragAndDrop({ handleDropAction });

  // transfer to vault
  const handleAddToVault = async () => {
    try {
      const response = await updateVaultData(authToken, itemToTransfer);
      setItemsToTransfer([]);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // transfer to vault
  const handleAddToBag = async () => {
    try {
      const response = await updateBagData(authToken, itemToTransfer);
      setItemsToTransfer([]);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // sell item
  const handleItemToTrade = async (draggedItem) => {
    setIsLoading(true);
    try {
      const itemId = draggedItem.isPouch ? draggedItem.itemId : draggedItem._id;
      await tradeItem(
        authToken,
        itemId,
        draggedItem.isPouch,
        draggedItem.isVault
      );

      // update dragged item
      setGameData((prevItems) => {
        let updatedBagItems = prevItems.bag;
        let updatedPouchItems = prevItems.pouch;
        let updatedVaultItems = prevItems.bank.vault;

        if (draggedItem.isPouch) {
          updatedPouchItems = prevItems.pouch.filter(
            (i) => i !== draggedItem.itemId
          );
        } else if (draggedItem.isVault) {
          updatedVaultItems = prevItems.bank.vault.map((group) => {
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
        } else {
          updatedBagItems = prevItems.bag.filter(
            (i) => i._id !== draggedItem._id
          );
        }

        const itemData = gameItems.find(
          (item) => item.id == draggedItem.itemId
        );
        const updatedCoins =
          prevItems.stats.gobcoin +
          (draggedItem.isComplete ? itemData.coins : 1);

        return {
          ...prevItems,
          bag: updatedBagItems,
          pouch: updatedPouchItems,
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

  // activate bank
  const handleActivateBank = async (isMulti) => {
    try {
      await activateVault(authToken, isMulti);
      setShowCard(null);
      setGameData((prev) => {
        const newStats = { ...prev.stats };

        newStats.gobcoin = prev.stats.gobcoin - 4;

        return {
          ...prev,
          stats: newStats,
          bank: {
            ...prev.bank,
            isVaultActive: true,
          },
        };
      });
      showToast("vault_success");
    } catch (error) {
      console.log(error);
      setShowCard(null);
      showToast("vault_error");
    }
  };

  const handlePageLeft = () => {
    if (isGridActive) {
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    } else {
      setCurrVaultMyth(
        (prev) => (prev - 1 + mythOrder.length - 1) % (mythOrder.length - 1)
      );
    }
  };

  const handlePageRight = () => {
    if (isGridActive) {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    } else {
      setCurrVaultMyth((prev) => (prev + 1) % (mythOrder.length - 1));
    }
  };

  // transfer to vault/bag
  useEffect(() => {
    const prevGrid = prevGridRef.current;

    if (itemToTransfer.length > 0) {
      if (prevGrid === 2 && showGrid !== 2) {
        (async () => await handleAddToVault())();
      } else if (prevGrid === 3 && showGrid !== 3) {
        (async () => await handleAddToBag())();
      }
    }

    prevGridRef.current = showGrid;
  }, [showGrid]);

  return (
    <BgLayout>
      <RoRHeader />

      {isGridActive && (
        <GridWrap>
          {/* draggedItem */}
          {isTouched && draggedItem && (
            <GridItemCopy
              copyPosition={copyPosition}
              draggedItem={draggedItem}
            />
          )}

          {/* item slots */}
          {paginatedVaultItems.map((item) => (
            <div
              key={item._id}
              onPointerDown={(e) => handleTouchStart(e, item)}
              onPointerMove={handleTouchMove}
              onPointerUp={handleTouchEnd}
              className={` relative w-full touch-none max-w-[120px] flex flex-col items-center  ${
                scaleIcon && draggedItem === item ? "scale-110" : ""
              }`}
            >
              <GridItem
                handleClick={() => {}}
                itemObj={item}
                scaleIcon={scaleIcon}
                itemsWithAllFrags={
                  isLoading ? [] : gridItems.map((item) => item.itemId)
                }
              />
            </div>
          ))}

          {/* empty slots */}
          {Array.from({
            length: itemsPerPage - paginatedVaultItems.length,
          }).map((_, index) => (
            <GridItemEmpty icon={"8"} idx={index} />
          ))}
        </GridWrap>
      )}

      <SecondaryFooter
        items={[
          {
            icon: "A",
            label: "sell",
            handleClick: () => {
              setShowGrid((prev) => {
                if (prev !== 0) {
                  return 0;
                } else {
                  return 1;
                }
              });
              setShowVaultItems(false);
            },
          },
          {
            icon: "8",
            label: "view",
            disable: showGrid === 1 || showGrid == 2,
            handleClick: () => {
              setShowGrid((prev) => {
                if (prev !== 0) {
                  return 0;
                } else {
                  return 2;
                }
              });
              setShowVaultItems(false);
            },
          },
          {
            icon: ",",
            label: !gameData.bank.isVaultActive
              ? "Buy"
                ? dragging
                : "Drop"
              : `keep`,
            disable: showGrid == 1,
            border:
              showGrid == 3
                ? `border-${mythOrder[currVaultMyth]}-primary text-${mythOrder[currVaultMyth]}-primary text-black-contour`
                : "text-white text-black-contour",
            handleClick: () => {
              if (!gameData.bank.isVaultActive) {
                setShowCard(
                  <MiscCard
                    id={"banker"}
                    isPay={4}
                    handleClick={handleActivateBank}
                    handleButtonClick={handleActivateBank}
                  />
                );
              } else {
                if (showGrid == 3) {
                  setShowVaultItems((prev) => !prev);
                } else {
                  setShowGrid((prev) => {
                    if (prev !== 0) {
                      return 0;
                    } else {
                      return 3;
                    }
                  });
                }
              }
            },
          },
        ]}
        id="banker"
        isGrid={isGridActive}
        isItem={showGrid == 3 && showVaultItems == false}
        src={`https://media.publit.io/file/BeGods/items/240px-${mythOrder[currVaultMyth]}.artifact.starter00-off.png`}
        dropRef={boxRefs}
        handleItemClick={() => {
          if (showGrid == 3) {
            setShowVaultItems(true);
          }
        }}
      />

      {/* side buttons */}
      <>
        <ToggleBack
          minimize={2}
          handleClick={() => {
            if (showGrid == 0) {
              setSection(0);
            }
            if (showGrid == 3 && showVaultItems) {
              setShowVaultItems(false);
            } else {
              setShowGrid(0);
            }
          }}
          activeMyth={8}
          isClose={showGrid !== 0}
        />
      </>
      {((showGrid == 3 && !showVaultItems) ||
        gridItems.length > itemsPerPage) && (
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
    </BgLayout>
  );
};

export default Bank;

// const handleActivate = async (key, value) => {
//   setShowCard(null);
//   await setStorage(tele, key, value);
// };

// const checkFirstTime = async () => {
//   const isActive = await getActiveFeature(tele, "banker01");

//   if (!isActive) {
//     setShowCard(
//       <MiscCard
//         id="banker"
//         handleClick={() => handleActivate("banker01", true)}
//       />
//     );
//   }
// };
// (async () => await checkFirstTime())();

// useEffect(() => {
//   if (enableGuide) {
//     setShowCard(
//       <BankGuide
//         currTut={0}
//         handleClick={() => {
//           setShowCard(
//             <BankGuide
//               currTut={1}
//               handleClick={() => {
//                 setShowCard(null);
//                 setEnableGuide(false);
//                 if (gameData.bank.isVaultActive) {
//                   setSection(5);
//                 } else {
//                   setShowCard(
//                     <MiscCard
//                       id="banker"
//                       isPay={4}
//                       handleClick={handleActivateBank}
//                       handleButtonClick={handleActivateBank}
//                     />
//                   );
//                 }
//               }}
//             />
//           );
//         }}
//       />
//     );
//   }
// }, [enableGuide]);
