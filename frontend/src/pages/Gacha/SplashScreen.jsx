import {
  defaultIcons,
  mythElementNames,
  mythologies,
  wheelNames,
} from "../../utils/constants";
import confetti from "canvas-confetti";
import { ThumbsUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../context/context";
import ReactHowler from "react-howler";
import MappedOrbs from "../../components/Common/MappedOrbs";
import Symbol from "../../components/Common/Symbol";
import assets from "../../assets/assets.json";
import {
  handleClickHaptic,
  validateTutCookie,
} from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const SplashScreen = ({ reward, exploitReward }) => {
  const { t } = useTranslation();
  const { setSection, setActiveMyth, enableSound, enableHaptic } =
    useContext(MyContext);
  const [currReward, setCurrReward] = useState(reward);
  const [showScale, setShowScale] = useState(0);
  const [showYouScale, setShowYouScale] = useState(0);
  const [showWon, setShowWon] = useState(false);
  const [showHand, setShowHand] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [playFlip, setPlayFlip] = useState(false);
  const [play, setPlay] = useState(false);
  let redirectTimoutId = useRef();

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

  const handleClick = async (reward) => {
    handleClickHaptic(tele, enableHaptic);
    // const showAnmnt = await validateTutCookie(tele, "announcement06");

    // if (!showAnmnt) {
    //   if (reward.type === "quest") {
    //     setActiveMyth(mythologies.indexOf(reward.quest.mythology));
    //     setSection(12);
    //   } else if (reward.type === "blackOrb") {
    //     setActiveMyth(0);
    //     setSection(12);
    //   } else {
    //     setActiveMyth(mythologies.indexOf(reward.mythology));
    //     setSection(12);
    //   }
    // } else {
    if (reward.type === "quest") {
      setActiveMyth(mythologies.indexOf(reward.quest.mythology));
      setSection(1);
    } else if (reward.type === "blackOrb") {
      setActiveMyth(0);
      setSection(0);
    } else {
      setActiveMyth(mythologies.indexOf(reward.mythology));
      setSection(0);
    }
    // }
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
          if (exploitReward.length === 0 || !exploitReward) {
            setPlayFlip(true);
          }
          setShowScale(100);
          setShowHand(true);
          redirectTimoutId.current = setTimeout(() => {
            handleClick(currReward);
          }, 4000);
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
              setPlayFlip(true);
              setTimeout(() => {
                handleClick(lastThreeRewards[index - 1]);
              }, 3000);
            }, 1000);
            clearInterval(interval);
          }
        }, 200);

        return () => clearInterval(interval);
      }
    }, 2500);
  }, []);

  useEffect(() => {
    if (playFlip) {
      const interval = setInterval(() => {
        setFlipped((prev) => !prev);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [playFlip]);

  return (
    <div className="w-screen h-screen relative bg-black">
      {/* You Won Text */}
      <div className="flex flex-col justify-center items-center  w-full absolute top-0 leading-[60px] text-gold text-black-contour  uppercase z-20">
        {t("bonus.youwon")
          .split(" ")
          .map((word, index) => (
            <div key={index}>
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
            </div>
          ))}
      </div>
      <div className="absolute z-20 w-full h-full flex items-center justify-center text-white text-4xl ">
        <div
          className={`flex relative flex-col items-center cursor-pointer mt-5 z-50 card ${
            flipped ? "flipped" : ""
          }`}
        >
          <div className="card__face card__face--front flex justify-center items-center">
            <div
              onClick={() => {
                handleClickHaptic(tele, enableHaptic);
                handleClick();
              }}
              className={`text-white transition-transform duration-1000 font-symbols scale-${showScale} text-[55vw]  mx-auto icon-black-contour`}
            >
              {currReward.type === "mythOrb"
                ? defaultIcons[currReward.mythology]
                : defaultIcons[currReward.type]}
            </div>
          </div>
          <div className="card__face card__face--back flex justify-center items-center">
            {currReward.type === "mythOrb" || currReward.type === "blackOrb" ? (
              <OrbCard reward={currReward} />
            ) : currReward.type === "automata" ||
              currReward.type === "minion" ? (
              <BoosterCard reward={currReward} />
            ) : (
              <QuestCard reward={currReward} />
            )}
          </div>
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
                  ]?.toLowerCase()}`
                ) +
                " " +
                t("keywords.orb")
              }`
            : currReward.type === "blackOrb"
            ? `${t("elements.aether") + " " + t("keywords.orb")}`
            : currReward.type === "quest"
            ? `${t("sections.quests")}`
            : `1 ${
                wheelNames[mythologies.indexOf(currReward.mythology) + 1] +
                " " +
                currReward.type.toUpperCase()
              }`}
        </h1>
      </div>

      {/* Audios */}
      <ReactHowler
        src={`${assets.audio.gachaWin}`}
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

const OrbCard = ({ reward }) => {
  const currReward = reward.type === "mythOrb" ? reward.mythology : reward.type;
  return (
    <div
      className={`flex justify-center items-center w-full absolute h-full glow-tap-${currReward.toLowerCase()}`}
    >
      <img
        src={`${assets.uxui.baseorb}`}
        alt="orb"
        className={`filter-orbs-${currReward.toLowerCase()} rounded-full`}
      />
      <span
        className={`absolute inset-0 flex justify-center items-center text-[180px] mt-4 text-white font-symbols opacity-50 orb-symbol-shadow`}
      >
        {defaultIcons[currReward]}
      </span>
    </div>
  );
};

const BoosterCard = ({ reward }) => {
  return (
    <div className="relative h-full -mt-8 w-[72%] flex items-center justify-center rounded-primary card-shadow-white">
      <div
        className={`absolute inset-0 rounded-[15px]`}
        style={{
          backgroundImage: `url(${
            assets.boosters[
              `${reward.type === "minion" ? "alchemist" : reward.type}Card`
            ]
          })`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center ",
        }}
      />
    </div>
  );
};

const QuestCard = ({ reward }) => {
  return (
    <div className="relative w-[72%] rounded-lg shadow-lg -mt-8 flex flex-col z-50">
      <div className="relative card-shadow-white">
        {/* Card Image */}
        <img
          src={
            assets.questCards?.[reward.quest.mythology.toLowerCase()]?.[
              reward.quest.type
            ]
          }
          alt="card"
          className="w-full h-full mx-auto rounded-[15px]"
        />
        {/* Close Button */}
        <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
          <div className="flex w-full">
            <div className="m-2 z-50">
              <MappedOrbs quest={reward.quest} />
            </div>
          </div>
          <div
            className={`flex relative items-center h-[19%] uppercase card-shadow-white-${reward.quest} text-white`}
          >
            <div
              style={{
                backgroundImage: `url(${assets.uxui.paper})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center center",
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
              }}
              className={`filter-paper-${reward.quest.mythology.toLowerCase()} rounded-b-[15px]`}
            />
            <div
              className={`flex justify-between w-full h-full items-center glow-text-quest px-3 z-10`}
            >
              <div>{reward.quest.questName}</div>
              <div className="">
                <Symbol
                  myth={reward.quest.mythology.toLowerCase()}
                  isCard={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
