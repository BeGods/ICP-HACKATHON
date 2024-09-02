import React, { useContext, useEffect, useRef, useState } from "react";
import { convertOrbs } from "../utils/api";
import { MyContext } from "../context/context";
import Footer from "../components/Common/Footer";
import ConvertButton from "../components/Buttons/ConvertButton";
import ConvertInfo from "../components/Cards/ConvertInfo";
import { useTranslation } from "react-i18next";
import { mythSymbols, mythologies, wheel } from "../utils/variables";
import { showToast } from "../components/Toast/Toast";
import Header from "../components/Headers/Header";
import { ToggleLeft, ToggleRight } from "../components/Common/SectionToggles";
import IconButton from "../components/Buttons/IconButton";
import ReactHowler from "react-howler";

const HeaderContent = ({ gameData, myth }) => {
  return (
    <div className="flex justify-between relative w-full">
      {/* Left */}
      <div className="flex justify-between w-fit h-[80%] flex-col items-start px-2">
        <h1
          className={`text-head text-black-contour uppercase ${
            myth === 0 ? "text-white" : `text-${wheel[myth]}-text`
          }
           `}
        >
          Dark
        </h1>
        {myth !== 0 && (
          <div className="flex">
            <span
              className={`font-symbols text-black-contour text-red text-[50px] -ml-1.5 mr-1.5 -mt-3.5 text-white`}
            >
              {mythSymbols[wheel[myth]]}
            </span>
            <h1
              className={`text-num -ml-3 text-black-contour -mt-2 text-${wheel[myth]}-text`}
            >
              {gameData.mythologies[myth - 1]?.orbs}
            </h1>
          </div>
        )}
      </div>
      <div className="flex absolute justify-center w-full">
        {/* Orb */}
        <div
          className={`flex text-center glow-icon-white justify-center h-[36vw] w-fit -mt-10 items-center rounded-full outline outline-[0.5px] outline-white  transition-all duration-1000`}
        >
          <img
            src="/assets/uxui/240px-orb.base.png"
            alt="base-orb"
            className={`filter-orbs-black w-full h-full`}
          />
          <span
            className={`absolute z-1 font-symbols  text-white text-[140px] mt-11  opacity-50 orb-symbol-shadow`}
          >
            {mythSymbols["other"]}
          </span>
        </div>
      </div>
      {/* Right */}
      <div className="flex justify-between w-fit h-[80%] flex-col items-start pr-2">
        <h1 className={`text-head text-white-contour uppercase text-black`}>
          TOWER
        </h1>
        <div className="flex w-full justify-end ml-1">
          <h1 className={`text-num  text-white-contour -mt-2 text-black`}>
            {gameData.blackOrbs}
          </h1>
          <span
            className={`font-symbols text-black-contour text-red text-[50px] -ml-1 mr-0.5 -mt-3.5 text-white`}
          >
            {mythSymbols["other"]}
          </span>
        </div>
      </div>
    </div>
  );
};

const Convert = () => {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [toggleClick, setToggleClick] = useState(false);
  const { setActiveMyth, setGameData, gameData } = useContext(MyContext);
  const [myth, setMyth] = useState(0);
  const mythData = gameData.mythologies.filter(
    (item) => item.name.toLowerCase() === wheel[myth]
  )[0];

  // convert orbs to multicolor
  const handleOrbsConversion = async () => {
    setToggleClick(true);
    setTimeout(() => {
      setToggleClick(false);
    }, 1000);
    if (myth < 4) {
      const token = localStorage.getItem("accessToken");
      const mythologyName = {
        mythologyName: mythData.name,
      };
      try {
        await convertOrbs(mythologyName, token);

        const updatedGameData = {
          ...gameData,
          multiColorOrbs: gameData.multiColorOrbs + 1,
          mythologies: gameData.mythologies.map((myth) => {
            if (myth.name === mythologies[myth]) {
              return {
                ...myth,
                orbs: myth.orbs - 2,
              };
            }

            return {
              ...myth,
              orbs: myth.orbs - 2,
            };
          }),
        };
        setGameData(updatedGameData);
        showToast("convert_success");
      } catch (error) {
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        showToast("convert_error");
      }
    }
  };

  useEffect(() => {}, [gameData]);

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
          className={`absolute top-0 left-0 h-full w-full filter-other`}
          style={{
            backgroundImage: `url(/assets/uxui/fof.base.background.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <Header
        children={
          <HeaderContent
            myth={myth}
            t={t}
            gameData={gameData}
            mythData={mythData}
          />
        }
      />
      {/* Wheel */}
      <div className="flex relative flex-grow justify-center items-center">
        {/* Info Icon */}
        {!showInfo && (
          <IconButton
            isInfo={true}
            handleClick={() => {
              setShowInfo(true);
            }}
            activeMyth={4}
            align={2}
          />
        )}
        {gameData.multiColorOrbs !== 0 && (
          <div className="absolute z-10">
            <div className="font-medium text-[60px] text-white glow-text-black">
              {gameData.multiColorOrbs}
            </div>
          </div>
        )}
        <ToggleLeft
          handleClick={() => {
            setActiveMyth((prev) => (prev - 1 + 5) % 5);
          }}
          activeMyth={4}
        />
        {/* Wheel */}
        <div className="flex  flex-col items-center justify-center w-full">
          <img
            src="/assets/uxui/480px-forges.of.faith.tower.png"
            alt="wheel"
            className={`w-[90%] absolute transition-all duration-1000 ${
              myth == 0 && "scale-wheel-glow"
            } ${toggleClick && `glow-tap-${wheel[myth]}`}`}
          />
          <div className="absolute h-full flex justify-center items-end bottom-[1%]">
            <ConvertButton
              t={t}
              handleNext={() => {
                handleClick();
                setMyth((prev) => (prev + 1) % 5);
              }}
              handlePrev={() => {
                handleClick();
                setMyth((prev) => (prev - 1 + 5) % 5);
              }}
              myth={myth}
              action={handleOrbsConversion}
            />
          </div>
        </div>
        <ToggleRight
          handleClick={() => {
            setActiveMyth((prev) => (prev + 1) % 5);
          }}
          activeMyth={4}
        />
      </div>
      {/* Footer */}
      <Footer />
      {showInfo && (
        <ConvertInfo
          t={t}
          handleClick={() => {
            setShowInfo(false);
          }}
        />
      )}
      <ReactHowler
        src="/assets/audio/fof.tower.background01.wav"
        playing={!JSON.parse(localStorage.getItem("sound"))}
        preload={true}
        loop
      />
    </div>
  );
};

export default Convert;
