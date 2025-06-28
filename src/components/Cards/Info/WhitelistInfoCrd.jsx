import React, { useContext } from "react";
import IconBtn from "../../Buttons/IconBtn";
import { mythSections } from "../../../utils/constants.fof";
import { FofContext } from "../../../context/context";

const SecretCard = ({ t, handleShowInfo, activeMyth }) => {
  const { assets, isTelegram, isTgMobile } = useContext(FofContext);
  return (
    <div
      onClick={() => {
        close();
      }}
      style={{
        backgroundImage: `url(${assets.uxui.bgInfo})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        top: 0,
        left: 0,
      }}
      className={`flex ${
        isTgMobile ? "h-[100%]" : "h-[100%]"
      } flex-col w-full rounded-[15px] items-center gap-4 card-shadow-black`}
    >
      <IconBtn
        isInfo={false}
        isFlip={true}
        activeMyth={activeMyth}
        handleClick={handleShowInfo}
        align={isTelegram ? 0 : 7}
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
        {t(`note.whitelist.desc`)}
      </div>
    </div>
  );
};

export default SecretCard;
