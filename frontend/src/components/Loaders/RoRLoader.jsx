import React, { useContext } from "react";
import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";
import ReactHowler from "react-howler";
import { MainContext } from "../../context/context";

const RoRLoader = (props) => {
  const { isTgMobile } = useContext(MainContext);

  return (
    <div
      className={`w-[100vw] relative ${
        isTgMobile ? "tg-container-height" : "browser-container-height"
      }`}
    >
      {/* img 1 */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: `url(${assets.locations.ror}) no-repeat center / cover`,
        }}
      ></div>
      {/* img 2 */}
      <div
        className="absolute inset-0 w-full h-full z-10"
        style={{
          background: `url(${assets.uxui.rorSplash}) no-repeat center / cover`,
        }}
      ></div>
      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center w-full justify-center z-20">
        <div className="flex flex-col justify-between items-center w-full h-full pt-[3vh] pb-[2vh]">
          <div>
            <img
              src={assets.logos.ror}
              alt="dod"
              className={` transition-all duration-300`}
            />
            <div className="flex justify-center text-white font-fof text-[2rem] glow-text-norse">
              BETA
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex justify-center fade-in items-center w-full -mb-[1.55vh]">
              <LoadRoll />
            </div>
            <div className="relative inline-block mx-auto">
              <img
                src={`${assets.buttons.blue.off}`}
                alt="Button"
                className="h-auto"
              />
              <span className="absolute inset-0 mt-[2px] flex text-black-contour items-center justify-center text-white opacity-80 font-fof font-semibold text-[1.75rem]">
                <div>LOADING</div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoRLoader;
