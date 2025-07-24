import React, { useContext, useState } from "react";
import assets from "../../../assets/assets.json";
import { handleClickHaptic, setStorage } from "../../../helpers/cookie.helper";
import { MainContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";

const tele = window.Telegram?.WebApp;

const RoRIntro = ({ handleFadeout, fadeout }) => {
  const [showGlow, setShowGlow] = useState(false);
  const { setGame } = useContext(MainContext);
  const navigate = useNavigate();

  return (
    <div
      style={{
        top: 0,
        left: 0,
        width: "100vw",
      }}
      className={`flex h-full flex-col m-0`}
    >
      <div className="h-full">
        <div
          className={`absolute top-0 left-0 h-full w-full`}
          style={{
            backgroundImage: `url(${assets.locations.ror})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
        {showGlow && (
          <div
            className="absolute inset-0 w-full h-full z-10 select-none"
            style={{
              background: `url(${assets.uxui.rorSplash}) no-repeat center / cover`,
            }}
            draggable={false}
          ></div>
        )}
        <img
          src={assets.uxui.shadow}
          alt="paper"
          draggable={false}
          className="w-full absolute top-0 rotate-180 left-0 z-[30] select-none h-[120px]"
        />
        <img
          src={assets.uxui.shadow}
          alt="paper"
          draggable={false}
          className="w-full absolute bottom-0 left-0 z-[1] select-none h-[120px]"
        />
      </div>
      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
        <div className="flex flex-col  justify-between items-center h-full mt-gamePanelTop mb-buttonBottom">
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
            {/* <div className="relative inline-block text-white font-fof text-[1.75rem] text-black-contour">
              COMING SOON
            </div> */}
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
      </div>
    </div>
  );
};

export default RoRIntro;
