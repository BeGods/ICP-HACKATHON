import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import {
  categorizeQuestsByMythology,
  handleActiveParts,
} from "../../helpers/quests.helper";
import {
  claimQuest,
  claimQuestOrbsReward,
  claimShareReward,
  completeQuest,
} from "../../utils/api";

import JigsawImage from "../../components/Cards/Jigsaw/JigsawCrd";
import InfoCard from "../../components/Cards/Quests/QuestInfoCrd";
import PayCard from "../../components/Cards/Quests/QuestPayCrd";
import OrbClaimCard from "../../components/Cards/Quests/QuestOrbCrd";
import { useTranslation } from "react-i18next";
import { mythologies, mythSections } from "../../utils/constants";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import QuestCard from "../../components/Cards/Quests/QuestCrd";
import JigsawButton from "../../components/Buttons/JigsawBtn";
import IconBtn from "../../components/Buttons/IconBtn";
import QuestButton from "../../components/Buttons/QuestBtn";
import MilestoneCard from "../../components/Cards/Reward/OrbRewardCrd";
import SecretCard from "../../components/Cards/Info/WhitelistInfoCrd";
import { showToast } from "../../components/Toast/Toast";
import MythInfoCard from "../../components/Cards/Info/MythInfoCrd";
import QuestHeader from "./Header";
import { useQuestGuide } from "../../hooks/Tutorial";
import { QuestGuide } from "../../components/Common/Tutorials";

const tele = window.Telegram?.WebApp;

