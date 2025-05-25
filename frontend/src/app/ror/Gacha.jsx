import { Crown } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Scratch from "../../components/Common/ScratchCrd";
import { RorContext } from "../../context/context";
import { fetchDailyBonus } from "../../utils/api.ror";
import { mythologies } from "../../utils/constants.ror";

const Gacha = () => {
  const { setSection, setGameData, isTelegram, assets, authToken } =
    useContext(RorContext);
  const [changeText, setChangeText] = useState("SCRATCH");
  const [item, setItem] = useState(null);
  const [itemSrc, setItemSrc] = useState(null);
  const shards = [
    "shard.fire01",
    "shard.earth01",
    "shard.water01",
    "shard.air01",
    "shard.aether01",
    "shard.aether02",
  ];

  const claimDailyBonus = async () => {
    try {
      const response = await fetchDailyBonus(authToken);
      const itemId = response.reward;

      setItem(itemId);

      if (response && itemId) {
        if (itemId === "coin 2") {
          setItemSrc(assets.uxui.gobcoin);
          setGameData((prev) => {
            const newStats = { ...prev.stats };

            newStats.gobcoin = (prev.stats.gobcoin || 0) + 2;
            return {
              ...prev,
              stats: newStats,
            };
          });
        } else if (itemId === "coin 1") {
          setItemSrc(assets.uxui.gobcoin);
          setGameData((prev) => {
            const newStats = { ...prev.stats };

            newStats.gobcoin = (prev.stats.gobcoin || 0) + 1;
            return {
              ...prev,
              stats: newStats,
            };
          });
        } else if (itemId === "meal") {
          setItemSrc(
            `https://media.publit.io/file/BeGods/items/320px-tavern-meal.jpg`
          );
          setGameData((prev) => {
            const newStats = { ...prev.stats };

            newStats.isRestActive = true;
            newStats.digLvl += 1;

            return {
              ...prev,
              stats: newStats,
            };
          });
        } else if (itemId?.includes("shard")) {
          const mythIndexOf = shards.indexOf(itemId);
          const mythologyName = mythologies[mythIndexOf];
          setItemSrc(
            `https://media.publit.io/file/BeGods/items/240px-${itemId}.png`
          );
          setGameData((prevItems) => {
            let updatedMythologies = prevItems.stats.mythologies;
            if (mythIndexOf < 4) {
              updatedMythologies = updatedMythologies.map((mythology) => {
                if (mythology?.name === mythologyName) {
                  return {
                    ...mythology,
                    shards: mythology.shards + 100,
                  };
                }

                return mythology;
              });
            } else {
              if (itemId?.includes("aether01")) {
                prevItems.stats.whiteShards = 100;
              } else if (itemId.includes("aether02")) {
                prevItems.stats.blackShards = 100;
              }
            }

            prevItems.stats.mythologies = updatedMythologies;

            return {
              ...prevItems,
              stats: prevItems.stats,
            };
          });
        } else if (itemId?.includes("starter02")) {
          setItemSrc(
            `https://media.publit.io/file/BeGods/items/240px-${itemId}.png`
          );
          setGameData((prev) => {
            let updatedPouch = [...prev.pouch, itemId];

            return {
              ...prev,
              pouch: updatedPouch,
            };
          });
        }
      }
    } catch (error) {
      console.error("Failed to claim daily bonus:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) =>
        prevText === "SCRATCH" ? "BONUS" : "SCRATCH"
      );
    }, 1500);

    (async () => await claimDailyBonus())();

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`flex flex-col ${
        isTelegram ? "tg-container-height" : "browser-container-height"
      } w-screen justify-center font-fof items-center bg-black`}
    >
      <div
        className="absolute inset-0 w-full h-full opacity-70 z-0"
        style={{
          background: `url(${assets.locations.ror}) no-repeat center / cover`,
        }}
      ></div>
      <div className="flex flex-col w-full h-full z-50 items-center pt-4">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center w-full h-1/5">
          <Crown color="#FFD660" size={"4.5rem"} />
          <h1 className="uppercase text-gold text-[4rem] -mt-4 scale-zero text-black-contour">
            {changeText}
          </h1>
        </div>
        {/* Scratch */}
        <div
          className={`absolute rounded-lg ${
            isTelegram ? "tg-container-height" : "browser-container-height"
          } w-screen flex justify-center items-center`}
        >
          <Scratch
            src={itemSrc}
            image={assets.uxui.bgInfo}
            item={item}
            handleComplete={() => {
              setTimeout(() => {
                setSection(1);
              }, 5000);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Gacha;
