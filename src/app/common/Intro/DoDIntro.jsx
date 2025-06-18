import React, { useEffect } from "react";
import assets from "../../../assets/assets.json";
import { useOpenAd } from "../../../hooks/DappAds";

const DoDIntro = (props) => {
  const zoneId = import.meta.env.VITE_LMA_ZONE;
  const publisherId = import.meta.env.VITE_PUBLISHER_ID;
  const userId = "tanmay";
  const displayName = "tanmay";

  const callReward = () => {
    try {
      console.log("claimed");
    } catch (error) {}
  };

  const { loadAd, showAd, isReady, adStatus } = useOpenAd({
    zoneId,
    publisherId,
    displayName,
    callReward,
  });

  useEffect(() => {
    loadAd();
  }, [loadAd]);

  useEffect(() => {
    if (isReady) {
      showAd();
    }
  }, [isReady]);

  return (
    <div
      draggable={false}
      className="absolute ml-[150vw] top-0 bottom-0 left-0 w-screen h-full z-10"
      style={{
        background: `url(${assets.uxui.dodLoad}) no-repeat center / cover`,
        backgroundPosition: "45.75% 0%",
      }}
    >
      <div
        className={`flex  flex-col h-full items-center justify-center z-[100]`}
      >
        <div className="absolute flex flex-col justify-between items-center h-full pt-[0.5dvh] pb-[3.5dvh]">
          <img
            draggable={false}
            src={assets.logos.dod}
            alt="dod"
            className="dod-text-shadow"
          />
          <div className="flex flex-col gap-[2vh]">
            <div className={`flex justify-center items-center z-[100]`}>
              <img
                draggable={false}
                src={assets.logos.begodsBlack}
                alt="logo"
                className="w-[65px] begod-text-shadow pointer-events-none"
              />
            </div>
            <div className="relative inline-block">
              <button
                onClick={showAd}
                disabled={!isReady}
                className={`px-6 py-2 rounded-lg text-white ${
                  isReady
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isReady
                  ? "Watch Ad to Get Reward"
                  : adStatus === "notAvailable"
                  ? "Ad Not Available"
                  : "Loading Ad..."}
              </button>

              <p className="text-sm text-gray-300 mt-2">
                {adStatus === "error" && (
                  <p className="text-red-500 text-sm mt-2">
                    Failed to load ad. Try again later.
                  </p>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoDIntro;

{
  /* <h1 className="text-gold font-fof text-[1.75rem] text-black-contour">
                COMING SOON
              </h1> */
}
{
  /* <img
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
              </span> */
}
