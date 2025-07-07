import React, { useContext, useEffect, useRef, useState } from "react";
import { convertOrbs } from "../../../utils/api.fof";
import { FofContext } from "../../../context/context";
import ConvertInfo from "../../../components/Cards/Info/ConvertInfoCrd";
import { useTranslation } from "react-i18next";
import {
  mythologies,
  mythSymbols,
  wheel,
  wheelMyths,
  wheelNames,
} from "../../../utils/constants.fof";
import { showToast } from "../../../components/Toast/Toast";
import ReactHowler from "react-howler";
import { Repeat2, RotateCw } from "lucide-react";
import ConvertClaimCard from "./ClaimTune";
import TowerHeader from "./Header";
import { TowerGuide } from "../../../components/Common/Tutorials";
import { useTowerGuide } from "../../../hooks/Tutorial";
import { getPhaseByDate } from "../../../helpers/game.helper";
import { trackComponentView, trackEvent } from "../../../utils/ga";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import DefaultBtn from "../../../components/Buttons/DefaultBtn";
import ConvertBtn from "../../../components/Buttons/ConvertBtn";

const tele = window.Telegram?.WebApp;

const orbPos = [
  "top-[70%] left-[45.5%]",
  "top-[66%] left-[26%]",
  "top-[39.5%] left-[14%]",
  "top-[27.5%] left-[65%]",
  "top-[54%] left-[77%]",
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
    enableHaptic,
    isTgMobile,
    isBrowser,
  } = useContext(FofContext);
  const [myth, setMyth] = useState(0);
  const [showClaim, setShowClaim] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const [scaleOrb, setScaleOrb] = useState(null);
  const mythData = gameData.mythologies.filter(
    (item) => item.name?.toLowerCase() === wheel[myth]
  )[0];
  const [enableGuide, setEnableGuide] = useTowerGuide("tutorial02");
  const [showHand, setShowHand] = useState(false);
  const [disappearEffect, setDisappearEffect] = useState(false);

  const handTimeoutRef = useRef(false);

  useEffect(() => {
    setDisappearEffect(false);
    const resetTimeout = setTimeout(() => {
      setDisappearEffect(true);
    }, 500);

    return () => clearTimeout(resetTimeout);
  }, []);

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

        if (!keysData.includes(key) && key) {
          trackEvent("purchase", "convert_orbs_tune", "success_tune");
        } else {
          trackEvent("purchase", "convert_orbs", "success");
        }

        const currPhase = getPhaseByDate(new Date());
        let blackOrbPhaseBonus = 1;
        let phaseBonus = 1;

        if (!gameData.isMoonActive) {
          blackOrbPhaseBonus = 1;
          phaseBonus = 1;
        } else if (mythologies[currPhase] === mythData.name) {
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
          isTgMobile={isTgMobile}
          currGuide={0}
          Header={
            <TowerHeader
              showGlow={showGlow}
              myth={myth}
              t={t}
              gameData={gameData}
              mythData={mythData}
              sessionOrbs={sessionOrbs}
            />
          }
          handleClick={() => {
            setMyth(1);
            setShowCard(null);
          }}
        />
      );
    }
  }, [enableGuide]);

  useEffect(() => {
    trackComponentView("tower");
  }, []);

  const triggerConvert = () => {
    handleClickHaptic(tele, enableHaptic);

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
  };

  return (
    <div
      className={`flex flex-col ${
        isTgMobile ? "tg-container-height" : "browser-container-height"
      } overflow-hidden m-0`}
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
          className={`absolute top-0 left-0 w-full h-full pointer-events-none`}
          style={{
            backgroundImage: `url(${assets.locations.fof})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "50% 0%",
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
        showInfo={showInfo}
        handleInfoClk={() => {
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
      />
      {/* <div className="font-fof w-full text-center disappear absolute top-0 text-[4.5dvh] mt-[16dvh] uppercase text-black drop-shadow z-50 font-black">
        {t(`elements.aether`)}
      </div> */}
      <div className="absolute inset-0 flex justify-center items-center -mt-3">
        <div
          className="relative"
          style={{
            width: "45dvh",
            aspectRatio: "1 / 1.4",
            backgroundImage: `url(${assets.uxui.towerOn})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <img
            src={assets.uxui[`pointer-${wheelNames[myth]}`]}
            alt="pointer"
            className="absolute cursor-pointer w-full mt-[8.1dvh] z-50"
          />

          {sessionOrbs !== 0 && (
            <div
              onClick={() => {
                if (handTimeoutRef.current) {
                  setShowHand(false);
                  clearTimeout(handTimeoutRef.current);
                  handTimeoutRef.current = null;
                }
                // setShowClaim(true);
                handleOrbsConversion();

                // setShowCard(
                //   <ConvertClaimCard
                //     keysData={keysData}
                //     handleClose={() => {
                //       setShowClaim(false);
                //       setShowCard(null);
                //     }}
                //     handleSubmit={handleOrbsConversion}
                //   />
                // );
              }}
              className="absolute z-[55] pointer-events-auto cursor-pointer w-[7.5dvh] h-[7.5dvh] rounded-full flex mt-[28dvh] ml-[19dvh] flex-col justify-center items-center"
            >
              <div
                className={`font-medium cursor-pointer ${
                  showEffect && "scale-150"
                } transition-all duration-250 text-[6dvh] text-white glow-text-black`}
              >
                {sessionOrbs}
              </div>

              {showHand && (
                <div className="font-symbols  scale-point mx-auto my-auto absolute  ml-[14dvw] mt-[10dvh] text-white text-[2.5rem] text-black-contour">
                  b
                </div>
              )}
            </div>
          )}

          {wheelMyths.map((item, index) => (
            <div
              onTouchStart={() => setScaleOrb(index)}
              onTouchEnd={() => setScaleOrb(null)}
              onClick={() => {
                handleClickHaptic(tele, enableHaptic);
                setMyth(index);
              }}
              key={index}
              className={`absolute z-50 ${orbPos[index]} transition-all duration-500`}
            >
              <div
                className={`flex justify-center items-center relative ${
                  scaleOrb === index ? "scale-110" : ""
                }`}
              >
                <img
                  src={`${assets.uxui.baseOrb}`}
                  alt="orb"
                  className={`w-[5.5dvh] filter-orbs-${item.toLowerCase()}`}
                />
                <span className="absolute font-symbols text-white opacity-50 text-[4dvh]">
                  {mythSymbols[item.toLowerCase()]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <div className="absolute h-full flex justify-center items-end bottom-[15%]">
          {myth !== 0 && (
            <ConvertBtn
              isConvert={true}
              activeMyth={myth - 1}
              handleClick={triggerConvert}
              handlePrev={() => {
                handleClickHaptic(tele, enableHaptic);
                setMyth((prev) => {
                  const updatedVal = (prev - 1 + wheel.length) % wheel.length;
                  return updatedVal;
                });
              }}
              handleNext={() => {
                handleClickHaptic(tele, enableHaptic);

                setMyth((prev) => {
                  const updatedVal = (prev + 1) % wheel.length;

                  return updatedVal;
                });
              }}
            />
          )}
          {myth == 0 && (
            <ConvertBtn
              handleClick={() => {
                handleClickHaptic(tele, enableHaptic);
                setMyth(1);
              }}
              handlePrev={() => {
                handleClickHaptic(tele, enableHaptic);
                setMyth((prev) => {
                  const updatedVal = (prev - 1 + wheel.length) % wheel.length;
                  return updatedVal;
                });
              }}
              handleNext={() => {
                handleClickHaptic(tele, enableHaptic);

                setMyth((prev) => {
                  const updatedVal = (prev + 1) % wheel.length;

                  return updatedVal;
                });
              }}
            />
          )}
        </div>
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

{
  /* <div
        className={`flex w-full ${
          disappearEffect && "disappear"
        } absolute text-[2.5rem] uppercase text-gold text-black-contour h-fit justify-center items-start ${
          isBrowser ? "mt-[16vh]" : isTgMobile ? "mt-[16vh]" : "mt-[17vh]"
        } `}
      >
        DOME
      </div> */
}

{
  /* Wheel */
}
