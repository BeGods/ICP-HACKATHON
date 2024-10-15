// import React from "react";

// const Test = (props) => {
//   return (
//     <div className="flex justify-between relative w-full">
//       {/* Left */}
//       <div className="flex flex-col justify-between h-full px-2 pt-1">
//         <div
//           className={`text-head  text-white glow-myth-${mythSections[activeMyth]} uppercase`}
//         >
//           Forge
//         </div>
//         <div className="flex mb-4 -ml-2 items-center text-black-contour w-fit h-fit">
//           <div
//             className={`font-symbols ${
//               glowShards && `scale-[175%]`
//             }  text-icon transition-all duration-1000  text-${
//               mythSections[activeMyth]
//             }-text`}
//           >
//             S
//           </div>
//           <div className={`text-num transition-all duration-1000 text-white`}>
//             {shards}
//           </div>
//         </div>
//       </div>
//       <div className="flex absolute justify-center w-full z-20">
//         <div
//           className={`flex text-center justify-center h-[36vw] w-[36vw] -mt-5 items-center rounded-full outline outline-${
//             mythSections[activeMyth]
//           }-primary transition-all duration-1000 ${
//             orbGlow
//               ? `glow-tap-${mythSections[activeMyth]} outline-[2px] `
//               : `glow-icon-${mythSections[activeMyth]}`
//           } ${tapGlow && "scale-[125%] outline-[2px]"} ${
//             glowReward && "scale-[125%] outline-[2px]"
//           } `}
//         >
//           <div
//             className={`absolute z-10 h-full w-[36vw] overflow-hidden rounded-full  outline outline-${mythSections[activeMyth]}-primary`}
//           >
//             <div
//               style={{
//                 height: `${height}%`,
//               }}
//               className={`absolute bottom-0  opacity-20 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
//             ></div>
//           </div>
//           <img
//             src="/assets/uxui/240px-orb.base.png"
//             alt="base-orb"
//             className={`filter-orbs-${mythSections[activeMyth]} w-full h-full`}
//           />
//           <div
//             className={`z-1  flex justify-center items-start  font-symbols ${
//               glowReward
//                 ? ` text-${mythSections[activeMyth]}-text opacity-100`
//                 : showBlackOrb === 1
//                 ? "text-white opacity-100"
//                 : "text-white opacity-50"
//             } text-[34vw] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute flex h-full w-full rounded-full`}
//           >
//             <div className={` ${platform === "ios" ? "-mt-6" : "-mt-2"}`}>
//               {mythSymbols[mythSections[activeMyth]]}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Right */}
//       <div className="flex items-end flex-col justify-between h-full px-2 pt-1">
//         <h1
//           className={`text-head  text-black-contour uppercase text-${mythSections[activeMyth]}-text`}
//         >
//           {t(`elements.${elements[activeMyth]}`)}
//         </h1>
//         <div className="flex mb-4 -mr-2 items-center text-black-contour w-fit h-fit">
//           <div className={`text-num transition-all duration-1000 text-white`}>
//             {orbs}
//           </div>
//           <div
//             className={`font-symbols  ${
//               (glowSymbol || glowBooster) && `scale-[175%]`
//             } text-icon transition-all duration-1000 text-${
//               mythSections[activeMyth]
//             }-text`}
//           >
//             {mythSymbols[mythSections[activeMyth]]}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// Test.propTypes = {};

// export default Test;

