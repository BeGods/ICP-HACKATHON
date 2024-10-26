import Lottie from "lottie-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import animationData from "../../../public/assets/fx/gacha.json";
import { fetchDailyBonus, fetchExploitDailyBonus } from "../../utils/api";

import { Crown, LoaderPinwheel } from "lucide-react";
import { MyContext } from "../../context/context";
import ReactHowler from "react-howler";
import SplashScreen from "./SplashScreen";
import { useTranslation } from "react-i18next";

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
    assets,
  } = useContext(MyContext);
  const lottieRef = useRef(null);
  const [reward, setReward] = useState(null);
  const [exploitReward, setExploitReward] = useState([]);
  const [showSpin, setShowSpin] = useState(true);
  const [showFlash, setShowFlash] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [changeText, setChangeText] = useState("Win");
  const [spinSound, setSpinSound] = useState(false);
  const [disableHand, setDisableHand] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const claimRef = useRef(false);
  const exploitClaimRef = useRef(false);

  const handleUpdateData = (rewardType, rewardValue, data) => {
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
  };

  const claimDailyBonus = async () => {
    tele.HapticFeedback.notificationOccurred("success");

    if (claimRef.current === true) {
      return;
    }
    claimRef.current = true;

    setShowScale(true);
    setIsClaimed(true);
    handlePlay();

    try {
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
          setShowSpin(false);
          setSpinSound(false);
          setReward(response.reward);
          setShowFlash(true);
        }, 2000);
      } else {
        console.error("No reward in response:", response);
      }
    } catch (error) {
      console.error("Failed to claim daily bonus:", error);
    }
  };

  const exploitDailyBonus = async () => {
    if (exploitClaimRef.current === true) {
      return;
    }
    exploitClaimRef.current = true;
    try {
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
    if (lottieRef.current) {
      setSpinSound(true);
      lottieRef.current.play();
      lottieRef.current.setSpeed(3);
    }
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

      // Clean up the second timeout
      return () => clearTimeout(secondTimeout);
    }, 2000);

    // Clean up the first timeout
    return () => clearTimeout(firstTimeout);
  }, [showScale, isClaimed]);

  return (
    <div className="flex flex-col h-screen w-screen justify-center font-fof items-center bg-black">
      <div className="flex flex-col w-full h-full items-center pt-4">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center w-full h-1/5">
          {!showScale && (
            <>
              <Crown color="#FFD660" size={"20vw"} />
              <h1 className="uppercase text-gold text-[14.2vw] -mt-4 scale-zero text-black-contour">
                {changeText}
              </h1>
            </>
          )}
        </div>
        {/* Main */}
        <div
          onClick={() => {
            tele.HapticFeedback.notificationOccurred("success");
            if (showScale) {
              exploitDailyBonus();
            }
          }}
          className="flex flex-grow justify-center items-center relative w-full h-full"
        >
          <img
            src={`${assets.uxui.pandora}`}
            alt="pandora"
            className={`w-fit h-fit transition-transform duration-1000 ${
              showScale
                ? "scale-golden-glow glow-box"
                : "glow-box scale-box -mt-10"
            }`}
          />
          <div className="absolute -mt-10">
            {showSpin && (
              <Lottie
                lottieRef={lottieRef}
                autoplay={false}
                loop
                animationData={animationData}
                className={`w-[90vw] ${showScale && "scale-125"}`}
              />
            )}
          </div>
        </div>
        {/* Bottom */}
        <div className="flex items-start justify-center w-full h-1/5"></div>
        <div className="flex absolute items-start bottom-[92px] justify-center w-full">
          {!showScale && (
            <div className="relative">
              {!disableHand && (
                <div className="font-symbols scale-point z-10 mx-auto my-auto absolute -mt-3 text-white text-[100px] text-black-contour">
                  b
                </div>
              )}
              <LoaderPinwheel
                color="#FFD660"
                size={"18vw"}
                className={`${disableHand && "animate-spin-slow"}`}
              />
            </div>
          )}
        </div>
        {showFlash && (
          <div
            className={`fixed flex flex-col items-center h-screen w-screen flash-overlay ${
              showFlash ? "show" : ""
            }`}
          >
            <SplashScreen
              showFlash={showFlash}
              reward={reward}
              exploitReward={exploitReward}
            />{" "}
          </div>
        )}
        {spinSound && (
          <ReactHowler
            src={`${assets.audio.gachaSpin}`}
            playing={enableSound}
            preload={true}
            loop
          />
        )}
      </div>
    </div>
  );
};

export default Gacha;
