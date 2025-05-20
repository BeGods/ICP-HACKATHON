import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";
import { mythologies, mythSymbols } from "../../utils/constants";
import { MainContext } from "../../context/context";

const orbPos = [
  "mt-[45vw] mr-[32vw]",
  "-ml-[52vw] -mt-[17vw]",
  "-mt-[45vw] ml-[32vw]",
  "mt-[18vw] ml-[52vw]",
];

const Loader = (props) => {
  const { t } = useTranslation();
  const [dots, setDots] = useState(1);
  const { isTelegram } = useContext(MainContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`${
        isTelegram ? "tg-container-height" : "browser-container-height"
      }`}
      style={{
        background: `url(${assets.locations.fof})`,
        backgroundPosition: "50.5% 0%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: "100vw",
        top: 0,
        left: 0,
      }}
    >
      <div
        className={`absolute flex justify-center items-center w-full ${
          isTelegram ? "tg-container-height" : "browser-container-height"
        }`}
      >
        <div
          className="relative  flex justify-center items-center w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url(${assets.uxui.towerOn})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        {/* {mythologies.map((item, index) => (
          <div
            key={index}
            className={`absolute max-w-[10vw] transition-all duration-1000 z-50 pointer-events-auto ${orbPos[index]}`}
          >
            <div
              className={`flex relative transition-all duration-1000 text-center justify-center scale-orb-${item.toLowerCase()} items-center rounded-full `}
            >
              <img
                src={`${assets.uxui.baseOrb}`}
                alt="orb"
                className={`filter-orbs-${item.toLowerCase()}`}
              />
              <span
                className={`absolute text-symbol-sm z-1 font-symbols text-white opacity-50 mt-1 text-black-sm-contour`}
              >
                <>{mythSymbols[item.toLowerCase()]}</>{" "}
              </span>
            </div>
          </div>
        ))} */}
        <p
          className={`font-fof text-black-contour text-white text-center w-full top-[80%] absolute text-lg font-medium`}
        >
          ⚜️“For I walk by faith, not by sight”⚜️
        </p>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-center items-center w-full leading-tight">
          <div className="relative z-[100]">
            <img
              src={assets.logos.fof}
              alt="fof"
              className="w-[200px] mt-6 fof-text-shadow pointer-events-none"
            />
          </div>
        </div>

        <div className="flex flex-grow"></div>
        <div className="absolute fade-in w-screen bottom-2">
          <div className="flex justify-center w-full -mb-[1.5vh]">
            <LoadRoll />
          </div>
          <div className="w-full relative font-medium text-center font-fof text-secondary uppercase text-white">
            {t("keywords.load")}
            <span className="absolute">{`${".".repeat(dots)}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