// <div className="flex justify-between relative w-full">
//   <div
//     className={`text-head mx-auto text-black-contour w-full text-center top-0 absolute z-30 text-white  uppercase`}
//   >
//     TOWER
//   </div>
//   {/* Left */}
//   <div className="flex flex-col justify-between h-full px-2 pt-1">
//     <h1
//       className={`text-head text-black-contour uppercase ${
//         myth === 0 ? "text-white" : `text-${wheel[myth]}-text`
//       }
//      `}
//     >
//       {myth === 0 ? "Dark" : t(`elements.${elements[myth - 1]}`)}
//     </h1>
//     {myth !== 0 ? (
//       <div className="flex mb-4 -ml-2 items-center text-black-contour w-fit h-fit">
//         <div className={`font-symbols text-icon text-${wheel[myth]}-text`}>
//           {mythSymbols[wheel[myth]]}
//         </div>
//         <div className="text-num text-white">
//           {gameData.mythologies[myth - 1]?.orbs - sessionOrbs * 2}
//         </div>
//       </div>
//     ) : (
//       <div className="flex mb-4 -mr-2 items-center text-black-contour w-fit h-fit">
//         <div className={`font-symbols text-icon text-white`}>
//           {mythSymbols["other"]}
//         </div>
//         <div className="text-num text-black-contour  text-white">
//           {gameData.blackOrbs}
//         </div>
//       </div>
//     )}
//   </div>
//   <div className="flex absolute justify-center w-full">
//     {/* Orb */}
//     <div
//       className={`flex text-center glow-icon-white justify-center h-[36vw] w-[36vw] mt-0.5 items-center rounded-full outline moutline outline-[0.5px] outline-white transition-all duration-1000  overflow-hidden relative`}
//     >
//       <img
//         src="/assets/uxui/240px-orb.base.png"
//         alt="base-orb"
//         className={`filter-orbs-black w-full h-full`}
//       />
//       <span
//         className={`absolute z-1 font-symbols  text-white text-[28vw] mt-8 opacity-50 orb-symbol-shadow`}
//       >
//         {mythSymbols["other"]}
//       </span>
//     </div>
//   </div>
//   {/* Right */}
//   <div className="flex flex-col items-end justify-between h-full px-2 pt-1">
//     <h1 className={`text-head text-black-contour uppercase text-white`}>
//       TOWER
//     </h1>
//     <div className="flex mb-4 items-center text-black-contour w-fit h-fit">
//       <div className="text-num text-black-contour  text-white pr-1.5">
//         {gameData.multiColorOrbs}
//       </div>
//       <div className="flex relative text-center justify-center items-center max-w-orb -mt-1 rounded-full glow-icon-black">
//         <img
//           src="/assets/uxui/240px-orb.multicolor.png"
//           alt="multiOrb"
//           className="w-full h-full"
//         />
//       </div>
//     </div>
//   </div>
// </div>;

// import React from "react";
// import { mythSections, mythSymbols } from "../../utils/constants";

// const ForgeHeader = ({
//   activeMyth,
//   shards,
//   orbs,
//   orbGlow,
//   tapGlow,
//   glowReward,
//   glowSymbol,
//   glowShards,
//   mythData,
//   platform,
//   showBlackOrb,
//   glowBooster,
// }) => {
//   const height = Math.min(
//     100,
//     Math.max(0, (mythData.energy / mythData.energyLimit) * 100)
//   );

