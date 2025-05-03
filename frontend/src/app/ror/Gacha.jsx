import { Crown } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Scratch from "../../components/Common/ScratchCrd";
import { RorContext } from "../../context/context";
import { fetchDailyBonus } from "../../utils/api.ror";

const Gacha = () => {
  const { setSection, setGameData, isTelegram, assets, authToken } =
    useContext(RorContext);
  const [changeText, setChangeText] = useState("SCRATCH");
  const [item, setItem] = useState(null);

  const claimDailyBonus = async () => {
    try {
      const response = await fetchDailyBonus(authToken);
      const itemId = response.reward;

      setItem(itemId);

      if (response && itemId) {
        let coins = 0;
        let updateField = null;

        if (/common01/.test(itemId)) {
          // gold coin
          coins = 2;
          updateField = "claimedItems";
        } else if (/starter0[3-9]/.test(itemId)) {
          // silver coin
          coins = 1;
          updateField = "claimedItems";
        } else {
          // other
          updateField = "pouch";
        }

        setGameData((prev) => {
          const newStats = { ...prev.stats };
          let updatedPouch = [...prev.pouch];
          let updatedClaimedItems = [...prev.claimedItems];

          if (updateField == "pouch") {
            updatedPouch.push(itemId);
          } else {
            updatedClaimedItems.push(itemId);
          }

          newStats.gobcoins = (prev.stats.gobcoin || 0) + coins;
          return {
            ...prev,
            pouch: updatedPouch,
            claimedItems: updatedClaimedItems,
            stats: newStats,
          };
        });
      } else {
        console.error("No reward in response:", response);
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
          background: `url(${assets.uxui.rorsplash}) no-repeat center / cover`,
        }}
      ></div>
      <div className="flex flex-col w-full h-full z-50 items-center pt-4">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center w-full h-1/5">
          <Crown color="#FFD660" size={"20vw"} />
          <h1 className="uppercase text-gold text-[14.2vw] -mt-4 scale-zero text-black-contour">
            {changeText}
          </h1>
        </div>
        {/* Scratch */}
        <div
          className={`absolute rounded-md ${
            isTelegram ? "tg-container-height" : "browser-container-height"
          } w-screen flex justify-center items-center`}
        >
          <Scratch
            image={assets.uxui.info}
            item={item}
            handleComplete={() => {
              setTimeout(() => {
                setSection(0);
              }, 5000);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Gacha;
