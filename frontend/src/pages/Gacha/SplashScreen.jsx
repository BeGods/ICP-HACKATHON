import {
  defaultIcons,
  mythElementNames,
  mythologies,
  wheelNames,
} from "../../utils/constants";
import Confetti from "react-confetti";
import { ThumbsUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../context/context";
import ReactHowler from "react-howler";

const tele = window.Telegram?.WebApp;

const SplashScreen = ({ reward, exploitReward }) => {
  const { t } = useTranslation();
  const { setSection, setActiveMyth, enableSound } = useContext(MyContext);
  const [runConfetti, setRunConfetti] = useState(false);
  const [currReward, setCurrReward] = useState(reward);
  const [showScale, setShowScale] = useState(0);
  const [showYouScale, setShowYouScale] = useState(0);
  const [showWon, setShowWon] = useState(false);
  const [showHand, setShowHand] = useState(false);
  const [play, setPlay] = useState(true);
  let redirectTimoutId = useRef();

  const playConfetti = () => {
    setRunConfetti(true);
    setTimeout(() => {
      setRunConfetti(false);
    }, 3000);
  };

  const handleClick = (reward) => {
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
          redirectTimoutId.current = setTimeout(() => {
            handleClick(currReward);
          }, 3000);
        }, 500);
      }, 500);
    }
  }, [showWon]);

  useEffect(() => {
    setTimeout(() => {
      if (exploitReward.length !== 0) {
        exploitReward;
        const lastThreeRewards = exploitReward.slice(-5);
        let index = 0;

        if (redirectTimoutId.current) {
          clearTimeout(redirectTimoutId.current);
        }
        const interval = setInterval(() => {
          setCurrReward(lastThreeRewards[index]);
          index++;

          if (index === lastThreeRewards.length) {
            setTimeout(() => {
              handleClick(lastThreeRewards[index - 1]);
            }, 1000);
            clearInterval(interval);
          }
        }, 200);

        return () => clearInterval(interval);
      }
    }, 2500);
  }, []);

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
        {t("bonus.youwon")
          .split(" ")
          .map((word, index) => (
            <>
              {index === 0 ? (
                <h1
                  className={`scale-[${showYouScale}%] text-[22vw] mt-7 transition-transform duration-500`}
                >
                  {word}
                </h1>
              ) : (
                <>
                  {showWon && (
                    <h1 className="text-[14.2vw] transition-opacity duration-250">
                      {word}
                    </h1>
                  )}
                </>
              )}
            </>
          ))}
      </div>
      <div className="absolute z-20 w-full h-full flex items-center justify-center text-white text-4xl">
        <div
          onClick={() => {
            tele.HapticFeedback.notificationOccurred("success");
            setSection(0);
          }}
          className={`text-white transition-transform duration-1000 font-symbols scale-${showScale} text-[85vw]  mx-auto icon-black-contour`}
        >
          {currReward.type === "mythOrb"
            ? defaultIcons[currReward.mythology]
            : defaultIcons[currReward.type]}
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
          {currReward.type === "mythOrb"
            ? `${
                t(
                  `elements.${mythElementNames[
                    currReward.mythology
                  ].toLowerCase()}`
                ) +
                " " +
                t("keywords.orbs")
              }`
            : currReward.type === "blackOrb"
            ? `${t("elements.aether") + " " + t("keywords.orbs")}`
            : currReward.type === "quest"
            ? `${t("sections.quests")}`
            : `1 ${
                wheelNames[mythologies.indexOf(currReward.mythology) + 1] +
                " " +
                currReward.type.toUpperCase()
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
        playing={play && enableSound}
        preload={true}
        onEnd={() => {
          setPlay(false);
        }}
      />
    </div>
  );
};

export default SplashScreen;
