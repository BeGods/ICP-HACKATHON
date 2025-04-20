import React, { useContext, useEffect, useState } from "react";
import "../../styles/carousel.scss";
import { RorContext } from "../../context/context";
import CitadelItem from "./CitadelItem";
import MiscCard from "./MiscCard";
import RoRBtn from "./RoRBtn";
import { toast } from "react-toastify";
import {
  activateBlacksmith,
  activateRest,
  activateVault,
} from "../../utils/api.ror";

const CitadelCarousel = ({ enableGuide, mythData }) => {
  const {
    assets,
    setShowCard,
    activeMyth,
    authToken,
    gameData,
    setSection,
    setGameData,
  } = useContext(RorContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);
  const [items, setItems] = useState([]);
  const [showEffect, setShowEffect] = useState(false);

  const handleActivateBank = async (isMulti) => {
    if (gameData.bank.isVaultActive) {
      setSection(2);
    } else {
      try {
        const response = await activateVault(authToken, isMulti);
        setShowCard(null);
        setGameData((prev) => {
          const newStats = { ...prev.stats };

          newStats.gobcoin = prev.stats.gobcoin - (isMulti ? 9 : 3);

          return {
            ...prev,
            stats: newStats,
            bank: {
              ...prev.bank,
              isVaultActive: true,
            },
          };
        });
        setSection(2);
        console.log(response);
        toast.success("vault activated");
      } catch (error) {
        console.log(error);
        setShowCard(null);
        toast.error("insufficient gobcoins");
      }
    }
  };

  const handleActivateRest = async () => {
    if (gameData.stats.isRestActive) {
      setSection(2);
    } else {
      try {
        const response = await activateRest(authToken);
        setShowCard(null);
        setGameData((prev) => {
          const newStats = { ...prev.stats };

          newStats.gobcoins = (prev.stats.gobcoin || 0) - 1;
          newStats.isRestActive = true;
          return {
            ...prev,
            stats: newStats,
          };
        });
        setSection(1);
        console.log(response);
        toast.success("rest activated");
      } catch (error) {
        console.log(error);
        setShowCard(null);
        toast.error("insufficient gobcoins");
      }
    }
  };

  const handleActivateBlacksmith = async () => {
    if (gameData.stats.isBlackSmithActive) {
      setSection(3);
    } else {
      try {
        const response = await activateBlacksmith(authToken);
        setShowCard(null);
        setGameData((prev) => {
          const newStats = { ...prev.stats };

          newStats.gobcoins = (prev.stats.gobcoin || 0) - 1;
          newStats.isBlacksmithActive = true;
          return {
            ...prev,
            stats: newStats,
          };
        });
        setSection(3);
        console.log(response);
        toast.success("blacksmith activated");
      } catch (error) {
        console.log(error);
        setShowCard(null);
        toast.error("insufficient gobcoins");
      }
    }
  };

  const handleActivateLibrarian = async () => {
    if (gameData.stats.isLibrnActive) {
      setSection(3);
    } else {
      try {
        const response = await activateBlacksmith(authToken);
        setShowCard(null);
        setGameData((prev) => {
          const newStats = { ...prev.stats };

          newStats.gobcoins = (prev.stats.gobcoin || 0) - 1;
          newStats.isLibrnActive = true;
          return {
            ...prev,
            stats: newStats,
          };
        });
        setSection(3);
        console.log(response);
        toast.success("blacksmith activated");
      } catch (error) {
        console.log(error);
        setShowCard(null);
        toast.error("insufficient gobcoins");
      }
    }
  };

  useEffect(() => {
    const boosters = [
      {
        key: "blacksmith",
        component: (
          <CitadelItem
            icon="h"
            isMulti={false}
            itemKey="blacksmith"
            handleClick={() => {
              if (gameData.stats.isBlackSmithActive) {
                setSection(3);
              } else {
                setShowCard(
                  <MiscCard
                    img={assets.boosters.minionCard}
                    icon="w"
                    isMulti={false}
                    handleClick={handleActivateBlacksmith}
                    Button={
                      <RoRBtn
                        left={1}
                        right={1}
                        handleClick={handleActivateBlacksmith}
                      />
                    }
                  />
                );
              }
            }}
          />
        ),
      },
      {
        key: "merchant",
        component: (
          <CitadelItem
            icon="A"
            isMulti={false}
            itemKey="merchant"
            handleClick={() => {
              setSection(4);
            }}
          />
        ),
      },
      {
        key: "vault",
        component: (
          <CitadelItem
            icon="6"
            itemKey="vault"
            handleClick={() => {
              if (gameData.bank.isVaultActive) {
                setSection(5);
              } else {
                setShowCard(
                  <MiscCard
                    img={assets.boosters.bankerCard}
                    icon="A"
                    isMulti={false}
                    handleClick={handleActivateBank}
                    Button={
                      <RoRBtn
                        left={1}
                        right={3}
                        handleClick={handleActivateBank}
                      />
                    }
                  />
                );
              }
            }}
          />
        ),
      },
      {
        key: "gemologist",
        component: (
          <CitadelItem
            icon="v"
            isMulti={false}
            itemKey="gemologist"
            handleClick={() => {
              setSection(11);
              // if (gameData.stats.isLibrnActive) {
              //   setSection(11);
              // } else {
              //   setShowCard(
              //     <MiscCard
              //       img={assets.boosters.gemologistCard}
              //       icon="v"
              //       isMulti={false}
              //       handleClick={handleActivateLibrarian}
              //       Button={
              //         <RoRBtn
              //           left={1}
              //           right={1}
              //           handleClick={handleActivateLibrarian}
              //         />
              //       }
              //     />
              //   );
              // }
            }}
          />
        ),
      },
    ];

    // if (!gameData.bank.isVaultActive) {
    //   boosters.push({
    //     key: "multiVault",
    //     component: (
    //       <CitadelItem
    //         icon="6"
    //         isMulti={true}
    //         itemKey="multiVault"
    //         handleClick={() => {
    //           if (gameData.bank.isVaultActive) {
    //             setSection(5);
    //           } else {
    //             setShowCard(
    //               <MiscCard
    //                 isMulti={true}
    //                 handleClick={() => handleActivateBank(true)}
    //                 Button={
    //                   <RoRBtn
    //                     isMulti={true}
    //                     left={7}
    //                     right={9}
    //                     handleClick={() => handleActivateBank(true)}
    //                   />
    //                 }
    //               />
    //             );
    //           }
    //         }}
    //       />
    //     ),
    //   });
    // }

    if (!gameData.stats.isRestActive && gameData.stats.isThiefActive) {
      boosters.push({
        key: "rest",
        component: (
          <CitadelItem
            icon="7"
            isMulti={false}
            itemKey="rest"
            handleClick={() => {
              setShowCard(
                <MiscCard
                  isMulti={false}
                  handleClick={handleActivateRest}
                  Button={
                    <RoRBtn
                      left={1}
                      right={3}
                      isMulti={false}
                      handleClick={handleActivateRest}
                    />
                  }
                />
              );
            }}
          />
        ),
      });
    }

    if (
      !gameData?.bag?.find((item) =>
        item?.itemId?.includes("celtic.artifact.starter10")
      )
    ) {
      boosters.push({
        key: "book",
        component: (
          <CitadelItem
            icon="j"
            isMulti={false}
            itemKey="book"
            handleClick={() => {
              setSection(12);
            }}
          />
        ),
      });
    }

    const boosterStatus = {
      multiVault: !gameData.bank.isVaultActive,
      vault: !gameData.bank.isVaultActive,
      blacksmith: true,
      merchant: false,
      rest: false,
    };

    const predefinedOrder = [
      "blacksmith",
      "merchant",
      "multiVault",
      "vault",
      "gemologist",
      "rest",
      "book",
    ];

    const sortedItems = boosters
      .filter((item) => predefinedOrder.includes(item.key))
      .sort((a, b) => {
        const statusA = boosterStatus[a.key] || false;
        const statusB = boosterStatus[b.key] || false;

        // If status is true, prioritize it
        if (statusA && !statusB) return -1;
        if (!statusA && statusB) return 1;

        // If both statuses are equal, fall back to predefined order
        const orderA = predefinedOrder.indexOf(a.key);
        const orderB = predefinedOrder.indexOf(b.key);
        return orderA - orderB;
      })
      .map((item) => item.component);

    setItems(sortedItems);
    setCurrentIndex(0);
  }, [activeMyth, enableGuide, mythData, gameData]);

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (deltaY > 50 && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (deltaY < -50 && currentIndex < items.length - 3) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    setShowEffect(false);
    const resetTimeout = setTimeout(() => {
      setShowEffect(true);
    }, 50);

    return () => clearTimeout(resetTimeout);
  }, [activeMyth]);

  return (
    <div
      className="wrapper h-[60vh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {items.length > 3 && currentIndex >= 1 && (
        <div
          onClick={() => {
            setCurrentIndex((prevIndex) => prevIndex - 1);
          }}
          className="absolute top-[24%] mr-[2vw] w-full z-50"
        >
          <div className="arrows-up"></div>
        </div>
      )}
      <div className="carousel">
        {items.slice(currentIndex, currentIndex + 3).map((item, index) => {
          let className = "carousel__item";
          className +=
            index === 1 ? " active" : index === 0 ? " previous" : " next";

          return (
            <div className={className} key={currentIndex + index}>
              {item}
            </div>
          );
        })}
      </div>
      {currentIndex < items.length - 3 && (
        <div
          onClick={() => setCurrentIndex((prevIndex) => prevIndex + 1)}
          className="absolute bottom-[22%] w-full"
        >
          <div className="arrows-down"></div>
        </div>
      )}
    </div>
  );
};

export default CitadelCarousel;
