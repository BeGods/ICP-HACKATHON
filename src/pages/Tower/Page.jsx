import React, { useContext, useEffect, useRef, useState } from "react";
import { convertOrbs } from "../../utils/api";
import { MyContext } from "../../context/context";
import ConvertButton from "../../components/Buttons/ConvertBtn";
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

const tele = window.Telegram?.WebApp;

const orbPos = [
  "mt-[45vw] mr-[32vw]",
  "-ml-[55vw] -mt-[18vw]",
  "-mt-[45vw] ml-[32vw]",
  "mt-[18vw] ml-[52vw]",
];

const Tower = () => {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [toggleClick, setToggleClick] = useState(false);
  const [sessionOrbs, setSessionOrbs] = useState(0);
  const {
    setGameData,
    gameData,
    activeMyth,
    authToken,
    keysData,
    setKeysData,
    enableSound,
    setShowCard,
  } = useContext(MyContext);
  const [myth, setMyth] = useState(0);
  const [showEffect, setShowEffect] = useState(false);
  const mythData = gameData.mythologies.filter(
    (item) => item.name.toLowerCase() === wheel[myth]
  )[0];
  const [showHand, setShowHand] = useState(false);
  const handTimeoutRef = useRef(false);

  const handleOrbsConversion = async (key) => {
    if (!keysData.includes(key) && key) {
      showToast("convert_key_fail");
    }
    if (keysData.includes(key) && key) {
      showToast("convert_key_success");
    }
    if (myth !== 0) {
      const mythologyName = {
        mythologyName: mythData.name,
        key: key,
        convertedOrbs: sessionOrbs * 2,
      };
      try {
        await convertOrbs(mythologyName, authToken);

        let blackOrb = 0;
        let multiColorOrbs =
          gameData.multiColorOrbs +
          sessionOrbs * (keysData.includes(key) ? 2 : 1);

        if (multiColorOrbs >= 500) {
          multiColorOrbs /= 500;
          blackOrb = multiColorOrbs % 500;
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

  const handleClick = () => {
    setToggleClick(true);
    setTimeout(() => {
      setToggleClick(false);
    }, 500);
  };

  // useEffect(() => {
  //   setShowCard(<TuneGuide />);
  // }, []);

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
            backgroundImage: `url(/assets/uxui/480px-fof.intro.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <TowerHeader
        myth={myth}
        t={t}
        gameData={gameData}
        mythData={mythData}
        sessionOrbs={sessionOrbs}
      />
      {/* Wheel */}
      <div className="flex relative flex-grow justify-center items-center">
        {/* Info Icon */}

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

        {/* Wheel */}
        <div className="flex  flex-col items-center justify-center w-full">
          <div className="absolute h-full flex justify-center items-end bottom-[17.5%]">
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
                  className={`p-[6vw] border flex justify-center items-center rounded-full ${
                    myth === 0 ? "bg-black" : `bg-${wheel[myth]}-text`
                  }`}
                >
                  <Repeat2
                    strokeWidth={3}
                    color={`${myth === 0 ? "white" : `white`}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute  flex justify-center items-center h-full w-full z-10">
        <div
          className="relative flex justify-center items-center w-full h-full pointer-events-none scale-wheel-glow"
          style={{
            backgroundImage:
              "url(/assets/uxui/480px-fof.background.aether1.png)",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>

      <div className="absolute flex justify-center items-center h-full w-full z-50">
        <div
          className="relative flex justify-center items-center w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url(/assets/uxui/480px-fof.background.${wheelNames[myth]}1.png)`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {mythologies.map((item, index) => (
            <div
              onClick={() => {
                tele.HapticFeedback.notificationOccurred("success");
                setMyth(index + 1);
              }}
              key={index}
              className={`absolute z-50 pointer-events-auto ${orbPos[index]}`}
            >
              <div
                className={`flex relative text-center justify-center "w-[12vw]  glow-icon-lg-white max-w-orb glow-icon-white items-center rounded-full `}
              >
                <img
                  src="/assets/uxui/240px-orb.base.png"
                  alt="orb"
                  className={`filter-orbs-${item.toLowerCase()} `}
                />
                <span
                  className={`absolute z-1 font-symbols text-white opacity-50 text-[30px] mt-1 text-black-sm-contour`}
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
                setShowCard(
                  <ConvertClaimCard
                    keysData={keysData}
                    handleClose={() => {
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
          src="/assets/audio/fof.tower.background01.wav"
          playing={enableSound && activeMyth >= 4}
          preload={true}
          loop
        />
      </div>
    </div>
  );
};

export default Tower;
