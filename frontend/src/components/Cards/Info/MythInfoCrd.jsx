import React, { useContext } from "react";
import { mythSections } from "../../../utils/constants";
import { FofContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { useTranslation } from "react-i18next";

const MythInfoCard = ({ close }) => {
  const { t, i18n } = useTranslation();
  const { activeMyth, assets } = useContext(FofContext);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="relative w-[72%] rounded-lg shadow-lg card-shadow-white">
        <div className="relative w-full h-full text-card">
          <img
            src={assets.uxui.info}
            alt="info card background"
            className="w-full h-full object-cover rounded-primary z-10"
          />

          <div className="absolute inset-0 flex justify-center items-center z-20">
            <img
              src={assets.symbols[mythSections[activeMyth]]}
              alt="symbol"
              className="opacity-40 symbol-svg w-3/4"
            />
          </div>

          <div className="absolute top-0 w-full text-center text-paperHead font-bold mt-2 uppercase z-30">
            {t(`mythologies.${mythSections[activeMyth]}`)}
          </div>

          <div
            className={`absolute leading-[18px] text-para inset-0 w-[85%] mx-auto flex flex-col items-center justify-center font-[550] z-30 ${
              (i18n.language === "hi" ||
                i18n.language === "th" ||
                i18n.language === "ru") &&
              "font-normal"
            }`}
          >
            {t(`descriptions.${mythSections[activeMyth]}`)}
          </div>
        </div>

        <IconBtn isInfo={false} activeMyth={4} handleClick={close} align={1} />
      </div>
    </div>
  );
};

export default MythInfoCard;
