import React, { useContext } from "react";
import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";
import ReactHowler from "react-howler";
import { MainContext } from "../../context/context";

const RoRLoader = (props) => {
  const { isTelegram } = useContext(MainContext);

  return (
    <div
      className={`w-[100vw] relative ${
        isTelegram ? "tg-container-height" : "browser-container-height"
      }`}
    >
      {/* img 1 */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: `url(${assets.uxui.rorspash}) no-repeat center / cover`,
        }}
      ></div>
      {/* img 2 */}
      <div
        className="absolute inset-0 w-full h-full z-10"
        style={{
          background: `url(${assets.uxui.rorspashOn}) no-repeat center / cover`,
        }}
      ></div>
      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center w-full justify-center z-20">
        <div className="flex flex-col justify-between items-center w-full h-full pt-[3vh] pb-[2vh]">
          <img
            src="/assets/logos/requiem.of.relics.png"
            alt="ror"
            className="purple-text-shadow"
          />
          <div className="flex flex-col w-full">
            <div className="flex justify-center fade-in items-center w-full -mb-[1.55vh]">
              <LoadRoll />
            </div>
            <div className="relative inline-block mx-auto">
              <img
                src="/assets/buttons/button.blue.off.png"
                alt="Button"
                className="h-auto"
              />
              <span className="absolute inset-0 mt-[2px] flex text-black-contour items-center justify-center text-white opacity-80 font-fof font-semibold text-[6vw]">
                <div>LOADING</div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute">
        <ReactHowler
          src={`${assets.audio.rorIntro}`}
          playing={true}
          preload={true}
          html5={true}
        />
      </div>
    </div>
  );
};

export default RoRLoader;
