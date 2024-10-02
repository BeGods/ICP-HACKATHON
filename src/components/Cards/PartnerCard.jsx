import React, { useContext } from "react";

import IconButton from "../Buttons/IconButton";
import { useTranslation } from "react-i18next";
import { MyContext } from "../../context/context";

const PartnerCard = ({ close }) => {
  const { activeReward } = useContext(MyContext);
  const { i18n } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="relative w-[72%] rounded-lg shadow-lg card-shadow-white">
        <div className="relative w-full h-full text-card">
          <img
            src="/assets/cards/320px-info_background.jpg"
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
        <IconButton
          isInfo={false}
          activeMyth={4}
          handleClick={close}
          align={1}
        />
      </div>
    </div>
  );
};

export default PartnerCard;
