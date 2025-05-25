import React, { useContext } from "react";
import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";
import { MainContext } from "../../context/context";

const FoFLoader = (props) => {
  const { isTelegram, isBrowser } = useContext(MainContext);

  return (
    <div
      className={`w-[100vw] relative ${
        isTelegram ? "tg-container-height" : "browser-container-height"
      }
          `}
    >
      {/* img 1 */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: `url(${assets.locations.fof}) no-repeat center / cover`,
        }}
      ></div>
      {/* img 2 */}
      <div
        className="absolute inset-0 w-full h-full z-10"
        style={{
          background: `url(${assets.uxui.fofSplash}) no-repeat center / cover`,
        }}
      ></div>
      <div className="absolute inset-0 flex z-[20] -mt-[8vh] fade-in justify-center items-center">
        <img
          src={assets.uxui.towerOn}
          alt="tower"
          className={`${
            isBrowser
              ? "w-[30%] h-auto"
              : isTelegram
              ? "max-w-full h-auto"
              : "w-[85%] h-auto"
          }`}
        />
      </div>
      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center w-full justify-center z-20">
        <div className="flex flex-col justify-between items-center h-full w-full pt-[3vh] pb-[2vh]">
          <img src={assets.logos.fof} alt="fof" className="fof-text-shadow" />
          <div className="flex flex-col w-full">
            <div className="flex justify-center fade-in items-center w-full -mb-[1.55vh]">
              <LoadRoll />
            </div>
            <div className="relative inline-block mx-auto">
              <img
                src={`${assets.buttons.orange.off}`}
                alt="Button"
                className="h-auto"
              />
              <span className="absolute inset-0 flex text-black-contour items-center justify-center text-white opacity-80 font-fof font-semibold mt-[2px] text-[1.75rem]">
                LOADING
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="absolute">
        <ReactHowler
          src={`${assets.audio.fofIntro}`}
          playing={true}
          preload={true}
          html5={true}
        />
      </div> */}
    </div>
  );
};

export default FoFLoader;
