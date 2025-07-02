import React, { useContext, useEffect } from "react";
import { mythSections } from "../../../utils/constants.fof";
import { FofContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { useTranslation } from "react-i18next";

const MythInfoCard = ({ close }) => {
  const { t, i18n } = useTranslation();
  const { activeMyth, assets, setShowBack, section } = useContext(FofContext);

  useEffect(() => {
    setShowBack(section);

    return () => {
      setShowBack(null);
    };
  }, []);

  return (
    <div
      onClick={close}
      className="fixed inset-0 cursor-pointer bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50"
    >
      <div
        className={`relative card-width rounded-lg shadow-lg card-shadow-white`}
      >
        <div className="relative w-full h-full text-card">
          <img
            src={assets.uxui.bgInfo}
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
            className={`absolute leading-para text-para inset-0 w-[93%] mx-auto flex flex-col items-center justify-center font-[550] z-30 ${
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
