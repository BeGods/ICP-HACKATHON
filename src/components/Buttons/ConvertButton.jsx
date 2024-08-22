import { RotateCcw, RotateCw } from "lucide-react";
import React, { useState, useRef } from "react";
import { wheel } from "../../utils/variables";
import ReactHowler from "react-howler";

const ConvertButton = ({ handleNext, handlePrev, action, t, myth }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const howlerRef = useRef(null);

  const playAudio = () => {
    if (howlerRef.current) {
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
      className={`flex items-center justify-between h-button-primary w-button-primary mx-auto border border-${
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
        {t(`buttons.convert`)}
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
            src="/assets/audio/fof.tower.lock.wav"
            playing={!JSON.parse(localStorage.getItem("sound"))}
            preload={true}
            ref={howlerRef} // Use the ref to control playback
            onEnd={() => setPlaySound(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ConvertButton;
