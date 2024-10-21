import React, { useContext, useEffect, useState } from "react";
import { elements, mythSections, mythSymbols } from "../../utils/constants";
import { MyContext } from "../../context/context";
import Header from "../../components/Common/Header";
import { useTranslation } from "react-i18next";

const tele = window.Telegram?.WebApp;

const CenterChild = ({
  height,
  tapGlow,
  glowReward,
  showBlackOrb,
  activeMyth,
  orbGlow,
  platform,
}) => {
  const { setSection } = useContext(MyContext);

  return (
    <div
      onClick={() => {
        tele.HapticFeedback.notificationOccurred("success");
        setSection(4);
      }}
      className="flex absolute justify-center w-full z-20 mt-1"
    >
      <div
        className={`flex text-center justify-center h-[36vw] w-[36vw] overflow-hidden items-center rounded-full outline outline-${
          mythSections[activeMyth]
        }-primary transition-all duration-1000 ${
          orbGlow
            ? `glow-tap-${mythSections[activeMyth]} outline-[2px]`
            : `glow-icon-${mythSections[activeMyth]}`
        } ${tapGlow ? "scale-[125%] outline-[2px]" : ""} ${
          glowReward ? "scale-[125%] outline-[2px]" : ""
        }`}
      >
        <div
          className={`absolute z-10 h-full w-[36vw] overflow-hidden rounded-full outline outline-${mythSections[activeMyth]}-primary`}
        >
          <div
            style={{ height: `${height}%` }}
            className={`absolute bottom-0 opacity-20 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
          ></div>
        </div>
        <img
          src="/assets/uxui/240px-orb.base.png"
          alt="base-orb"
          className={`filter-orbs-${mythSections[activeMyth]} w-full h-full`}
        />
        <div
          className={`z-1 flex justify-center items-start font-symbols ${
            glowReward
              ? `text-${mythSections[activeMyth]}-text opacity-100`
              : showBlackOrb === 1
              ? "text-white opacity-100"
              : "text-white opacity-50"
          } text-[28vw] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
        >
          <div className={`${platform === "ios" ? "mt-1" : "mt-2"}`}>
            {mythSymbols[mythSections[activeMyth]]}
          </div>
        </div>
      </div>
    </div>
  );
};

const TopChild = ({
  activeMyth,
  glowShards,
  glowBooster,
  glowSymbol,
  minimize,
}) => {
  const [changeText, setChangeText] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute flex w-full justify-between top-0 z-50">
      <div
        className={`font-symbols ml-[8vw] text-black-md-contour ${
          glowShards && `scale-150`
        }  text-[12vw] transition-all duration-1000 text-${
          mythSections[activeMyth]
        }-text`}
      >
        l
      </div>
      <div
        className={`font-symbols mr-[8vw] text-black-lg-contour ${
          (glowSymbol || glowBooster === 3) && `scale-[150%]`
        } text-[12vw] transition-all duration-1000 text-${
          mythSections[activeMyth]
        }-text`}
      >
        {mythSymbols[mythSections[activeMyth]]}
      </div>
      <div
        className={`text-head -mt-1 text-center top-0 text-black-lg-contour uppercase absolute inset-0 w-fit h-fit  mx-auto ${
          changeText ? `text-white` : `text-${mythSections[activeMyth]}-text`
        } ${minimize === 1 && "minimize-head"} ${
          minimize === 2 && "maximize-head"
        }`}
      >
        {changeText
          ? t("sections.forges")
          : t(`elements.${elements[activeMyth]}`)}
      </div>
    </div>
  );
};
const BottomChild = ({ shards, orbs, activeMyth, glowShards }) => {
  const [showEffect, setShowEffect] = useState(false);
  //  bar-flipped

  useEffect(() => {
    if (glowShards) {
      setShowEffect(true);
      setTimeout(() => {
        setShowEffect(false);
      }, 1000);
    }
  }, [glowShards, showEffect]);

  return (
    <div className="flex justify-center -mt-[4vh] px-7 w-full">
      <div
        className={`flex ${
          showEffect &&
          `glow-button-${mythSections[activeMyth]} transition-all duration-1000`
        } text-num pl-3 text-black-lg-contour text-white items-center border border-${
          mythSections[activeMyth]
        }-primary justify-start h-button-primary w-full bg-black z-10 rounded-primary transform skew-x-[18deg]`}
      >
        {shards}
      </div>
      <div
        className={`flex ${
          showEffect &&
          `glow-button-${mythSections[activeMyth]} transition-all duration-1000`
        } text-num pr-3 text-black-lg-contour text-white items-center border border-${
          mythSections[activeMyth]
        }-primary justify-end h-button-primary w-full bg-black z-10 rounded-primary transform -skew-x-[18deg]`}
      >
        {orbs}
      </div>
    </div>
  );
};

const ForgeHeader = ({
  activeMyth,
  shards,
  orbs,
  orbGlow,
  tapGlow,
  glowReward,
  mythData,
  platform,
  showBlackOrb,
  glowShards,
  glowSymbol,
  glowBooster,
  minimize,
}) => {
  const height = Math.min(
    100,
    Math.max(0, (mythData.energy / mythData.energyLimit) * 100)
  );

  return (
    <Header
      TopChild={
        <TopChild
          glowBooster={glowBooster}
          glowSymbol={glowSymbol}
          shards={shards}
          activeMyth={activeMyth}
          glowShards={glowShards}
          minimize={minimize}
        />
      }
      CenterChild={
        <CenterChild
          height={height}
          tapGlow={tapGlow}
          glowReward={glowReward}
          showBlackOrb={showBlackOrb}
          orbGlow={orbGlow}
          platform={platform}
          activeMyth={activeMyth}
        />
      }
      BottomChild={
        <BottomChild
          shards={shards}
          orbs={orbs}
          activeMyth={activeMyth}
          glowShards={glowShards}
        />
      }
    />
  );
};

export default ForgeHeader;
