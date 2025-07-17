import React, { useContext, useEffect } from "react";
import { RorContext } from "../../../context/context";
import CitadelCarousel from "./CitadelCarousel";
import ReactHowler from "react-howler";
import { useProfileGuide } from "../../../hooks/Tutorial";

const CenterChild = ({ gameData, assets }) => {
  return (
    <div className="flex cursor-pointer justify-center items-center absolute w-[8rem] h-[8rem] shadow-lg rounded-full text-white text-[5rem] top-0 z-20 left-1/2 -translate-x-1/2">
      <div className="relative w-full h-full">
        <img
          src={assets.uxui.sundial}
          alt="sundial"
          className={`absolute ${
            gameData.stats.dailyQuota < 4 && "grayscale"
          } z-30 w-auto h-auto max-w-full max-h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
        />

        <img
          src={
            assets.items[
              `amulet.${gameData.stats.dailyQuota < 4 ? "moon" : "sun"}`
            ]
          }
          alt="amulet"
          className="w-full h-full rounded-full shadow-2xl pointer-events-none z-40 relative"
        />

        <div className="absolute z-40 flex justify-center items-center inset-0 text-[5rem] text-black-contour">
          {gameData.stats.dailyQuota ?? 0}
        </div>
      </div>
      <div className="absolute top-0 mt-[7rem] w-full flex text-center leading-6 justify-center z-[60] text-[1.25rem] uppercase glow-text-black font-bold text-white">
        turns
      </div>
    </div>
  );
};

const Citadel = (props) => {
  const { isTgMobile, gameData, assets, enableSound, setShowCard } =
    useContext(RorContext);
  const [enableGuide, setEnableGuide] = useProfileGuide("ror-tutorial01");

  useEffect(() => {
    // setShowCard(
    //   <CitadelGuide
    //     handleClick={() => {
    //       setShowCard(null);
    //     }}
    //   />
    // );
  }, [enableGuide]);

  return (
    <div
      className={`flex flex-col ${
        isTgMobile ? "tg-container-height" : "browser-container-height"
      } overflow-hidden m-0`}
    >
      <CenterChild assets={assets} gameData={gameData} />
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
