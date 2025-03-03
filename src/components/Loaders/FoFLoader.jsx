import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";
import ReactHowler from "react-howler";

const FoFLoader = (props) => {
  return (
    <div
      className="w-[100vw] relative flex justify-center items-center"
      style={{
        background: `url(${assets.uxui.fofsplash}) no-repeat center / cover`,
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
      }}
    >
      <div className="absolute inset-0 flex -mt-[8vh] fade-in justify-center items-center">
        <img
          src={assets.uxui.towerOn}
          alt="tower"
          className="max-w-full h-auto"
        />
      </div>
      <div className="flex flex-col h-full items-center justify-center">
        <div className="absolute flex flex-col justify-between items-center w-full h-full py-[3vh]">
          <img
            src="/assets/logos/forges.of.faith.vertical.copper.svg"
            alt="dod"
            className="fof-text-shadow w-[180px]"
          />
          <div className="flex flex-col w-full">
            <div className="flex justify-center fade-in items-center w-full -mb-[1.85vh]">
              <LoadRoll />
            </div>
            <div className="relative inline-block mx-auto">
              <img
                src="/assets/buttons/button.orange.off.png"
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

export default FoFLoader;
