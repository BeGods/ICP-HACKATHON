import React from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../../assets/assets.json";

const RoRIntro = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-[200vw]"
      style={{
        background: `url(${assets.uxui.rorspash}) no-repeat center / cover`,
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
      }}
    >
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
            <div
              onClick={() => {
                handleFadeout();
                setTimeout(() => {
                  navigate("/ror");
                }, 2000);
              }}
              className="relative inline-block"
            >
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
    </div>
  );
};

export default RoRIntro;
