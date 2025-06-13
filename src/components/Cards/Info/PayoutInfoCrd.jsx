import React, { useContext } from "react";
import { MainContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { useTranslation } from "react-i18next";

const PayoutInfoCard = ({ close, data }) => {
  const { t, i18n } = useTranslation();
  const { assets, isTelegram, userData } = useContext(MainContext);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="relative card-width rounded-lg shadow-lg card-shadow-white">
        <div className="relative w-full h-full text-card">
          <img
            src={assets.uxui.bgInfo}
            alt="info card background"
            className="w-full h-full object-cover rounded-primary z-10"
          />
        </div>

        <div className="absolute top-0 w-full flex flex-col justify-center leading-8 items-center text-center text-card text-paperHead font-bold mt-2 uppercase z-30">
          <div className="w-3/4">{data?.title}</div>
          <h2 className={`-mt-1 text-paperSub font-medium uppercase`}>
            {data?.amount} <span>{isTelegram ? "STAR" : "KAIA"}</span>
          </h2>
        </div>

        <div
          className={`absolute leading-[1.25rem] text-paperSub text-card inset-0 w-[85%] mx-auto flex flex-col justify-start pt-[50%] font-[550] z-30 ${
            (i18n.language === "hi" ||
              i18n.language === "th" ||
              i18n.language === "ru") &&
            "font-normal"
          }`}
        >
          <div className="flex flex-col gap-y-4">{data?.description}</div>
        </div>

        <div className="absolute w-full flex justify-center items-center bottom-0 gap-2 text-para mx-auto px-2 py-1 text-card">
          {data?.limit} <span>Left</span>
        </div>

        <IconBtn isInfo={false} activeMyth={4} handleClick={close} align={1} />
      </div>
    </div>
  );
};

export default PayoutInfoCard;
