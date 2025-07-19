import React, { useContext, useRef, useState } from "react";
import { mythSections } from "../../utils/constants.fof";
import { ChevronLeft, ChevronRight, CornerUpLeft } from "lucide-react";
import ReactHowler from "react-howler";
import { MainContext } from "../../context/context";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

export const ToggleLeft = ({ handleClick, activeMyth, minimize }) => {
  const howlerRef = useRef(null);
  const { enableSound, assets, enableHaptic } = useContext(MainContext);

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleButtonClick = () => {
    handleClickHaptic(tele, enableHaptic);
    setIsButtonClicked(true);

    setTimeout(() => {
      setIsButtonClicked(false);
      playAudio();
      handleClick();
    }, 100);
  };

  const playAudio = () => {
    if (howlerRef.current && enableSound) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  return (
    <div className="absolute flex top-1/2 -translate-y-1/2 -left-7">
      <div
        className={`flex ${minimize === 2 && "slide-inside-left"} ${
          minimize === 1 && "slide-away-left"
        } relative justify-center items-center  z-40`}
      >
        <div
          onClick={handleButtonClick}
          className={`bg-glass-black flex justify-center items-center pl-5 border border-white/60 w-[60px] h-[60px] rounded-primary cursor-pointer  ${
            isButtonClicked
              ? `glow-button-${
                  mythSections[activeMyth] === "other"
                    ? "white"
                    : mythSections[activeMyth]
                }`
              : ""
          }`}
        >
          <ChevronLeft color="white" className="h-[30px] w-[30px]" />
        </div>
        <ReactHowler
          src={assets.audio.toggle}
          playing={false}
          ref={howlerRef}
          html5={true}
        />
      </div>
    </div>
  );
};

export const ToggleRight = ({
  handleClick,
  activeMyth,
  minimize,
  positionBottom,
}) => {
  const howlerRef = useRef(null);
  const { enableSound, assets, enableHaptic } = useContext(MainContext);

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleButtonClick = () => {
    handleClickHaptic(tele, enableHaptic);
    setIsButtonClicked(true);
    playAudio();
    setTimeout(() => {
      setIsButtonClicked(false);
      handleClick();
    }, 100);
  };

  const playAudio = () => {
    if (howlerRef.current && enableSound) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  return (
    <div className="absolute flex top-1/2 -translate-y-1/2 -right-7">
      <div
        className={`${minimize === 2 && "slide-inside-right"} ${
          minimize === 1 && "slide-away-right"
        } relative justify-center items-center`}
      >
        <div
          onClick={handleButtonClick}
          className={`bg-glass-black pr-5 flex justify-center items-center w-[60px] h-[60px] border border-white/60 rounded-primary cursor-pointer  ${
            isButtonClicked
              ? `glow-button-${
                  mythSections[activeMyth] === "other"
                    ? "white"
                    : mythSections[activeMyth]
                }`
              : ""
          }`}
        >
          <ChevronRight color="white" className="h-[30px] w-[30px]" />
        </div>
        <ReactHowler
          src={assets.audio.toggle}
          playing={false}
          ref={howlerRef}
          html5={true}
        />
      </div>
    </div>
  );
};

export const ToggleBack = ({ handleClick }) => {
  const howlerRef = useRef(null);
  const { enableSound, enableHaptic } = useContext(MainContext);

  const handleButtonClick = () => {
    handleClickHaptic(tele, enableHaptic);
    playAudio();
    setTimeout(() => {
      handleClick();
    }, 100);
  };

  const playAudio = () => {
    if (howlerRef.current && enableSound) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  return (
    <div className="absolute bottom-0 mb-safeBottom -right-7  rounded-full flex z-40">
      <div
        className={`relative justify-center items-center slide-inside-right `}
      >
        <div
          onClick={handleButtonClick}
          className={`bg-glass-black pr-6 border border-white/60 flex justify-center items-center w-[60px] h-[60px] rounded-primary cursor-pointer `}
        >
          <CornerUpLeft color="white" className="h-[24px] w-[24px]" />
        </div>
      </div>
    </div>
  );
};

export const CustomToggleLeft = ({ handleClick, lightMode, label, src }) => {
  const howlerRef = useRef(null);
  const { enableSound, assets, enableHaptic } = useContext(MainContext);
  const primaryColor = lightMode ? "black" : "white";
  const secondaryColor = lightMode ? "white" : "black";

  const handleButtonClick = () => {
    handleClickHaptic(tele, enableHaptic);
    playAudio();
    setTimeout(() => {
      handleClick();
    }, 100);
  };

  const playAudio = () => {
    if (howlerRef.current && enableSound) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  return (
    <>
      <div
        onClick={handleButtonClick}
        className="absolute bottom-0 mb-safeBottom left-0 w-button-primary slide-header-left flex z-40"
      >
        <div className="w-full relative ">
          <div
            className={`flex  cursor-pointer pr-0.5 justify-end items-center h-button-primary bg-${primaryColor} w-full rounded-r-full border border-${secondaryColor}`}
          >
            <div
              className={`flex font-symbols justify-center items-center bg-${secondaryColor} text-${primaryColor} w-[3rem] h-[90%] text-symbol-sm rounded-primary`}
            >
              {src}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute slide-in-out-left bottom-0 left-0 pl-[6px] -mb-1  pb-[6px]">
        <div className="mr-auto uppercase  text-secondary  text-white">
          {label}
        </div>
      </div>
    </>
  );
};

export const CustomToggleRight = ({ handleClick, lightMode, label, src }) => {
  const howlerRef = useRef(null);
  const { enableSound, enableHaptic } = useContext(MainContext);
  const primaryColor = lightMode ? "black" : "white";
  const secondaryColor = lightMode ? "white" : "black";

  const handleButtonClick = () => {
    handleClickHaptic(tele, enableHaptic);
    playAudio();
    setTimeout(() => {
      handleClick();
    }, 100);
  };

  const playAudio = () => {
    if (howlerRef.current && enableSound) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  return (
    <>
      <div
        onClick={handleButtonClick}
        className="mb-safeBottom right-0 w-button-primary slide-header-right flex z-40"
      >
        <div className="w-full relative">
          <div
            className={`flex  cursor-pointer pl-0.5 justify-start items-center h-button-primary bg-${primaryColor} w-full rounded-l-primary border border-${secondaryColor}`}
          >
            <div
              className={`flex font-symbols justify-center items-center bg-${secondaryColor} text-${primaryColor} w-[3rem] h-[90%] text-symbol-sm rounded-primary`}
            >
              {src}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute slide-in-out-right bottom-0 right-0 pr-[6px] -mb-1  pb-[6px]">
        <div className="mr-auto uppercase  text-secondary  text-white">
          {label}
        </div>
      </div>
    </>
  );
};
