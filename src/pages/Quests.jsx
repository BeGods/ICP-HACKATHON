import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";
import { categorizeQuestsByMythology } from "../utils/categorizeQuests";
import {
  claimQuest,
  claimQuestOrbsReward,
  claimShareReward,
  completeQuest,
} from "../utils/api";
import Footer from "../components/Common/Footer";
import JigsawImage from "../components/Pieces";
import InfoCard from "../components/Cards/QuestCards/InfoCard";
import PayCard from "../components/Cards/QuestCards/PayCard";
import OrbClaimCard from "../components/Cards/QuestCards/OrbClaimCard";
import Symbol from "../components/Common/Symbol";
import { useTranslation } from "react-i18next";
import { mythologies, mythSections } from "../utils/variables";
import { ToggleLeft, ToggleRight } from "../components/Common/SectionToggles";
import QuestCard from "../components/Cards/QuestCards/QuestCard";
import Header from "../components/Headers/Header";
import JigsawButton from "../components/Buttons/JigsawButton";
import IconButton from "../components/Buttons/IconButton";
import QuestButton from "../components/Buttons/QuestButton";
import MilestoneCard from "../components/Cards/MilestoneCard";
import Button from "../components/Buttons/Button";
import SecretCard from "../components/Cards/QuestCards/SecretCard";
import { showToast } from "../components/Toast/Toast";

const HeaderContent = ({ activeMyth, t }) => {
  return (
    <>
      <div className="flex flex-col flex-grow justify-start items-start text-white pl-5">
        <div className="text-left  gap-1 flex font-medium text-head">
          <span
            className={`text-white glow-myth-${mythSections[activeMyth]} uppercase`}
          >
            QUESTS
          </span>
        </div>
        <h1
          className={`text-${mythSections[activeMyth]}-text text-black-contour text-[17vw] font-${mythSections[activeMyth]}  uppercase -mt-4 -ml-2`}
        >
          {t(`mythologies.${mythSections[activeMyth]}`)}
        </h1>
      </div>
      <div className="h-full -mr-[14%] ml-auto mt-1">
        <Symbol myth={mythSections[activeMyth]} isCard={false} />
      </div>
    </>
  );
};

