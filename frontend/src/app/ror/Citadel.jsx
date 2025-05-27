import React, { useContext } from "react";
import { RorContext } from "../../context/context";
import CitadelCarousel from "../../components/Carousel/CitadelCarousel";
import RoRHeader from "../../components/Layouts/Header";
import ReactHowler from "react-howler";

const CenterChild = ({ gameData, assets }) => {
  return (
    <div
      className={`
            flex cursor-pointer justify-center items-center absolute w-[8rem] rounded-full text-white text-[5rem] top-0 z-20 left-1/2 -translate-x-1/2`}
    >
      <img
        src={assets.uxui.citadelHead}
        alt="base-orb"
        className={`w-full h-full rounded-full pointer-events-none`}
      />
      <div className="absolute flex justify-center items-center inset-0 text-[3rem] text-black-contour">
        {gameData.stats.dailyQuota ?? 0}
      </div>
    </div>
  );
};

const Citadel = (props) => {
  const { isTgMobile, gameData, assets, enableSound } = useContext(RorContext);

  return (
    <div
      className={`flex flex-col ${
        isTgMobile ? "tg-container-height" : "browser-container-height"
      } overflow-hidden m-0`}
    >
      <RoRHeader
        CenterChild={<CenterChild assets={assets} gameData={gameData} />}
      />
      <div className="flex flex-col justify-center items-center absolute h-full w-full bottom-0 px-2.5">
        <div className="flex w-[75%] min-h-[60vh] flex-col">
          <CitadelCarousel />
        </div>
        <div className="absolute top-0 right-0 mt-[34vw] mr-[16vw]">
          {gameData.stats.isThiefActive && (
            <div
              className={`text-[50px] ${
                gameData.stats.showThief && "glow-thief scale-point"
              } font-symbols text-black-contour text-white `}
            >
              m
            </div>
          )}
        </div>
      </div>

      <div className="absolute">
        <ReactHowler
          src={`${assets.audio["location.citadel"]}`}
          playing={enableSound}
          preload={true}
          loop
        />
      </div>
    </div>
  );
};

export default Citadel;
