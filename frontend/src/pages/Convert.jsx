import React, { useContext, useEffect, useState } from "react";
import { convertOrbs } from "../utils/api";
import { MyContext } from "../context/context";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Footer from "../components/Footer";
import ConvertButton from "../components/Buttons/ConvertButton";
import { formatOrbsWithLeadingZeros } from "../utils/gameManipulations";
import ProgressBar from "../components/ProgressBar";

const mythSections = ["celtic", "egyptian", "greek", "norse", "other"];
const mythologies = ["Celtic", "Egyptian", "Greek", "Norse", "Other"];

const Convert = () => {
  const [showInfo, setShowInfo] = useState(false);
  const { setActiveMyth, setGameData, gameData } = useContext(MyContext);
  const [myth, setMyth] = useState(4);
  const mythData = gameData.mythologies;

  // convert orbs to multicolor
  const handleOrbsConversion = async () => {
    if (myth < 4) {
      const token = localStorage.getItem("accessToken");
      const mythologyName = {
        mythologyName: mythData[myth].name,
      };
      try {
        await convertOrbs(mythologyName, token);

        const updatedGameData = {
          ...gameData,
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

        console.log("Converted Successfully");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePrev = () => {
    setMyth((prev) => (prev - 1 + 5) % 5);
  };

  const handleNext = () => {
    setMyth((prev) => (prev + 1) % 5);
  };

  useEffect(() => {}, [gameData]);

  return (
    <div
      style={{
        backgroundImage: `url(/themes/background/celtic.png)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
      className="flex flex-col h-screen overflow-hidden m-0"
    >
      {/* Header */}
      <div
        style={{
          backgroundImage: `url(/themes/header/other.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
        className="flex h-[18.5%] w-full"
      >
        {myth === 4 ? (
          <div className="flex flex-col flex-grow justify-center items-start text-white pl-5">
            <h1 className="flex items-center gap-4 text-[43px] font-fof text-fof drop-shadow-2xl -mt-4">
              FORGES <span className="text-[20px]">OF</span> FAITH
            </h1>
            <div className="flex w-full justify-between items-center -mt-1.5">
              <div className="text-right font-medium font-montserrat text-[22px]">
                {formatOrbsWithLeadingZeros(gameData.multiColorOrbs)}{" "}
                <span className="gradient-multi">$ORB(S)</span>
              </div>
              <div
                onClick={() => {
                  setShowInfo(true);
                }}
              >
                <img
                  src="/icons/info.svg"
                  alt="info"
                  className="w-8 h-8 mr-4"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-grow justify-center items-start text-white pl-5 -mt-4">
            <h1 className="flex items-center gap-4 text-[36px] font-montserrat text-white drop-shadow-2xl">
              FORGES OF FAITH
            </h1>

            <div className="text-right font-medium font-montserrat text-[22px] -mt-1.5">
              {formatOrbsWithLeadingZeros(mythData[myth].orbs)}{" "}
              <span className={`text-${mythSections[myth]}-text`}>$ORB(S)</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-grow justify-center items-center">
        <div className="flex justify-center items-center w-[20%]">
          <div className="bg-glass-black p-1 rounded-full cursor-pointer">
            <ChevronsLeft
              onClick={() => {
                setActiveMyth((prev) => (prev - 1 + 5) % 5);
                setMyth();
              }}
              color="white"
              className="h-[30px] w-[30px]"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <img
            src="/themes/elements/wheel.png"
            alt="wheel"
            className="w-full"
          />
          <ConvertButton
            handleNext={handleNext}
            handlePrev={handlePrev}
            myth={myth}
            action={handleOrbsConversion}
          />
        </div>
        <div className="flex justify-center items-center w-[20%]">
          <div className="bg-glass-black p-1 rounded-full cursor-pointer">
            <ChevronsRight
              onClick={() => {
                setActiveMyth((prev) => (prev + 1) % 5);
                setMyth(4);
              }}
              color="white"
              className="h-[30px] w-[30px]"
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="relative w-[72%] rounded-lg shadow-lg mt-10">
            <img
              src={`/cards/conversion.png`}
              alt="card"
              className="w-full h-full mx-auto"
            />
            <div className="absolute top-0 right-0 h-10 w-10 cursor-pointer">
              <img
                src="/icons/close.svg"
                alt="close"
                className="w-[38px] h-[38px] mt-1.5 -ml-2"
                onClick={() => {
                  setShowInfo((prev) => !prev);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Convert;
