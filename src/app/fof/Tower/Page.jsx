import { useEffect, useRef, useState } from "react";
import { convertOrbs } from "../../../utils/api.fof";
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
import TowerHeader from "./Header";
import { TowerGuide } from "../../../components/Tutorials/Tutorials";
import { useTowerGuide } from "../../../hooks/useTutorial";
import { getPhaseByDate } from "../../../helpers/game.helper";
import { trackComponentView, trackEvent } from "../../../utils/ga";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import BgLayout from "../../../components/Layouts/BgLayout";
import { Repeat2 } from "lucide-react";
import { PrimaryBtn } from "../../../components/Buttons/PrimaryBtn";
import { useDisableWrapper } from "../../../hooks/useDisableClick";
import { useStore } from "../../../store/useStore";

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
  const setGameData = useStore((s) => s.setGameData);
  const gameData = useStore((s) => s.gameData);
  const authToken = useStore((s) => s.authToken);
  const keysData = useStore((s) => s.keysData);
  const setKeysData = useStore((s) => s.setKeysData);
  const enableSound = useStore((s) => s.enableSound);
  const setShowCard = useStore((s) => s.setShowCard);
  const assets = useStore((s) => s.assets);
  const enableHaptic = useStore((s) => s.enableHaptic);
  const isTgMobile = useStore((s) => s.isTgMobile);
  const setMinimize = useStore((s) => s.setMinimize);
  const [showGlow, setShowGlow] = useState(false);
  const [sessionOrbs, setSessionOrbs] = useState(0);
  const [myth, setMyth] = useState(0);
  const [showClaim, setShowClaim] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [scaleOrb, setScaleOrb] = useState(null);
  const [showToggle, setShowToggles] = useState(false);

  const mythData = gameData.mythologies.filter(
    (item) => item.name?.toLowerCase() === wheel[myth]
  )[0];
  const [enableGuide, setEnableGuide] = useTowerGuide("tutorial02");
  const [showHand, setShowHand] = useState(false);
  const [enableTower, setEnableTower] = useState(false);
  const { wrapWithDisable } = useDisableWrapper();

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
    // ga
    trackComponentView("tower");

    // toggle effect
    setTimeout(() => {
      setShowToggles(true);
    }, 300);
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

  useEffect(() => {
    return () => {
      if (enableTower) {
        setMinimize(2);
        setEnableTower(false);
      }
    };
  }, []);

  useEffect(() => {
    if (enableTower) {
      setShowScale(true);

      setTimeout(() => {
        setShowScale(true);
      }, 1200);
    }
  }, [enableTower]);

  return (
    <BgLayout>
      {/* Header */}
      <TowerHeader
        showGlow={showGlow}
        myth={myth}
        t={t}
        gameData={gameData}
        mythData={mythData}
        sessionOrbs={sessionOrbs}
      />

      <div
        onClick={() => {
          if (!enableTower) {
            handleClickHaptic(tele, enableHaptic);
            setMinimize(1);
            setEnableTower(true);
          }
        }}
        className="center-section"
      >
        <div
          className={`relative ${showScale && "scale-tower"}`}
          style={{
            width: `${
              !!document.fullscreenElement || isTgMobile ? "82dvw" : "45dvh"
            }`,
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
            className={`absolute cursor-pointer w-full ${
              !!document.fullscreenElement || isTgMobile
                ? "mt-[7dvh]"
                : "mt-[8dvh]"
            }  z-40`}
          />

          {sessionOrbs !== 0 && (
            <div
              onClick={() => {
                if (handTimeoutRef.current) {
                  setShowHand(false);
                  clearTimeout(handTimeoutRef.current);
                  handTimeoutRef.current = null;
                }

                wrapWithDisable(handleOrbsConversion);
              }}
              className={`absolute z-[55] pointer-events-auto cursor-pointer w-[7.5dvh] h-[7.5dvh] rounded-full flex ${
                !!document.fullscreenElement || isTgMobile
                  ? "mt-[23.1dvh] ml-[15.5dvh]"
                  : "mt-[28dvh] ml-[19dvh]"
              }  flex-col justify-center items-center`}
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
                  className={`${
                    !!document.fullscreenElement || isTgMobile
                      ? "w-[10dvw]"
                      : "w-[5.5dvh]"
                  } filter-orbs-${item.toLowerCase()}`}
                />
                <span
                  className={`absolute font-symbols text-white opacity-50 ${
                    !!document.fullscreenElement || isTgMobile
                      ? "text-[8dvw]"
                      : "text-[4dvh]"
                  }`}
                >
                  {mythSymbols[item.toLowerCase()]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {enableTower && (
        <div className="flex flex-col items-center justify-center w-full">
          <div className="absolute h-full flex justify-center items-end bottom-0 mb-safeBottom">
            <PrimaryBtn
              mode="default"
              onClick={() => {
                if (myth !== 0) {
                  triggerConvert();
                } else {
                  handleClickHaptic(tele, enableHaptic);
                  setMyth(1);
                }
              }}
              customMyth={myth - 1}
              centerContent={
                myth !== 0 ? (
                  <div className="font-symbols">{mythSymbols[wheel[myth]]}</div>
                ) : (
                  <Repeat2 size={"2rem"} />
                )
              }
            />
          </div>
        </div>
      )}

      <div className="absolute">
        <ReactHowler
          src={`${assets.audio.towerBg}`}
          playing={enableSound && !showClaim}
          preload={true}
          loop
        />
      </div>

      {enableTower && (
        <>
          <ToggleBack
            minimize={2}
            handleClick={() => {
              setMinimize(2);
              setEnableTower(false);
              setMyth(0);
              setSessionOrbs(0);
            }}
            activeMyth={8}
          />
        </>
      )}
      {showToggle && (
        <>
          <ToggleLeft
            minimize={2}
            handleClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setSessionOrbs(0);

              if (!enableTower) {
                setMinimize(1);
                setEnableTower(true);
              }
              setMyth((prev) => {
                const updatedVal = (prev - 1 + wheel.length) % wheel.length;
                return updatedVal;
              });
            }}
            activeMyth={8}
          />
          <ToggleRight
            minimize={2}
            handleClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setSessionOrbs(0);
              if (!enableTower) {
                setMinimize(1);
                setEnableTower(true);
              }
              setMyth((prev) => {
                const updatedVal = (prev + 1) % wheel.length;

                return updatedVal;
              });
            }}
            activeMyth={8}
          />
        </>
      )}
    </BgLayout>
  );
};

export default Tower;

// setShowClaim(true);

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
