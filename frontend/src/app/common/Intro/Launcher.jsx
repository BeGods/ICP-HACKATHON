import { useEffect, useRef, useState } from "react";
import assets from "../../../assets/assets.json";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FoFIntro from "./FoFIntro";
import RoRIntro from "./RoRIntro";
import ReactHowler from "react-howler";
import DoDIntro from "./DoDIntro";
import TgHeader from "../../../components/Layouts/TgHeader";
import SettingModal from "../../../components/Modals/Settings";
import { validateSoundCookie } from "../../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

export default function Launcher({
  handleUpdateIdx,
  activeIndex,
  isTgMobile,
  isLoading,
}) {
  const menuRef = useRef(null);
  const bgRef = useRef(null);
  const [fadeout, setFadeout] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const pos = ["-50vw", "-150vw", "-250vw"];
  const bgAudios = ["fofIntro", "", "rorIntro"];

  const playMenuAudio = async () => {
    const isSoundActive = await validateSoundCookie(tele);
    if (menuRef.current && isSoundActive) {
      menuRef.current.stop();
      menuRef.current.play();
    }
  };

  useEffect(() => {
    const handleAudioLoad = async () => {
      const isSoundActive = await validateSoundCookie(tele);
      if (bgRef.current && isSoundActive && activeIndex !== 1) {
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
    <div
      className={`flex ${
        isTgMobile ? "tg-container-height" : "browser-container-height"
      } w-screen text-wrap`}
    >
      <TgHeader hideExit={true} openSettings={() => setShowCard(true)} />
      <div className={`transition-all duration-500 overflow-hidden relative`}>
        <div
          className="slider-container flex transition-transform duration-500"
          style={{
            width: "400vw",
            transform: `translateX(${pos[activeIndex]})`,
          }}
        >
          <FoFIntro
            isLoading={isLoading}
            isTgMobile={isTgMobile}
            handleFadeout={() => setFadeout(true)}
            fadeout={fadeout}
          />
          <RoRIntro
            isLoading={isLoading}
            isTgMobile={isTgMobile}
            handleFadeout={() => setFadeout(true)}
            fadeout={fadeout}
          />
          <DoDIntro
            isLoading={isLoading}
            isTgMobile={isTgMobile}
            handleFadeout={() => setFadeout(true)}
            fadeout={fadeout}
          />
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
      {activeIndex > 0 && (
        <div
          className={`flex left-0 absolute justify-center items-center  w-[15%] h-full top-0 z-40`}
        >
          <div onClick={prevSlide} className={`cursor-pointer`}>
            <ChevronLeft strokeWidth="3px" size={40} color="white" />
          </div>
        </div>
      )}
      {activeIndex < pos.length - 1 && (
        <div
          className={`flex right-0 absolute justify-center items-center  w-[15%] h-full top-0 z-40`}
        >
          <div onClick={nextSlide} className={`cursor-pointer`}>
            <ChevronRight strokeWidth="3px" size={40} color="white" />
          </div>
        </div>
      )}
    </div>
  );
}
