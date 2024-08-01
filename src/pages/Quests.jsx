import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";
import { categorizeQuestsByMythology } from "../utils/categorizeQuests";
import {
  claimQuest,
  claimQuestOrbsReward,
  claimShareReward,
} from "../utils/api";
import ProgressBar from "../components/ProgressBar";
import QuestButton from "../components/Buttons/QuestButton";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Footer from "../components/Footer";
import JigsawImage from "../components/Pieces";
import InfoCard from "../components/QuestCards/InfoCard";
import OrbClaimCard from "../components/QuestCards/OrbClaimCard";
import ToastMesg from "../components/Toast/ToastMesg";
import { toast } from "react-toastify";

const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];
const mythSections = ["celtic", "egyptian", "greek", "norse"];
const symbols = {
  greek: 4,
  celtic: 2,
  norse: 5,
  egyptian: 1,
};

const Quests = () => {
  const [showClaim, setShowClaim] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [currQuest, setCurrQuest] = useState(0);
  const {
    questsData,
    setQuestsData,
    gameData,
    setGameData,
    activeMyth,
    setActiveMyth,
  } = useContext(MyContext);
  const mythData = gameData.mythologies;
  const quests = categorizeQuestsByMythology(questsData)[activeMyth][
    mythologies[activeMyth]
  ].sort((a, b) => a.isCompleted - b.isCompleted);
  const quest = quests[currQuest];

  const handleClaimShareReward = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: quest._id,
    };
    try {
      await claimShareReward(questData, token);

      toast.success(
        <ToastMesg
          title={"Link Copied Successfully!"}
          desc={"Share it on X to earn an extra $ORB"}
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

      // update quest data
      const updatedQuestData = questsData.map((item) =>
        item._id === quest._id ? { ...item, isShared: true } : item
      );

      // update game data
      const updatedGameData = {
        ...gameData,
        multiColorOrbs: gameData.multiColorOrbs + 1,
      };
      setQuestsData(updatedQuestData);
      setGameData(updatedGameData);
    } catch (error) {
      console.log(error.message);
      toast.error(
        <ToastMesg
          title={"Failed to share quest."}
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

  const handleOrbClaimReward = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: quest._id,
    };
    try {
      await claimQuestOrbsReward(questData, token);
      setShowClaim(false);

      // update quest data
      const updatedQuestData = questsData.map((item) =>
        item._id === quest._id ? { ...item, isOrbClaimed: true } : item
      );

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
      setQuestsData(updatedQuestData);
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
    }
  };

  const handleClaimQuest = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: quest._id,
    };
    try {
      await claimQuest(questData, token);
      setActiveCard(quest?.type);
      setShowClaim(true);
      setShowPay(false);

      // update quest data
      const updatedQuestData = questsData.map((item) =>
        item._id === quest._id ? { ...item, isCompleted: true } : item
      );

      // update game data
      const updatedGameData = {
        ...gameData,
        mythologies: gameData.mythologies.map((myth) => {
          const requiredOrbs = quest.requiredOrbs || {};
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

      setQuestsData(updatedQuestData);
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
      console.log(error.message);

      toast.error(
        <ToastMesg
          title={"Failed claim to claim quest."}
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

  const handlePrev = () => {
    if (currQuest > 0) {
      setCurrQuest((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currQuest < quests.length) {
      setCurrQuest((prev) => prev + 1);
    }
  };

  useEffect(() => {}, [questsData, showClaim, showPay]);

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
        <div className="h-full -ml-[16%] mr-auto mt-1">
          <img
            src={`/themes/symbols/${mythSections[activeMyth]}.png`}
            alt="symbol"
            className="h-full w-full"
          />
        </div>
        <div className="flex flex-col flex-grow justify-center items-end text-white pr-5 pl-10 pb-1">
          <h1 className={`glow-${mythSections[activeMyth]}`}>
            {mythSections[activeMyth].toUpperCase()}
          </h1>
          {/* <ProgressBar
            value={mythData[activeMyth].faith}
            max={12}
            activeMyth={activeMyth}
          /> */}

          <div className="text-right font-medium font-montserrat mt-1 text-[16px]">
            {`${mythData[activeMyth].faith}/${12}`}{" "}
            <span className={`text-${mythSections[activeMyth]}-text`}>
              $FAITH
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-grow justify-center items-center">
        <div className="flex justify-center items-center w-[20%]">
          <div
            onClick={() => {
              setActiveMyth((prev) => (prev - 1 + 4) % 4);
              setCurrQuest(0);
              setShowPay(false);
              setShowInfo(false);
              setShowClaim(false);
            }}
            className="bg-glass-black p-1 rounded-full cursor-pointer"
          >
            <ChevronsLeft color="white" className="h-[30px] w-[30px]" />
          </div>
        </div>
        <div className="flex items-center justify-center w-full">
          {currQuest < quests.length ? (
            <>
              {!showPay ? (
                <div className="relative">
                  <img
                    src={`/cards/${quest?.type}_${
                      quest?.isCompleted ? "on" : "off"
                    }.png`}
                    alt="card"
                    className="w-full h-[75%]"
                  />
                  <div
                    onClick={() => {
                      setShowInfo((prev) => !prev);
                      setActiveCard(quest?.type);
                    }}
                    className="absolute top-0 right-0 h-10 w-10"
                  ></div>
                  <QuestButton
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    isCompleted={quest?.isCompleted}
                    activeMyth={activeMyth}
                    action={() => {
                      setShowPay(true);
                      window.open(quest?.link, "_blank");
                    }}
                  />
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <img
                      src={`/cards/${quest?.type}_${
                        quest?.isCompleted ? "on" : "off"
                      }.png`}
                      alt="card"
                      className="w-full h-[75%]"
                    />
                    <div className="absolute top-0 right-0 h-10 w-10 cursor-pointer">
                      <img
                        src="/icons/close.svg"
                        alt="close"
                        className="w-[38px] h-[38px] mt-1"
                        onClick={() => {
                          setShowPay(false);
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 h-[85%] mt-auto">
                      <div className="w-full h-full backdrop-blur-sm rounded-lg grayscale"></div>
                    </div>
                  </div>
                  <div
                    onClick={handleClaimQuest}
                    className={`flex items-center justify-between h-[54px] w-[192px] mx-auto -mt-2 bg-glass-black z-50 text-white font-montserrat rounded-button`}
                  >
                    <div className="flex justify-center items-center w-1/4 h-full"></div>
                    <div className="text-[16px] uppercase">PAY</div>
                    <div className="flex justify-center items-center w-1/4  h-full"></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="relative">
              <div>
                <JigsawImage
                  imageUrl={`/cards/${mythSections[activeMyth]}.quest.C07_on.png`}
                  faith={4}
                />
              </div>

              <div
                onClick={() => {
                  setShowInfo((prev) => !prev);
                  setActiveCard(quest?.type);
                }}
                className="absolute top-0 right-0 h-10 w-10"
              ></div>
              <QuestButton
                handlePrev={handlePrev}
                handleNext={handleNext}
                isCompleted={quest?.isCompleted}
                activeMyth={activeMyth}
                action={() => {
                  setShowPay(true);
                  window.open(quest?.link, "_blank");
                }}
              />
            </div>
          )}
        </div>
        <div className="flex justify-center items-center w-[20%]">
          <div
            onClick={() => {
              setActiveMyth((prev) => (prev + 1) % 4);
              setCurrQuest(0);
              setShowPay(false);
              setShowInfo(false);
              setShowClaim(false);
            }}
            className="bg-glass-black p-1 rounded-full cursor-pointer"
          >
            <ChevronsRight color="white" className="h-[30px] w-[30px]" />
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
      {showInfo && (
        <InfoCard
          activeCard={activeCard}
          isShared={quest?.isShared}
          handleClaimShareReward={handleClaimShareReward}
          handleShowInfo={() => {
            setShowInfo((prev) => !prev);
          }}
          activeMyth={activeMyth}
        />
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

export default Quests;
