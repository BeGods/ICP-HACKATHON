import React from "react";
import { useTranslation } from "react-i18next";
import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";

const Loader = (props) => {
  const { t } = useTranslation();
  return (
    <div className="bg-black flex flex-col justify-center items-center h-screen w-screen">
      <div className="w-[75%] flex flex-col justify-between h-full mb-4 scale-loader-gold-glow">
        <img
          src={assets.logos.begodsBlack}
          alt="black-gods"
          className="h-full w-full"
        />
      </div>
      <div className="flex justify-center w-full">
        <LoadRoll />
      </div>
      <div className="w-full text-center font-fof text-secondary uppercase text-white">
        {t("keywords.load")}...
      </div>
    </div>
  );
};

export default Loader;
