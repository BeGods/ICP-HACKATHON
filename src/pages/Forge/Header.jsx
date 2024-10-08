import React, { useContext } from "react";
import { mythSections, mythSymbols } from "../../utils/variables";
import { MyContext } from "../../context/context";

const tele = window.Telegram?.WebApp;

const ForgeHeader = ({
  activeMyth,
  shards,
  orbs,
  orbGlow,
  tapGlow,
  glowReward,
  glowSymbol,
  glowShards,
  mythData,
  platform,
  showBlackOrb,
  glowBooster,
}) => {
  const { setSection } = useContext(MyContext);
  const height = Math.min(
    100,
    Math.max(0, (mythData.energy / mythData.energyLimit) * 100)
  );

  return (
    <div className="flex justify-between relative w-full">
      <div
        className={`text-head -mt-2 mx-auto  w-full text-center top-0 absolute z-30 text-white text-black-lg-contour uppercase`}
      >
        Forge
      </div>
      {/* Left */}
      <div className="flex flex-col justify-center h-full px-2">
        <div className="flex flex-col leading-[45px] mb-4 justify-start ml-1 items-center text-black-contour w-fit h-fit">
          <div className={`text-num transition-all duration-1000 text-white`}>
            {shards}
          </div>
          <div
            className={`font-symbols pt-3 ${
              glowShards && `scale-[150%]`
            }  text-[50px] transition-all duration-1000 text-${
              mythSections[activeMyth]
            }-text`}
          >
            l
          </div>
        </div>
      </div>
      {/* Orb */}
      <div
        onClick={() => {
          tele.HapticFeedback.notificationOccurred("success");
          setSection(6);
        }}
        className="flex absolute justify-center w-full z-20"
      >
        <div
          className={`flex text-center justify-center h-[36vw] w-[36vw] mt-0.5 overflow-hidden items-center rounded-full outline outline-${
            mythSections[activeMyth]
          }-primary transition-all duration-1000 ${
            orbGlow
              ? `glow-tap-${mythSections[activeMyth]} outline-[2px] `
              : `glow-icon-${mythSections[activeMyth]}`
          } ${tapGlow && "scale-[125%] outline-[2px]"} ${
            glowReward && "scale-[125%] outline-[2px]"
          } `}
        >
          {" "}
          <div
            className={`absolute z-10 h-full w-[36vw] overflow-hidden rounded-full  outline outline-${mythSections[activeMyth]}-primary`}
          >
            <div
              style={{
                height: `${height}%`,
              }}
              className={`absolute bottom-0  opacity-20 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
            ></div>
          </div>
          <img
            src="/assets/uxui/240px-orb.base.png"
            alt="base-orb"
            className={`filter-orbs-${mythSections[activeMyth]} w-full h-full`}
          />
          <div></div>
          <div
            className={`z-1  flex justify-center items-start  font-symbols  ${
              glowReward
                ? ` text-${mythSections[activeMyth]}-text opacity-100`
                : showBlackOrb === 1
                ? "text-white opacity-100"
                : "text-white opacity-50"
            }  text-[28vw] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
          >
            <div className={`${platform === "ios" ? "mt-1" : "mt-2"}`}>
              {mythSymbols[mythSections[activeMyth]]}
            </div>
          </div>
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-col justify-center h-full px-2">
        <div className="flex flex-col leading-[45px] mb-4 items-center text-black-contour w-fit h-fit">
          <div className={`text-num transition-all duration-1000 text-white`}>
            {orbs}
          </div>
          <div
            className={`font-symbols pt-3 ${
              (glowSymbol || glowBooster === 3) && `scale-[150%]`
            } text-[50px] transition-all duration-1000 text-${
              mythSections[activeMyth]
            }-text`}
          >
            {mythSymbols[mythSections[activeMyth]]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgeHeader;
