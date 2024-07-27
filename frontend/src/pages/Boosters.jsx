import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";
import { ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Footer from "../components/Footer";
import { formatOrbsWithLeadingZeros } from "../utils/gameManipulations";
import { claimAutomataBooster, claimShardsBooster } from "../utils/api";

const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];
const mythSections = ["celtic", "egyptian", "greek", "norse"];

const Boosters = () => {
  const [showCard, setShowCard] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const { gameData, setGameData, activeMyth, setActiveMyth } =
    useContext(MyContext);
  const multiColorOrbs = gameData.multiColorOrbs;
  const mythData = gameData.mythologies[activeMyth].boosters;

  const handleClaimShards = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const mythologyName = {
      mythologyName: mythologies[activeMyth],
    };
    try {
      const response = await claimShardsBooster(mythologyName, accessToken);
      setGameData(response.updatedMythologies);
      setShowCard(false);
      console.log("claimed succesfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClaimAutomata = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const mythologyName = {
      mythologyName: mythologies[activeMyth],
    };
    try {
      const response = await claimAutomataBooster(mythologyName, accessToken);
      setGameData(response.updatedMythologies);
      setShowCard(false);
      console.log("claimed succesfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClaimBooster = (e) => {
    e.preventDefault();

    if (activeCard === "shard") {
      handleClaimShards();
    } else if (activeCard === "automata") {
      handleClaimAutomata();
    }
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
          backgroundImage: `url(/themes/header/${mythSections[activeMyth]}.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
        className="flex h-[18.5%] w-full"
      >
        <div className="flex flex-col flex-grow justify-center items-center text-white">
          <h1 className={`glow-${mythSections[activeMyth]} uppercase`}>
            Boosters
          </h1>

          <div className="text-right  font-medium font-montserrat -mt-2 text-[22px]">
            {formatOrbsWithLeadingZeros(multiColorOrbs)}{" "}
            <span className="gradient-multi">$ORBS</span>
          </div>
        </div>
      </div>

      <div className="flex flex-grow justify-center items-center">
        <div className="flex justify-center items-center w-[20%]">
          <div
            onClick={() => {
              setActiveMyth((prev) => (prev - 1 + 4) % 4);
              setActiveCard("shard");
            }}
            className="bg-glass-black p-1 rounded-full cursor-pointer"
          >
            <ChevronsLeft color="white" className="h-[30px] w-[30px]" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-[15px]">
          {/* SHARDS BOOSTER */}
          <div
            className={`flex gap-4 border ${
              mythData.isShardsClaimActive
                ? `border-${mythSections[activeMyth]}-primary`
                : "border-cardsGray"
            }   rounded-button h-[100px] w-full bg-glass-black p-[15px] font-montserrat text-white`}
          >
            <div>
              {mythData.isShardsClaimActive ? (
                <img
                  src="/icons/shard.svg"
                  alt="Boosters shards"
                  className="h-[65px] w-[65px]"
                />
              ) : (
                <img
                  src="/icons/shard-lock.svg"
                  alt="Boosters shards"
                  className="h-[65px] w-[65px]"
                />
              )}
            </div>
            <div
              className={`flex flex-col flex-grow justify-center ${
                !mythData.isShardsClaimActive && "text-cardsGray"
              }`}
            >
              <h1 className="tetx-[18px]">SHARDS</h1>
              <h2 className="tetx-[14px]">Double tap</h2>
            </div>
            <div className="flex justify-center items-center w-[10%]">
              {mythData.isShardsClaimActive ? (
                <ChevronRight
                  onClick={() => {
                    setShowCard(true);
                    setActiveCard("shard");
                  }}
                />
              ) : (
                <img src="/icons/lock.svg" alt="lock" />
              )}
            </div>
          </div>
          {/* LOST QUESTS BOOSTER */}
          <div
            className={`flex gap-4 border ${
              mythData.isShardsClaimActive
                ? `border-${mythSections[activeMyth]}-primary`
                : "border-cardsGray"
            }   rounded-button h-[100px] w-full bg-glass-black p-[15px] font-montserrat text-white`}
          >
            <div>
              {mythData.isShardsClaimActive ? (
                <img
                  src="/icons/lost.svg"
                  alt="Boosters shards"
                  className="h-[65px] w-[65px]"
                />
              ) : (
                <img
                  src="/icons/lost-lock.svg"
                  alt="Boosters shards"
                  className="h-[65px] w-[65px]"
                />
              )}
            </div>
            <div
              className={`flex flex-col flex-grow justify-center ${
                !mythData.isShardsClaimActive && "text-cardsGray"
              }`}
            >
              <h1 className="tetx-[18px]">SHARDS</h1>
              <h2 className="tetx-[14px]">Double tap</h2>
            </div>
            <div className="flex justify-center items-center w-[10%]">
              {mythData.isShardsClaimActive ? (
                <ChevronRight
                  onClick={() => {
                    setShowCard(true);
                    setActiveCard("shard");
                  }}
                />
              ) : (
                <img src="/icons/lock.svg" alt="lock" />
              )}
            </div>
          </div>
          {/* AUTOMATA BOOSTER */}
          <div
            className={`flex gap-4 border ${
              !mythData.isAutomataActive
                ? `border-${mythSections[activeMyth]}-primary`
                : "border-cardsGray"
            }   rounded-button h-[100px] w-full bg-glass-black p-[15px] font-montserrat text-white`}
          >
            <div>
              {!mythData.isAutomataActive ? (
                <img
                  src="/icons/automata.svg"
                  alt="Boosters shards"
                  className="h-[65px] w-[65px]"
                />
              ) : (
                <img
                  src="/icons/automata-lock.svg"
                  alt="Boosters shards"
                  className="h-[65px] w-[65px]"
                />
              )}
            </div>
            <div
              className={`flex flex-col flex-grow justify-center ${
                mythData.isAutomataActive && "text-cardsGray"
              }`}
            >
              <h1 className="tetx-[18px]">AUTOMATA</h1>
              <h2 className="tetx-[14px]">Auto tap</h2>
            </div>
            <div className="flex justify-center items-center w-[10%]">
              {!mythData.isAutomataActive ? (
                <ChevronRight
                  onClick={() => {
                    setShowCard(true);
                    setActiveCard("automata");
                  }}
                />
              ) : (
                <img src="/icons/lock.svg" alt="lock" />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center w-[20%]">
          <div
            onClick={() => {
              setActiveMyth((prev) => (prev + 1) % 4);
            }}
            className="bg-glass-black p-1 rounded-full cursor-pointer"
          >
            <ChevronsRight color="white" className="h-[30px] w-[30px]" />
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
      {showCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative w-[72%] rounded-lg shadow-lg mt-12">
            <img
              src={`/cards/${activeCard + "." + mythSections[activeMyth]}.png`}
              alt="card"
              className="w-full h-full mx-auto"
            />
            <div className="absolute top-0 right-0 h-10 w-10 cursor-pointer">
              <img
                src="/icons/close.svg"
                alt="close"
                className="w-[38px] h-[38px] mt-1"
                onClick={() => {
                  setShowCard((prev) => !prev);
                }}
              />
            </div>
            <div
              onClick={handleClaimBooster}
              className="flex items-center justify-between h-[54px] w-[192px] mx-auto -mt-2   bg-glass-black text-white font-montserrat rounded-button"
            >
              <div className="flex justify-center items-center w-1/4  border-borderGray h-full">
                <img
                  src={`/images/orb.png`}
                  alt="orb"
                  className="w-[32px] h-[32px]"
                />
              </div>
              <div className="text-[16px] uppercase">PAY</div>
              <div className="flex justify-center items-center w-1/4  border-borderGray h-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Boosters;
