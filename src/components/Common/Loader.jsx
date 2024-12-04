import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";

const Loader = (props) => {
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
        background: `url(${assets.uxui.fofsplash})`,
        backgroundPosition: "50% 0%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div className="flex flex-col h-screen ">
        <div className="flex justify-center items-center w-full leading-tight">
          <div className="relative z-[100]">
            <img
              src={assets.logos.fof}
              alt="fof"
              className="w-[200px] mt-6 fof-text-shadow pointer-events-none"
            />
          </div>
        </div>
        <div className="absolute  scale-110">
          <img
            src={assets.uxui.tower}
            alt="tower"
            className="fof-text-shadow"
          />
        </div>
        <div className="flex flex-grow"></div>
        <div className="absolute fade-in w-screen bottom-0">
          <div className="flex justify-center w-full">
            <LoadRoll />
          </div>
          <div className="w-full font-medium text-center font-fof text-secondary uppercase text-white">
            {t("keywords.load")}
            {`${".".repeat(dots)}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

// <div
//   style={{
//     background: `url(${assets.uxui.fofsplash})`,
//     backgroundPosition: "50% 0%",
//     backgroundRepeat: "no-repeat",
//     backgroundSize: "cover",
//     height: "100vh",
//     width: "100vw",
//     position: "fixed",
//     top: 0,
//     left: 0,
//   }}
//   className="flex flex-col justify-center items-center h-screen w-screen"
// >
//   <div className="w-[75%] fade-in flex flex-col justify-between h-full scale-loader-gold-glow">
//     <img
//       src={assets.logos.begodsBlack}
//       alt="black-gods"
//       className="h-full w-full -mt-16"
//     />
//   </div>
//   <div className="absolute fade-in w-screen bottom-0">
//     <div className="flex justify-center w-full">
//       <LoadRoll />
//     </div>
//     <div className="w-full font-medium text-center font-fof text-secondary uppercase text-white">
//       {t("keywords.load")}...
//     </div>
//   </div>
// </div>
