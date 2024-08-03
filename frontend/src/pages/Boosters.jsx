import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";
import { ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Footer from "../components/Footer";
import { formatOrbsWithLeadingZeros } from "../utils/gameManipulations";
import {
  claimAutomataBooster,
  claimLostQuest,
  claimQuest,
  claimQuestOrbsReward,
  claimShardsBooster,
  fetchLostQuests,
} from "../utils/api";

import OrbClaimCard from "../components/QuestCards/OrbClaimCard";
import ToastMesg from "../components/Toast/ToastMesg";
import { toast } from "react-toastify";

const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];
const mythSections = ["celtic", "egyptian", "greek", "norse"];

const Boosters = () => {
  const [showCard, setShowCard] = useState(false);
  const [lostQuest, setLostQuest] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [quest, setQuest] = useState(0);
  const [showQuest, setShowQuest] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [isGlowing, setIsGlowing] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const { gameData, setGameData, activeMyth, setActiveMyth } =
    useContext(MyContext);
  const multiColorOrbs = gameData.multiColorOrbs;
  const mythData = gameData.mythologies[activeMyth].boosters;
  const hoursInMs = 24 * 60 * 60 * 1000;
  const timeLeftInMs = mythData.automataStartTime + hoursInMs - Date.now();

  const hoursLeft = Math.floor(timeLeftInMs / (1000 * 60 * 60));
  const minutesLeft = Math.floor(
    (timeLeftInMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  // quest share reward after completing quest
  const handleOrbClaimReward = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: lostQuest[quest]._id,
    };
    try {
      await claimQuestOrbsReward(questData, token);

      setShowClaim(false);

      lostQuest[quest].isOrbClaimed = true;

      // update game data
      const updatedGameData = {
        ...gameData,
        mythologies: gameData.mythologies.map((myth) =>
          myth.name === mythologies[activeMyth]
            ? {
                ...myth,
                orbs: myth.orbs + 1,
              }
            : myth
        ),
      };
      setGameData(updatedGameData);

      toast.success(
        <ToastMesg
          title={"Congratulations ypu earned an extra orb!"}
          desc={"Orb credited to your account."}
          img={"/icons/success.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (error) {
      console.log(error.message);
      toast.error(
        <ToastMesg
          title={"Failed to claim orb."}
          desc={error.message}
          img={"/icons/fail.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  const handleClaimQuest = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: lostQuest[quest]._id,
    };
    try {
      await claimLostQuest(questData, token);
      setActiveCard(lostQuest[quest]?.type);
      setShowClaim(true);
      setShowPay(false);
      setShowQuest(false);

      // update game data
      const updatedGameData = {
        ...gameData,
        mythologies: gameData.mythologies.map((myth) => {
          const requiredOrbs = lostQuest[quest].requiredOrbs || {};
          const orbsToDeduct = requiredOrbs[myth.name] || 0;

          if (myth.name === mythologies[activeMyth]) {
            return {
              ...myth,
              faith: myth.faith + 1,
              energyLimit: myth.energyLimit + 1000,
              orbs: myth.orbs - orbsToDeduct,
            };
          }

          return {
            ...myth,
            orbs: myth.orbs - orbsToDeduct,
          };
        }),
      };
      setShowQuest(false);
      setGameData(updatedGameData);

      toast.success(
        <ToastMesg
          title={"Quest claimed successfuly!"}
          desc={"Enerbar bla blab bla"}
          img={"/icons/success.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";

      toast.error(
        <ToastMesg
          title={"Failed claim to claim quest."}
          desc={errorMessage}
          img={"/icons/fail.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  const handleLostQuest = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetchLostQuests(
        mythologies[activeMyth],
        accessToken
      );
      if (response.lostQuests.length !== 0) {
        setShowQuest(true);
        setLostQuest(response.lostQuests);
        console.log(response.lostQuests);
      } else {
        toast.success(
          <ToastMesg
            title={"Currently there are no lost quests."}
            desc={"Keep it up"}
            img={"/icons/fail.svg"}
          />,
          {
            icon: false,
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        <ToastMesg
          title={"There was a problem in loading quests."}
          desc={error.message}
          img={"/icons/fail.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  const handleClick = (num) => {
    setIsGlowing(num);
  };

  const handleRemoveClick = () => {
    setIsGlowing(0);
  };

  const handleClaimBooster = (e) => {
    e.preventDefault();

    if (activeCard === "shard") {
      handleClaimShards();
    } else if (activeCard === "automata") {
      handleClaimAutomata();
    }
  };

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
      toast.success(
        <ToastMesg
          title={"Booster claimed successfully!"}
          desc={error.message}
          img={"/icons/success.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (error) {
      console.log(error);
      toast.error(
        <ToastMesg
          title={"Failed to claim the booster."}
          desc={error.message}
          img={"/icons/fail.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
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

      toast.success(
        <ToastMesg
          title={"Booster claimed successfully!"}
          desc={"Your automata is running!"}
          img={"/icons/success.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (error) {
      console.log(error);
      toast.error(
        <ToastMesg
          title={"Failed to claim the booster."}
          desc={error.message}
          img={"/icons/fail.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  useEffect(() => {}, [gameData, showInfo, showClaim, showPay]);

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
          zIndex: -1, // Ensures the background is behind the content
        }}
        className="background-wrapper"
      >
        <div
          className={`absolute top-0 left-0 h-full w-full filter-${mythSections[activeMyth]}`}
          style={{
            backgroundImage: `url(/themes/background/main.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <div
        style={{
          position: "relative",
          height: "18.5%",
          width: "100%",
        }}
        className="flex"
      >
        <div
          style={{
            backgroundImage: `url(/images/head.png)`,
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
          className={`filter-paper-${mythSections[activeMyth]} -mt-1`}
        />
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
            } ${
              isGlowing === 1 ? `glow-button-${mythSections[activeMyth]}` : ""
            }  rounded-button h-[100px] w-full bg-glass-black p-[15px] font-montserrat text-white hover:glow-icon-celtic`}
            onMouseDown={() => handleClick(1)}
            onMouseUp={handleRemoveClick}
            onMouseLeave={handleRemoveClick}
            onTouchStart={() => handleClick(1)}
            onTouchEnd={handleRemoveClick}
            onTouchCancel={handleRemoveClick}
          >
            <div>
              {/* //! Uncomment image and remove -ml-20 for text for svg */}
              {mythData.isShardsClaimActive ? (
                // <img
                //   src="/icons/shard.svg"
                //   alt="Boosters shards"
                //   className="h-[65px] w-[65px]"
                // />
                <h1 className="font-symbols text-[85px] p-0 -mt-[30px] -ml-2">
                  S
                </h1>
              ) : (
                // <img
                //   src="/icons/shard-lock.svg"
                //   alt="Boosters shards"
                //   className="h-[65px] w-[65px]"
                // />
                <h1 className="font-symbols text-[80px] p-0 -mt-10 -ml-2">S</h1>
              )}
            </div>
            <div
              className={`flex flex-col flex-grow justify-center -ml-[10px] ${
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
            className={`flex gap-4 border border-${
              mythSections[activeMyth]
            }-primary ${
              isGlowing === 2 ? `glow-button-${mythSections[activeMyth]}` : ""
            } rounded-button h-[100px] w-full bg-glass-black p-[15px] font-montserrat text-white`}
            onMouseDown={() => handleClick(2)}
            onMouseUp={handleRemoveClick}
            onMouseLeave={handleRemoveClick}
            onTouchStart={() => handleClick(2)}
            onTouchEnd={handleRemoveClick}
            onTouchCancel={handleRemoveClick}
          >
            <div>
              {/* <img
                src="/icons/lost.svg"
                alt="Boosters shards"
                className="h-[65px] w-[65px]"
              /> */}
              <h1 className="font-symbols text-[75px] p-0 -mt-6 -ml-2">Q</h1>
            </div>
            <div className={`flex flex-col flex-grow justify-center `}>
              <h1 className="tetx-[18px]">LOST QUESTS</h1>
              <h2 className="tetx-[14px]">ENERGY 2X</h2>
            </div>
            <div className="flex justify-center items-center w-[10%]">
              <ChevronRight onClick={handleLostQuest} />
            </div>
          </div>
          {/* AUTOMATA BOOSTER */}
          <div
            className={`flex gap-4 border 
                border-${mythSections[activeMyth]}-primary ${
              isGlowing === 3 ? `glow-button-${mythSections[activeMyth]}` : ""
            } rounded-button h-[100px] w-full bg-glass-black p-[15px] font-montserrat text-white`}
            onMouseDown={() => handleClick(3)}
            onMouseUp={handleRemoveClick}
            onMouseLeave={handleRemoveClick}
            onTouchStart={() => handleClick(3)}
            onTouchEnd={handleRemoveClick}
            onTouchCancel={handleRemoveClick}
          >
            <div>
              {/* <img
                src="/icons/automata-bot.svg"
                alt="Boosters shards"
                className="h-[65px] w-[65px]"
              /> */}
              <h1 className="font-symbols text-[80px] p-0 -mt-6 -ml-1">b</h1>{" "}
            </div>
            <div className={`flex flex-col flex-grow justify-center -ml-1.5`}>
              <h1 className="tetx-[18px]">AUTOMATA</h1>
              <h2 className="tetx-[14px]">Auto tap</h2>
            </div>
            <div className="flex justify-center items-center w-[10%] ">
              <ChevronRight
                onClick={() => {
                  setShowCard(true);
                  setActiveCard("automata");
                }}
              />
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

      {/* Booster card */}
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

            {activeCard === "automata" && mythData?.isAutomataActive ? (
              <div
                className={`flex items-center justify-between h-[54px] w-[192px] mx-auto -mt-2 bg-glass-black z-50 text-white font-montserrat rounded-button`}
              >
                <div className="flex justify-center items-center w-1/4 h-full"></div>
                <div className="text-[16px] uppercase">
                  {hoursLeft}:{minutesLeft}
                </div>
                <div className="flex justify-center items-center w-1/4  h-full"></div>
              </div>
            ) : (
              <div
                onClick={handleClaimBooster}
                className="flex items-center justify-between h-[54px] w-[192px] mx-auto -mt-2   bg-glass-black text-white font-montserrat rounded-button"
              >
                <div
                  className={`flex justify-center items-center w-1/4 border-borderGray h-full`}
                >
                  <div className={`filter-orbs-${mythSections[activeMyth]}`}>
                    <img
                      src={`/themes/orb.png`}
                      alt="orb"
                      className="w-[40px] h-[40px]"
                    />
                  </div>
                  <div className="absolute bottom-0">
                    <img
                      src="/icons/up.svg"
                      alt="upward"
                      className="mb-3 z-1"
                    />
                  </div>
                </div>

                <div className="text-[16px] uppercase">PAY</div>
                <div className="flex justify-center items-center w-1/4  border-borderGray h-full"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* lost quests card */}
      {showQuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="w-[72%] rounded-lg shadow-lg mt-10">
            <div className="relative">
              <img
                src={`/cards/${lostQuest[quest]?.type}_off.png`}
                alt="card"
                className="w-full h-[75%]"
              />
              <div className="absolute top-0 right-0 h-10 w-10 cursor-pointer">
                <img
                  src="/icons/close.svg"
                  alt="close"
                  className="w-[38px] h-[38px] mt-1"
                  onClick={() => {
                    setShowQuest(false);
                  }}
                />
              </div>
            </div>

            <div
              onClick={handleClaimQuest}
              className={`flex items-center justify-between h-[54px] w-[192px] mx-auto -mt-2 bg-glass-black z-50 text-white font-montserrat rounded-button`}
            >
              <div className="flex justify-center items-center w-1/4 h-full">
                <img
                  src={`/images/multi-pay.png`}
                  alt="orb"
                  className="w-[32px] h-[32px]"
                />
              </div>
              <div className="text-[16px] uppercase">PAY</div>
              <div className="flex justify-center items-center w-1/4  h-full"></div>
            </div>
          </div>
        </div>
      )}

      {showClaim && (
        <OrbClaimCard
          activeCard={activeCard}
          handleOrbClaimReward={handleOrbClaimReward}
          handleShowClaim={() => {
            setShowClaim((prev) => !prev);
          }}
          activeMyth={activeMyth}
        />
      )}
    </div>
  );
};

export default Boosters;
