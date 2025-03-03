import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";

const FoFLoader = (props) => {
  return (
    <div
      className="w-[100vw] relative flex justify-center items-center"
      style={{
        background: `url(${assets.uxui.fofsplash}) no-repeat center / cover`,
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
      }}
    >
      <div className="absolute inset-0 flex -mt-[8vh] fade-in justify-center items-center">
        <img
          src={assets.uxui.towerOn}
          alt="tower"
          className="max-w-full h-auto"
        />
      </div>
      <div className="flex flex-col h-full items-center justify-center">
        <div className="absolute flex flex-col justify-between items-center w-full h-full py-[3vh]">
          <img
            src="/assets/logos/forges.of.faith.vertical.copper.svg"
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

{
  /* <div
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
</div> */
}
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
