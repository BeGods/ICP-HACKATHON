import React, { useContext, useState } from "react";
import { boosterIcon, mythSections } from "../../../utils/constants";
import { MyContext } from "../../../context/context";

const BoosterItem = ({
  isActive,
  handleClick,
  activeMyth,
  t,
  booster,
  isGuideActive,
}) => {
  const { gameData } = useContext(MyContext);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      onClick={handleClick}
      className={`flex gap-1 border ${
        !gameData.mythologies[activeMyth].isEligibleForBurst &&
        booster === 6 &&
        "grayscale"
      } ${booster === 0 && isGuideActive && "z-[60]"} ${
        booster === 7
          ? "border-multiColor"
          : `border-${mythSections[activeMyth]}-primary`
      } text-white ${
        isActive && isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
      } rounded-primary h-[90px] w-full bg-glass-black p-[10px]`}
      onMouseDown={() => {
        setIsClicked(true);
      }}
      onMouseUp={() => {
        setIsClicked(false);
      }}
      onMouseLeave={() => {
        setIsClicked(false);
      }}
      onTouchStart={() => {
        setIsClicked(true);
      }}
      onTouchEnd={() => {
        setIsClicked(false);
      }}
      onTouchCancel={() => {
        setIsClicked(false);
      }}
    >
      <div>
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
          } ${booster === 7 && "gradient-multi"}  ${
            booster === 6 &&
            !gameData.mythologies[activeMyth].isEligibleForBurst &&
            `text-gray-400`
          } text-[55px] p-0 -mt-2 mr-2`}
        >
          {boosterIcon[booster]}
        </div>
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
              200%
            </span>
          )}
          <span className={`text-${mythSections[activeMyth]}-text pl-1`}>
            {booster != 6 && booster != 7 && booster != 1 && "Max. 99"}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default BoosterItem;
