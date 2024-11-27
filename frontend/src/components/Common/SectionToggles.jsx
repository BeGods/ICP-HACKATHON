import React, { useContext, useRef, useState } from "react";
import { mythSections } from "../../utils/constants";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import ReactHowler from "react-howler";
import { MyContext } from "../../context/context";

export const ToggleLeft = ({ handleClick, activeMyth, minimize }) => {
  const howlerRef = useRef(null);
  const { enableSound, assets } = useContext(MyContext);

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleButtonClick = () => {
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
      className={`flex absolute left-0 ${
        minimize === 2 && "slide-inside-left"
      } ${
        minimize === 1 && "slide-away-left"
      } absolute justify-center items-center top-1/2 -mt-4 w-[15%] z-40`}
    >
      <div
        onClick={handleButtonClick}
        className={`bg-glass-black p-[6px] rounded-full cursor-pointer  ${
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

export const ToggleRight = ({ handleClick, activeMyth, minimize }) => {
  const howlerRef = useRef(null);
  const { enableSound, assets } = useContext(MyContext);

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleButtonClick = () => {
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
      className={`flex right-0 ${minimize === 2 && "slide-inside-right"} ${
        minimize === 1 && "slide-away-right"
      }  absolute justify-center items-center top-1/2 -mt-4 w-[15%] z-40`}
    >
      <div
        onClick={handleButtonClick}
        className={`bg-glass-black p-[6px] mt-1 rounded-full cursor-pointer  ${
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
