import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import { activateVault, tradeItem, updateVaultData } from "../../utils/api.ror";
import { gameItems } from "../../utils/gameItems";
import RoRHeader from "../../components/layouts/Header";
import { toast } from "react-toastify";
import { elementMythNames } from "../../utils/constants.ror";
import MiscCard from "../../components/ror/MiscCard";
import RoRBtn from "../../components/ror/RoRBtn";
import { getActiveFeature, setStorage } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ handleClick }) => {
  return (
    <div
      onClick={handleClick}
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
  const { gameData, setGameData, authToken, setSection, assets, setShowCard } =
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
      x: touch.clientX - 100,
      y: touch.clientY - 220,
    });
  };

  const handleActivateBank = async (isMulti) => {
    try {
      const response = await activateVault(authToken, isMulti);
      setShowCard(null);
      setGameData((prev) => {
        const newStats = { ...prev.stats };

        newStats.gobcoin = prev.stats.gobcoin - (isMulti ? 5 : 1);

        return {
          ...prev,
          stats: newStats,
          bank: {
            ...prev.bank,
            isVaultActive: true,
          },
        };
      });
      console.log(response);
      toast.success("vault activated");
    } catch (error) {
      console.log(error);
      setShowCard(null);
      toast.error("insufficient gobcoins");
    }
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

      return overlapPercentage >= 15;
    });

    if (itemBoxIndex !== -1) {
      if (itemBoxIndex == 0) {
        handleItemToTrade(draggedItem._id);
      } else if (itemBoxIndex == 2) {
        if (!gameData.bank.isVaultActive) {
          setShowCard(
            <MiscCard
              img={assets.boosters.bankerCard}
              icon="A"
              isMulti={false}
              handleClick={handleActivateBank}
              Button={
                <RoRBtn left={1} right={1} handleClick={handleActivateBank} />
              }
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
    setDraggedItem(null);
  };

  const showInfoCard = async () => {
    setShowCard(
      <MiscCard
        showInfo={true}
        img={assets.boosters.bankerCard}
        icon="Banker"
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
      const isActive = await getActiveFeature(tele, "banker01");

      if (!isActive) {
        setShowCard(
          <MiscCard
            showInfo={false}
            img={assets.boosters.bankerCard}
            icon="Banker"
            isMulti={false}
            handleClick={() => handleActivate("banker01", true)}
            Button={
              <RoRBtn
                isNotPay={true}
                left={1}
                right={1}
                handleClick={() => handleActivate("banker01", true)}
              />
            }
          />
        );
      }
    };
    (async () => await checkFirstTime())();
    return () => {
      if (itemToTransfer.length != 0) {
        (async () => handleAddToVault())();
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <RoRHeader CenterChild={<CenterChild handleClick={showInfoCard} />} />
      <div className="w-[80%] mt-[18dvh] h-[60dvh] mx-auto relative">
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
        <div className="grid grid-cols-3  gap-x-2 w-full h-full">
          {[
            {
              icon: "#",
              label: "banker",
            },
            {
              icon: "8",
              label: "bag",
            },
            {
              icon: ",",
              label: "vault",
            },
          ].map((itm, index) => (
            <div
              ref={boxRefs[index]}
              key={`box-${index}`}
              onClick={() => {
                if (index === 2) {
                  if (!gameData.bank.isVaultActive) {
                    setShowCard(
                      <MiscCard
                        img={assets.boosters.bankerCard}
                        icon="Banker"
                        isMulti={false}
                        handleClick={handleActivateBank}
                        Button={
                          <RoRBtn
                            left={1}
                            right={1}
                            handleClick={handleActivateBank}
                          />
                        }
                      />
                    );
                  } else {
                    setSection(5);
                  }
                }
              }}
              className={`relative border ${
                index == 1
                  ? "text-white/20  border-white/20"
                  : "text-white  border-white"
              }  flex flex-col items-center aspect-square shadow-2xl max-w-[120px] w-full h-full max-h-[140px] rounded-md overflow-hidden`}
            >
              <div
                className={`w-full aspect-square rounded-md bg-white/20 flex justify-center items-center`}
              >
                <span className="text-iconLg font-symbols">{itm.icon}</span>
              </div>
              <div className="w-full uppercase text-center text-[1rem] mt-1 break-words px-1">
                {itm.label}
              </div>
            </div>
          ))}

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

          {paginatedVaultItems.map((item) => (
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
