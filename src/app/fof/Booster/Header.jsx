import React, { useContext, useEffect, useState } from "react";
import { mythSections } from "../../../utils/constants.fof";
import Symbol from "../../../components/Common/Symbol";
import { useTranslation } from "react-i18next";
import { formatTwoNums } from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { FofContext } from "../../../context/context";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ activeMyth, showSymbol }) => {
  const { enableHaptic } = useContext(FofContext);
  const [showEffect, setShowEffect] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowEffect(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex cursor-pointer absolute justify-center w-full top-0 -mt-2 z-20">
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          showSymbol();
        }}
        className={`h-full flex justify-center items-center z-20 transition-all duration-500`}
      >
        <Symbol myth={mythSections[activeMyth]} isCard={2} />
      </div>
    </div>
  );
};

const BottomChild = ({ activeMyth, gameData }) => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full justify-center px-2 mt-1 top-0 absolute">
      <div className="flex relative w-full max-w-[720px] px-7">
        <div
          className={`flex relative border-${
            mythSections[activeMyth]
          }-primary  ${
            !gameData.isShardsClaimActive &&
            `glow-button-${mythSections[activeMyth]}`
          }  gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black-lg border w-full`}
        >
          <div
            className={`font-symbols absolute -ml-[2rem] text-iconLg text-black-lg-contour text-${mythSections[activeMyth]}-text`}
          >
            9
          </div>
          <div className="flex items-center text-primary font-medium pl-headSides">
            {formatTwoNums(gameData.shardslvl)}
          </div>
        </div>
        <div
          className={`flex relative justify-end ${
            gameData.isAutomataActive &&
            `glow-button-${mythSections[activeMyth]}`
          } border-${
            mythSections[activeMyth]
          }-primary gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black-lg border w-full`}
        >
          <div className="flex text-black-contour items-center text-primary font-medium pr-headSides">
            {gameData?.automatalvl
              ? formatTwoNums(gameData.automatalvl + 1)
              : 1}
          </div>

          <div
            className={`font-symbols absolute -mr-[2rem] text-iconLg text-black-contour  text-${mythSections[activeMyth]}-text`}
          >
            n
          </div>
        </div>
      </div>
      <div className="absolute flex text-white text-black-contour px-1 w-full mt-[4.5rem] font-fof text-tertiary uppercase">
        <div className={`mr-auto slide-in-out-left`}>
          {t(`boosters.${2}.title`)}
        </div>
        <div className={`ml-auto slide-in-out-right`}>
          {t(`boosters.${0}.title`)}
        </div>
      </div>
    </div>
  );
};

const BoosterHeader = ({ activeMyth, showSymbol, gameData }) => {
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
      <div className="flex flex-col gap-[5px] pt-headTop">
        <div
          className={`font-fof disappear w-full text-center mt-[7rem] absolute top-0 text-[4.5dvh]  glow-icon-${mythSections[activeMyth]} uppercase text-white drop-shadow z-50 text-black-contour`}
        >
          {t(`mythologies.${mythSections[activeMyth]}`)}
        </div>
        <BottomChild activeMyth={activeMyth} gameData={gameData} />
        <CenterChild activeMyth={activeMyth} showSymbol={showSymbol} />
      </div>
    </div>
  );
};

export default BoosterHeader;
