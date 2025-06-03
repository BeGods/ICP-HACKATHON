import React, { useContext, useRef, useState } from "react";
import { RorContext } from "../../context/context";
import { elementMythNames } from "../../utils/constants.ror";
import { toast } from "react-toastify";
import { claimPotion } from "../../utils/api.ror";
import MiscCard from "../Cards/Citadel/MiscCard";

const PotionBtn = ({ currSection, buttonColor, potion }) => {
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

    handleClaimPotion();
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

        if (gameData.stats.gobcoin < 1) {
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

        if (gameData.stats.gobcoin < 1) {
          toast.error("Error: You don't have enough gobcoins");
          return;
        }
      }

      await claimPotion(authToken, potion);

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

        const updatedPouch = [...prev.pouch, potion];

        return {
          ...prev,
          stats: newStats,
          pouch: updatedPouch,
        };
      });

      toast.success("Potion added to pouch successfully!");
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
                <div className="text-white uppercase h-button-primary mt-[4px] text-[2.5rem]">
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
      className="flex justify-center items-center relative h-fit"
    >
      <img
        src={
          currSection === 1
            ? isClicked
              ? assets.buttons[buttonColor]?.off
              : assets.buttons[buttonColor]?.on
            : isClicked
            ? assets.buttons.black.off
            : assets.buttons.black.on
        }
        alt="button"
      />
      <div className="absolute z-50 uppercase text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
        pay
      </div>
    </div>
  );
};

export default PotionBtn;