const Quests = () => {
  const { t } = useTranslation();
  const [showClaim, setShowClaim] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showShareReward, setShowShareReward] = useState(false);
  const [showClaimEffect, setShowClaimEffect] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [secretInfo, setSecretInfo] = useState(null);
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
  const quests = categorizeQuestsByMythology(questsData)
    [activeMyth][mythologies[activeMyth]]?.filter(
      (item) => item?.secret !== true
    )
    .sort((a, b) => a.isQuestClaimed - b.isQuestClaimed);

  const completedQuests = quests?.filter(
    (item) => item.isQuestClaimed === true
  );
  const quest = quests[currQuest];
  const secretQuests = categorizeQuestsByMythology(questsData)[activeMyth][
    mythologies[activeMyth]
  ]?.filter((item) => item?.secret === true);

  const handlePrev = () => {
    if (currQuest > 0) {
      setCurrQuest((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    const range =
      mythData[activeMyth].faith > 0 ? quests.length : quests.length - 1;
    if (currQuest < range) {
      setCurrQuest((prev) => prev + 1);
    }
  };

  const handleActiveParts = (faith) => {
    const activeParts = [];
    for (let i = 0; i < faith; i++) {
      activeParts.push(i);
    }

    return activeParts;
  };

  const handeUpdateOnClaim = () => {
    // update quest data
    const updatedQuestData = questsData.map((item) =>
      item._id === quest._id ? { ...item, isQuestClaimed: true } : item
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
    setShowComplete(false);
    showToast("quest_claim_success");
    setQuestsData(updatedQuestData);
    setGameData(updatedGameData);
  };

  const handleClaimShareReward = async (id) => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: id,
    };
    try {
      await claimShareReward(questData, token);
      setShowInfo(false);
      setShowShareReward(true);
      showToast("quest_share_success");

      // update quest data
      const updatedQuestData = questsData.map((item) =>
        item._id === id ? { ...item, isShared: true } : item
      );

      // update game data
      const updatedGameData = {
        ...gameData,
        multiColorOrbs: gameData.multiColorOrbs + 1,
      };
      setQuestsData(updatedQuestData);
      setGameData(updatedGameData);
    } catch (error) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("quest_share_error");
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
      setShowReward(true);

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
      showToast("orb_claim_success");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("orb_claim_error");
    }
  };

  const handleCompleteQuest = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: quest._id,
    };

    if (!quest.isCompleted) {
      try {
        await completeQuest(questData, token);
        setShowComplete(false);
        setShowPay(true);

        // update quest data
        const updatedQuestData = questsData.map((item) =>
          item._id === quest._id ? { ...item, isCompleted: true } : item
        );

        setQuestsData(updatedQuestData);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        console.log("quest_complete_error");
      }
    } else {
      setShowPay(true);
    }
  };

  const handleClaimQuest = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: quest._id,
    };
    try {
      await claimQuest(questData, token);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      setShowPay(false);
      console.log(errorMessage);
      showToast("quest_claim_error");
    }
  };

  const handleRedirect = () => {
    setShowComplete(true);
    window.open(quest?.link, "_blank");
  };

  useEffect(() => {}, [questsData, showClaim, showPay]);

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
      >
        <div
          className={`absolute top-0 left-0 h-full w-full filter-${mythSections[activeMyth]}`}
          style={{
            backgroundImage: `url(/assets/uxui/fof.base.background.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <Header
        children={
          <HeaderContent
            activeMyth={activeMyth}
            completedQuests={completedQuests}
            mythData={mythData}
            t={t}
          />
        }
      />
      {/* Content */}
      <div className="flex flex-grow justify-center items-center">
        {/* Quests */}
        <div className="flex items-center justify-center w-full">
          {currQuest < quests.length ? (
            <QuestCard
              quest={quest}
              activeMyth={activeMyth}
              completedQuests={completedQuests}
              curr={currQuest}
              showClaimEffect={showClaimEffect}
              t={t}
              handleClick={() => {
                setShowInfo((prev) => !prev);
              }}
              InfoIcon={
                <IconButton
                  isInfo={true}
                  activeMyth={activeMyth}
                  handleClick={() => {
                    setShowInfo((prev) => !prev);
                  }}
                  align={1}
                />
              }
              Button={
                quest.isCompleted || showComplete ? (
                  <QuestButton
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    message={t("buttons.complete")}
                    isCompleted={quest?.isQuestClaimed}
                    activeMyth={activeMyth}
                    lastQuest={quests.length}
                    action={handleCompleteQuest}
                    currQuest={currQuest}
                    faith={mythData[activeMyth].faith}
                    t={t}
                  />
                ) : (
                  <QuestButton
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    message={t("buttons.claim")}
                    isCompleted={quest?.isQuestClaimed}
                    lastQuest={quests.length}
                    t={t}
                    activeMyth={activeMyth}
                    faith={mythData[activeMyth].faith}
                    action={handleRedirect}
                    currQuest={currQuest}
                  />
                )
              }
            />
          ) : (
            <div className="relative">
              <div
                handleClick={() => {
                  setSecretInfo((prev) => !prev);
                }}
                className="h-full relative -mt-[42px]"
              >
                <JigsawImage
                  imageUrl={`/assets/cards/320px-${mythSections[activeMyth]}.whitelist.wood.jpg`}
                  activeParts={handleActiveParts(
                    gameData.mythologies[activeMyth].faith
                  )}
                />
                {gameData.mythologies[activeMyth].faith >= 12 && (
                  <IconButton
                    isInfo={true}
                    activeMyth={activeMyth}
                    handleClick={() => {
                      setSecretInfo((prev) => !prev);
                    }}
                    align={1}
                  />
                )}
              </div>
              <JigsawButton
                activeMyth={activeMyth}
                handleNext={handleNext}
                handlePrev={handlePrev}
                faith={gameData.mythologies[activeMyth].faith}
                t={t}
              />
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <Footer />
      <ToggleLeft
        handleClick={() => {
          setCurrQuest(0);
          setActiveMyth((prev) => (prev - 1 + 4) % 4);
          setShowPay(false);
          setShowInfo(false);
          setShowClaim(false);
        }}
        activeMyth={activeMyth}
      />
      <ToggleRight
        handleClick={() => {
          setCurrQuest(0);
          setActiveMyth((prev) => (prev + 1) % 4);
          setShowPay(false);
          setShowInfo(false);
          setShowClaim(false);
        }}
        activeMyth={activeMyth}
      />
      {showShareReward && (
        <MilestoneCard
          t={t}
          isMulti={true}
          isOrb={true}
          isBlack={false}
          activeMyth={activeMyth}
          closeCard={() => {
            setShowShareReward(false);
          }}
          Button={
            <Button
              message={t("buttons.claim")}
              handleClick={() => {
                setShowShareReward(false);
              }}
              activeMyth={activeMyth}
            />
          }
        />
      )}
      {showReward && (
        <MilestoneCard
          t={t}
          isOrb={true}
          isBlack={false}
          activeMyth={activeMyth}
          closeCard={() => {
            setShowClaimEffect(true);
            setTimeout(() => {
              setShowClaimEffect(false);
            }, 1000);
            setShowReward(false);
          }}
          Button={
            <Button
              message={t("buttons.claim")}
              handleClick={() => {
                setShowClaimEffect(true);
                setTimeout(() => {
                  setShowClaimEffect(false);
                }, 1000);
                setShowReward(false);
              }}
              activeMyth={activeMyth}
            />
          }
        />
      )}

      {/* Pay to claim quest */}
      {showPay && (
        <PayCard
          t={t}
          quest={quest}
          handlePay={handleClaimQuest}
          handleShowPay={() => {
            setShowPay((prev) => !prev);
          }}
          handleClaimEffect={() => {
            setShowClaim(true);
            setShowPay(false);
            handeUpdateOnClaim();
          }}
          activeMyth={activeMyth}
        />
      )}
      {/* get info about secret quest */}
      {secretInfo && (
        <SecretCard
          t={t}
          isShared={secretQuests[0]?.isShared}
          quest={secretQuests[0]}
          handleClaimShareReward={() =>
            handleClaimShareReward(secretQuests[0]._id)
          }
          handleShowInfo={() => {
            setSecretInfo((prev) => !prev);
          }}
          activeMyth={activeMyth}
        />
      )}
      {/* get info about quest */}
      {showInfo && (
        <InfoCard
          t={t}
          isShared={quest?.isShared}
          quest={quest}
          handleClaimShareReward={() => handleClaimShareReward(quest._id)}
          handleShowInfo={() => {
            setShowInfo((prev) => !prev);
          }}
          activeMyth={activeMyth}
        />
      )}
      {/* claim extra orb  */}
      {showClaim && (
        <OrbClaimCard
          t={t}
          quest={quest}
          handleOrbClaimReward={handleOrbClaimReward}
          handleShowClaim={() => {
            setShowClaim((prev) => !prev);
            setShowClaimEffect(true);
            setTimeout(() => {
              setShowClaimEffect(false);
            }, 1000);
          }}
          activeMyth={activeMyth}
        />
      )}
    </div>
  );
};

export default Quests;
