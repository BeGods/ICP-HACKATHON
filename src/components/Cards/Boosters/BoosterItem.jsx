import React, { useContext, useRef, useState } from "react";
import { boosterIcon, mythSections } from "../../../utils/constants.fof";
import { FofContext } from "../../../context/context";
import { MoonStar } from "lucide-react";

export const GradientMoonStar = ({ size = "14vw" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Define the gradient */}
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
    {/* Render the MoonStar with the gradient */}
    <MoonStar fill="url(#multiGradient)" size="100%" />
  </svg>
);

const BoosterItem = ({
  isActive,
  handleClick,
  activeMyth,
  t,
  booster,
  isGuideActive,
}) => {
  const { gameData } = useContext(FofContext);
  const [isClicked, setIsClicked] = useState(false);
  const touchTimer = useRef(null);

  return (
    <div
      onClick={handleClick}
      className={`flex gap-1 border ${
        !gameData.mythologies[activeMyth].isEligibleForBurst &&
        booster === 6 &&
        "grayscale"
      } ${booster === 0 && isGuideActive && "z-[60]"} ${
        booster === 7 || booster === 8 || booster == 9
          ? "border-multiColor"
          : `border-${mythSections[activeMyth]}-primary`
      } text-white ${
        isActive && isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
      } rounded-primary h-[90px] w-full bg-glass-black p-[10px]`}
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
    >
      <div>
        {booster == 9 ? (
          <div
            className={`${
              isActive && `glow-icon-${mythSections[activeMyth]}`
            } mt-1 mr-2`}
          >
            <MoonStar fill="white" size={"14vw"} />
          </div>
        ) : (
          <div
            className={`font-symbols ${
              gameData.mythologies[activeMyth].isEligibleForBurst &&
              booster === 6 &&
              !isActive &&
              `glow-icon-${mythSections[activeMyth]}`
            } ${
              (!isActive || booster === 1) &&
              booster !== 7 &&
              booster !== 6 &&
              `glow-icon-${mythSections[activeMyth]}`
            } ${(booster === 7 || booster === 8) && "gradient-multi"}  ${
              booster === 6 &&
              !gameData.mythologies[activeMyth].isEligibleForBurst &&
              `text-gray-400`
            } text-[55px] p-0 -mt-2 mr-2`}
          >
            {boosterIcon[booster]}
          </div>
        )}
      </div>
      <div
        className={`flex flex-col ${
          !gameData.mythologies[activeMyth].isEligibleForBurst &&
          booster === 6 &&
          "text-gray-400"
        } flex-grow justify-center -ml-1`}
      >
        <h1 className="text-tertiary uppercase">
          {t(`boosters.${booster}.title`)}
        </h1>
        <h2 className="text-tertiary">
          {t(`boosters.${booster}.desc`)}{" "}
          {booster === 6 && (
            <span className={`text-${mythSections[activeMyth]}-text pl-1`}>
              1000*n
            </span>
          )}
          {booster === 1 && (
            <span className={`text-${mythSections[activeMyth]}-text pl-1`}>
              +20%
            </span>
          )}
          <span className={`text-${mythSections[activeMyth]}-text pl-1`}>
            {booster != 6 &&
              booster != 7 &&
              booster != 8 &&
              booster != 1 &&
              booster != 9 &&
              "Max. 99"}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default BoosterItem;