//   return (
//     <div className="flex justify-between relative w-full">
//       <div
//         className={`text-head -mt-2 mx-auto  w-full text-center top-0 absolute z-30 text-white text-black-lg-contour uppercase`}
//       >
//         Forge
//       </div>
//       <div>
//         <img src="/assets/uxui/160px-header.top.left.png" alt="right" />
//       </div>
//       {/* Left */}
//       {/* <div className="flex flex-col justify-center h-full px-2">
//         <div className="flex flex-col leading-[45px] mb-4 justify-start ml-1 items-center text-black-contour w-fit h-fit">
//           <div className={`text-num transition-all duration-1000 text-white`}>
//             {shards}
//           </div>
//           <div
//             className={`font-symbols pt-3 ${
//               glowShards && `scale-[150%]`
//             }  text-[50px] transition-all duration-1000 text-${
//               mythSections[activeMyth]
//             }-text`}
//           >
//             l
//           </div>
//         </div>
//       </div> */}
//       {/* Orb */}
//       <div className="flex absolute justify-center w-full z-20">
//         <div
//           className={`flex text-center justify-center h-[36vw] w-[36vw] mt-0.5 overflow-hidden items-center rounded-full outline outline-${
//             mythSections[activeMyth]
//           }-primary transition-all duration-1000 ${
//             orbGlow
//               ? `glow-tap-${mythSections[activeMyth]} outline-[2px] `
//               : `glow-icon-${mythSections[activeMyth]}`
//           } ${tapGlow && "scale-[125%] outline-[2px]"} ${
//             glowReward && "scale-[125%] outline-[2px]"
//           } `}
//         >
//           {" "}
//           <div
//             className={`absolute z-10 h-full w-[36vw] overflow-hidden rounded-full  outline outline-${mythSections[activeMyth]}-primary`}
//           >
//             <div
//               style={{
//                 height: `${height}%`,
//               }}
//               className={`absolute bottom-0  opacity-20 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
//             ></div>
//           </div>
//           <img
//             src="/assets/uxui/240px-orb.base.png"
//             alt="base-orb"
//             className={`filter-orbs-${mythSections[activeMyth]} w-full h-full`}
//           />
//           <div></div>
//           <div
//             className={`z-1  flex justify-center items-start  font-symbols  ${
//               glowReward
//                 ? ` text-${mythSections[activeMyth]}-text opacity-100`
//                 : showBlackOrb === 1
//                 ? "text-white opacity-100"
//                 : "text-white opacity-50"
//             }  text-[28vw] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
//           >
//             <div className={`${platform === "ios" ? "mt-1" : "mt-2"}`}>
//               {mythSymbols[mythSections[activeMyth]]}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Right */}
//       {/* 154px-head.lft.png */}
//       <div>
//         <img src="/assets/uxui/160px-header.top.right.png" alt="right" />
//       </div>
//       {/* <div className="flex flex-col justify-center h-full px-2">
//         <div className="flex flex-col leading-[45px] mb-4 items-center text-black-contour w-fit h-fit">
//           <div className={`text-num transition-all duration-1000 text-white`}>
//             {orbs}
//           </div>
//           <div
//             className={`font-symbols pt-3 ${
//               (glowSymbol || glowBooster === 3) && `scale-[150%]`
//             } text-[50px] transition-all duration-1000 text-${
//               mythSections[activeMyth]
//             }-text`}
//           >
//             {mythSymbols[mythSections[activeMyth]]}
//           </div>
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default ForgeHeader;

// import React from "react";
// import { mythSections, mythSymbols } from "../../utils/constants";

// const ForgeHeader = ({
//   activeMyth,
//   shards,
//   orbs,
//   orbGlow,
//   tapGlow,
//   glowReward,
//   glowSymbol,
//   glowShards,
//   mythData,
//   platform,
//   showBlackOrb,
//   glowBooster,
// }) => {
//   const height = Math.min(
//     100,
//     Math.max(0, (mythData.energy / mythData.energyLimit) * 100)
//   );

//   return (
//     <div className="flex justify-center relative w-full">
//       <div
//         className={`text-head -mt-2 mx-auto  w-full text-center top-0 absolute z-30 text-white text-black-lg-contour uppercase`}
//       >
//         Forge
//       </div>
//       <div>
//         <img src="/assets/uxui/160px-header.top.left.png" alt="right" />
//       </div>
//       {/* Left */}
//       {/* Orb */}
//       <div className="flex absolute justify-center w-full z-20">
//         <div
//           className={`flex text-center justify-center h-[36vw] w-[36vw] mt-0.5 overflow-hidden items-center rounded-full outline outline-${
//             mythSections[activeMyth]
//           }-primary transition-all duration-1000 ${
//             orbGlow
//               ? `glow-tap-${mythSections[activeMyth]} outline-[2px] `
//               : `glow-icon-${mythSections[activeMyth]}`
//           } ${tapGlow && "scale-[125%] outline-[2px]"} ${
//             glowReward && "scale-[125%] outline-[2px]"
//           } `}
//         >
//           {" "}
//           <div
//             className={`absolute z-10 h-full w-[36vw] overflow-hidden rounded-full  outline outline-${mythSections[activeMyth]}-primary`}
//           >
//             <div
//               style={{
//                 height: `${height}%`,
//               }}
//               className={`absolute bottom-0  opacity-20 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
//             ></div>
//           </div>
//           <img
//             src="/assets/uxui/240px-orb.base.png"
//             alt="base-orb"
//             className={`filter-orbs-${mythSections[activeMyth]} w-full h-full`}
//           />
//           <div></div>
//           <div
//             className={`z-1  flex justify-center items-start  font-symbols  ${
//               glowReward
//                 ? ` text-${mythSections[activeMyth]}-text opacity-100`
//                 : showBlackOrb === 1
//                 ? "text-white opacity-100"
//                 : "text-white opacity-50"
//             }  text-[28vw] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
//           >
//             <div className={`${platform === "ios" ? "mt-1" : "mt-2"}`}>
//               {mythSymbols[mythSections[activeMyth]]}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Right */}
//       <div>
//         <img src="/assets/uxui/160px-header.top.right.png" alt="right" />
//       </div>
//     </div>
//   );
// };

