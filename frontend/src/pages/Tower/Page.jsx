import React, { useContext, useEffect, useRef, useState } from "react";
import { convertOrbs } from "../../utils/api";
import { MyContext } from "../../context/context";
import ConvertInfo from "../../components/Cards/Info/ConvertInfoCrd";
import { useTranslation } from "react-i18next";
import {
  mythologies,
  mythSymbols,
  wheel,
  wheelNames,
} from "../../utils/constants";
import { showToast } from "../../components/Toast/Toast";
import IconBtn from "../../components/Buttons/IconBtn";
import ReactHowler from "react-howler";
import { Repeat2 } from "lucide-react";
import ConvertClaimCard from "./ClaimTune";
import TowerHeader from "./Header";
import { TowerGuide } from "../../components/Common/Tutorials";
import { useTowerGuide } from "../../hooks/Tutorial";
import { getPhaseByDate } from "../../helpers/game.helper";

const tele = window.Telegram?.WebApp;

const orbPos = [
  "mt-[45vw] mr-[32vw]",
  "-ml-[52vw] -mt-[17vw]",
  "-mt-[45vw] ml-[32vw]",
  "mt-[18vw] ml-[52vw]",
];

const Tower = () => {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [sessionOrbs, setSessionOrbs] = useState(0);
  const {
    setGameData,
    gameData,
    authToken,
    keysData,
    setKeysData,
    enableSound,
    setShowCard,
    assets,
  } = useContext(MyContext);
  const [myth, setMyth] = useState(0);
  const [showClaim, setShowClaim] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const [scaleOrb, setScaleOrb] = useState(null);
  const mythData = gameData.mythologies.filter(
    (item) => item.name?.toLowerCase() === wheel[myth]
  )[0];
  const [enableGuide, setEnableGuide] = useTowerGuide("jdio");
  const [showHand, setShowHand] = useState(false);
  const handTimeoutRef = useRef(false);

  const handleOrbsConversion = async (key) => {
    if (!keysData.includes(key) && key) {
      showToast("convert_key_fail");
    }
    if (keysData.includes(key) && key) {
      showToast("convert_key_success");
    }

    setShowGlow(true);
    setTimeout(() => {
      setShowGlow(false);
    }, 1000);
    if (myth !== 0) {
      const mythologyName = {
        mythologyName: mythData.name,
        key: key,
        convertedOrbs: sessionOrbs * 2,
      };
      try {
        await convertOrbs(mythologyName, authToken);

        const currPhase = getPhaseByDate(new Date());
        let blackOrbPhaseBonus = 1;
        let phaseBonus = 1;

        if (mythologies[currPhase] === mythData.name) {
          phaseBonus = 2;
        } else if (currPhase === 4) {
          blackOrbPhaseBonus = 2;
        }

        let blackOrb = 0;
        let multiColorOrbs =
          gameData.multiColorOrbs +
          sessionOrbs * (keysData.includes(key) ? 2 : 1) * phaseBonus;

        if (multiColorOrbs >= 500) {
          multiColorOrbs /= 500;
          blackOrb = (multiColorOrbs % 500) * blackOrbPhaseBonus;
        }

        const updatedGameData = {
          ...gameData,
          blackOrb: blackOrb,
          multiColorOrbs: multiColorOrbs,
          mythologies: gameData.mythologies.map((currMyth) => {
            if (currMyth.name === mythData.name) {
              return {
                ...currMyth,
                orbs: currMyth.orbs - sessionOrbs * 2,
              };
            }
            return currMyth;
          }),
        };

        setKeysData((prevState) => prevState.filter((item) => item != key));
        setGameData(updatedGameData);
        setSessionOrbs(0);
        showToast("convert_success");
      } catch (error) {
        console.log(error);
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        setSessionOrbs(0);
        showToast("convert_error");
      }
    }
  };

  useEffect(() => {
    if (enableGuide) {
      setShowCard(
        <TowerGuide
          handleClick={() => {
            setMyth(1);
            setShowCard(null);
          }}
        />
      );
    }
  }, [enableGuide]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
      }}
      className="flex flex-col h-screen overflow-hidden m-0"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
        className="background-wrapper"
      >
        <div
          className={`absolute top-0 left-0 h-screen w-screen pointer-events-none`}
          style={{
            backgroundImage: `url(${assets.uxui.intro})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <TowerHeader
        showGlow={showGlow}
        myth={myth}
        t={t}
        gameData={gameData}
        mythData={mythData}
        sessionOrbs={sessionOrbs}
      />
      <div className="flex relative max-h-[16vw] w-full justify-center items-center z-[99]">
        {!showInfo && (
          <IconBtn
            isInfo={true}
            handleClick={() => {
              setShowInfo(true);
              setShowCard(
                <ConvertInfo
                  t={t}
                  handleClick={() => {
                    setShowCard(null);
                    setShowInfo(false);
                  }}
                />
              );
            }}
            activeMyth={4}
            align={2}
          />
        )}
      </div>

      {/* Wheel */}
      <div className="flex  flex-col items-center justify-center w-full">
        <div className="absolute h-full flex justify-center items-end bottom-[15%]">
          {myth !== 0 && (
            <div
              onClick={() => {
                tele.HapticFeedback.notificationOccurred("success");

                if (myth !== 0) {
                  setShowEffect(true);
                  setTimeout(() => {
                    setShowEffect(false);
                  }, 300);

                  if (handTimeoutRef.current) {
                    clearTimeout(handTimeoutRef.current);
                    handTimeoutRef.current = null;
                  }
                  handTimeoutRef.current = setTimeout(() => {
                    setShowHand(true);
                    handTimeoutRef.current = setTimeout(() => {
                      setShowHand(false);
                    }, 2000);
                  }, 2000);

                  setSessionOrbs((prev) => {
                    const orbs = gameData.mythologies[myth - 1]?.orbs || 0;
                    return orbs != 0 && orbs - prev * 2 > 1 ? prev + 1 : prev;
                  });
                }
              }}
              className="text-button-primary uppercase -mb-[7px] shadow-2xl z-[99]"
            >
              <div
                className={`p-[5.5vw] border flex justify-center items-center rounded-full ${
                  myth === 0 ? "bg-black" : `bg-${wheel[myth]}-text`
                }`}
              >
                <Repeat2
                  strokeWidth={3}
                  size={"7.5vw"}
                  color={`${myth === 0 ? "white" : `white`}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute  flex justify-center items-center h-full w-full">
        <div
          className="relative flex justify-center items-center w-full h-full pointer-events-none scale-wheel-glow"
          style={{
            backgroundImage: `url(${assets.uxui.tower})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
      {/* `url(/assets/uxui/480px-fof.background.${wheelNames[myth]}1.png)` */}
      <div className="absolute flex justify-center items-center h-full w-full z-50">
        <div
          className="relative flex justify-center items-center w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url(${assets.uxui[`dial-${wheelNames[myth]}`]})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {mythologies.map((item, index) => (
            <div
              onTouchStart={() => {
                setScaleOrb(index);
              }}
              onTouchEnd={() => {
                setScaleOrb(null);
              }}
              onClick={() => {
                tele.HapticFeedback.notificationOccurred("success");
                setMyth(index + 1);
              }}
              key={index}
              className={`absolute transition-all duration-1000 z-50 pointer-events-auto ${orbPos[index]}`}
            >
              <div
                className={`flex relative transition-all duration-1000 text-center justify-center ${
                  scaleOrb == index ? "w-[11vw]" : "max-w-orb"
                } scale-orb-${item.toLowerCase()} items-center rounded-full `}
              >
                <img
                  src={`${assets.uxui.baseorb}`}
                  alt="orb"
                  className={`filter-orbs-${item.toLowerCase()} `}
                />
                <span
                  className={`absolute z-1 font-symbols text-white opacity-50 ${
                    scaleOrb == index ? "text-[35px]" : "text-[30px]"
                  }  mt-1 text-black-sm-contour`}
                >
                  <>{mythSymbols[item.toLowerCase()]}</>{" "}
                </span>
              </div>
            </div>
          ))}
        </div>
        {sessionOrbs !== 0 && (
          <div className="absolute flex flex-col justify-center items-center">
            <div
              onClick={() => {
                if (handTimeoutRef.current) {
                  setShowHand(false);
                  clearTimeout(handTimeoutRef.current);
                  handTimeoutRef.current = null;
                }
                setShowClaim(true);
                setShowCard(
                  <ConvertClaimCard
                    keysData={keysData}
                    handleClose={() => {
                      setShowClaim(false);
                      setShowCard(null);
                    }}
                    handleSubmit={handleOrbsConversion}
                  />
                );
              }}
              className={`font-medium ${
                showEffect && "scale-150"
              } transition-all duration-250 text-[60px] text-white glow-text-black`}
            >
              {sessionOrbs}
            </div>
            {showHand && (
              <div className="font-symbols  scale-point mx-auto my-auto absolute  ml-[16vw] mt-[14vh] text-white text-[60px] text-black-contour">
                b
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute">
        <ReactHowler
          src={`${assets.audio.towerBg}`}
          playing={enableSound && !showClaim}
          preload={true}
          loop
        />
      </div>
    </div>
  );
};

export default Tower;
