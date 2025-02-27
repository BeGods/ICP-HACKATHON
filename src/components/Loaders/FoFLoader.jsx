import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";
import { mythologies, mythSymbols } from "../../utils/constants.fof";

const orbPos = [
  "mt-[45vw] mr-[32vw]",
  "-ml-[52vw] -mt-[17vw]",
  "-mt-[45vw] ml-[32vw]",
  "mt-[18vw] ml-[52vw]",
];

const FoFLoader = (props) => {
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
        background: `url(${assets.uxui.fofsplash}) no-repeat center / cover`,
        backgroundPosition: "50% 10%",
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 55px)`,
        marginTopTop: "45px",
        marginBottom: "10px",
      }}
      className="flex  flex-col items-center justify-center"
    >
      <div
        className="absolute w-[110vw]"
        style={{
          height: `100svh`,
        }}
      >
        <img
          src={assets.uxui.towerOn}
          alt="tower"
          className="w-[110vw] mx-auto"
        />
      </div>
      <p
        className={`font-fof text-black-contour fade-in text-white text-center w-full top-[73%] absolute text-[5.4vw] font-medium`}
      >
        ⚜️“For I walk by faith, not by sight”⚜️
      </p>
      <div className="absolute flex flex-col justify-between items-center h-full pt-[3vh] pb-[3vh]">
        <div className="flex justify-center items-center w-full leading-tight">
          <img
            src="/assets/logos/forges.of.faith.vertical.svg"
            alt="dod"
            className="fof-text-shadow w-[180px]"
          />
        </div>
        <div className="flex flex-grow"></div>
        <div className="w-screen fade-in">
          <div className="flex justify-center items-center w-full">
            <LoadRoll />
          </div>
          <div className="w-full relative font-medium text-center font-fof text-secondary uppercase text-white">
            {t("keywords.load")}
            <span className="absolute">{`${".".repeat(dots)}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoFLoader;
// {
//   mythologies.map((item, index) => (
//     <div
//       key={index}
//       className={`absolute max-w-[10vw] transition-all duration-1000 z-50 pointer-events-auto ${orbPos[index]}`}
//     >
//       <div
//         className={`flex relative transition-all duration-1000 text-center justify-center scale-orb-${item.toLowerCase()} items-center rounded-full `}
//       >
//         <img
//           src={`${assets.uxui.baseorb}`}
//           alt="orb"
//           className={`filter-orbs-${item.toLowerCase()}`}
//         />
//         <span
//           className={`absolute text-symbol-sm z-1 font-symbols text-white opacity-50 mt-1 text-black-sm-contour`}
//         >
//           <>{mythSymbols[item.toLowerCase()]}</>{" "}
//         </span>
//       </div>
//     </div>
//   ));
// }
