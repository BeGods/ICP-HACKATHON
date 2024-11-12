import React, { useContext } from "react";

import IconBtn from "../../Buttons/IconBtn";
import { useTranslation } from "react-i18next";
import { MyContext } from "../../../context/context";

const PartnerCard = ({ close }) => {
  const { activeReward, assets, platform } = useContext(MyContext);
  const { i18n } = useTranslation();

  return (
    <div
      onClick={() => {
        close();
      }}
      style={{
        backgroundImage: `url(${assets.uxui.basebg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        top: 0,
        left: 0,
      }}
      className="flex flex-col rounded-[15px] items-center gap-4 card-shadow-black h-full"
    >
      <div className="relative w-full h-full text-card">
        <img
          src={assets.uxui.info}
          alt="info card background"
          className="w-full h-full object-cover rounded-primary"
        />
        <div className="absolute text-card top-0 w-full text-center text-[28px] font-bold mt-2 uppercase">
          {activeReward.name}
        </div>
        <div
          className={`absolute leading-[18px] text-[16px] inset-0 w-[85%] mx-auto flex flex-col items-center justify-center font-[550] ${
            (i18n.language === "hi" ||
              i18n.language === "th" ||
              i18n.language === "ru") &&
            "font-normal"
          }`}
        >
          {activeReward.description} <br /> <br />{" "}
          {activeReward.metadata.campaignDetails}
        </div>
      </div>
      {platform === "ios" ? (
        <IconBtn isInfo={false} activeMyth={4} handleClick={close} align={6} />
      ) : (
        <IconBtn isInfo={false} activeMyth={4} handleClick={close} align={0} />
      )}
    </div>
  );
};

export default PartnerCard;
