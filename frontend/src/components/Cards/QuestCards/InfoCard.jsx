import React from "react";
import ShareButton from "../../Buttons/ShareButton";
import IconButton from "../../Buttons/IconButton";
import { mythSections } from "../../../utils/variables";

const InfoCard = ({
  t,
  quest,
  isShared,
  handleClaimShareReward,
  handleShowInfo,
  activeMyth,
}) => {
  return (
    <div className="fixed flex flex-col justify-center items-center inset-0 bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
      <div
        style={{
          backgroundImage: `url(/assets/cards/320px-info_background.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",

          top: 0,
          left: 0,
        }}
        className="flex flex-col  rounded-[15px] items-center gap-4 w-[72%] h-[55%] mt-[73px] card-shadow-white"
      >
        <IconButton
          isInfo={false}
          activeMyth={activeMyth}
          handleClick={handleShowInfo}
          align={0}
        />
        <div className="flex w-full">
          <div className="flex flex-col leading-tight justify-center items-center flex-grow  text-card pt-[10px]">
            <div className="text-left">
              <h1 className="text-[28px] font-bold uppercase">
                {t("keywords.discover")}
              </h1>
              <h2 className="-mt-1 text-tertiary font-medium uppercase">
                {t(`mythologies.${mythSections[activeMyth]}`)}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex -mt-[5px]">
          <img
            src={`/assets/cards/188px-${mythSections[activeMyth]}.quest.${quest?.type}_info_painting.jpg`}
            alt="info_painting"
            className="w-[82%] mx-auto card-shadow-black"
          />
        </div>
        <div className="leading-[18px] text-[16px] -mt-[5px] text-left mx-auto w-[85%] text-card font-[550]">
          {t(`quests.${mythSections[activeMyth]}.${quest.type}.desc`)}
        </div>
      </div>
      <ShareButton
        isShared={isShared}
        isInfo={true}
        handleClaim={handleClaimShareReward}
        activeMyth={activeMyth}
        t={t}
      />
    </div>
  );
};

export default InfoCard;
