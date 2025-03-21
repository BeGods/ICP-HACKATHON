import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../../assets/assets.json";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { MainContext } from "../../../context/context";

const tele = window.Telegram?.WebApp;

const RoRIntro = ({ handleFadeout, fadeout, isTelegram }) => {
  const navigate = useNavigate();
  const [showGlow, setShowGlow] = useState(false);
  const { setGame } = useContext(MainContext);

  return (
    <div
      className={`w-[200vw] ${
        isTelegram ? "tg-container-height" : "browser-container-height"
      } relative`}
    >
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
            background: `url(${assets.uxui.rorspashOn}) no-repeat center / cover`,
          }}
        ></div>
      )}

      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="flex flex-col justify-between items-center h-full pt-[3vh] pb-[2vh]">
          <img
            src={assets.logos.ror}
            alt="dod"
            className="purple-text-shadow"
          />
          <div className="flex flex-col gap-[2vh]">
            <div
              className={`flex ${
                fadeout && "fade-out"
              }   justify-center items-center z-[100]`}
            >
              <img
                src={assets.logos.begodsWhite}
                alt="logo"
                className="w-[67px] begod-blue-shadow pointer-events-none"
              />
            </div>
            <div
              onClick={() => {
                handleClickHaptic(tele, true);
                setGame("ror");
                setShowGlow(true);
                handleFadeout();
                setTimeout(() => {
                  navigate("/ror");
                }, 1000);
              }}
              className="relative inline-block"
            >
              {/* <img
                src={
                  showGlow
                    ? `${assets.buttons.blue.off}`
                    : `${assets.buttons.blue.on}`
                }
                alt="Button"
                className="h-auto"
              />
              <span className="absolute inset-0 flex text-black-contour items-center justify-center opacity-80 text-white font-fof font-semibold text-[6vw]">
                PLAY
              </span> */}
              <h1 className="text-white font-fof text-[9vw] text-black-contour">
                COMING SOON
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="flex flex-col justify-between items-center h-full pt-[3vh] pb-[3.5vh]">
          <img
            src={assets.logos.ror}
            alt="dod"
            className="purple-text-shadow"
          />
          <div className="flex flex-col gap-[2vh]">
            <div
              className={`flex ${
                fadeout && "fade-out"
              }   justify-center items-center z-[100]`}
            >
              <img
                src={assets.logos.begodsWhite}
                alt="logo"
                className="w-[67px] begod-blue-shadow pointer-events-none"
              />
            </div>
            <div
              onClick={() => {
                handleClickHaptic(tele, true);
                setGame("ror");
                setShowGlow(true);
                handleFadeout();
                setTimeout(() => {
                  navigate("/ror");
                }, 1000);
              }}
              className="relative inline-block"
            >
              <div className="relative inline-block">
                <h1 className="text-white font-fof text-[9vw] text-black-contour">
                  COMING SOON
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default RoRIntro;
