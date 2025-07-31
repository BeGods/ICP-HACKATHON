import { useEffect, useRef, useState } from "react";
import assets from "../../../assets/assets.json";
import FoFIntro from "./FoFIntro";
import RoRIntro from "./RoRIntro";
import ReactHowler from "react-howler";
import SettingModal from "../../../components/Modals/Settings";
import { validateSoundCookie } from "../../../helpers/cookie.helper";
import {
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import { useStore } from "../../../store/useStore";

const tele = window.Telegram?.WebApp;

export default function Launcher({
  handleUpdateIdx,
  activeIndex,
  isTgMobile,
  isLoading,
}) {
  const showCard = useStore((s) => s.showCard);
  const setShowCard = useStore((s) => s.setShowCard);
  const menuRef = useRef(null);
  const bgRef = useRef(null);
  const [fadeout, setFadeout] = useState(false);
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
    if (activeIndex < 1) {
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
      className={`flex h-full w-screen transition-all duration-500 text-wrap`}
    >
      {activeIndex == 0 ? (
        <FoFIntro
          isLoading={isLoading}
          isTgMobile={isTgMobile}
          handleFadeout={() => setFadeout(true)}
          fadeout={fadeout}
        />
      ) : (
        <RoRIntro
          isLoading={isLoading}
          isTgMobile={isTgMobile}
          handleFadeout={() => setFadeout(true)}
          fadeout={fadeout}
        />
      )}
      {showCard && <SettingModal close={() => setShowCard(false)} />}
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

      <div className="z-50">
        {activeIndex == 0 && (
          <ToggleRight activeMyth={8} handleClick={nextSlide} minimize={2} />
        )}
        {activeIndex == 1 && (
          <ToggleLeft activeMyth={8} handleClick={prevSlide} minimize={2} />
        )}
      </div>
    </div>
  );
}
