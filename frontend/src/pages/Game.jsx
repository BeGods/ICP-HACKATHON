import React, { useContext, useState } from "react";
import Convert from "./Convert";
import { MyContext } from "../context/context";
import ProgressBar from "../components/ProgressBar";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Footer from "../components/Footer";
import {
  formatOrbsWithLeadingZeros,
  formatShardsWithLeadingZeros,
} from "../utils/gameManipulations";

const mythSections = ["celtic", "egyptian", "greek", "norse", "other"];

const Game = () => {
  const { activeMyth, setActiveMyth, gameData } = useContext(MyContext);
  const [energy, setEnergy] = useState(gameData.energy);
  const mythData = gameData.mythologies;

  return (
    <>
      {activeMyth < 4 ? (
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
              backgroundImage: `url(/themes/header/${mythSections[activeMyth]}.png)`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
            className="flex h-[18.5%] w-full"
          >
            <div className="flex flex-col flex-grow justify-center items-start text-white pl-5 pr-10 pb-1">
              <h1 className={`glow-${mythSections[activeMyth]}`}>
                {mythSections[activeMyth].toUpperCase()}
              </h1>
              <ProgressBar
                value={energy}
                max={mythData[activeMyth].energyLimit}
              />

              <div className="text-right font-medium font-montserrat text-[22px]">
                {formatOrbsWithLeadingZeros(mythData[activeMyth].orbs)}{" "}
                <span className="text-celtic-text">$ORB(S)</span>
              </div>
              <div className="text-right font-medium font-montserrat -mt-2 text-[14px]">
                {formatShardsWithLeadingZeros(mythData[activeMyth].shards)}{" "}
                <span className="text-celtic-text">SHARDS</span>
              </div>
            </div>
            <div className="h-full -mr-[16%] ml-auto mt-1">
              <img
                src={`/themes/symbols/${mythSections[activeMyth]}.png`}
                alt="symbol"
                className="h-full w-full"
              />
            </div>
          </div>

          <div className="flex flex-grow justify-center items-center">
            <div className="flex justify-center items-center w-[20%]">
              <div
                onClick={() => {
                  setActiveMyth((prev) => (prev - 1 + 5) % 5);
                }}
                className="bg-glass-black p-1 rounded-full cursor-pointer"
              >
                <ChevronsLeft color="white" className="h-[30px] w-[30px]" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              hi
            </div>
            <div className="flex justify-center items-center w-[20%]">
              <div
                onClick={() => {
                  setActiveMyth((prev) => (prev + 1) % 5);
                }}
                className="bg-glass-black p-1 rounded-full cursor-pointer"
              >
                <ChevronsRight color="white" className="h-[30px] w-[30px]" />
              </div>
            </div>
          </div>
          {/* Footer */}
          <Footer />
        </div>
      ) : (
        <Convert />
      )}
    </>
  );
};

export default Game;
