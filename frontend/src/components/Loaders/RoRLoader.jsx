import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";

const RoRLoader = (props) => {
  const { t } = useTranslation();
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: `url(${assets.uxui.rorspash})`,
        backgroundPosition: "50.5% 0%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
        top: 0,
        left: 0,
      }}
    >
      <div className="flex flex-col h-screen">
        <div className="flex justify-center items-center w-full leading-tight">
          <div className="relative z-[100]">
            <img
              src={assets.logos.ror}
              alt="fof"
              className="w-[300px] mt-2 fof-text-shadow pointer-events-none"
            />
          </div>
        </div>

        <div className="flex flex-grow"></div>
        <div className="absolute fade-in w-screen bottom-0">
          <div className="flex justify-center w-full">
            <LoadRoll />
          </div>
          <div className="w-full relative font-medium text-center font-fof text-secondary uppercase text-black">
            {t("keywords.load")}
            <span className="absolute">{`${".".repeat(dots)}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoRLoader;
