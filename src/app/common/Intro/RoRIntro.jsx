import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../../assets/assets.json";
import { handleClickHaptic, setStorage } from "../../../helpers/cookie.helper";
import { MainContext } from "../../../context/context";

const tele = window.Telegram?.WebApp;

const RoRIntro = ({ handleFadeout, fadeout, isTgMobile }) => {
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
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: `url(${assets.locations.ror}) no-repeat center / cover`,
        }}
        draggable={false}
      ></div>

      {/* img 2 */}
      {showGlow && (
        <div
          className="absolute inset-0 w-full h-full z-10"
          style={{
            background: `url(${assets.uxui.rorSplash}) no-repeat center / cover`,
          }}
          draggable={false}
        ></div>
      )}

      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="flex flex-col justify-between items-center h-full pt-[3vh] pb-[2vh]">
          <div>
            <img
              draggable={false}
              src={assets.logos.ror}
              alt="dod"
              className={`${
                showGlow && "ror-text-shadow"
              } transition-all duration-300`}
            />
            <div className="flex justify-center text-white font-fof text-[2rem] glow-text-norse">
              BETA
            </div>
          </div>
          <div className="flex flex-col gap-[2vh]">
            <div
              className={`flex ${
                fadeout && "fade-out"
              }   justify-center items-center z-[100]`}
            >
              <img
                draggable={false}
                src={assets.logos.begodsWhite}
                alt="logo"
                className="w-[67px] begod-blue-shadow pointer-events-none"
              />
            </div>
            <div onClick={() => {}} className="relative inline-block">
              <div className="relative inline-block">
                <h1 className="text-white font-fof text-[1.75rem] text-black-contour">
                  COMING SOON
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="flex flex-col justify-between items-center h-full pt-[3dvh] pb-[2dvh]">
          <div>
            <img
              draggable={false}
              src={assets.logos.ror}
              alt="dod"
              className={`${
                showGlow && "ror-text-shadow"
              } transition-all duration-300`}
            />
            <div className="flex justify-center text-white font-fof text-[2rem] glow-text-norse">
              BETA
            </div>
          </div>
          <div className="flex flex-col gap-[2vh]">
            <div
              className={`flex ${
                fadeout && "fade-out"
              }   justify-center items-center z-[100]`}
            >
              <img
                draggable={false}
                src={assets.logos.begodsWhite}
                alt="logo"
                className="w-[67px] begod-blue-shadow pointer-events-none"
              />
            </div>
            <div
              onClick={async () => {
                handleClickHaptic(tele, true);
                setGame("ror");
                setShowGlow(true);
                handleFadeout();
                await setStorage(tele, "game", "ror");
                setTimeout(() => {
                  navigate("/ror");
                }, 1000);
              }}
              className="relative inline-block"
            >
              <img
                src={
                  showGlow
                    ? `${assets.buttons.blue.off}`
                    : `${assets.buttons.blue.on}`
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
      </div> */}
    </div>
  );
};

export default RoRIntro;
