import { Repeat2, RotateCcw, RotateCw } from "lucide-react";
import React, { useState, useRef, useContext } from "react";
import { wheel } from "../../utils/constants";
import ReactHowler from "react-howler";
import { MyContext } from "../../context/context";

const ConvertButton = ({ handleNext, handlePrev, action, myth }) => {
  const { enableSound, assets } = useContext(MyContext);
  const [isClicked, setIsClicked] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const howlerRef = useRef(null);

  const playAudio = () => {
    if (howlerRef.current && !JSON.parse(localStorage.getItem("sound"))) {
      howlerRef.current.stop();
      howlerRef.current.play();
    } else {
      setPlaySound(true);
    }
  };

  return (
    <div
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      onMouseLeave={() => setIsClicked(false)}
      onTouchStart={() => setIsClicked(true)}
      onTouchEnd={() => setIsClicked(false)}
      onTouchCancel={() => setIsClicked(false)}
      className={`flex items-center z-20 justify-between h-button-primary w-button-primary mx-auto border border-${
        wheel[myth]
      }-primary bg-glass-black text-white rounded-primary ${
        isClicked ? `glow-button-${wheel[myth]}` : ""
      }`}
    >
      <div
        onClick={() => {
          playAudio();
          handlePrev();
        }}
        className="flex justify-center items-center w-1/4 border-r-secondary border-borderGray h-full"
      >
        <RotateCcw color="white" className="h-[28px] w-[28px]" />
      </div>
      <div
        onClick={() => {
          playAudio();
          action();
        }}
        className="text-button-primary uppercase"
      >
        <div
          className={`p-[6vw] flex justify-center items-center rounded-full bg-${wheel[myth]}-text`}
        >
          <Repeat2 strokeWidth={3} />
        </div>
      </div>
      <div
        onClick={() => {
          playAudio();
          handleNext();
        }}
        className="flex justify-center items-center w-1/4 border-l-secondary border-borderGray h-full"
      >
        <RotateCw color="white" className="h-[28px] w-[28px]" />
      </div>
      <div className="absolute">
        {playSound && (
          <ReactHowler
            src={`${assets.audio.towerButton}`}
            playing={enableSound}
            preload={true}
            ref={howlerRef}
            onEnd={() => setPlaySound(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ConvertButton;
