import React, { useContext, useEffect, useRef, useState } from "react";
import { convertOrbs } from "../utils/api";
import { MyContext } from "../context/context";
import Footer from "../components/Footer";
import ConvertButton from "../components/Buttons/ConvertButton";
import ConvertInfo from "../components/ConvertInfo";
import { useTranslation } from "react-i18next";
import {
  mythSymbols,
  mythologies,
  wheel,
  wheelNames,
} from "../utils/variables";
import { showToast } from "../components/Toast/Toast";
import Header from "../components/Headers/Header";
import { ToggleLeft, ToggleRight } from "../components/Common/SectionToggles";
import IconButton from "../components/Common/IconButton";
import ReactHowler from "react-howler";

// export const HeaderContent = ({ myth, t, gameData, mythData }) => {
//   return (
//     <div className="flex flex-col flex-grow justify-center items-center text-white  -mt-1.5">
//       <div className="mt-2  w-[90%]">
//         <img
//           src="/assets/logos/forgesoffaith1.svg"
//           alt="fof"
//           className="w-full fof-text-shadow"
//         />
//       </div>
//       <div className="flex w-full justify-center items-center mt-2">
//         <div className="text-center text-primary">
//           {myth == 0 ? (
//             <div className="text-right font-medium">
//               {gameData.blackOrbs}
//               <span className="text-black fof-shadow">
//                 {" "}
//                 {t(`keywords.orbs`)}
//               </span>
//             </div>
//           ) : (
//             <div className="text-right font-medium text-pretty">
//               {mythData.orbs}
//               <span className={`text-${wheel[myth]}-text`}>
//                 {" "}
//                 {t(`keywords.orbs`)}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

const HeaderContent = ({ myth, t, gameData, mythData }) => {
  return (
    <div className="flex relative flex-col flex-grow justify-center items-center text-white ">
      <div className="flex justify-between h-full w-full px-2">
        <div>
          <h1 className={`text-primary uppercase`}>
            {t(`elements.${wheelNames[myth]}`)}
          </h1>
        </div>
        <div> </div>
      </div>
      <div
        className={`flex text-center  justify-center h-[160px] -mt-10 absolute items-center rounded-full transition-all duration-1000 ${`glow-icon-white`}`}
      >
        <img
          src="/assets/uxui/240px-orb.base.png"
          alt="orb"
          className={`filter-orbs-  w-full h-full`}
        />
        <span
          className={`absolute z-1 font-symbols t text-white text-[160px] mt-11 ml-1  opacity-50 orb-glow`}
        >
          {mythSymbols["other"]}
        </span>
      </div>
    </div>
  );
};

