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
} from "../../utils/api";
import JigsawImage from "../../components/Cards/Jigsaw/JigsawCrd";
import InfoCard from "../../components/Cards/Info/QuestInfoCrd";
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
import SecretCard from "../../components/Cards/Info/WhitelistInfoCrd";
import { showToast } from "../../components/Toast/Toast";
import MythInfoCard from "../../components/Cards/Info/MythInfoCrd";
import QuestHeader from "./Header";
import { useQuestGuide } from "../../hooks/Tutorial";
import { QuestGuide } from "../../components/Common/Tutorials";
import ShareButton from "../../components/Buttons/ShareBtn";
import GameEndCrd from "../../components/Cards/Reward/GameEnd";
import ReactHowler from "react-howler";
import { trackComponentView, trackEvent } from "../../utils/ga";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const Quests = () => {
  const { t } = useTranslation();
  const [showClaimEffect, setShowClaimEffect] = useState(false);
  const [enableGuide, setEnableGuide] = useQuestGuide("tutorial05");
  const [showToggle, setShowToggles] = useState(false);
  const [flipped, setFlipped] = useState(false);
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
    showBooster,
    setShowBooster,
    assets,
    enableSound,
    enableHaptic,
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

  // Filter for different quest categories
  const completedQuests = quests?.filter(
    (item) => item.isQuestClaimed === true
  );

  const lostQuests = quests?.filter(
    (item) => item.isQuestClaimed === false && item.status === "Inactive"
  );

  const activeQuestIndex = quests?.findIndex(
    (item) => item.status === "Active"
  );

  // Determine the fallback quest
  let initialQuestIndex = activeQuestIndex;

  if (initialQuestIndex === -1) {
    // No active quest, check for lost quests
    initialQuestIndex = quests?.findIndex(
      (item) => item.isQuestClaimed === false && item.status === "Inactive"
    );
  }

  if (initialQuestIndex === -1) {
    // No active or lost quests, check for completed quests
    initialQuestIndex = quests?.findIndex(
      (item) => item.isQuestClaimed === true
    );
  }

  // Initialize state with the determined quest
  const [currQuest, setCurrQuest] = useState(initialQuestIndex);
  const quest = quests?.[currQuest];

  // secret quests
  const secretQuests = categorizeQuestsByMythology(questsData)[activeMyth][
    mythologies[activeMyth]
  ]?.filter((item) => item?.secret === true);

  //* toggle handler functions
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

  //* state update handler
  const handeUpdateOnClaim = () => {
    // update quest data
    const updatedQuestData = questsData.map((item) =>
      item._id === quest._id ? { ...item, isQuestClaimed: true } : item
    );

    const curr = questsData.filter((item) => item._id === quest._id);
    const currQuestKeys = Object.keys(curr[0].requiredOrbs)
      .map((myth) => {
        const index = mythologies.indexOf(myth);
        const count = curr[0].requiredOrbs[myth];

        return index.toString().repeat(count);
      })
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

    showToast("quest_claim_success");
    setQuestsData(updatedQuestData);
    setKeysData((prev) => [...prev, currQuestKeys]);
    setGameData(updatedGameData);
  };

  //* claim quest handler
  const handleClaimQuest = async () => {
    const questData = {
      questId: quest._id,
    };

    try {
      await claimQuest(questData, authToken);
      trackEvent("purchase", "claim_quest", "success");
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

  //* share reward handler
  const handleClaimShareReward = async (id) => {
    handleClickHaptic(tele, enableHaptic);

    const questData = {
      questId: quest._id,
    };
    try {
      await claimShareReward(questData, authToken);
      trackEvent("rewards", "claim_quest_info_reward", "success");
      showToast("quest_share_success");

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
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("quest_share_error");
    }
  };

  //* after claim reward handler
  const handleOrbClaimReward = async () => {
    const questData = {
      questId: quest._id,
    };

    try {
      await claimQuestOrbsReward(questData, authToken);
      setCurrQuest(quests.length + 1);
      setShowCard(null);
      setShowClaimEffect(true);
      setTimeout(() => {
        setShowClaimEffect(false);
      }, 1000);

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

  //* action button
  const handleButtonClick = () => {
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
                setCurrQuest(quests.length + 1);
                setShowCard(null);
                setShowClaimEffect(true);
                setTimeout(() => {
                  setShowClaimEffect(false);
                }, 1000);
              }}
              activeMyth={activeMyth}
            />
          );

          handeUpdateOnClaim();
        }}
        activeMyth={activeMyth}
      />
    );
  };

  useEffect(() => {
    if (showBooster === "quest") {
      setCurrQuest(quests.length + 1);
      setTimeout(() => {
        setShowClaimEffect(true);
        setTimeout(() => {
          setShowClaimEffect(false);
          setShowBooster(null);
        }, 1000);
      }, 500);
    }
  }, [questsData, currQuest]);

  useEffect(() => {
    // enable guide
    if (enableGuide) {
      setShowCard(
        <QuestGuide
          currQuest={quest}
          handleClick={() => {
            setShowCard(null);
          }}
        />
      );
    }
  }, [enableGuide]);

  useEffect(() => {
    // ga
    trackComponentView("quests");

    // toggle effect
    setTimeout(() => {
      setShowToggles(true);
    }, 300);
  }, []);

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
            backgroundImage: `url(${assets.uxui.basebg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <QuestHeader
        totalQuests={quests}
        quest={quest}
        activeMyth={activeMyth}
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
      <div className="flex justify-center items-center h-screen w-screen absolute mx-auto">
        {currQuest < quests.length ? (
          <QuestCard
            quest={quest}
            isGuideActive={enableGuide}
            activeMyth={activeMyth}
            showClaimEffect={showClaimEffect}
            t={t}
            ShareButton={
              <ShareButton
                isOrbClaimCard={true}
                isShared={quest?.isShared}
                isInfo={true}
                handleClaim={handleClaimShareReward}
                activeMyth={activeMyth}
                link={`https://twitter.com/intent/tweet?text=Check%20it%20out!%20%F0%9F%92%AF%0A%0ALearn%20about%20world%20mythologies%20and%20Play%20Forges%20of%20Faith%20from%20BeGODS%20Mythoverse!%20%F0%9F%9B%A1%EF%B8%8F%F0%9F%94%A5%40BattleofGods_io%0Ahttps%3A%2F%2Fx.com%2FBattleofGods_io%2Fstatus%2F${quest.link[0]}%0A%0A%F0%9F%8E%AE%20Join%20now%3A%20http%3A%2F%2Ft.me%2FBeGods_bot%0A%0A%23FoF%20%23ForgesOfFaith%20%23Play2Learn%20%23BeGodsTMA&via=BattleofGods_io`}
                t={t}
              />
            }
            InfoCard={
              <InfoCard
                t={t}
                isShared={quest?.isShared}
                quest={quest}
                handleClaimShareReward={() => handleClaimShareReward(quest._id)}
                handleShowInfo={() => {
                  setShowCard(null);
                }}
                activeMyth={activeMyth}
              />
            }
            Button={
              <QuestButton
                handlePrev={handlePrev}
                handleNext={handleNext}
                isCompleted={quest?.isQuestClaimed}
                activeMyth={activeMyth}
                lastQuest={quests.length - 1}
                action={handleButtonClick}
                currQuest={currQuest}
                faith={mythData[activeMyth].faith}
                t={t}
              />
            }
          />
        ) : (
          <div className="flex flex-col  mt-[10vh] gap-[28px] items-center justify-center w-full h-full">
            <div
              className={`card ${
                flipped ? "flipped" : ""
              } w-[70%] h-[55%] z-[99]`}
            >
              <div
                className={`card__face card__face--front ${
                  showClaimEffect && "scale-reward"
                }  relative flex justify-center items-center`}
              >
                <JigsawImage
                  handleClick={() => {}}
                  imageUrl={assets.whitelist[mythSections[activeMyth]]}
                  activeParts={handleActiveParts(
                    gameData.mythologies[activeMyth].faith
                  )}
                />
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
                  align={0}
                />
              </div>
              <div className="card__face card__face--back flex justify-center items-center">
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
              </div>
            </div>
            <JigsawButton
              handleClick={() => {
                if (gameData.mythologies[activeMyth].faith >= 12) {
                  setShowCard(
                    <GameEndCrd
                      handleClick={() => {
                        setShowCard(null);
                      }}
                    />
                  );
                }
              }}
              activeMyth={activeMyth}
              handleNext={handleNext}
              handlePrev={handlePrev}
              faith={gameData.mythologies[activeMyth].faith}
              t={t}
            />
          </div>
        )}{" "}
        {/* Flp trigger for Jigsaw */}
        {currQuest === quests.length && (
          <div
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setFlipped((prev) => !prev);
            }}
            className="absolute -mt-[60px] flex justify-end w-[70%] h-[55%] z-[99]"
          >
            <div className="h-[60px] w-[60px] rounded-full -mt-[25px] -mr-[25px]"></div>
          </div>
        )}
      </div>

      <ReactHowler
        src={assets.audio.forgeBg}
        playing={enableSound}
        loop
        preload={true}
        html5={true}
      />

      {/* Toggles */}
      {showToggle && (
        <>
          <ToggleLeft
            minimize={2}
            handleClick={() => {
              setCurrQuest(0);
              setActiveMyth((prev) => (prev - 1 + 4) % 4);
            }}
            activeMyth={activeMyth}
          />
          <ToggleRight
            minimize={2}
            handleClick={() => {
              setCurrQuest(0);
              setActiveMyth((prev) => (prev + 1) % 4);
            }}
            activeMyth={activeMyth}
          />
        </>
      )}
    </div>
  );
};

export default Quests;
