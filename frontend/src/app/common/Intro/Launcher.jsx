import { useEffect, useRef, useState } from "react";
import assets from "../../../assets/assets.json";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FoFIntro from "./FoFIntro";
import RoRIntro from "./RoRIntro";
import ReactHowler from "react-howler";
import DoDIntro from "./DoDIntro";
import TgHeader from "../../../components/Common/TgHeader";
import SettingModal from "../../../components/Modals/Settings";

export default function Launcher({ handleUpdateIdx, activeIndex, isTelegram }) {
  const menuRef = useRef(null);
  const bgRef = useRef(null);
  const [fadeout, setFadeout] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const pos = ["-50vw", "-150vw", "-250vw"];
  const bgAudios = ["fofIntro", "", "rorIntro"];

  const playMenuAudio = () => {
    if (menuRef.current) {
      menuRef.current.stop();
      menuRef.current.play();
    }
  };

  useEffect(() => {
    const handleAudioLoad = () => {
      if (bgRef.current && activeIndex !== 1) {
        setTimeout(() => {
          bgRef.current.play();
        }, 2000);
      }
    };
    handleAudioLoad();
  }, [activeIndex]);

  const nextSlide = () => {
    if (activeIndex < pos.length - 1) {
      playMenuAudio();
      handleUpdateIdx(activeIndex + 1);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      playMenuAudio();
      handleUpdateIdx(activeIndex - 1);
    }
  };

  return (
    <div className="flex w-screen text-wrap">
      <TgHeader hideExit={true} openSettings={() => setShowCard(true)} />
      <div
        className={`transition-all ${
          isTelegram ? "tg-container-height" : "browser-container-height"
        } duration-500 overflow-hidden relative`}
      >
        <div
          className="slider-container flex transition-transform duration-500"
          style={{
            width: "400vw",
            transform: `translateX(${pos[activeIndex]})`,
          }}
        >
          <FoFIntro
            isTelegram={isTelegram}
            handleFadeout={() => setFadeout(true)}
            fadeout={fadeout}
          />
          <RoRIntro
            isTelegram={isTelegram}
            handleFadeout={() => setFadeout(true)}
            fadeout={fadeout}
          />
          <DoDIntro
            isTelegram={isTelegram}
            handleFadeout={() => setFadeout(true)}
            fadeout={fadeout}
          />
        </div>
        <div className={`${fadeout && "fade-out"}`}>
          {activeIndex > 0 && (
            <button
              className="absolute z-50 top-[50%] opacity-80"
              onClick={prevSlide}
            >
              <ChevronLeft strokeWidth="3px" size={40} color="white" />
            </button>
          )}
          {activeIndex < pos.length - 1 && (
            <button
              className="absolute right-0 top-[50%] z-50 opacity-80"
              onClick={nextSlide}
            >
              <ChevronRight strokeWidth="3px" size={40} color="white" />
            </button>
          )}
        </div>

        {showCard && (
          <div className="absolute z-[99] w-screen">
            <SettingModal close={() => setShowCard(false)} />
          </div>
        )}
        <div className="absolute">
          <ReactHowler
            src={assets.audio.menu}
            playing={false}
            ref={menuRef}
            html5={true}
            volume={0.2}
          />
          {activeIndex !== 1 && (
            <ReactHowler
              src={assets.audio[bgAudios[activeIndex]]}
              playing={false}
              ref={bgRef}
              loop
              onLoad={() => {
                console.log("ye loaded");
              }}
              onLoadError={(err) => {
                console.log("Error", err);
              }}
              onPlayError={(err) => {
                console.log("Error", err);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