// export default ForgeHeader;

// import React, { useContext, useRef } from "react";
// import { MyContext } from "../../context/context";
// import { footerIcons, mythSections } from "../../utils/constants";
// import ReactHowler from "react-howler";

// const tele = window.Telegram?.WebApp;

// const FooterItem = ({
//   section,
//   index,
//   activeMyth,
//   handleClick,
//   enableSound,
// }) => {
//   const howlerRef = useRef(null);

//   const playAudio = () => {
//     if (howlerRef.current && enableSound) {
//       howlerRef.current.stop();
//       howlerRef.current.play();
//     }
//   };

//   return (
//     <>
//       <div
//         className="flex relative flex-col items-center cursor-pointer mt-2 z-50"
//         onClick={(e) => {
//           e.preventDefault();
//           playAudio();
//           handleClick();
//         }}
//         style={{ minWidth: "90px" }}
//       >
//         <h1
//           className={`font-symbols ${
//             section === index
//               ? `${
//                   activeMyth < 4 && section != 3
//                     ? `glow-icon-${mythSections[activeMyth]}`
//                     : `glow-text-white`
//                 }`
//               : `text-black-contour`
//           }`}
//           style={{
//             fontSize: section === index ? "60px" : "50px",
//             transition: "font-size 0.3s ease",
//           }}
//         >
//           {footerIcons[index]}
//         </h1>
//       </div>
//       <div className="absolute ">
//         <ReactHowler
//           src="/assets/audio/fof.menu01.wav"
//           playing={false}
//           preload={true}
//           ref={howlerRef}
//           html5={true}
//         />
//       </div>
//     </>
//   );
// };

// const Footer = ({ minimize }) => {
//   const { section, setSection, activeMyth, setActiveMyth, enableSound } =
//     useContext(MyContext);

//   const handleSectionChange = (newSection) => {
//     tele.HapticFeedback.notificationOccurred("success");
//     setSection(newSection);
//     if (activeMyth >= 4) {
//       setActiveMyth(0);
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100%",
//       }}
//       className={`flex justify-between ${minimize === 2 && "maximize"} ${
//         minimize === 1 && "minimize"
//       } transition-all duration-1000 items-center h-[12%] z-50 w-full text-white`}
//     >
//       <div
//         style={{
//           backgroundImage: `url(/assets/uxui/fof.footer.paper.png)`,
//           backgroundRepeat: "no-repeat",
//           backgroundSize: "cover",
//           backgroundPosition: "center center",
//           position: "absolute",
//           top: 0,
//           left: 0,
//           height: "100%",
//           width: "100%",
//           zIndex: -1,
//         }}
//         className={`filter-paper-${
//           section === 3 || section === 9
//             ? mythSections[8]
//             : mythSections[activeMyth]
//         } `}
//       />
//       <div className="flex justify-between mx-auto w-[80%]">
//         {footerIcons.map((item, index) => (
//           <FooterItem
//             key={index}
//             section={section}
//             index={index}
//             enableSound={enableSound}
//             activeMyth={activeMyth}
//             handleClick={() => {
//               handleSectionChange(index);
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Footer;

// import React, { useContext } from "react";
// import { MyContext } from "../../context/context";
// import { mythSections } from "../../utils/constants";

// const Header = ({ children }) => {
//   const { activeMyth, section } = useContext(MyContext);
//   return (
//     <div
//       style={{
//         position: "relative",
//         height: "12%",
//         width: "100%",
//       }}
//       className="flex"
//     >
//       <div
//         style={{
//           backgroundImage: `url(/assets/uxui/fof.footer.rock2.png)`,
//           backgroundRepeat: "no-repeat",
//           transform: "rotate(180deg)",
//           backgroundSize: "cover",
//           backgroundPosition: "center center",
//           position: "absolute",
//           top: 0,
//           left: 0,
//           height: "100%",
//           width: "100%",
//           zIndex: -1,
//         }}
//         className={`filter-paper-${
//           section === 3 || section === 9
//             ? mythSections[8]
//             : mythSections[activeMyth]
//         } relative -mt-1`}
//       />
//       {children}
//     </div>
//   );
// };

