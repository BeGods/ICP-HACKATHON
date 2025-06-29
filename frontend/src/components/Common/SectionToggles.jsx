import React, { useContext, useRef, useState } from "react";
import { mythSections } from "../../utils/constants.fof";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
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
    <div
      className={`flex absolute ${isShrinked ? "-left-[1.95rem]" : "left-0"} ${
        minimize === 2 && "slide-inside-left"
      } ${
        minimize === 1 && "slide-away-left"
      } absolute justify-center items-center ${
        positionBottom ? "bottom-[3.5dvh]" : "top-1/2 -mt-4"
      }  w-[15%] z-40`}
    >
      <div
        onClick={handleButtonClick}
        className={`bg-glass-black p-[6px] rounded-full cursor-pointer ${
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
        <ChevronsLeft color="white" className="h-[30px] w-[30px]" />
      </div>
      <ReactHowler
        src={assets.audio.toggle}
        playing={false}
        ref={howlerRef}
        html5={true}
      />
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
    <div
      className={`flex ${isShrinked ? "-right-[1.95rem]" : "right-0"}  ${
        minimize === 2 && "slide-inside-right"
      } ${
        minimize === 1 && "slide-away-right"
      }  absolute justify-center items-center ${
        positionBottom ? "bottom-[3.5dvh]" : "top-1/2 -mt-4"
      } w-[15%] z-40`}
    >
      <div
        onClick={handleButtonClick}
        className={`bg-glass-black p-[6px] mt-1 rounded-full cursor-pointer ${
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
        <ChevronsRight color="white" className="h-[30px] w-[30px]" />
      </div>
      <ReactHowler
        src={assets.audio.toggle}
        playing={false}
        ref={howlerRef}
        html5={true}
      />
    </div>
  );
};
