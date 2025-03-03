import React from "react";
import assets from "../../../assets/assets.json";
import { useNavigate } from "react-router-dom";

const FoFIntro = ({ handleFadeout, fadeout }) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-[200vw]"
      style={{
        background: `url(${assets.uxui.fofsplash}) no-repeat center / cover`,
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
      }}
    >
      <div
        className={`flex flex-col h-full items-center justify-center z-[100]`}
      >
        <div className="absolute flex flex-col justify-between items-center h-full py-[3vh]">
          <img
            src="/assets/logos/forges.of.faith.vertical.copper.svg"
            alt="dod"
            className="fof-text-shadow w-[180px]"
          />
          <div className={`flex  ${fadeout && "fade-out"}  flex-col gap-[2vh]`}>
            <div className={`flex justify-center items-center z-[100]`}>
              <img
                src={assets.logos.begodsBlack}
                alt="logo"
                className="w-[65px] begod-orange-shadow pointer-events-none"
              />
            </div>
            <div
              onClick={() => {
                handleFadeout();
                setTimeout(() => {
                  navigate("/fof");
                }, 2000);
              }}
              className="relative inline-block"
            >
              <img
                src="/assets/buttons/button.orange.off.png"
                alt="Button"
                className="h-auto"
              />
              <span className="absolute inset-0 flex text-black-contour items-center justify-center text-white opacity-80 font-fof font-semibold mt-[2px] text-[6vw]">
                PLAY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoFIntro;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { mythologies, mythSymbols } from "../../../utils/constants.fof";
// import assets from "../../../assets/assets.json";

// const orbPos = [
//   "mt-[45vw] mr-[32vw]",
//   "-ml-[52vw] -mt-[17vw]",
//   "-mt-[45vw] ml-[32vw]",
//   "mt-[18vw] ml-[52vw]",
// ];

// const FoFIntro = () => {
//   const navigate = useNavigate();
//   const [fadeout, setFadeout] = useState(false);

//   useEffect(() => {
//     setTimeout(() => {
//       setFadeout(true);
//       setTimeout(() => {
//         navigate("/fof");
//       }, 200);
//     }, 2000);
//   }, []);

//   return (
//     <div
//       style={{
//         background: `url(${assets.uxui.intro})`,
//         backgroundPosition: "50.5% 0%",
//         backgroundRepeat: "no-repeat",
//         backgroundSize: "cover",
//         height: "100svh",
//         width: "100vw",
//         position: "fixed",
//         top: 0,
//         left: 0,
//       }}
//     >
//       <div className="absolute  fade-in-intro scale-110 flex justify-center items-center h-full w-full">
//         <div
//           className="relative flex justify-center items-center w-full h-full pointer-events-none"
//           style={{
//             backgroundImage: `url(${assets.uxui.towerOn})`,
//             backgroundSize: "contain",
//             backgroundPosition: "center",
//             backgroundRepeat: "no-repeat",
//           }}
//         ></div>
//         {mythologies.map((item, index) => (
//           <div
//             key={index}
//             className={`absolute max-w-[10vw] transition-all duration-1000 z-50 pointer-events-auto ${orbPos[index]}`}
//           >
//             <div
//               className={`flex relative transition-all duration-1000 text-center justify-center scale-orb-${item.toLowerCase()} items-center rounded-full `}
//             >
//               <img
//                 src={`${assets.uxui.baseorb}`}
//                 alt="orb"
//                 className={`filter-orbs-${item.toLowerCase()}`}
//               />
//               <span
//                 className={`absolute text-symbol-sm z-1 font-symbols text-white opacity-50 mt-1 text-black-sm-contour`}
//               >
//                 <>{mythSymbols[item.toLowerCase()]}</>{" "}
//               </span>
//             </div>
//           </div>
//         ))}
//         <p
//           className={`font-fof text-black-contour fade-in-intro text-white text-center w-full top-[75%] absolute text-lg font-medium`}
//         >
//           ⚜️“For I walk by faith, not by sight”⚜️
//         </p>
//       </div>
//       <div className="flex flex-col h-screen">
//         <div className="flex justify-center items-center w-full leading-tight">
//           <div className="relative z-[100]">
//             <img
//               src={assets.logos.fof}
//               alt="fof"
//               className="w-[200px] mt-6 fof-text-shadow pointer-events-none"
//             />
//           </div>
//         </div>

//         <div className="flex flex-grow"></div>
//         <div
//           className={`flex ${
//             fadeout && "fade-out"
//           } justify-center items-center z-[100]`}
//         >
//           <img
//             src={assets.logos.begodsBlack}
//             alt="logo"
//             className="w-[65px] h-[75px] mb-6 begod-text-shadow pointer-events-none"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FoFIntro;

// {
//   /* <div className="absolute">
// <ReactHowler
//   src={assets.audio.fofIntro}
//   playing={!disableDesktop && enableSound}
//   preload={true}
//   loop
// />
// </div> */
// }
