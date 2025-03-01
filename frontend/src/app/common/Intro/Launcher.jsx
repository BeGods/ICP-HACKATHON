import { useState } from "react";
import assets from "../../../assets/assets.json";
import "../../../styles/load.carousel.scss";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { mythologies, mythSymbols } from "../../../utils/constants.fof";
import { useNavigate } from "react-router-dom";

export default function Launcher() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [fadeout, setFadeout] = useState(false);
  const pos = ["-50vw", "-150vw", "-250vw"];

  const nextSlide = () => {
    if (activeIndex < pos.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleFadeout = () => {
    setFadeout(true);
  };

  return (
    <div
      className="transition-all duration-500 overflow-hidden relative"
      style={{
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 55px)`,
      }}
    >
      <div
        className=" slider-container flex transition-transform duration-500"
        style={{
          width: "400vw",
          transform: `translateX(${pos[activeIndex]})`,
        }}
      >
        <div
          className="w-[200vw]"
          style={{
            background: `url(${assets.uxui.fofsplash}) no-repeat center / cover`,
            height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
          }}
        >
          <FOFLaunch handleFadeout={handleFadeout} fadeout={fadeout} />
        </div>
        <div
          className="w-[200vw]"
          style={{
            background: `url(${assets.uxui.rorspash}) no-repeat center / cover`,
            height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
          }}
        >
          <RORLaunch />
        </div>
        <div
          className="absolute ml-[150vw] top-0 bottom-0 left-0 w-screen h-full z-10"
          style={{
            background: `url(/assets/1280px-dod.loading.png) no-repeat center / cover`,
            backgroundPosition: "45.75% 0%",
          }}
        >
          <DODLaunch />
        </div>
      </div>
      {/* <div className={`${fadeout && "fade-out"} `}>
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
      </div> */}
    </div>
  );
}

export const FOFLaunch = ({ handleFadeout, fadeout }) => {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col h-full items-center justify-center z-[100]`}>
      <div className="absolute flex flex-col justify-between items-center h-full pt-[3vh] pb-[3vh]">
        <img
          src="/assets/logos/forges.of.faith.vertical.copper.svg"
          alt="dod"
          className="fof-text-shadow w-[180px]"
        />
        <div className={`flex  ${fadeout && "fade-out"}  flex-col gap-[2vh]`}>
          <div className={`flex justify-center items-center z-[100]`}>
            <img
              src={assets.logos.begodsBlack}
              alt="logo"
              className="w-[65px] begod-orange-shadow pointer-events-none"
            />
          </div>
          <div
            onClick={() => {
              handleFadeout();
              setTimeout(() => {
                navigate("/fof");
              }, 2000);
            }}
            className="relative inline-block"
          >
            <img
              src="/assets/buttons/button.orange.off.png"
              alt="Button"
              className="h-auto"
            />
            <span className="absolute inset-0 flex text-black-contour items-center justify-center text-white opacity-80 font-fof font-semibold mt-[2px] text-[6vw]">
              PLAY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RORLaunch = () => {
  return (
    <div
      className={`flex  flex-col h-full items-center justify-center z-[100]`}
    >
      <div className="absolute flex flex-col justify-between items-center h-full pt-[3vh] pb-[3vh]">
        <img
          src="/assets/ror.logo.silver1.svg"
          alt="dod"
          className="purple-text-shadow w-[180px]"
        />
        <div className="flex flex-col gap-[2vh]">
          <div className={`flex justify-center items-center z-[100]`}>
            <img
              src={assets.logos.begodsWhite}
              alt="logo"
              className="w-[65px] begod-blue-shadow pointer-events-none"
            />
          </div>
          <div className="relative inline-block">
            <img
              src="/assets/buttons/button.blue.on.png"
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
  );
};

export const DODLaunch = () => {
  return (
    <div
      className={`flex  flex-col h-full items-center justify-center z-[100]`}
    >
      <div className="absolute flex flex-col justify-between items-center h-full pt-[1vh] pb-[3vh]">
        <img
          src="/assets/logos/dawn.of.duels.vertical.gold.png"
          alt="dod"
          className="w-[180px] dod-text-shadow"
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
  );
};
