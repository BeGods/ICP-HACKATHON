import React, { useRef, useState } from "react";
import { mythSections } from "../../utils/variables";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import ReactHowler from "react-howler";

export const ToggleLeft = ({ handleClick, activeMyth, minimize }) => {
  const howlerRef = useRef(null);

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
    if (howlerRef.current && !JSON.parse(localStorage.getItem("sound"))) {
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
      }  top-[50%] justify-center items-center w-[15%] z-40 -mt-8`}
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
        <ChevronsLeft color="white" className="h-[30px] w-[30px]" />
      </div>
      <ReactHowler
        src="/assets/audio/fof.side.button.wav"
        playing={false}
        ref={howlerRef}
        html5={true}
      />
    </div>
  );
};

export const ToggleRight = ({ handleClick, activeMyth, minimize }) => {
  const howlerRef = useRef(null);

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
    if (howlerRef.current && !JSON.parse(localStorage.getItem("sound"))) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  return (
    <div
      className={`flex right-0 ${minimize === 2 && "slide-inside-right"} ${
        minimize === 1 && "slide-away-right"
      }  top-[50%] absolute justify-center items-center w-[15%] z-40 -mt-8`}
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
        src="/assets/audio/fof.side.button.wav"
        playing={false}
        ref={howlerRef}
        html5={true}
      />
    </div>
  );
};
