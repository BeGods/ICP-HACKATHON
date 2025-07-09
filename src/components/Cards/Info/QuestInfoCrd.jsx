import React, { useContext, useEffect, useState } from "react";
import IconBtn from "../../Buttons/IconBtn";
import { mythSections } from "../../../utils/constants.fof";
import { useTranslation } from "react-i18next";
import { FofContext } from "../../../context/context";

const InfoCard = ({ t, quest, handleShowInfo, activeMyth }) => {
  const { i18n } = useTranslation();
  const { assets, platform } = useContext(FofContext);

  return (
    <div
      style={{
        backgroundImage: `url(${assets.uxui.bgInfo})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        top: 0,
        left: 0,
      }}
      className="flex flex-col rounded-[15px] items-center gap-4 card-shadow-black h-full"
    >
      {platform === "ios" ? (
        <IconBtn
          isFlip={true}
          isInfo={false}
          activeMyth={activeMyth}
          handleClick={handleShowInfo}
          align={6}
        />
      ) : (
        <IconBtn
          isFlip={true}
          isInfo={false}
          activeMyth={activeMyth}
          handleClick={handleShowInfo}
          align={0}
        />
      )}
      <div className="flex w-full">
        <div className="flex flex-col leading-tight justify-center items-center flex-grow  text-card pt-[0.5dvh]">
          <div className="text-left">
            <h1 className="text-paperHead font-bold uppercase">
              {t("keywords.discover")}
            </h1>
            <h2 className={`-mt-1.5 text-paperSub font-medium uppercase`}>
              {t(`mythologies.${mythSections[activeMyth]}`)}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex -mt-[1.5dvh]">
        <img
          src={assets.questFrames?.[mythSections[activeMyth]]?.[quest?.type]}
          alt="info_painting"
          className="h-[18dvh] mx-auto card-shadow-black pointer-events-none"
        />
      </div>
      <div
        className={`leading-para text-para -mt-[5px] text-left mx-auto w-[93%] text-card font-[550] ${
          (i18n.language === "hi" ||
            i18n.language === "th" ||
            i18n.language === "ru") &&
          "font-normal"
        } ${i18n.language === "ru" && "leading-[2dvh]"}`}
      >
        {t(`quests.${mythSections[activeMyth]}.${quest.type}.desc`)}
      </div>
      <div className="absolute italic bottom-0 text-para mx-auto px-2 py-1 text-card">
        {t(`quests.${mythSections[activeMyth]}.${quest.type}.artist`)}
      </div>
    </div>
  );
};

export default InfoCard;
