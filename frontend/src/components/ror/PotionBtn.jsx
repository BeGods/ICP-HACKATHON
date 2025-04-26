import React, { useContext, useRef, useState } from "react";
import { RorContext } from "../../context/context";
import { elementMythNames } from "../../utils/constants.ror";
import { toast } from "react-toastify";
import { claimPotion } from "../../utils/api.ror";
import RoRBtn from "./RoRBtn";
import MiscCard from "./MiscCard";

const PotionBtn = ({ potion, stage, showGobCoin }) => {
  const { gameData, setGameData, setShowCard, authToken, setSection, assets } =
    useContext(RorContext);
  const [isClicked, setIsClicked] = useState(false);
  const regex = /potion\.(\w+)\.(A|B)\d{2}$/;
  const match = potion.match(regex);
  const element = match[1];
  const typeCode = match[2];
  const mythology = elementMythNames[element];

  const validateShards = () => {
    const typeA = typeCode === "A" ? "whiteShards" : "blackShards";
    const typeB = typeCode === "B" ? "blackShards" : "whiteShards";

    if (element === "aether") {
      if (gameData.stats[typeA] < 100) {
        toast.error(`Error: You don't have enough ${typeA} shards (need 100)`);
        return;
      }

      if (gameData.stats[typeB] < 900) {
        toast.error(`Error: You don't have enough ${typeB} shards (need 900)`);
        return;
      }
    } else {
      const mythData = gameData.stats.mythologies.find(
        (myth) => myth.name === mythology
      );

      if (!mythData) {
        toast.error(`Error: Mythology ${mythology} not found`);
        return;
      }

      if (mythData.shards < 900) {
        toast.error(
          `Error: You don't have enough ${mythology} shards (need 900)`
        );
        return;
      }

      if (gameData.stats[typeA] < 100) {
        toast.error(`Error: You don't have enough ${typeA} shards (need 100)`);
        return;
      }
    }

    showGobCoin();
  };

  const handleClaimPotion = async () => {
    try {
      const typeA = typeCode === "A" ? "whiteShards" : "blackShards";
      const typeB = typeCode === "B" ? "blackShards" : "whiteShards";

      if (element === "aether") {
        if (gameData.stats[typeA] < 100) {
          toast.error(
            `Error: You don't have enough ${typeA} shards (need 100)`
          );
          return;
        }

        if (gameData.stats[typeB] < 900) {
          toast.error(
            `Error: You don't have enough ${typeB} shards (need 900)`
          );
          return;
        }

        if (gameData.stats.gobcoins < 1) {
          toast.error("Error: You don't have enough gobcoins");
          return;
        }
      } else {
        const mythData = gameData.stats.mythologies.find(
          (myth) => myth.name === mythology
        );

        if (!mythData) {
          toast.error(`Error: Mythology ${mythology} not found`);
          return;
        }

        if (mythData.shards < 900) {
          toast.error(
            `Error: You don't have enough ${mythology} shards (need 900)`
          );
          return;
        }

        if (gameData.stats[typeA] < 100) {
          toast.error(
            `Error: You don't have enough ${typeA} shards (need 100)`
          );
          return;
        }

        if (gameData.stats.gobcoins < 1) {
          toast.error("Error: You don't have enough gobcoins");
          return;
        }
      }

      await claimPotion(authToken, potion);

      const potionItem = {
        _id: "dhflhfhdj",
        itemId: potion,
        fragmentId: 0,
        isComplete: true,
      };

      let showThief = false;

      // update
      setGameData((prev) => {
        const newStats = { ...prev.stats };

        if (!newStats.isThiefActive) {
          newStats.isThiefActive = true;
          showThief = true;
        }

        newStats.gobcoin = (prev.stats.gobcoin || 0) - 1;
        newStats[typeA] = (prev.stats[typeA] || 0) - 100;

        if (element !== "aether") {
          newStats[typeB] = (prev.stats[typeB] || 0) - 900;
        } else {
          newStats.mythologies = prev.stats.mythologies.map((m) => {
            if (m.name === mythology) {
              return {
                ...m,
                shards: (m.shards || 0) - 900,
              };
            }
            return m;
          });
        }

        const updatedBag = [...prev.bag, potionItem];

        return {
          ...prev,
          stats: newStats,
          bag: updatedBag,
        };
      });

      toast.success(potion);
      setShowCard(null);
      setSection(2);

      setTimeout(() => {
        if (showThief) {
          setShowCard(
            <MiscCard
              img={assets.boosters.thiefCard}
              icon="B"
              isMulti={false}
              handleClick={() => setShowCard(null)}
              Button={
                <div className="text-white uppercase h-button-primary mt-[4px] text-num">
                  thief infestation
                </div>
              }
            />
          );
        }
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!stage ? (
        <div
          onClick={validateShards}
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
          className={`flex items-center border text-white ${
            isClicked && `glow-button-white`
          } justify-between h-button-primary w-button-primary mt-[4px] mx-auto px-1 bg-glass-black z-50 rounded-primary`}
        >
          <div className="flex text-primary justify-center items-center w-1/4 h-full">
            <div className="relative flex justify-center items-center">
              <img
                src={`/assets/ror-cards/240px-shard.${
                  element === "aether"
                    ? typeCode !== "A"
                      ? "aether.black"
                      : "aether.white"
                    : element
                }.png`}
                alt="shard"
              />
              <div className="absolute z-10">
                <div className="text-[7vw] text-white glow-text-black pl-1.5">
                  900
                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex shadow-black shadow-2xl justify-center text-[40px] font-symbols items-center bg-black w-[18vw] h-[18vw] border-[3px] rounded-full`}
          >
            V
          </div>

          <div className="flex justify-center items-center w-1/4  h-full">
            <div className="relative flex justify-center items-center">
              <img
                src={`/assets/ror-cards/240px-shard.aether.${
                  element === "aether"
                    ? typeCode === "A"
                      ? "black"
                      : "white"
                    : typeCode === "A"
                    ? "white"
                    : "black"
                }.png`}
                alt="shard"
              />
              <div className="absolute z-10">
                <div className="text-[7vw] text-white glow-text-black pr-1.5">
                  100
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <RoRBtn left={1} right={1} handleClick={handleClaimPotion} />
      )}
    </>
  );
};

export default PotionBtn;
