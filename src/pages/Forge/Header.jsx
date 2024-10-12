import React, { useContext } from "react";
import { mythSections, mythSymbols } from "../../utils/constants";
import { MyContext } from "../../context/context";
import Header from "../../components/Common/Header";

const tele = window.Telegram?.WebApp;

const CenterChild = ({
  height,
  tapGlow,
  glowReward,
  showBlackOrb,
  activeMyth,
  orbGlow,
  platform,
}) => {
  const { setSection } = useContext(MyContext);

  return (
    <div
      onClick={() => {
        tele.HapticFeedback.notificationOccurred("success");
        setSection(4);
      }}
      className="flex absolute justify-center w-full z-20"
    >
      <div
        className={`flex text-center justify-center h-[36vw] w-[36vw] overflow-hidden items-center rounded-full outline outline-${
          mythSections[activeMyth]
        }-primary transition-all duration-1000 ${
          orbGlow
            ? `glow-tap-${mythSections[activeMyth]} outline-[2px]`
            : `glow-icon-${mythSections[activeMyth]}`
        } ${tapGlow ? "scale-[125%] outline-[2px]" : ""} ${
          glowReward ? "scale-[125%] outline-[2px]" : ""
        }`}
      >
        <div
          className={`absolute z-10 h-full w-[36vw] overflow-hidden rounded-full outline outline-${mythSections[activeMyth]}-primary`}
        >
          <div
            style={{ height: `${height}%` }}
            className={`absolute bottom-0 opacity-20 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
          ></div>
        </div>
        <img
          src="/assets/uxui/240px-orb.base.png"
          alt="base-orb"
          className={`filter-orbs-${mythSections[activeMyth]} w-full h-full`}
        />
        <div
          className={`z-1 flex justify-center items-start font-symbols ${
            glowReward
              ? `text-${mythSections[activeMyth]}-text opacity-100`
              : showBlackOrb === 1
              ? "text-white opacity-100"
              : "text-white opacity-50"
          } text-[28vw] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
        >
          <div className={`${platform === "ios" ? "mt-1" : "mt-2"}`}>
            {mythSymbols[mythSections[activeMyth]]}
          </div>
        </div>
      </div>
    </div>
  );
};

const TopChild = ({ activeMyth, glowShards, glowBooster, glowSymbol }) => {
  return (
    <div className="absolute flex w-full justify-between top-0 z-50">
      <div
        className={`font-symbols text-black-md-contour ml-[13vw] mt-0.5 ${
          glowShards && `scale-150`
        }  text-[50px] transition-all duration-1000 text-${
          mythSections[activeMyth]
        }-text`}
      >
        l
      </div>
      <div
        className={`font-symbols text-black-lg-contour mr-[13vw] mt-0.5 ${
          (glowSymbol || glowBooster === 3) && `scale-[150%]`
        } text-[50px] transition-all duration-1000 text-${
          mythSections[activeMyth]
        }-text`}
      >
        {mythSymbols[mythSections[activeMyth]]}
      </div>
    </div>
  );
};
const BottomChild = ({ shards, orbs }) => {
  return (
    <div className="absolute flex w-full justify-between bottom-0 z-50 mb-[2vh]">
      <div
        className={`text-num transition-all italic text-black-lg-contour custom-skew ml-[13vw]  duration-1000 text-white`}
      >
        {shards}
      </div>
      <div
        className={`text-num text-black-lg-contour transition-all text-right mr-[13vw] italic -rotate-6 duration-1000 text-white`}
      >
        {orbs}
      </div>
    </div>
  );
};

const ForgeHeader = ({
  activeMyth,
  shards,
  orbs,
  orbGlow,
  tapGlow,
  glowReward,
  mythData,
  platform,
  showBlackOrb,
  glowShards,
  glowSymbol,
  glowBooster,
}) => {
  const height = Math.min(
    100,
    Math.max(0, (mythData.energy / mythData.energyLimit) * 100)
  );

  return (
    <Header
      TopChild={
        <TopChild
          glowBooster={glowBooster}
          glowSymbol={glowSymbol}
          shards={shards}
          glowShards={glowShards}
          activeMyth={activeMyth}
        />
      }
      CenterChild={
        <CenterChild
          height={height}
          tapGlow={tapGlow}
          glowReward={glowReward}
          showBlackOrb={showBlackOrb}
          orbGlow={orbGlow}
          platform={platform}
          activeMyth={activeMyth}
        />
      }
      BottomChild={<BottomChild shards={shards} orbs={orbs} />}
    />
  );
};

export default ForgeHeader;

// <div className="flex justify-between w-full">
//   <div className="relative flex justify-center w-full">
//     {/* Left */}
//     <div className="relative">
//       <img
//         src="/assets/uxui/390px-header-new.png"
//         alt="left"
//         className={`left-0 h-[36vw] filter-${mythSections[activeMyth]}`}
//       />
//       <div className="absolute flex w-full justify-center top-0 z-50">
//         <div
//           className={`font-symbols mr-[17vw] text-black-md-contour mt-0.5 ${
//             glowShards && `scale-150`
//           }  text-[50px] transition-all duration-1000 text-${
//             mythSections[activeMyth]
//           }-text`}
//         >
//           l
//         </div>
//       </div>
//       <div className="absolute flex w-full justify-center  rotate-6 bottom-0 z-50">
//         <div
//           className={`text-num transition-all italic text-black-lg-contour custom-skew -mb-[8vw] mr-[18vw] duration-1000 text-white`}
//         >
//           999
//         </div>
//       </div>
//     </div>
//     {/* Orb */}
//     <div
//       onClick={() => {
//         tele.HapticFeedback.notificationOccurred("success");
//         setSection(4);
//       }}
//       className="flex absolute justify-center w-full z-20"
//     >
//       <div
//         className={`flex text-center justify-center h-[36vw] w-[36vw] overflow-hidden items-center rounded-full outline outline-${
//           mythSections[activeMyth]
//         }-primary transition-all duration-1000 ${
//           orbGlow
//             ? `glow-tap-${mythSections[activeMyth]} outline-[2px] `
//             : `glow-icon-${mythSections[activeMyth]}`
//         } ${tapGlow && "scale-[125%] outline-[2px]"} ${
//           glowReward && "scale-[125%] outline-[2px]"
//         } `}
//       >
//         {" "}
//         <div
//           className={`absolute z-10 h-full w-[36vw] overflow-hidden rounded-full  outline outline-${mythSections[activeMyth]}-primary`}
//         >
//           <div
//             style={{
//               height: `${height}%`,
//             }}
//             className={`absolute bottom-0  opacity-20 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
//           ></div>
//         </div>
//         <img
//           src="/assets/uxui/240px-orb.base.png"
//           alt="base-orb"
//           className={`filter-orbs-${mythSections[activeMyth]} w-full h-full`}
//         />
//         <div></div>
//         <div
//           className={`z-1 flex justify-center items-start  font-symbols  ${
//             glowReward
//               ? ` text-${mythSections[activeMyth]}-text opacity-100`
//               : showBlackOrb === 1
//               ? "text-white opacity-100"
//               : "text-white opacity-50"
//           }  text-[28vw] transition-all duration-1000 myth-glow-greek text-black-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
//         >
//           <div className={`${platform === "ios" ? "mt-1" : "mt-2"}`}>
//             {mythSymbols[mythSections[activeMyth]]}
//           </div>
//         </div>
//       </div>
//     </div>
//     {/* Right */}
//     <img
//       src="/assets/uxui/390px-header-new.png"
//       alt="left"
//       className={`right-0 transform scale-x-[-1] h-[36vw] filter-${mythSections[activeMyth]}`}
//     />
//     <div className="absolute flex w-full justify-center top-0 z-50">
//       <div
//         className={`font-symbols text-black-lg-contour ml-[65vw] mt-0.5 ${
//           (glowSymbol || glowBooster === 3) && `scale-[150%]`
//         } text-[50px] transition-all duration-1000 text-${
//           mythSections[activeMyth]
//         }-text`}
//       >
//         {mythSymbols[mythSections[activeMyth]]}
//       </div>
//     </div>
//     <div className="absolute flex w-full justify-center -mb-[8vw] ml-[70vw] italic bottom-0 z-50">
//       <div
//         className={`text-num text-black-lg-contour transition-all text-right -rotate-6 duration-1000 text-white`}
//       >
//         999
//       </div>
//     </div>
//   </div>
// </div>
