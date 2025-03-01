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
      className="transition-all duration-500 overflow-hidden relative"
      style={{
        background: `url(${assets.uxui.fofsplash}) no-repeat center / cover`,
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 55px)`,
        marginTop: "45px",
        marginBottom: "10px",
      }}
    >
      <div
        className={`flex flex-col h-full items-center justify-center z-[100]`}
      >
        <div
          className="absolute w-[110vw] fade-in"
          style={{
            height: `100svh`,
          }}
        >
          <img
            src={assets.uxui.towerOn}
            alt="tower"
            className="w-[110vw] mx-auto "
          />
        </div>
        <div className="absolute flex flex-col justify-between w-full items-center h-full pt-[3vh] pb-[3vh]">
          <img
            src="/assets/logos/forges.of.faith.vertical.svg"
            alt="dod"
            className="fof-text-shadow w-[180px]"
          />
          <div className="flex flex-col fade-in w-full">
            <div className="flex justify-center items-center w-full -mb-[1.85vh]">
              <LoadRoll />
            </div>
            <div className="relative inline-block mx-auto">
              <img
                src="/assets/buttons/button.orange.off.png"
                alt="Button"
                className="h-auto"
              />
              <span className="absolute inset-0 mt-[2px] flex text-black-contour items-center justify-center text-white opacity-80 font-fof font-semibold text-[6vw]">
                <div>LOADING</div>
              </span>
            </div>
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
