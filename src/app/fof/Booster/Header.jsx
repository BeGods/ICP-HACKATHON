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
    <div className="flex absolute justify-center w-full top-0 z-20">
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          showSymbol();
        }}
        className={`h-full z-20 transition-all duration-500 ${
          showEffect && "pulse-text"
        }`}
      >
        <Symbol myth={mythSections[activeMyth]} isCard={2} />
      </div>
    </div>
  );
};

const BottomChild = ({ activeMyth, gameData }) => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full justify-center px-2 mt-4 top-0 absolute">
      <div className="flex relative w-full px-7">
        <div
          className={`flex border-${mythSections[activeMyth]}-primary  ${
            !gameData.isShardsClaimActive &&
            `glow-button-${mythSections[activeMyth]}`
          }  gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="flex items-center text-primary font-medium pl-headSides">
            <span className="font-roboto text-black-contour font-normal text-[6vw] pr-1">
              x
            </span>

            {formatTwoNums(gameData.shardslvl)}
          </div>
        </div>
        <div
          className={`flex justify-end ${
            gameData.isAutomataActive &&
            `glow-button-${mythSections[activeMyth]}`
          } border-${
            mythSections[activeMyth]
          }-primary gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="flex text-black-contour items-center text-primary font-medium pr-headSides">
            {formatTwoNums(gameData.automatalvl + 1)}{" "}
            <span className="font-roboto font-normal text-[6vw] pl-1">x</span>
          </div>
        </div>
      </div>
      <div className="flex text-white justify-between absolute w-[98%] top-0 -mt-4">
        <div
          className={`font-symbols  text-iconLg text-black-lg-contour text-${mythSections[activeMyth]}-text`}
        >
          9
        </div>
        <div
          className={`font-symbols text-iconLg text-black-contour  text-${mythSections[activeMyth]}-text`}
        >
          n
        </div>
      </div>
      <div className="absolute flex text-white text-black-contour px-1 w-full mt-[9vh] font-fof text-[17px] uppercase">
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
      <div className="flex flex-col gap-[5px] pt-[3.5vh]">
        {/* <div
          className={`text-sectionHead ${
            changeText ? `text-white` : `text-${mythSections[activeMyth]}-text`
          } -mt-2.5 text-center top-0 text-black-lg-contour uppercase absolute inset-0 w-fit h-fit z-30 mx-auto`}
        >
          {changeText
            ? t("sections.boosters")
            : t(`mythologies.${mythSections[activeMyth]}`)}
        </div> */}
        <BottomChild activeMyth={activeMyth} gameData={gameData} />
        <CenterChild activeMyth={activeMyth} showSymbol={showSymbol} />
      </div>
    </div>
  );
};

export default BoosterHeader;
