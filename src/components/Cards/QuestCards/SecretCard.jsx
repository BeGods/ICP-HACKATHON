import React from "react";
import ShareButton from "../../Buttons/ShareButton";
import IconButton from "../../Buttons/IconButton";
import { mythSections } from "../../../utils/variables";

const SecretCard = ({
  t,
  quest,
  isShared,
  handleClaimShareReward,
  handleShowInfo,
  activeMyth,
}) => {
  return (
    <div className="fixed flex flex-col justify-center items-center inset-0 bg-black backdrop-blur-sm bg-opacity-60 z-50">
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
                {t("keywords.whitelist")}
              </h1>
            </div>
          </div>
        </div>
        <div className="leading-[18px] text-[16px] text-left mx-auto w-[85%] text-card font-[550]">
          {t(`quests.${mythSections[activeMyth]}.whitelist.desc`)}
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

export default SecretCard;