// export default Header;

{
  /* <div className="bg-white h-screen">
<div className="relative">
  <img
    src="/assets/uxui/fof.footer.rock2.png"
    alt="paper"
    className="rotate-180 w-full h-auto"
  />
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="bg-red-400 p-4">Hi</div>
  </div>
</div>
<div className="relative">
  <img
    src="/assets/uxui/fof.footer.rock2.png"
    alt="paper"
    className="w-full bottom-0 h-auto"
  />
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="bg-red-400 p-4">Hi</div>
  </div>
</div>
</div> */
}

// import Lottie from "lottie-react";
// import React, { useRef, useState } from "react";
// import animationData from "../../public/assets/fx/tower.json";

// function Test(props) {
//   const lottieRef = useRef(null);

//   const handlePlay = () => {
//     if (lottieRef.current) {
//       lottieRef.current.setDirection(1);
//       lottieRef.current.play();
//     }
//   };

//   const handleReverse = () => {
//     if (lottieRef.current) {
//       lottieRef.current.setDirection(-1);
//       lottieRef.current.play();
//     }
//   };

//   return (
//     <div className="bg-black h-screen w-scree flex flex-col justify-center items-center">
//       <Lottie
//         lottieRef={lottieRef}
//         autoplay={false}
//         loop={false}
//         animationData={animationData}
//         className="w-[15vw]"
//       />

//       <div className="flex gap-5 mt-10">
//         <div onClick={handlePlay} className="bg-white text-black">
//           Play
//         </div>
//         <div onClick={handleReverse} className="bg-white text-black">
//           Reverse
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Test;

// import React, { useState } from "react";

// function Test(props) {
//   const [plusOnes, setPlusOnes] = useState([]);

//   const handlePlusOneEffect = (e) => {
//     let x, y;

//     if (e.type === "touchstart" || e.type === "touchend") {
//       // Touch event handling
//       x = e.touches[0]?.clientX || e.changedTouches[0]?.clientX;
//       y = e.touches[0]?.clientY || e.changedTouches[0]?.clientY;
//     } else {
//       // Mouse event handling
//       x = e.clientX;
//       y = e.clientY;
//     }

//     const newPlusOne = { x, y, id: Date.now() };
//     setPlusOnes((prev) => [...prev, newPlusOne]);

//     setTimeout(() => {
//       setPlusOnes((prev) =>
//         prev.filter((plusOne) => plusOne.id !== newPlusOne.id)
//       );
//     }, 1000);
//   };

//   return (
//     <div className="bg-black h-screen w-screen flex justify-center items-center">
//       <div
//         onMouseDown={(e) => handlePlusOneEffect(e)}
//         onTouchStart={(e) => handlePlusOneEffect(e)}
//         onTouchEnd={(e) => handlePlusOneEffect(e)}
//         className="flex flex-col items-center justify-center bg-red-400 w-[84vw] h-[84vw] rounded-full"
//       >
//         {plusOnes.map((plusOne) => (
//           <span
//             key={plusOne.id}
//             className="plus-one absolute mt-[120px]"
//             style={{
//               top: `${plusOne.y}px`,
//               left: `${plusOne.x}px`,
//               zIndex: 99,
//             }}
//           >
//             250
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Test;

import React, { useState } from "react";
import "../styles/flip.scss";

const Test = (props) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex relative flex-col items-center cursor-pointer mt-5 z-50">
      <div className={`font-symbols text-[15vw]`}>
        <div className={`card ${flipped ? "flipped" : ""} text-black-contour`}>
          <div
            onClick={(e) => {
              setFlipped((prev) => !prev);
            }}
            className="card__face card__face--front bg-red-400 h-[10vh] w-[20vw] flex justify-center items-center"
          ></div>
          <div
            onClick={(e) => {
              setFlipped((prev) => !prev);
            }}
            className="card__face card__face--back bg-green-400 flex justify-center items-center"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Test;
