import React, { useState } from "react";
import assets from "../../../assets/assets.json";
import { useNavigate } from "react-router-dom";
import { handleClickHaptic } from "../../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const FoFIntro = ({ handleFadeout, fadeout }) => {
  const navigate = useNavigate();
  const [showGlow, setShowGlow] = useState(false);

  return (
    <div className="w-[200vw] tg-container-height relative">
      {/* img 1 */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: `url(${assets.uxui.fofsplash}) no-repeat center / cover`,
        }}
      ></div>
      {/* img 2 */}
      {showGlow && (
        <div
          className="absolute inset-0 w-full h-full z-10"
          style={{
            background: `url(${assets.uxui.fofsplashOn}) no-repeat center / cover`,
          }}
        ></div>
      )}
      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="flex flex-col justify-between items-center h-full pt-[3vh] pb-[2vh]">
          <img
            src="/assets/logos/forges.of.faith.png"
            alt="fof"
            className="fof-text-shadow"
          />
          <div className={`flex flex-col gap-[2vh]`}>
            <div
              className={`flex ${
                fadeout && "fade-out"
              } justify-center items-center z-[100]`}
            >
              <img
                src={assets.logos.begodsBlack}
                alt="logo"
                className="w-[65px] begod-orange-shadow pointer-events-none"
              />
            </div>
            <div
              onClick={() => {
                handleClickHaptic(tele, true);
                setShowGlow(true);
                handleFadeout();
                setTimeout(() => {
                  navigate("/fof");
                }, 1000);
              }}
              className="relative inline-block transition-all duration-500"
            >
              <img
                src={
                  showGlow
                    ? `/assets/buttons/button.orange.off.png`
                    : `/assets/buttons/button.orange.on.png`
                }
                alt="Button"
                className="h-auto"
              />
              <span className="absolute inset-0 flex text-black-contour items-center justify-center text-white opacity-80 font-fof font-semibold mt-[2px] text-[6vw]">
                {showGlow ? "LOADING" : "PLAY"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoFIntro;
