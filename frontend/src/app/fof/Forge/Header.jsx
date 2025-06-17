import React, { useContext, useEffect, useState } from "react";
import {
  elements,
  mythSections,
  mythSymbols,
} from "../../../utils/constants.fof";
import { FofContext } from "../../../context/context";
import { useTranslation } from "react-i18next";
import { formatThreeNums } from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const CenterChild = ({
  tapGlow,
  glowReward,
  showBlackOrb,
  activeMyth,
  orbGlow,
  platform,
  mythData,
  height,
  starIsHeld,
}) => {
  const { setSection, assets, enableHaptic } = useContext(FofContext);

  return (
    <div className="flex absolute justify-center w-full z-20 top-0">
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          setSection(4);
        }}
        className={`flex text-center justify-center h-symbol-primary w-symbol-primary overflow-hidden items-center rounded-full outline outline-${
          mythSections[activeMyth]
        }-primary transition-all duration-1000 ${
          orbGlow
            ? `glow-tap-${mythSections[activeMyth]} outline-[2px]`
            : `glow-icon-${mythSections[activeMyth]}`
        } ${tapGlow ? "scale-[115%] outline-[2px]" : ""} ${
          glowReward ? "scale-[115%] outline-[2px]" : ""
        }`}
      >
        <div
          className={`absolute h-symbol-primary w-symbol-primary overflow-hidden rounded-full outline outline-${mythSections[activeMyth]}-primary`}
        >
          <div
            style={{ height: `${height}%` }}
            className={`absolute bottom-0 opacity-35 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
          ></div>
        </div>
        <img
          src={assets.uxui.baseOrb}
          alt="base-orb"
          className={`filter-orbs-${mythSections[activeMyth]} w-full h-full`}
        />
        <div
          className={`z-1 flex justify-center items-start font-symbols ${
            mythData.disabled && "opacity-25"
          } ${
            glowReward
              ? `text-${mythSections[activeMyth]}-text`
              : showBlackOrb === 1
              ? "text-white"
              : "text-white"
          } text-[5rem] transition-all ${
            starIsHeld && "z-20"
          } duration-1000 myth-glow-greek text-black-icon-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
        >
          <div
            className={`${platform === "ios" ? "mt-[1rem]" : "mt-[1.25rem]"}`}
          >
            {mythSymbols[mythSections[activeMyth]]}
          </div>
        </div>
      </div>
    </div>
  );
};

const BottomChild = ({
  shards,
  orbs,
  activeMyth,
  glowShards,
  glowBooster,
  glowSymbol,
  showTut,
}) => {
  const [showEffect, setShowEffect] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (glowShards) {
      setShowEffect(true);
      setTimeout(() => {
        setShowEffect(false);
      }, 1000);
    }
  }, [glowShards, showEffect]);

  return (
    <div className="flex relative justify-center -mt-3 px-2">
      <div className="flex w-full max-w-[720px] px-7">
        <div
          className={`flex  relative ${
            showEffect &&
            `glow-button-${mythSections[activeMyth]} transition-all duration-1000`
          }  border-${
            mythSections[activeMyth]
          }-primary gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div
            className={`font-symbols text-black-lg-contour absolute -ml-[2rem] text-iconLg ${
              showTut == 0 && "tut-shake"
            } ${glowShards && `scale-125`}   text-${
              mythSections[activeMyth]
            }-text transition-all duration-500`}
          >
            l
          </div>
          <div className="text-primary text-black-contour font-medium pl-headSides">
            {formatThreeNums(shards)}
          </div>
        </div>
        <div
          className={`flex relative justify-end ${
            showEffect &&
            `glow-button-${mythSections[activeMyth]} transition-all duration-1000`
          }  border-${
            mythSections[activeMyth]
          }-primary gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="text-primary text-black-contour font-medium pr-headSides">
            {formatThreeNums(orbs)}
          </div>
          <div
            className={`font-symbols absolute -mr-[2rem] text-black-lg-contour text-iconLg ${
              (glowSymbol || glowBooster === 3) && `scale-125`
            } ${showTut == 1 && "tut-shake"} text-${
              mythSections[activeMyth]
            }-text transition-all duration-500`}
          >
            {mythSymbols[mythSections[activeMyth]]}
          </div>
        </div>
      </div>
      <div className="absolute flex text-white text-black-contour px-1 w-full mt-[4.5rem] font-fof text-[2dvh] uppercase">
        <div className={`mr-auto slide-in-out-left`}>
          {t(`keywords.shards`)}
        </div>
        <div className={`ml-auto slide-in-out-right`}>
          {" "}
          {t(`elements.${elements[activeMyth]}`)}
        </div>
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
  showTut,
  starIsHeld,
}) => {
  const { assets, section } = useContext(FofContext);
  const [changeText, setChangeText] = useState(true);
  const height = Math.min(
    100,
    Math.max(0, (mythData.energy / mythData.energyLimit) * 100)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-[5px] pt-headTop">
      <div
        className={`text-[1.5rem] opacity-50 absolute z-30 text-white-lg-contour font-semibold ${
          minimize == 1 && "rise-and-fade"
        } ${
          minimize == 2 && "drop-and-fade-in"
        } text-center top-0 text-black-lg-contour uppercase absolute inset-0 w-fit h-fit mx-auto`}
      >
        <h1 className="">
          {Math.floor(mythData.energy / 10)}
          <span className="text-[16px] font-bold">%</span>
        </h1>
      </div>
      <BottomChild
        shards={shards}
        orbs={orbs}
        activeMyth={activeMyth}
        glowShards={glowShards}
        showTut={showTut}
        glowBooster={glowBooster}
        glowSymbol={glowSymbol}
        minimize={minimize}
      />
      <CenterChild
        starIsHeld={starIsHeld}
        tapGlow={tapGlow}
        height={height}
        glowReward={glowReward}
        showBlackOrb={showBlackOrb}
        orbGlow={orbGlow}
        platform={platform}
        activeMyth={activeMyth}
        mythData={mythData}
      />
    </div>
  );
};

export default ForgeHeader;
