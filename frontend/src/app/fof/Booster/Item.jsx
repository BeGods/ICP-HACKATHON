import React, { useContext, useRef, useState } from "react";
import { boosterIcon, mythSections } from "../../../utils/constants.fof";
import { FofContext } from "../../../context/context";
import { MoonStar } from "lucide-react";
import { getTimerContent } from "../../../helpers/booster.helper";

export const GradientMoonStar = ({ size = "14vw" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="multiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="18%" stop-color="#001aff" />
        <stop offset="32%" stop-color="#16ffd5" />
        <stop offset="48%" stop-color="#42ff00" />
        <stop offset="62%" stop-color="#ccff00" />
        <stop offset="78%" stop-color="#ffb800" />
        <stop offset="100%" stop-color="#ff0000" />
      </linearGradient>
    </defs>
    <MoonStar fill="url(#multiGradient)" size="100%" />
  </svg>
);

const BoosterItem = ({
  activeCard,
  isActive,
  handleClick,
  activeMyth,
  t,
  booster,
  isGuideActive,
  mythData,
}) => {
  const { gameData } = useContext(FofContext);
  const [isClicked, setIsClicked] = useState(false);
  const touchTimer = useRef(null);
  const myth = gameData?.mythologies?.[activeMyth];
  const boosterTextColor = `text-${mythSections[activeMyth]}-text`;

  const descAddOn = [
    "Max. 99",
    "+20%",
    "Max. 99",
    "Max. 99",
    "Max. 99",
    "Max. 99",
    "1000*n",
    "",
    "",
  ];

  const isBurstDisabled = booster === 6 && !myth?.isEligibleForBurst;

  const isMultiBooster = booster === 7 || booster === 8 || booster === 9;
  const showTimer = getTimerContent(
    activeCard,
    gameData,
    mythData,
    booster === 7 || booster === 8
  );

  return (
    <div
      onClick={handleClick}
      onTouchStart={() => {
        touchTimer.current = setTimeout(() => {
          setIsClicked(true);
        }, 200);
      }}
      onTouchEnd={() => {
        setIsClicked(false);
        clearTimeout(touchTimer.current);
      }}
      onTouchCancel={() => {
        setIsClicked(false);
        clearTimeout(touchTimer.current);
      }}
      className={`
        flex bg-glass-black-lg text-white items-center gap-x-2.5 
        border rounded-primary w-full cursor-pointer h-[4.65rem] px-4
        ${isBurstDisabled ? "grayscale" : ""}
        ${booster === 0 && isGuideActive ? "z-[60]" : ""}
        ${
          isMultiBooster
            ? "border-multiColor"
            : `border-${mythSections[activeMyth]}-primary`
        }
        ${
          isActive && isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
        }
      `}
    >
      <div
        className={`
          font-symbols text-[3rem]
          ${
            !isActive && booster !== 6 && booster !== 7 && booster !== 8
              ? `glow-icon-${mythSections[activeMyth]}`
              : ""
          }
          ${booster === 6 && !myth?.isEligibleForBurst ? "text-gray-400" : ""}
          ${booster === 7 || booster === 8 ? "gradient-multi" : ""}
          ${
            booster === 6 && myth?.isEligibleForBurst && !isActive
              ? `glow-icon-${mythSections[activeMyth]}`
              : ""
          }
        `}
      >
        {boosterIcon[booster]}
      </div>
      <div
        className={`flex flex-col flex-grow justify-center ${
          isBurstDisabled ? "text-gray-400" : ""
        }`}
      >
        <h1 className="text-tertiary uppercase">
          {t(`boosters.${booster}.title`)}
        </h1>
        <h2 className="text-tertiary flex gap-x-2">
          <span>{!showTimer && t(`boosters.${booster}.desc`)}</span>
          <span className={boosterTextColor}>
            {showTimer ?? descAddOn[booster]}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default BoosterItem;
