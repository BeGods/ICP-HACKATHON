import React, { useContext, useEffect, useState } from "react";
import { convertOrbs } from "../../utils/api";
import { MyContext } from "../../context/context";
import Footer from "../../components/Common/Footer";
import ConvertButton from "../../components/Buttons/ConvertButton";
import ConvertInfo from "../../components/Cards/ConvertInfo";
import { useTranslation } from "react-i18next";
import { wheel, wheelNames } from "../../utils/variables";
import { showToast } from "../../components/Toast/Toast";
import Header from "../../components/Headers/Header";
import IconBtn from "../../components/Buttons/IconBtn";
import ReactHowler from "react-howler";
import { Download } from "lucide-react";
import ConvertClaimCard from "../../components/Cards/ConvertClaimCard";
import TowerHeader from "./Header";

const Tower = ({ setMythStates }) => {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [toggleClick, setToggleClick] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [sessionOrbs, setSessionOrbs] = useState(0);
  const {
    setGameData,
    gameData,
    activeMyth,
    authToken,
    keysData,
    setKeysData,
    enableSound,
  } = useContext(MyContext);
  const [myth, setMyth] = useState(0);
  const [showEffect, setShowEffect] = useState(false);
  const mythData = gameData.mythologies.filter(
    (item) => item.name.toLowerCase() === wheel[myth]
  )[0];

  // convert orbs to multicolor
  const handleOrbsConversion = async (key) => {
    if (!keysData.includes(key) && !key) {
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
          className={`absolute top-0 left-0 h-full w-full`}
          style={{
            backgroundImage: `url(/assets/uxui/480px-fof.intro.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <Header
        children={
          <TowerHeader
            myth={myth}
            t={t}
            gameData={gameData}
            mythData={mythData}
            sessionOrbs={sessionOrbs}
          />
        }
      />
      {/* Wheel */}
      <div className="flex relative flex-grow justify-center items-center">
        {/* Info Icon */}
        {!showInfo && (
          <IconBtn
            isInfo={true}
            handleClick={() => {
              setShowInfo(true);
            }}
            activeMyth={4}
            align={2}
          />
        )}

        {/* Wheel */}
        <div className="flex  flex-col items-center justify-center w-full">
          <div className="absolute h-full flex justify-center items-end bottom-[1%]">
            <ConvertButton
              t={t}
              handleNext={() => {
                handleClick();
                setSessionOrbs(0);
                setMyth((prev) => (prev + 1) % 5);
              }}
              handlePrev={() => {
                handleClick();
                setSessionOrbs(0);
                setMyth((prev) => (prev - 1 + 5) % 5);
              }}
              myth={myth}
              action={() => {
                if (myth !== 0) {
                  setShowEffect(true);
                  setTimeout(() => {
                    setShowEffect(false);
                  }, 300);

                  setSessionOrbs((prev) => {
                    const orbs = gameData.mythologies[myth - 1]?.orbs || 0;
                    return orbs != 0 && orbs - prev * 2 > 1 ? prev + 1 : prev;
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />

      <div className="absolute  flex justify-center items-center h-[100vh] w-screen  z-10">
        {myth === 0 ? (
          <img
            src="/assets/uxui/480px-fof.background.aether1.png"
            alt="wheel"
            className={`w-screen h-screen absolute z-10 transition-all duration-1000 ${
              myth == 0 && "scale-wheel-glow"
            } ${toggleClick && `glow-tap-${wheel[myth]}`}`}
          />
        ) : (
          <img
            src={`/assets/uxui/480px-fof.background.${wheelNames[myth]}1.png`}
            alt="wheel"
            className={`w-screen h-screen absolute z-10 transition-all duration-1000`}
          />
        )}
      </div>

      {showInfo && (
        <ConvertInfo
          t={t}
          handleClick={() => {
            setShowInfo(false);
          }}
        />
      )}
      {sessionOrbs !== 0 && (
        <div className="absolute h-screen w-screen flex flex-col justify-center items-center z-10">
          <div
            className={`font-medium ${
              showEffect && "scale-150"
            } transition-all duration-250 text-[60px] text-white glow-text-black`}
          >
            {sessionOrbs}
          </div>
          <Download
            size={"18vw"}
            color="white"
            onClick={() => {
              setShowClaim(true);
            }}
            className="scale-icon absolute mt-[85vw]"
          />
        </div>
      )}

      {showClaim && (
        <ConvertClaimCard
          keysData={keysData}
          handleClose={() => {
            setShowClaim(false);
          }}
          handleSubmit={handleOrbsConversion}
        />
      )}

      <ReactHowler
        src="/assets/audio/fof.tower.background01.wav"
        playing={enableSound && activeMyth >= 4}
        preload={true}
        loop
      />
    </div>
  );
};

export default Tower;