const Convert = () => {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const { setActiveMyth, setGameData, gameData } = useContext(MyContext);
  const [myth, setMyth] = useState(0);
  const mythData = gameData.mythologies.filter(
    (item) => item.name.toLowerCase() === wheel[myth]
  )[0];

  // convert orbs to multicolor
  const handleOrbsConversion = async () => {
    if (myth < 4) {
      const token = localStorage.getItem("accessToken");
      const mythologyName = {
        mythologyName: mythData.name,
      };
      try {
        await convertOrbs(mythologyName, token);

        const updatedGameData = {
          ...gameData,
          multiColorOrbs: gameData.multiColorOrbs + 1,
          mythologies: gameData.mythologies.map((myth) => {
            if (myth.name === mythologies[myth]) {
              return {
                ...myth,
                orbs: myth.orbs - 2,
              };
            }

            return {
              ...myth,
              orbs: myth.orbs - 2,
            };
          }),
        };
        setGameData(updatedGameData);
        showToast("convert_success");
      } catch (error) {
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        showToast("convert_error");
      }
    }
  };

  useEffect(() => {}, [gameData]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
      }}
      className="flex flex-col h-screen overflow-hidden m-0"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
        className="background-wrapper"
        ƒ
      >
        <div
          className={`absolute top-0 left-0 h-full w-full filter-other`}
          style={{
            backgroundImage: `url(/assets/uxui/fof.base.background.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      <div className="bg-red-400 absolute z-50">
        {JSON.parse(localStorage.getItem("sound")) ? "yes" : "no"}
      </div>
      {/* Header */}
      <Header
        children={
          <HeaderContent
            myth={myth}
            t={t}
            gameData={gameData}
            mythData={mythData}
          />
        }
      />
      {/* Wheel */}
      <div className="flex relative flex-grow justify-center items-center">
        {/* Info Icon */}
        {!showInfo && (
          <IconButton
            isInfo={true}
            handleClick={() => {
              setShowInfo(true);
            }}
            activeMyth={4}
            align={2}
          />
        )}
        {gameData.multiColorOrbs !== 0 && (
          <div className="absolute z-10">
            <div className="font-medium text-[60px] text-white footer-shadow">
              {gameData.multiColorOrbs}
            </div>
          </div>
        )}

        <ToggleLeft
          handleClick={() => {
            setActiveMyth((prev) => (prev - 1 + 5) % 5);
          }}
          activeMyth={4}
        />
        {/* Wheel */}
        <div className="flex flex-col items-center justify-center w-full">
          <img
            src="/assets/uxui/480px-forges.of.faith.tower.png"
            alt="wheel"
            className="w-[90%] absolute"
          />
          <div className="absolute h-full flex justify-center items-end bottom-[1%]">
            <ConvertButton
              t={t}
              handleNext={() => {
                setMyth((prev) => (prev + 1) % 5);
              }}
              handlePrev={() => {
                setMyth((prev) => (prev - 1 + 5) % 5);
              }}
              myth={myth}
              action={handleOrbsConversion}
            />
          </div>
        </div>
        <ToggleRight
          handleClick={() => {
            setActiveMyth((prev) => (prev + 1) % 5);
          }}
          activeMyth={4}
        />
      </div>
      {/* Footer */}
      <Footer />
      {showInfo && (
        <ConvertInfo
          t={t}
          handleClick={() => {
            setShowInfo(false);
          }}
        />
      )}
      <ReactHowler
        src="/assets/audio/fof.tower.background01.wav"
        playing={!JSON.parse(localStorage.getItem("sound"))}
        preload={true}
        loop
      />
    </div>
  );
};

export default Convert;

{
  /* <div
          className="absolute flex w-full pr-5 justify-end top-0"
          onClick={() => {
            handleButtonClick(3);
            setShowInfo(true);
          }}
        >
          <img
            src="/assets/icons/info.svg"
            alt="info"
            className={`w-icon-primary h-icon-primary rounded-full mr-[15px] mt-7 ${
              isButtonGlowing === 3 ? `glow-button-other` : ""
            }`}
          />
        </div> */
}

{
  /* <div
  style={{
    position: "relative",
    height: "18.5%",
    width: "100%",
  }}
  className="flex"
>
  <div
    style={{
      backgroundImage: `url(/assets/uxui/fof.header.paper.png)`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      zIndex: -1,
    }}
    className={`filter-paper-other relative -mt-1`}
  />
  <div className="flex flex-col flex-grow justify-center items-center text-white  -mt-1.5">
    <div className="mt-2">
      <img
        src="/assets/uxui/forgesoffaith1.svg"
        alt="fof"
        className="w-full fof-text-shadow"
      />
    </div>
    <div className="flex w-full justify-center items-center mt-2">
      <div className="text-center">
        {myth == 4 ? (
          <div className="text-right font-medium text-orb-primary">
            {formatOrbsWithLeadingZeros(gameData.blackOrbs)}
            <span className="text-black fof-text-shadow">{t(`keywords.orbs`)}</span>
          </div>
        ) : (
          <div className="text-right font-medium text-orb-primary">
            {formatOrbsWithLeadingZeros(mythData[myth].orbs)}
            <span className={`text-${mythSections[myth]}-text`}>
              {t(`keywords.orbs`)}
            </span>
          </div>
        )}
        <div className="font-medium  text-orb-secondary -mt-1">
          {formatOrbsWithLeadingZeros(gameData.multiColorOrbs)}{" "}
          <span className="gradient-multi">{t(`keywords.orbs`)}</span>
        </div>
      </div>
    </div>
  </div>
</div>; */
}

{
  /* <h1 className="flex items-center gap-4 text-[43px] glow-white font-fof text-fof drop-shadow-2xl -mt-0.5"></h1> */
  /* FORGES <span className="text-[20px]">OF</span> FAITH */
  /* {t("main.fof")} */
}

{
  /* {myth === 4 ? (
          <div className="flex flex-col flex-grow justify-center items-center text-white  -mt-1.5">
            <div className="mt-2">
              <img
                src="/assets/uxui/forgesoffaith1.svg"
                alt="fof"
                className="w-full fof-text-shadow"
              />
            </div>
            <div className="flex w-full justify-center items-center mt-2">
              <div className="text-center">
                <div className="text-right font-medium  text-[22px]">
                  {formatOrbsWithLeadingZeros(gameData.blackOrbs)}{" "}
                  <span className="text-black fof-text-shadow">
                    {t(`keywords.orbs`)}
                  </span>
                </div>
                <div className="font-medium  text-[14px] -mt-1">
                  {formatOrbsWithLeadingZeros(gameData.multiColorOrbs)}{" "}
                  <span className="gradient-multi">{t(`keywords.orbs`)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-grow justify-center items-center text-white  -mt-1.5">
            <div className="mt-2">
              <img
                src="/assets/uxui/forgesoffaith1.svg"
                alt="fof"
                className="w-full fof-text-shadow"
              />
            </div>
            <div className="flex  w-full justify-center items-center mt-2">
              <div className="text-center">
                <div className="text-right font-medium  text-[22px]">
                  {formatOrbsWithLeadingZeros(mythData[myth].orbs)}{" "}
                  <span className={`text-${mythSections[myth]}-text`}>
                    {t(`keywords.orbs`)}
                  </span>
                </div>
                <div className="font-medium  text-[14px] -mt-1">
                  {formatOrbsWithLeadingZeros(gameData.multiColorOrbs)}{" "}
                  <span className="gradient-multi">{t(`keywords.orbs`)}</span>
                </div>
              </div>
            </div>
          </div>
        )} */
}