const Quests = () => {
  const { t } = useTranslation();
  const [showClaimEffect, setShowClaimEffect] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [enableGuide, setEnableGuide] = useQuestGuide("tut2");

  const {
    questsData,
    setQuestsData,
    gameData,
    setGameData,
    activeMyth,
    setActiveMyth,
    authToken,
    setKeysData,
    setShowCard,
  } = useContext(MyContext);
  const mythData = gameData.mythologies;
  const quests = categorizeQuestsByMythology(questsData)[activeMyth][
    mythologies[activeMyth]
  ]?.sort((a, b) => {
    // First condition: Inactive and isQuestClaimed is false
    if (a.status === "Inactive" && !a.isQuestClaimed) return -1;
    if (b.status === "Inactive" && !b.isQuestClaimed) return 1;

    // Second condition: Active and isQuestClaimed is false
    if (a.status === "Active" && !a.isQuestClaimed) return -1;
    if (b.status === "Active" && !b.isQuestClaimed) return 1;

    // Third condition: Active and isQuestClaimed is true
    if (a.status === "Active" && a.isQuestClaimed) return -1;
    if (b.status === "Active" && b.isQuestClaimed) return 1;

    return 0;
  });

  const todaysQuest = quests.findIndex((item) => item.status === "Active");

  // completed quests
  const completedQuests = quests?.filter(
    (item) => item.isQuestClaimed === true
  );

  const lostQuests = quests?.filter(
    (item) => item.isQuestClaimed === false && item.status === "Inactive"
  );

  const [currQuest, setCurrQuest] = useState(todaysQuest);
  const quest = quests[currQuest];

  // secret quests
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

  const handeUpdateOnClaim = () => {
    // update quest data
    const updatedQuestData = questsData.map((item) =>
      item._id === quest._id ? { ...item, isQuestClaimed: true } : item
    );

    const currQuest = questsData.filter((item) => item._id === quest._id);
    const currQuestKeys = Object.keys(currQuest[0].requiredOrbs)
      .map((item) => mythologies.indexOf(item))
      .join("");

    // update game data
    const updatedGameData = {
      ...gameData,
      multiColorOrbs:
        gameData.multiColorOrbs - (quest.requiredOrbs.MultiOrb || 0),
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
    setKeysData((prev) => [...prev, currQuestKeys]);
    setGameData(updatedGameData);
  };

  const handleClaimShareReward = async (id) => {
    const questData = {
      questId: id,
    };
    try {
      await claimShareReward(questData, authToken);
      setShowCard(
        <MilestoneCard
          t={t}
          isMulti={true}
          isOrb={true}
          isBlack={false}
          activeMyth={activeMyth}
          closeCard={() => {
            setShowCard(null);
          }}
          handleClick={() => {
            tele.HapticFeedback.notificationOccurred("success");
            setShowCard(null);
          }}
        />
      );
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
    const questData = {
      questId: quest._id,
    };
    try {
      await claimQuestOrbsReward(questData, authToken);
      setShowCard(null);
      setShowCard(
        <MilestoneCard
          t={t}
          isOrb={true}
          isBlack={false}
          isForge={true}
          activeMyth={activeMyth}
          closeCard={() => {}}
          handleClick={() => {
            tele.HapticFeedback.notificationOccurred("success");
            setShowClaimEffect(true);
            setTimeout(() => {
              setShowClaimEffect(false);
            }, 1000);
            setShowCard(null);
          }}
        />
      );

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
    const questData = {
      questId: quest._id,
    };

    if (!quest.isCompleted) {
      try {
        await completeQuest(questData, authToken);
        setShowComplete(false);
        setShowCard(
          <PayCard
            t={t}
            quest={quest}
            handlePay={handleClaimQuest}
            handleShowPay={() => {
              setShowCard(null);
            }}
            handleClaimEffect={() => {
              setShowCard(
                <OrbClaimCard
                  t={t}
                  quest={quest}
                  handleOrbClaimReward={handleOrbClaimReward}
                  handleShowClaim={() => {
                    setShowCard(null);
                    setShowClaimEffect(true);
                    setTimeout(() => {
                      setShowClaimEffect(false);
                    }, 1000);
                  }}
                  activeMyth={activeMyth}
                />
              );
              setShowCard(null);

              handeUpdateOnClaim();
            }}
            activeMyth={activeMyth}
          />
        );

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
      setShowCard(
        <PayCard
          t={t}
          quest={quest}
          handlePay={handleClaimQuest}
          handleShowPay={() => {
            setShowCard(null);
          }}
          handleClaimEffect={() => {
            setShowCard(
              <OrbClaimCard
                t={t}
                quest={quest}
                handleOrbClaimReward={handleOrbClaimReward}
                handleShowClaim={() => {
                  setShowCard(null);
                  setShowClaimEffect(true);
                  setTimeout(() => {
                    setShowClaimEffect(false);
                  }, 1000);
                }}
                activeMyth={activeMyth}
              />
            );
            setShowCard(null);

            handeUpdateOnClaim();
          }}
          activeMyth={activeMyth}
        />
      );
    }
  };

  const handleClaimQuest = async () => {
    const questData = {
      questId: quest._id,
    };
    try {
      await claimQuest(questData, authToken);
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      setShowCard(null);
      console.log(errorMessage);
      showToast("quest_claim_error");
      return false;
    }
  };

  const handleRedirect = () => {
    setShowComplete(true);
    window.open(quest?.link, "_blank");
  };

  useEffect(() => {
    if (enableGuide) {
      setShowCard(
        <QuestGuide
          handleClick={() => {
            setShowCard(null);
          }}
        />
      );
    }
  }, [enableGuide]);

  useEffect(() => {}, [questsData]);

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
            backgroundImage: `url(/assets/uxui/1280px-fof.base.background.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <QuestHeader
        activeMyth={activeMyth}
        todayQuest={todaysQuest}
        currQuest={currQuest}
        completedQuests={completedQuests}
        lostQuests={lostQuests}
        mythData={mythData}
        showClaimEffect={showClaimEffect}
        showSymbol={() => {
          setShowCard(
            <MythInfoCard
              close={() => {
                setShowCard(null);
              }}
            />
          );
        }}
        t={t}
      />

      {/* Content */}
      <div className="flex mt-7 justify-center items-center h-screen w-screen absolute mx-auto">
        <div className="flex items-center justify-center w-full">
          {currQuest < quests.length ? (
            <QuestCard
              quest={quest}
              isGuideActive={enableGuide}
              activeMyth={activeMyth}
              completedQuests={completedQuests}
              curr={currQuest}
              showClaimEffect={showClaimEffect}
              t={t}
              handleClick={() => {
                if (!enableGuide) {
                  tele.HapticFeedback.notificationOccurred("success");
                  setShowCard(
                    <InfoCard
                      t={t}
                      isShared={quest?.isShared}
                      quest={quest}
                      handleClaimShareReward={() =>
                        handleClaimShareReward(quest._id)
                      }
                      handleShowInfo={() => {
                        setShowCard(null);
                      }}
                      activeMyth={activeMyth}
                    />
                  );
                }
              }}
              InfoIcon={
                <IconBtn
                  isInfo={true}
                  activeMyth={activeMyth}
                  handleClick={() => {
                    setShowCard(
                      <InfoCard
                        t={t}
                        isShared={quest?.isShared}
                        quest={quest}
                        handleClaimShareReward={() =>
                          handleClaimShareReward(quest._id)
                        }
                        handleShowInfo={() => {
                          setShowCard(null);
                        }}
                        activeMyth={activeMyth}
                      />
                    );
                  }}
                  align={1}
                />
              }
              Button={
                quest.isCompleted || showComplete ? (
                  <QuestButton
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    message={"Complete"}
                    isCompleted={quest?.isQuestClaimed}
                    activeMyth={activeMyth}
                    lastQuest={quests.length - 1}
                    action={handleCompleteQuest}
                    currQuest={currQuest}
                    faith={mythData[activeMyth].faith}
                    t={t}
                  />
                ) : (
                  <QuestButton
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    message={"claim"}
                    isCompleted={quest?.isQuestClaimed}
                    lastQuest={quests.length - 1}
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
                  setShowCard(
                    <SecretCard
                      t={t}
                      isShared={secretQuests[0]?.isShared}
                      quest={secretQuests[0]}
                      handleClaimShareReward={() =>
                        handleClaimShareReward(secretQuests[0]._id)
                      }
                      handleShowInfo={() => {
                        setShowCard(null);
                      }}
                      activeMyth={activeMyth}
                    />
                  );
                }}
                className="h-full relative -mt-[66px]"
              >
                <JigsawImage
                  handleClick={() => {}}
                  imageUrl={`/assets/cards/320px-${mythSections[activeMyth]}.whitelist.wood.jpg`}
                  activeParts={handleActiveParts(
                    gameData.mythologies[activeMyth].faith
                  )}
                />
                {gameData.mythologies[activeMyth].faith >= 12 && (
                  <IconBtn
                    isInfo={true}
                    activeMyth={activeMyth}
                    handleClick={() => {
                      setShowCard(
                        <SecretCard
                          t={t}
                          isShared={secretQuests[0]?.isShared}
                          quest={secretQuests[0]}
                          handleClaimShareReward={() =>
                            handleClaimShareReward(secretQuests[0]._id)
                          }
                          handleShowInfo={() => {
                            setShowCard(null);
                          }}
                          activeMyth={activeMyth}
                        />
                      );
                    }}
                    align={1}
                  />
                )}
              </div>
              <JigsawButton
                handleClick={() => {}}
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

      {/* Toggles */}
      <ToggleLeft
        handleClick={() => {
          setCurrQuest(0);
          setActiveMyth((prev) => (prev - 1 + 4) % 4);
        }}
        activeMyth={activeMyth}
      />
      <ToggleRight
        handleClick={() => {
          setCurrQuest(0);
          setActiveMyth((prev) => (prev + 1) % 4);
        }}
        activeMyth={activeMyth}
      />
    </div>
  );
};

export default Quests;
