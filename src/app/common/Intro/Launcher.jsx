import { useRef, useState } from "react";
import assets from "../../../assets/assets.json";
import "../../../styles/load.carousel.scss";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import FoFIntro from "./FoFIntro";
import RoRIntro from "./RoRIntro";
import ReactHowler from "react-howler";

export default function Launcher({ handleUpdateIdx, activeIndex }) {
  const howlerRef = useRef(null);
  const [fadeout, setFadeout] = useState(false);
  const pos = ["-50vw", "-150vw", "-250vw"];

  const playAudio = () => {
    if (howlerRef.current) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  const nextSlide = () => {
    if (activeIndex < pos.length - 1) {
      playAudio();
      handleUpdateIdx(activeIndex + 1);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      playAudio();
      handleUpdateIdx(activeIndex - 1);
    }
  };

  const handleFadeout = () => {
    setFadeout(true);
  };

  return (
    <div
      className="transition-all duration-500 overflow-hidden relative"
      style={{
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
      }}
    >
      <div
        className="slider-container flex transition-transform duration-500"
        style={{
          width: "400vw",
          transform: `translateX(${pos[activeIndex]})`,
        }}
      >
        <FoFIntro handleFadeout={handleFadeout} fadeout={fadeout} />
        <RoRIntro handleFadeout={handleFadeout} fadeout={fadeout} />
        <DODLaunch handleFadeout={handleFadeout} fadeout={fadeout} />
      </div>
      <div className={`${fadeout && "fade-out"} `}>
        {activeIndex > 0 && (
          <button
            className={`absolute z-50 top-[77%] opacity-80`}
            onClick={prevSlide}
          >
            <ChevronLeft strokeWidth="3px" size={40} color="white" />
          </button>
        )}
        {activeIndex < pos.length - 1 && (
          <button
            className={`absolute right-0 top-[80%] z-50 opacity-80`}
            onClick={nextSlide}
          >
            <ChevronRight strokeWidth="3px" size={40} color="white" />
          </button>
        )}
      </div>
      <div className="absolute">
        <ReactHowler
          src={assets.audio.menu}
          playing={false}
          ref={howlerRef}
          html5={true}
          volume={0.1}
        />
      </div>
    </div>
  );
}

export const DODLaunch = () => {
  return (
    <div
      className="absolute ml-[150vw] top-0 bottom-0 left-0 w-screen h-full z-10"
      style={{
        background: `url(/assets/1280px-dod.loading.png) no-repeat center / cover`,
        backgroundPosition: "45.75% 0%",
      }}
    >
      <div
        className={`flex  flex-col h-full items-center justify-center z-[100]`}
      >
        <div className="absolute flex flex-col justify-between items-center h-full pb-[3vh]">
          <img
            src="/assets/new/dod2-.png"
            alt="dod"
            className="dod-text-shadow"
          />
          <div className="flex flex-col gap-[2vh]">
            <div className={`flex justify-center items-center z-[100]`}>
              <img
                src={assets.logos.begodsBlack}
                alt="logo"
                className="w-[65px] begod-text-shadow pointer-events-none"
              />
            </div>
            <div className="relative inline-block">
              <img
                src="/assets/buttons/button.black.off.png"
                alt="Button"
                className="h-auto"
              />
              <span className="absolute inset-0 flex text-black-contour items-center justify-center opacity-80 text-white font-fof font-semibold text-[6vw]">
                PLAY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
