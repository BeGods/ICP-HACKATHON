import Lottie from "lottie-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import animationData from "../../public/assets/fx/gacha.json";
import { fetchDailyBonus } from "../utils/api";
import {
  defaultIcons,
  mythElementNames,
  mythologies,
  wheelNames,
} from "../utils/variables";
import Confetti from "react-confetti";
import { Crown, LoaderPinwheel, ThumbsUp } from "lucide-react";
import { MyContext } from "../context/context";
import ReactHowler from "react-howler";
import { toast } from "react-toastify";

const tele = window.Telegram?.WebApp;

const FlashScreen = ({ reward }) => {
  const { t } = useTranslation();
  const { setSection, setActiveMyth } = useContext(MyContext);
  const [runConfetti, setRunConfetti] = useState(false);
  const [showScale, setShowScale] = useState(0);
  const [showYouScale, setShowYouScale] = useState(0);
  const [showWon, setShowWon] = useState(false);
  const [showHand, setShowHand] = useState(false);
  const [play, setPlay] = useState(true);

  const playConfetti = () => {
    setRunConfetti(true);
    setTimeout(() => {
      setRunConfetti(false);
    }, 3000);
  };

  const handleClick = (e) => {
    tele.HapticFeedback.notificationOccurred("success");
    if (reward.type === "mythOrb") {
      setActiveMyth(mythologies.indexOf(reward.mythology));
      setSection(0);
    } else if (reward.type === "quest") {
      setActiveMyth(mythologies.indexOf(reward.quest.mythology));
      setSection(1);
    } else if (reward.type === "automata" || reward.type === "minion") {
      setActiveMyth(mythologies.indexOf(reward.mythology));
      setSection(0);
    } else if (reward.type === "blackOrb") {
      setSection(6);
    }
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
          setShowHand(true);
          setTimeout(() => {
            handleClick();
          }, 3000);
        }, 500);
      }, 500);
    }
  }, [showWon]);

  return (
    <div className="w-screen h-screen relative bg-black">
      {/* Background Paper */}
      <div
        className="absolute animate-spin-slow scale-150 z-0"
        style={{
          background: "url(/assets/fx/star.light.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center center",
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      ></div>
      {/* Content */}
      <div className="flex flex-col justify-center items-center  w-full absolute top-0 leading-[60px] text-gold text-black-contour  uppercase z-20">
        <h1
          className={`scale-[${showYouScale}%] text-[22vw] mt-7 transition-transform duration-500`}
        >
          YOU
        </h1>
        {showWon && (
          <h1 className="text-[14.2vw] transition-opacity duration-250">
            WON!
          </h1>
        )}
      </div>
      <div className="absolute z-20 w-full h-full flex items-center justify-center text-white text-4xl">
        <div
          onClick={() => {
            tele.HapticFeedback.notificationOccurred("success");
            setSection(0);
          }}
          className={`text-white transition-transform duration-1000 font-symbols scale-${showScale} text-[85vw]  mx-auto icon-black-contour`}
        >
          {reward.type === "mythOrb"
            ? defaultIcons[reward.mythology]
            : defaultIcons[reward.type]}
        </div>
      </div>
      <div className="flex flex-col items-center w-full h-1/4 absolute bottom-0 text-[9vw] text-gold uppercase z-20">
        <div>
          {showHand && (
            <ThumbsUp
              onClick={() => {
                handleClick();
              }}
              size={"18vw"}
              color="#FFD660"
              className="mx-auto drop-shadow-xl scale-more mt-6"
            />
          )}
        </div>
        <h1
          className={`text-black-contour uppercase mt-auto pb-8 scale-${showScale} transition-all duration-1000`}
        >
          {reward.type === "mythOrb"
            ? `${
                t(
                  `elements.${mythElementNames[reward.mythology].toLowerCase()}`
                ) +
                " " +
                t("keywords.orbs")
              }`
            : reward.type === "blackOrb"
            ? `${t("elements.aether") + " " + t("keywords.orbs")}`
            : reward.type === "quest"
            ? `${t("buttons.completed") + " " + t("sections.quests")}`
            : `1 ${
                wheelNames[mythologies.indexOf(reward.mythology)] +
                " " +
                reward.type.toUpperCase()
              }`}
        </h1>
      </div>
      {/* Confetti */}
      {runConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 10, position: "fixed", top: 0, left: 0 }}
        />
      )}
      <ReactHowler
        src="/assets/audio/fof.gatcha.win.wav"
        playing={play && !JSON.parse(localStorage.getItem("sound"))}
        preload={true}
        onEnd={() => {
          setPlay(false);
        }}
      />
    </div>
  );
};

const Gacha = (props) => {
  const {
    gameData,
    setQuestsData,
    questsData,
    setGameData,
    setShowBooster,
    authToken,
  } = useContext(MyContext);
  const lottieRef = useRef(null);
  const [reward, setReward] = useState(null);
  const [showSpin, setShowSpin] = useState(true);
  const [showFlash, setShowFlash] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [changeText, setChangeText] = useState("Win");
  const [spinSound, setSpinSound] = useState(false);
  const [disableHand, setDisableHand] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

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
    if (isClaimed) return;

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

  const handlePlay = () => {
    if (lottieRef.current) {
      setSpinSound(true);
      lottieRef.current.play();
      lottieRef.current.setSpeed(3);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => (prevText === "PANDORA" ? "BOX" : "PANDORA"));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const firstTimeout = setTimeout(() => {
      setDisableHand(true);
      const secondTimeout = setTimeout(() => {
        // Ensure that claimDailyBonus is only called when necessary
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
          }}
          className="flex flex-grow justify-center items-center relative w-full h-full"
        >
          <img
            src="/assets/uxui/320px-pandora.png"
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
        <div
          onClick={!showScale && claimDailyBonus}
          className="flex absolute items-start bottom-[92px] justify-center w-full"
        >
          {!showScale && (
            <div className="relative">
              {!disableHand && (
                <div className="font-symbols scale-point z-10 mx-auto my-auto absolute -mt-3 text-white text-[100px] text-black-contour">
                  T
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
            <FlashScreen showFlash={showFlash} reward={reward} />{" "}
          </div>
        )}
        {spinSound && (
          <ReactHowler
            src="/assets/audio/fof.gacha.spin.wav"
            playing={!JSON.parse(localStorage.getItem("sound"))}
            preload={true}
            loop
          />
        )}
      </div>
    </div>
  );
};

export default Gacha;
