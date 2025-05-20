import React from "react";
import assets from "../../../assets/assets.json";

const DoDIntro = (props) => {
  return (
    <div
      className="absolute ml-[150vw] top-0 bottom-0 left-0 w-screen h-full z-10"
      style={{
        background: `url(${assets.uxui.dodLoad}) no-repeat center / cover`,
        backgroundPosition: "45.75% 0%",
      }}
    >
      <div
        className={`flex  flex-col h-full items-center justify-center z-[100]`}
      >
        <div className="absolute flex flex-col justify-between items-center h-full pt-[0.5vh] pb-[3.5vh]">
          <img src={assets.logos.dod} alt="dod" className="dod-text-shadow" />
          <div className="flex flex-col gap-[2vh]">
            <div className={`flex justify-center items-center z-[100]`}>
              <img
                src={assets.logos.begodsBlack}
                alt="logo"
                className="w-[65px] begod-text-shadow pointer-events-none"
              />
            </div>
            <div className="relative inline-block">
              <h1 className="text-gold font-fof text-[1.75rem] text-black-contour">
                COMING SOON
              </h1>
              {/* <img
                src={
                  showGlow
                    ? `${assets.buttons.black.off}`
                    : `${assets.buttons.black.on}`
                }
                alt="Button"
                className="h-auto"
              />
              <span className="absolute inset-0 flex text-black-contour items-center justify-center opacity-80 text-white font-fof font-semibold text-[6vw]">
                PLAY
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoDIntro;
