import { useContext, useEffect, useState } from "react";
import { RorContext } from "../../../context/context";
import { fetchDailyBonus } from "../../../utils/api.ror";
import { mythologies } from "../../../utils/constants.ror";
import ReactHowler from "react-howler";
import confetti from "canvas-confetti";
import { useTranslation } from "react-i18next";
import BasicLayout from "../../../components/Layouts/BasicLayout";

const Gacha = () => {
  const { setSection, setGameData, assets, authToken, enableSound } =
    useContext(RorContext);
  const { t } = useTranslation();
  const [showScale, setShowScale] = useState(0);
  const [showYouScale, setShowYouScale] = useState(0);
  const [showWon, setShowWon] = useState(false);
  const [itemSrc, setItemSrc] = useState(null);
  const [play, setPlay] = useState(false);
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

      if (response && itemId) {
        if (itemId === "coin 2") {
          setItemSrc({
            icon: "A",
            title: "2 gobcoin",
          });
          setGameData((prev) => {
            const newStats = { ...prev.stats };

            newStats.gobcoin = (prev.stats.gobcoin || 0) + 2;
            return {
              ...prev,
              stats: newStats,
            };
          });
        } else if (itemId === "coin 1") {
          setItemSrc({
            icon: "A",
            title: "1 gobcoin",
          });
          setGameData((prev) => {
            const newStats = { ...prev.stats };

            newStats.gobcoin = (prev.stats.gobcoin || 0) + 1;
            return {
              ...prev,
              stats: newStats,
            };
          });
        } else if (itemId === "meal") {
          setItemSrc({
            icon: ")",
            title: "1 daily meal",
          });

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
          const element = itemId?.split(".")[1].slice(0, -2);
          const mythIndexOf = shards.indexOf(itemId);
          const mythologyName = mythologies[mythIndexOf];
          setItemSrc({
            myth: mythIndexOf < 4 ? mythologyName : "other",
            icon: "l",
            title: `100 ${element} shards`,
          });
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
          const mythologyName = itemId?.split(".")[0];
          setItemSrc({
            myth: mythologyName,
            icon: "*",
            title: `1 ${mythologyName} map`,
          });
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
    (async () => await claimDailyBonus())();
  }, []);

  const playConfetti = () => {
    const defaults = {
      spread: 360,
      ticks: 80,
      gravity: 0,
      decay: 0.94,
      startVelocity: 20,
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["star"],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
      });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
    setTimeout(shoot, 300);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowYouScale(125);
      setTimeout(() => {
        setShowYouScale(100);
        setShowWon(true);
        playConfetti();
      }, 1000);
    }, 100);
  }, []);

  useEffect(() => {
    if (showWon) {
      setTimeout(() => {
        setShowScale(150);
        setTimeout(() => {
          setShowScale(100);
          setTimeout(() => {
            setSection(1);
          }, 2000);
        }, 500);
      }, 500);
    }
  }, [showWon]);

  return (
    <>
      <BasicLayout
        TopChild={
          <h1 className="bonus-heading-text">
            {t("bonus.youwon")
              .split(" ")
              .map((word, index) => (
                <div key={index}>
                  {index === 0 ? (
                    <h1
                      className={`scale-[${showYouScale}%] text-bonus-title-lg mb-1 text-center transition-transform duration-500`}
                    >
                      {word}
                    </h1>
                  ) : (
                    <>
                      {showWon && (
                        <h1 className="text-bonus-title text-center transition-opacity duration-250">
                          {word}
                        </h1>
                      )}
                    </>
                  )}
                </div>
              ))}
          </h1>
        }
        CenterChild={
          <div
            className={`flex relative flex-col items-center cursor-pointer z-50 card`}
          >
            <div className="card__face card__face--front flex justify-center items-center">
              <div
                onClick={() => {
                  handleClickHaptic(tele, enableHaptic);
                  handleClick();
                }}
                className={`text-white transition-all duration-500 font-symbols scale-${showScale} ${
                  itemSrc?.myth
                    ? `text-${itemSrc?.myth?.toLowerCase()}-primary`
                    : "text-white"
                } text-[15rem] mx-auto icon-black-contour`}
              >
                {itemSrc?.icon ?? ""}
              </div>
            </div>

            <div
              className={`card__face card__face--back flex justify-center items-center`}
            ></div>
          </div>
        }
        BottomChild={
          <div
            className={`text-gold text-black-contour leading-[3rem] text-bonus-desc text-center -mb-2  pb-safeBottom  uppercase transition-all duration-500 scale-${showScale} w-full flex justify-center items-center`}
          >
            {itemSrc?.title ?? ""}
          </div>
        }
      />

      {/* Audios */}
      <ReactHowler
        src={`${assets.audio.gachaWin}`}
        playing={play && enableSound}
        preload={true}
        onEnd={() => {
          setPlay(false);
        }}
      />
    </>
  );
};

export default Gacha;
