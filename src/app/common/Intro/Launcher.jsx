import { useRef, useState } from "react";
import assets from "../../../assets/assets.json";
import "../../../styles/load.carousel.scss";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Play,
  Settings,
} from "lucide-react";
import FoFIntro from "./FoFIntro";
import RoRIntro from "./RoRIntro";
import ReactHowler from "react-howler";
import DoDIntro from "./DoDIntro";
import TgHeader from "../../../components/Common/TgHeader";
import SettingModal from "../../../components/Modals/Settings";

export default function Launcher({ handleUpdateIdx, activeIndex }) {
  const howlerRef = useRef(null);
  const [fadeout, setFadeout] = useState(false);
  const [showCard, setShowCard] = useState(false);
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
    <div className={`flex w-screen text-wrap`}>
      <TgHeader
        hideExit={true}
        openSettings={() => {
          setShowCard(true);
        }}
      />
      <div className="transition-all tg-container-height duration-500 overflow-hidden relative">
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

        {showCard && (
          <div className="absolute z-[99] w-screen">
            <SettingModal
              close={() => {
                setShowCard(false);
              }}
            />
          </div>
        )}
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
