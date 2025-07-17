import React, { useContext, useRef, useState } from "react";
import { mythSections } from "../../utils/constants.fof";
import { ChevronLeft, ChevronRight, CornerUpLeft, LogOut } from "lucide-react";
import ReactHowler from "react-howler";
import { MainContext } from "../../context/context";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

export const ToggleLeft = ({
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
          className={`bg-glass-black flex justify-center items-center pl-4 w-[60px] h-[60px] rounded-full cursor-pointer ${
            positionBottom && "border-[0.5px] border-white"
          } ${
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
          className={`bg-glass-black pr-4 flex justify-center items-center w-[60px] h-[60px] rounded-full cursor-pointer ${
            positionBottom && "border-[0.5px] border-white"
          } ${
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

export const ToggleBack = ({ handleClick, lightMode }) => {
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
        className="absolute bottom-0 mb-safeBottom right-0 w-button-primary slide-header-right flex z-40"
      >
        <div className="w-full relative">
          <div
            className={`flex  cursor-pointer pl-0.5 justify-start items-center h-button-primary bg-${primaryColor} w-full rounded-l-primary border border-${secondaryColor}`}
          >
            <div
              className={`flex font-symbols justify-center items-center bg-${secondaryColor} text-${primaryColor} w-[3rem] h-[90%] text-symbol-sm rounded-primary`}
            >
              <LogOut color={primaryColor} size={30} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute slide-in-out-right bottom-0 right-0 pr-[6px] -mb-1  pb-[6px]">
        <div className="mr-auto uppercase  text-secondary  text-white">
          Back
        </div>
      </div>
      <ReactHowler
        src={assets.audio.toggle}
        playing={false}
        ref={howlerRef}
        html5={true}
      />
    </>
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
        <div className="w-full relative">
          <div
            className={`flex  cursor-pointer pr-0.5 justify-end items-center h-button-primary bg-${primaryColor} w-full rounded-r-primary border border-${secondaryColor}`}
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
