import React, { useContext, useRef, useState } from "react";
import { mythSections } from "../../utils/constants.fof";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactHowler from "react-howler";
import { MainContext } from "../../context/context";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

export const ToggleLeft = ({
  handleClick,
  activeMyth,
  minimize,
  positionBottom,
  isShrinked,
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
    <div className="absolute flex top-1/2 -translate-y-1/2  -mt-[2.5rem] -left-9">
      <div
        className={`flex ${minimize === 2 && "slide-inside-left"} ${
          minimize === 1 && "slide-away-left"
        } relative justify-center items-center  z-40`}
      >
        <div
          onClick={handleButtonClick}
          className={`bg-glass-black flex justify-center items-center pl-5 w-[72px] h-[72px] rounded-full cursor-pointer ${
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
  isShrinked,
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
    <div className="absolute flex top-1/2 -translate-y-1/2 -mt-[2.5rem] -right-9">
      <div
        className={`${minimize === 2 && "slide-inside-right"} ${
          minimize === 1 && "slide-away-right"
        } relative justify-center items-center z-40`}
      >
        <div
          onClick={handleButtonClick}
          className={`bg-glass-black mt-1 pr-5 flex justify-center items-center w-[72px] h-[72px] rounded-full cursor-pointer ${
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
