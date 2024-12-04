import React, { useContext, useEffect, useState } from "react";
import { elements, mythSections, mythSymbols } from "../../utils/constants";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";
import { formatThreeNums } from "../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const CenterChild = ({
  height,
  tapGlow,
  glowReward,
  showBlackOrb,
  activeMyth,
  orbGlow,
  platform,
  mythData,
}) => {
  const { setSection, assets, enableHaptic } = useContext(MyContext);

  return (
    <div className="flex absolute justify-center w-full z-20 top-0 -mt-1">
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
          className={`absolute z-10 h-full w-[36vw] overflow-hidden rounded-full outline outline-${mythSections[activeMyth]}-primary`}
        >
          <div
            style={{ height: `${height}%` }}
            className={`absolute bottom-0 opacity-35 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
          ></div>
        </div>
        <img
          src={assets.uxui.baseorb}
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
          } text-[22vw] transition-all duration-1000 myth-glow-greek text-black-icon-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
        >
          <div className={`${platform === "ios" ? "-mt-1" : "mt-4"}`}>
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

  useEffect(() => {
    if (glowShards) {
      setShowEffect(true);
      setTimeout(() => {
        setShowEffect(false);
      }, 1000);
    }
  }, [glowShards, showEffect]);

  return (
    <div className="flex relative justify-center px-2 -mt-3">
      <div className="flex w-full px-7">
        <div
          className={`flex  ${
            showEffect &&
            `glow-button-${mythSections[activeMyth]} transition-all duration-1000`
          }  border-${
            mythSections[activeMyth]
          }-primary gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="text-primary font-medium pl-headSides">
            {formatThreeNums(shards)}
          </div>
        </div>
        <div
          className={`flex  justify-end ${
            showEffect &&
            `glow-button-${mythSections[activeMyth]} transition-all duration-1000`
          }  border-${
            mythSections[activeMyth]
          }-primary gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="text-primary font-medium pr-headSides">
            {formatThreeNums(orbs)}
          </div>
        </div>
      </div>
      <div className="flex justify-between absolute w-[98%] top-0 -mt-4">
        <div
          className={`font-symbols text-black-lg-contour text-iconLg ${
            showTut == 0 && "tut-shake"
          } ${glowShards && `scale-125`}   text-${
            mythSections[activeMyth]
          }-text transition-all duration-500`}
        >
          l
        </div>
        <div
          className={`font-symbols text-black-lg-contour text-iconLg ${
            (glowSymbol || glowBooster === 3) && `scale-125`
          } ${showTut == 1 && "tut-shake"} text-${
            mythSections[activeMyth]
          }-text transition-all duration-500`}
        >
          {mythSymbols[mythSections[activeMyth]]}
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
}) => {
  const height = Math.min(
    100,
    Math.max(0, (mythData.energy / mythData.energyLimit) * 100)
  );
  const [changeText, setChangeText] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-[5px] pt-[3.5vh]">
        <div
          className={`text-sectionHead ${minimize == 1 && "minimize-head"} ${
            minimize == 2 && "maximize-head"
          } ${
            changeText ? `text-white` : `text-${mythSections[activeMyth]}-text`
          } -mt-2.5 text-center top-0 text-black-lg-contour uppercase absolute inset-0 w-fit h-fit z-30 mx-auto`}
        >
          {changeText
            ? t("sections.forges")
            : t(`elements.${elements[activeMyth]}`)}
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
          height={height}
          tapGlow={tapGlow}
          glowReward={glowReward}
          showBlackOrb={showBlackOrb}
          orbGlow={orbGlow}
          platform={platform}
          activeMyth={activeMyth}
          mythData={mythData}
        />
      </div>
    </div>
  );
};

export default ForgeHeader;
