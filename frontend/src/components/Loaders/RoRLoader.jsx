import React from "react";
import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";
import ReactHowler from "react-howler";

const RoRLoader = (props) => {
  return (
    <div className="w-[100vw] relative h-[calc(100svh-var(--tg-safe-area-inset-top)-45px)]">
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
      {/* <div className="absolute inset-0 flex z-[20] -mt-[8vh] fade-in justify-center items-center">
        <img
          src={assets.uxui.towerOn}
          alt="tower"
          className="max-w-full h-auto"
        />
      </div> */}
      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center w-full justify-center z-20">
        <div className="flex flex-col justify-between items-center w-full h-full pt-[3vh] pb-[3vh]">
          <img
            src="/assets/new/requiem.of.relics_off----.png"
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
          src={`${assets.audio.fofIntro}`}
          playing={true}
          preload={true}
          html5={true}
        />
      </div>
    </div>
  );
};

export default RoRLoader;
