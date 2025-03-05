import { useRef, useState } from "react";
import assets from "../../../assets/assets.json";
import "../../../styles/load.carousel.scss";
import { ChevronLeft, ChevronRight, Play, Settings } from "lucide-react";
import FoFIntro from "./FoFIntro";
import RoRIntro from "./RoRIntro";
import ReactHowler from "react-howler";
import DoDIntro from "./DoDIntro";

export default function Launcher({ handleUpdateIdx, activeIndex }) {
  const howlerRef = useRef(null);
  const [fadeout, setFadeout] = useState(false);
  const pos = ["-50vw", "-150vw", "-250vw"];
  const bgAudios = ["fofIntro", "", "rorIntro"];
  const currAudio = bgAudios[activeIndex];

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
      className={`flex w-screen text-wrap`}
      style={{
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
      }}
    >
      <div className="absolute flex gap-5 -top-[35px] right-[94px] text-white z-50">
        <Settings size={"6vw"} />
      </div>
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
          <DoDIntro handleFadeout={handleFadeout} fadeout={fadeout} />
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
    </div>
  );
}
