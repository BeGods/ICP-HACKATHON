import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";
import { ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Footer from "../components/Footer";
import { formatOrbsWithLeadingZeros } from "../utils/gameManipulations";
import {
  claimAutomataBooster,
  claimLostQuest,
  claimQuestOrbsReward,
  claimShardsBooster,
  fetchLostQuests,
} from "../utils/api";

import OrbClaimCard from "../components/QuestCards/OrbClaimCard";
import ToastMesg from "../components/Toast/ToastMesg";
import { toast } from "react-toastify";
import { calculateRemainingTime } from "../utils/getBoosterCard";
import QuestSymbol from "../components/QuestCards/QuestSymbol";
import { useTranslation } from "react-i18next";

const symbols = {
  greek: 4,
  celtic: 2,
  norse: 5,
  egyptian: 1,
};

const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];
const mythSections = ["celtic", "egyptian", "greek", "norse"];
const boosterCards = ["earth", "air", "fire", "water"];

const Boosters = () => {
  const { t } = useTranslation();
  const [showCard, setShowCard] = useState(false);
  const [lostQuest, setLostQuest] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [quest, setQuest] = useState(0);
  const [showQuest, setShowQuest] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [isGlowing, setIsGlowing] = useState(0);
  const [isButtonGlowing, setIsButtonGlowing] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const { gameData, setGameData, activeMyth, setActiveMyth } =
    useContext(MyContext);
  const multiColorOrbs = gameData.multiColorOrbs;
  const mythData = gameData.mythologies[activeMyth].boosters;

  const handleButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
    }, 100);
  };

  const handleCloseButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
      setShowCard((prev) => !prev);
    }, 100);
  };

  const handleCloseQuestButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
      setShowQuest(false);
    }, 100);
  };

  // Quests Functions
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
          title={t("toasts.Quest_orb_claim.success.title")}
          desc={t("toasts.Quest_orb_claim.success.desc")}
          img={"/assets/icons/toast.success.svg"}
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
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      toast.error(
        <ToastMesg
          title={t("toasts.Quest_orb_claim.error.title")}
          desc={t("toasts.Quest_orb_claim.error.desc")}
          img={"/assets/icons/toast.fail.svg"}
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
      questId: lostQuest._id,
    };
    try {
      await claimLostQuest(questData, token);
      setShowQuest(false);
      setActiveCard(lostQuest[quest]?.type);
      setShowClaim(true);

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

      setGameData(updatedGameData);

      toast.success(
        <ToastMesg
          title={t("toasts.Quest_claim.success.title")}
          desc={t("toasts.Quest_claim.success.desc")}
          img={"/assets/icons/toast.success.svg"}
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
          title={t("toasts.Quest_claim_InsufficientOrbs.error.title")}
          desc={t("toasts.Quest_claim_InsufficientOrbs.error.desc")}
          img={"/assets/icons/toast.fail.svg"}
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

  // Boosters functions
  const handleLostQuest = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetchLostQuests(
        mythologies[activeMyth],
        accessToken
      );
      if (response.lostQuests.length !== 0) {
        setShowQuest(true);
        setLostQuest(response.lostQuests[0]);
      } else {
        toast.success(
          <ToastMesg
            title={t("toasts.Booster_Lost_Not_Available.error.title")}
            desc={t("toasts.Booster_Lost_Not_Available.error.title")}
            img={"/assets/icons/toast.fail.svg"}
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
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";

      toast.error(
        <ToastMesg
          title={"There was a problem in loading quests."}
          desc={errorMessage}
          img={"/assets/icons/toast.fail.svg"}
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
          title={t("toasts.Booster_ShardsClaim.success.title")}
          desc={t("toasts.Booster_ShardsClaim.success.desc")}
          img={"/assets/icons/toast.success.svg"}
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
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";

      toast.error(
        <ToastMesg
          title={t("toasts.Booster_InsufficientOrbs.error.title")}
          desc={t("toasts.Booster_InsufficientOrbs.error.desc")}
          img={"/assets/icons/toast.fail.svg"}
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
          title={t("toasts.Booster_AutomataClaim.success.title")}
          desc={t("toasts.Booster_AutomataClaim.success.desc")}
          img={"/assets/icons/toast.success.svg"}
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
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";

      toast.error(
        <ToastMesg
          title={t("toasts.Booster_InsufficientOrbs.error.title")}
          desc={t("toasts.Booster_InsufficientOrbs.error.desc")}
          img={"/assets/icons/toast.fail.svg"}
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
            backgroundImage: `url(/assets/uxui/fof.base.background_tiny.jpg)`,
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
            backgroundImage: `url(/assets/uxui/fof.header.paper_tiny.png)`,
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
        <div className="flex flex-col flex-grow justify-center items-center text-white pb-[20px]">
          <h1 className={`glow-${mythSections[activeMyth]} uppercase`}>
            {t(`sections.boosters`)}
          </h1>

          <div className="text-right -mt-[12px] font-medium   text-[22px]">
            {formatOrbsWithLeadingZeros(multiColorOrbs)}{" "}
            <span className="gradient-multi">{t(`keywords.orbs`)}</span>
          </div>
          <div className="text-right font-medium  -mt-1 text-[14px]">
            {formatOrbsWithLeadingZeros(gameData.mythologies[activeMyth].orbs)}{" "}
            <span className={`text-${mythSections[activeMyth]}-text`}>
              {t(`keywords.orbs`)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-grow justify-center items-center">
        <div className="flex justify-center items-center w-[20%]">
          <div
            onClick={() => {
              handleButtonClick(1);

              setActiveMyth((prev) => (prev - 1 + 4) % 4);
              setActiveCard("shard");
            }}
            className={`bg-glass-black p-[6px] rounded-full cursor-pointer ${
              isButtonGlowing === 1
                ? `glow-button-${mythSections[activeMyth]}`
                : ""
            }`}
          >
            <ChevronsLeft color="white" className="h-[30px] w-[30px]" />
          </div>
        </div>
        {/* BOOSTER CARDS */}
        <div className="flex flex-col items-center justify-center w-full gap-[15px]">
          {/* AUTOMATA BOOSTER */}
          <div
            className={`flex gap-1 border 
            ${
              !mythData.isAutomataActive
                ? `border-${mythSections[activeMyth]}-primary text-white`
                : "border-cardsGray text-cardsGray"
            } ${
              isGlowing === 3 ? `glow-button-${mythSections[activeMyth]}` : ""
            } rounded-button h-[90px] w-full bg-glass-black p-[15px] `}
            onMouseDown={() => handleClick(3)}
            onMouseUp={handleRemoveClick}
            onMouseLeave={handleRemoveClick}
            onTouchStart={() => handleClick(3)}
            onTouchEnd={handleRemoveClick}
            onTouchCancel={handleRemoveClick}
          >
            <div>
              <h1 className={`font-symbols text-[80px] p-0 -mt-7 -ml-2 `}>b</h1>{" "}
            </div>
            <div className={`flex flex-col flex-grow justify-center -ml-1 `}>
              <h1 className="text-[18px] uppercase">{t(`boosters.0.title`)}</h1>
              <h2 className="text-[14px]">{t(`boosters.0.desc`)}</h2>
            </div>
            <div className="flex justify-center items-center w-[8%] ">
              {!mythData.isAutomataActive ? (
                <ChevronRight
                  onClick={() => {
                    setShowCard(true);
                    setActiveCard("automata");
                  }}
                  className="h-[50px]"
                />
              ) : (
                <img src="/assets/icons/lock.svg" alt="lock" />
              )}
            </div>
          </div>
          {/* ACTIVE LOST QUESTS BOOSTER */}
          {/*
          <div
            className={`flex gap-1 border border-${
              mythSections[activeMyth]
            }-primary ${
              isGlowing === 2 ? `glow-button-${mythSections[activeMyth]}` : ""
            } rounded-button h-[90px] w-full bg-glass-black p-[15px]  text-white`}
            onMouseDown={() => handleClick(2)}
            onMouseUp={handleRemoveClick}
            onMouseLeave={handleRemoveClick}
            onTouchStart={() => handleClick(2)}
            onTouchEnd={handleRemoveClick}
            onTouchCancel={handleRemoveClick}
          >
            <div>
              <h1 className="font-symbols text-[75px] p-0 -mt-6 -ml-2">Q</h1>
            </div>
            <div className={`flex flex-col flex-grow justify-center`}>
              <h1 className="text-[18px]">LOST QUESTS</h1>
              <h2 className="text-[14px]">Energy 200%</h2>
            </div>
            <div className="flex justify-center items-center w-[8%]">
              <ChevronRight
                onClick={() => {
                  handleLostQuest();
                }}
                className="h-[50px]"
              />
            </div>
          </div> */}
          {/* DISABLED LOST QUESTS BOOSTER */}
          <div
            className={`flex gap-1 border border-cardsGray ${
              isGlowing === 2 ? `glow-button-${mythSections[activeMyth]}` : ""
            } rounded-button h-[90px] w-full bg-glass-black p-[15px]  text-cardsGray`}
            onMouseDown={() => handleClick(2)}
            onMouseUp={handleRemoveClick}
            onMouseLeave={handleRemoveClick}
            onTouchStart={() => handleClick(2)}
            onTouchEnd={handleRemoveClick}
            onTouchCancel={handleRemoveClick}
          >
            <div>
              <h1 className="font-symbols text-[75px] p-0 -mt-6 -ml-2">Q</h1>
            </div>
            <div className={`flex flex-col flex-grow justify-center`}>
              <h1 className="text-[18px] uppercase">{t(`boosters.1.title`)}</h1>
              <h2 className="text-[14px]">{t(`boosters.1.desc`)}</h2>
            </div>
            <div className="flex justify-center items-center w-[8%]">
              <img src="/assets/icons/lock.svg" alt="lock" />
            </div>
          </div>
          {/* SHARDS BOOSTER */}
          <div
            className={`flex gap-1 border  ${
              mythData.isShardsClaimActive
                ? `border-${mythSections[activeMyth]}-primary text-white`
                : "border-cardsGray text-cardsGray"
            } ${
              isGlowing === 1 ? `glow-button-${mythSections[activeMyth]}` : ""
            }  rounded-button h-[90px] w-full bg-glass-black p-[15px]  hover:glow-icon-celtic`}
            onMouseDown={() => handleClick(1)}
            onMouseUp={handleRemoveClick}
            onMouseLeave={handleRemoveClick}
            onTouchStart={() => handleClick(1)}
            onTouchEnd={handleRemoveClick}
            onTouchCancel={handleRemoveClick}
          >
            <h1 className="font-symbols text-[65px] p-0 -mt-4 -ml-1">A</h1>

            <div className={`flex flex-col flex-grow justify-center ml-2`}>
              <h1 className="text-[18px] uppercase">{t(`boosters.2.title`)}</h1>
              <h2 className="text-[14px]">{t(`boosters.2.desc`)}</h2>
            </div>
            <div className="flex justify-center items-center w-[8%]">
              {mythData.isShardsClaimActive ? (
                <ChevronRight
                  onClick={() => {
                    setShowCard(true);
                    setActiveCard("shard");
                  }}
                  className="h-[50px]"
                />
              ) : (
                <img src="/assets/icons/lock.svg" alt="lock" />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center w-[20%]">
          <div
            onClick={() => {
              handleButtonClick(2);

              setActiveMyth((prev) => (prev + 1) % 4);
            }}
            className={`bg-glass-black p-[6px] rounded-full cursor-pointer ${
              isButtonGlowing === 2
                ? `glow-button-${mythSections[activeMyth]}`
                : ""
            }`}
          >
            <ChevronsRight color="white" className={`h-[30px] w-[30px] `} />
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
              src={`/assets/cards/320px-${
                activeCard + "." + boosterCards[activeMyth]
              }1_tiny.png`}
              alt="card"
              className="w-full h-full mx-auto"
            />

            <div
              className={`absolute top-0 right-0 w-[55px] h-[55px] cursor-pointer `}
            >
              <img
                src="/assets/icons/close.svg"
                alt="close"
                className={`h-full w-full ml-auto -mt-6 -mr-6 rounded-full ${
                  isButtonGlowing === 4
                    ? `glow-button-${mythSections[activeMyth]}`
                    : ""
                }`}
                onClick={() => {
                  handleCloseButtonClick(4);
                }}
              />
            </div>
            <div className="relative">
              {/* <div className="absolute flex justify-center items-center w-full z-0">
                <div className="bg-black  h-[60px] w-[60px] rounded-full -mt-2"></div>
              </div> */}
              <div className="relative z-50">
                {activeCard === "automata" && mythData?.isAutomataActive ? (
                  <div
                    className={`flex items-center justify-between h-[60px] w-[192px] border border-${mythSections[activeMyth]}-primary  mx-auto  bg-glass-black z-50 text-white  rounded-button`}
                  >
                    <div className="flex justify-center items-center w-1/4 h-full"></div>
                    <div className="text-[16px] uppercase">
                      {calculateRemainingTime(mythData.automataStartTime)}
                    </div>
                    <div className="flex justify-center items-center w-1/4  h-full"></div>
                  </div>
                ) : activeCard === "shard" && !mythData?.isShardsClaimActive ? (
                  <div className="flex items-center justify-between h-[60px] w-[192px] mx-auto border border-${mythSections[activeMyth]}-primary   bg-glass-black text-white  rounded-button">
                    <div className="flex justify-center items-center w-1/4 h-full"></div>
                    <div className="text-[16px] uppercase">
                      {calculateRemainingTime(mythData.shardsLastClaimedAt)}
                    </div>
                    <div className="flex justify-center items-center w-1/4  h-full"></div>
                  </div>
                ) : (
                  <div
                    onClick={handleClaimBooster}
                    className={`flex items-center justify-between h-[60px] w-[192px] mx-auto border border-${mythSections[activeMyth]}-primary  bg-glass-black z-50 text-white  rounded-button`}
                  >
                    <div className="flex justify-center items-center w-[30%]  h-full  border-r border-borderGray">
                      <h1 className="text-xl  text-white rounded-full  w-full flex justify-center items-center">
                        2x
                      </h1>
                    </div>

                    <div className="text-[16px] uppercase">
                      {t(`buttons.buy`)}
                    </div>
                    <div className="flex justify-center items-center w-[30%] h-full pr-1 border-l border-borderGray">
                      <img
                        src={`/assets/uxui/240px-orb.multicolor-tiny.png`}
                        alt="orb"
                        className="p-1.5"
                      />
                      {/* <div className="absolute mt-auto z-10">
                        <img
                          src="/assets/icons/arrow.up.svg"
                          alt="upward"
                          className="z-10 mt-6"
                        />
                      </div> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* lost quests card */}
      {showQuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div>
            <div className="relative">
              <img
                src={`/assets/cards/320px-${lostQuest.type}_tiny.png`}
                alt="card"
                className={`w-full h-[75%] grayscale blur-sm`}
              />
              <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
                <div className="flex w-full">
                  <div className="flex flex-grow">
                    <div className="flex w-full mt-2 ml-[0.7375rem] font-symbols text-white text-[2rem]">
                      {Object.entries(lostQuest.requiredOrbs).map(
                        ([key, value]) => (
                          <div className="flex" key={key}>
                            {Array.from({ length: value }, (_, index) => (
                              <div
                                key={index}
                                className={`flex relative text-center justify-center items-center w-[45px] -ml-1.5 rounded-full glow-icon-${key.toLowerCase()}`}
                              >
                                <img
                                  src="/assets/uxui/240px-orb.base-tiny.png"
                                  alt="orb"
                                  className={`filter-orbs-${key.toLowerCase()} }`}
                                />
                                <span
                                  className={`absolute z-1 text-[25px] ${
                                    key.toLowerCase() === "egyptian" &&
                                    "ml-[2px]"
                                  } ${
                                    key.toLowerCase() === "greek" && "ml-[5px]"
                                  }`}
                                >
                                  {symbols[key.toLowerCase()]}
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex absolute w-full justify-end">
                    <img
                      src="/assets/icons/close.svg"
                      alt="info"
                      className={`w-[55px] h-[55px] ml-auto -mt-6 rounded-full -mr-6 ${
                        isButtonGlowing === 3
                          ? `glow-button-${mythSections[activeMyth]}`
                          : ""
                      }`}
                      onClick={() => {
                        handleButtonClick(3);
                        setShowQuest(false);
                      }}
                    />
                  </div>
                </div>
                <div
                  className={`flex relative items-center h-[19%] uppercase glow-card-${mythSections[activeMyth]} text-white`}
                >
                  <div
                    style={{
                      backgroundImage: `url(/assets/uxui/footer.paper_tiny.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: "100%",
                    }}
                    className={`filter-paper-${mythSections[activeMyth]} rounded-b-[15px]`}
                  />
                  <div className="flex justify-between w-full h-full items-center px-3 z-10">
                    <div>{lostQuest?.questName}</div>
                    <div className="">
                      <QuestSymbol myth={mythSections[activeMyth]} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={handleClaimQuest}
              className={`flex items-center justify-between h-[45px] w-[192px] mx-auto bg-glass-black border border-${mythSections[activeMyth]}-primary z-50 text-white  rounded-button`}
            >
              <div className="flex justify-center items-center w-1/4 h-full"></div>
              <div className="text-[16px] uppercase">Buy</div>
              <div className="flex justify-center items-center w-1/4  h-full"></div>
            </div>
          </div>
        </div>
        // <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
        //   <div className="w-[72%] rounded-lg shadow-lg mt-10">
        //     <div className="relative">
        //       <img
        //         src={`/cards/${lostQuest[quest]?.type}_off.png`}
        //         alt="card"
        //         className="w-full h-[75%]"
        //       />
        //       <div className="absolute top-0 right-0 h-10 w-10 cursor-pointer">
        //         <img
        //           src="/assets/icons/close.svg"
        //           alt="close"
        //           className={`w-[38px] h-[38px] mt-1 ${
        //             isButtonGlowing === 5
        //               ? `glow-button-${mythSections[activeMyth]}`
        //               : ""
        //           }`}
        //           onClick={() => {
        //             handleCloseQuestButtonClick(5);
        //           }}
        //         />
        //       </div>
        //     </div>

        //     <div
        //       onClick={handleClaimQuest}
        //       className={`flex items-center justify-between h-[45px] w-[192px] mx-auto bg-glass-black z-50 text-white  rounded-button`}
        //     >
        //       <div className="flex justify-center items-center w-1/4 h-full">
        //         <img
        //           src={`/images/multi-pay.png`}
        //           alt="orb"
        //           className="w-[32px] h-[32px]"
        //         />
        //       </div>
        //       <div className="text-[16px] uppercase">Buy</div>
        //       <div className="flex justify-center items-center w-1/4  h-full"></div>
        //     </div>
        //   </div>
        // </div>
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
// onClick={() => {
//   handleCloseQuestButtonClick(5);
// }}
