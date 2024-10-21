import Lottie from "lottie-react";
import React from "react";
import animationData from "../../../public/assets/fx/loader.json";
import { useTranslation } from "react-i18next";

const Loader = (props) => {
  const { t } = useTranslation();
  return (
    <div className="bg-black flex flex-col justify-center items-center h-screen w-screen">
      <div className="w-[75%] flex flex-col justify-between h-full mb-4 scale-loader-gold-glow">
        <img
          src="/assets/logos/battle.gods.black.svg"
          alt="black-gods"
          className="h-full w-full"
        />
        <div>
          <Lottie
            autoplay
            loop
            animationData={animationData}
            className="w-full h-full"
          />
        </div>
        <div className="w-full text-center font-fof text-secondary uppercase text-white">
          {t("keywords.load")}...
        </div>
      </div>
    </div>
  );
};

export default Loader;
