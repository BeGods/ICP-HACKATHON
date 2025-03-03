import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../../assets/assets.json";

const RoRIntro = () => {
  const navigate = useNavigate();
  const [showGlow, setShowGlow] = useState(false);

  return (
    <div className="w-[200vw] relative h-[calc(100svh-var(--tg-safe-area-inset-top)-45px)]">
      {/* img 1 */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: `url(${assets.uxui.rorspash}) no-repeat center / cover`,
        }}
      ></div>

      {/* img 2 */}
      {showGlow && (
        <div
          className="absolute inset-0 w-full h-full z-10"
          style={{
            background: `url(/assets/1280px-ror.on.png) no-repeat center / cover`,
          }}
        ></div>
      )}

      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="flex flex-col justify-between items-center h-full pt-[3vh] pb-[3vh]">
          <img
            src="/assets/ror.logo.silver1.svg"
            alt="dod"
            className="purple-text-shadow w-[180px]"
          />
          <div className="flex flex-col gap-[2vh]">
            <div className="flex justify-center items-center">
              <img
                src={assets.logos.begodsWhite}
                alt="logo"
                className="w-[65px] begod-blue-shadow pointer-events-none"
              />
            </div>
            <div
              onClick={() => {
                setShowGlow(true);
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
