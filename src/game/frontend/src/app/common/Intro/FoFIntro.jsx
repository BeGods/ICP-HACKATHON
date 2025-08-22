import { useState } from "react";
import assets from "../../../assets/assets.json";
import { useNavigate } from "react-router-dom";
import { handleClickHaptic, setStorage } from "../../../helpers/cookie.helper";
import { useStore } from "../../../store/useStore";

const tele = window.Telegram?.WebApp;

const FoFIntro = ({ handleFadeout }) => {
  const navigate = useNavigate();
  const [showGlow, setShowGlow] = useState(false);
  const setGame = useStore((s) => s.setGame);

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
            backgroundImage: `url(${assets.locations.fof})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
        {showGlow && (
          <div
            className="absolute inset-0 w-full h-full z-10 select-none"
            style={{
              background: `url(${assets.uxui.fofSplash}) no-repeat center / cover`,
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
          <div className={`flex flex-col  justify-center items-center z-[100]`}>
            <img
              draggable={false}
              src={assets.logos.fof}
              alt="fof"
              className={` select-none ${
                showGlow && "fof-text-shadow"
              } transition-all duration-300`}
            />
          </div>

          <div className={`flex flex-col gap-[2vh]`}>
            <img
              draggable={false}
              src={assets.logos.begodsBlack}
              alt="logo"
              className="w-[65px] mx-auto begod-orange-shadow pointer-events-none select-none"
            />
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

// <div
//   className="absolute inset-0 w-full h-full z-0 select-none"
//   style={{
//     background: `url(${assets.locations.fof}) no-repeat center / cover`,
//   }}
//   draggable={false}
// ></div>
// {showGlow && (
//   <div
//     className="absolute inset-0 w-full h-full z-10 select-none"
//     style={{
//       background: `url(${assets.uxui.fofSplash}) no-repeat center / cover`,
//     }}
//     draggable={false}
//   ></div>
// )}
