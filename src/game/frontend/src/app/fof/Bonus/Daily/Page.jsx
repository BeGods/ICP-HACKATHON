import React, { useContext, useEffect, useRef, useState } from "react";
import {
  fetchDailyBonus,
  fetchExploitDailyBonus,
} from "../../../../utils/api.fof";
import { LoaderPinwheel } from "lucide-react";
import { FofContext } from "../../../../context/context";
import ReactHowler from "react-howler";
import SplashScreen from "./Splash";
import { useTranslation } from "react-i18next";
import GachaRoll from "../../../../components/Fx/GachaRoll";
import { trackEvent } from "../../../../utils/ga";
import { handleClickHaptic } from "../../../../helpers/cookie.helper";
import BgLayout from "../../../../components/Layouts/BgLayout";
import BasicLayout from "../../../../components/Layouts/BasicLayout";

const tele = window.Telegram?.WebApp;

const Gacha = (props) => {
  const { t } = useTranslation();
  const {
    gameData,
    setQuestsData,
    questsData,
    setGameData,
    setShowBooster,
    authToken,
    enableSound,
    enableHaptic,
    assets,
    platform,
    showAnmt,
    isTgMobile,
  } = useContext(FofContext);
  const [reward, setReward] = useState(null);
  const [exploitReward, setExploitReward] = useState([]);
  const [showSpin, setShowSpin] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [changeText, setChangeText] = useState("Win");
  const [spinSound, setSpinSound] = useState(false);
  const [disableHand, setDisableHand] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const claimRef = useRef(false);
  const exploitClaimRef = useRef(false);

  const handleUpdateData = (rewardType, rewardValue, data) => {
    try {
      if (rewardType === "blackOrb") {
        setShowBooster("blackOrb");

        setGameData((prev) => ({
          ...prev,
          blackOrbs: prev.blackOrbs + 1,
        }));
      } else if (rewardType === "mythOrb") {
        setShowBooster("mythOrb");
        const updatedGameData = {
          ...gameData,
          mythologies: gameData.mythologies.map((myth) =>
            myth.name === rewardValue
              ? {
                  ...myth,
                  orbs: myth.orbs + 1,
                }
              : myth
          ),
        };
        setGameData(updatedGameData);
      } else if (rewardType === "minion") {
        setShowBooster("minion");
        setGameData((prevData) => {
          const updatedData = {
            ...prevData,
            mythologies: prevData.mythologies.map((item) =>
              item.name === rewardValue
                ? {
                    ...item,
                    boosters: data,
                  }
                : item
            ),
          };

          return updatedData;
        });
      } else if (rewardType === "automata") {
        setShowBooster("automata");
        setGameData((prevData) => {
          const updatedData = {
            ...prevData,
            mythologies: prevData.mythologies.map((item) =>
              item.name === rewardValue
                ? {
                    ...item,
                    boosters: data,
                  }
                : item
            ),
          };

          return updatedData;
        });
      } else if (rewardType === "quest") {
        setShowBooster("quest");
        const updatedQuestData = questsData.map((item) =>
          item._id === data._id
            ? { ...item, isQuestClaimed: true, isCompleted: true }
            : item
        );
        const updatedGameData = {
          ...gameData,
          mythologies: gameData.mythologies.map((myth) => {
            if (myth.name === data.mythology) {
              return {
                ...myth,
                faith: myth.faith + 1,
                energyLimit: myth.energyLimit + 1000,
              };
            }

            return {
              ...myth,
            };
          }),
        };
        setGameData(updatedGameData);
        setQuestsData(updatedQuestData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const claimDailyBonus = async () => {
    try {
      handleClickHaptic(tele, enableHaptic, platform);

      if (claimRef.current === true) {
        return;
      }
      claimRef.current = true;

      setShowScale(true);
      setIsClaimed(true);
      handlePlay();
      const response = await fetchDailyBonus(authToken);
      if (response && response.reward) {
        handleUpdateData(
          response.reward.type,
          response.reward.mythology,
          response.reward?.boosterUpdatedData
            ? response.reward?.boosterUpdatedData
            : response.reward?.quest
        );
        setTimeout(() => {
          setSpinSound(false);
          setReward(response.reward);
          setShowFlash(true);
          trackEvent("rewards", "claim_daily_reward", "success");
        }, 2000);
      } else {
        console.error("No reward in response:", response);
      }
    } catch (error) {
      console.error("Failed to claim daily bonus:", error);
    }
  };

  const exploitDailyBonus = async () => {
    try {
      if (exploitClaimRef.current === true) {
        return;
      }
      exploitClaimRef.current = true;
      const response = await fetchExploitDailyBonus(authToken);
      if (response && response.reward) {
        handleUpdateData(
          response.reward.type,
          response.reward.mythology,
          response.reward?.boosterUpdatedData
            ? response.reward?.boosterUpdatedData
            : response.reward?.quest
        );

        setTimeout(() => {
          exploitClaimRef.current = false;
        }, 150);

        setExploitReward((prev) => [...prev, response.reward]);
      } else {
        console.error("No reward in response:", response);
      }
    } catch (error) {
      console.error("Failed to claim daily bonus:", error);
    }
  };

  const handlePlay = () => {
    setSpinSound(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) =>
        prevText === "PANDORA" ? t("bonus.box") : "PANDORA"
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const firstTimeout = setTimeout(() => {
      setDisableHand(true);
      const secondTimeout = setTimeout(() => {
        if (!showScale && !isClaimed) {
          claimDailyBonus();
        }
      }, 1500);

      return () => clearTimeout(secondTimeout);
    }, 2000);

    return () => clearTimeout(firstTimeout);
  }, [showScale, isClaimed]);

  return (
    <BgLayout>
      {showFlash ? (
        <div
          className={`flex flex-col items-center w-full h-full flash-overlay ${
            showFlash ? "show" : ""
          }`}
        >
          <SplashScreen
            showFlash={showFlash}
            reward={reward}
            exploitReward={exploitReward}
          />{" "}
        </div>
      ) : (
        <>
          <BasicLayout
            TopChild={<h1 className="bonus-heading-text">{changeText}</h1>}
            CenterChild={
              <div
                onClick={() => {
                  handleClickHaptic(tele, enableHaptic, platform);
                  if (showScale) {
                    exploitDailyBonus();
                  }
                }}
                className="flex flex-grow justify-center items-center relative w-full h-full"
              >
                <img
                  src={`${assets.items.pandora}`}
                  alt="pandora"
                  className={`w-[40dvh] h-fit transition-transform duration-1000  ${
                    !showScale
                      ? "scale-golden-glow glow-box"
                      : "glow-box scale-box"
                  }`}
                />
                <div className={`absolute ${showSpin && "scale-105"} -mt-10`}>
                  <GachaRoll showSpin={spinSound} />
                </div>
              </div>
            }
            BottomChild={
              !showScale && (
                <div className="text-gold -mb-0.5  w-full flex justify-center">
                  <div className="relative">
                    <LoaderPinwheel
                      color="#FFD660"
                      size={"4.5rem"}
                      className={`${disableHand && "animate-spin-slow"}`}
                    />
                  </div>
                </div>
              )
            }
          />
          {spinSound && (
            <ReactHowler
              src={`${assets.audio.gachaSpin}`}
              playing={enableSound}
              preload={true}
              loop
            />
          )}
        </>
      )}
    </BgLayout>
  );
};

export default Gacha;
