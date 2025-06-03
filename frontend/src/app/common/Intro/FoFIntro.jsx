import React, { useContext, useEffect, useState } from "react";
import assets from "../../../assets/assets.json";
import { useNavigate } from "react-router-dom";
import { handleClickHaptic, setStorage } from "../../../helpers/cookie.helper";
import { MainContext } from "../../../context/context";

const tele = window.Telegram?.WebApp;

const FoFIntro = ({ handleFadeout, fadeout, isTgMobile }) => {
  const navigate = useNavigate();
  const [showGlow, setShowGlow] = useState(false);
  const { setGame } = useContext(MainContext);

  return (
    <div
      className={`w-[200vw] ${
        isTgMobile ? "tg-container-height" : "browser-container-height"
      } relative`}
    >
      {/* img 1 */}
      <div
        className="absolute inset-0 w-full h-full z-0 select-none"
        style={{
          background: `url(${assets.locations.fof}) no-repeat center / cover`,
        }}
        draggable={false}
      ></div>
      {/* img 2  */}
      {showGlow && (
        <div
          className="absolute inset-0 w-full h-full z-10 select-none"
          style={{
            background: `url(${assets.uxui.fofSplash}) no-repeat center / cover`,
          }}
          draggable={false}
        ></div>
      )}

      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="flex flex-col justify-between items-center h-full pt-[3dvh] pb-[2dvh]">
          <img
            draggable={false}
            src={assets.logos.fof}
            alt="fof"
            className={` select-none${
              showGlow && "fof-text-shadow"
            } transition-all duration-300`}
          />
          <div className={`flex flex-col gap-[2vh]`}>
            <div
              className={`flex ${
                fadeout && "fade-out"
              } justify-center items-center z-[100]`}
            >
              <img
                draggable={false}
                src={assets.logos.begodsBlack}
                alt="logo"
                className="w-[65px] begod-orange-shadow pointer-events-none select-none"
              />
            </div>
            <div
              onClick={async () => {
                handleClickHaptic(tele, true);
                setShowGlow(true);
                setGame("fof");
                handleFadeout();
                await setStorage(tele, "game", "fof");
                setTimeout(() => {
                  navigate("/fof");
                }, 1000);
              }}
              className={`relative fade-in inline-block transition-all duration-500`}
            >
              <img
                src={
                  showGlow
                    ? `${assets.buttons.orange.off}`
                    : `${assets.buttons.orange.on}`
                }
                alt="Button"
                className="h-auto"
              />
              <span className="absolute cursor-pointer inset-0 flex text-black-contour items-center justify-center text-white opacity-80 font-fof font-semibold mt-[2px] text-[1.75rem]">
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
