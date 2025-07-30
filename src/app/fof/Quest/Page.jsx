import { useCallback, useContext, useEffect, useState } from "react";
import { FofContext } from "../../../context/context";
import {
  categorizeQuestsByMythology,
  handleActiveParts,
} from "../../../helpers/quests.helper";
import {
  claimQuest,
  claimQuestOrbsReward,
  claimShareReward,
} from "../../../utils/api.fof";
import InfoCard from "../../../components/Cards/Info/QuestInfoCrd";
import PayCard from "../../../components/Cards/Quests/QuestPayCrd";
import OrbClaimCard from "../../../components/Cards/Quests/QuestOrbCrd";
import { useTranslation } from "react-i18next";
import { mythologies, mythSections } from "../../../utils/constants.fof";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import QuestCard from "../../../components/Cards/Quests/QuestCrd";
import IconBtn from "../../../components/Buttons/IconBtn";
import SecretCard from "../../../components/Cards/Info/WhitelistInfoCrd";
import { showToast } from "../../../components/Toast/Toast";
import MythInfoCard from "../../../components/Cards/Info/MythInfoCrd";
import QuestHeader from "./Header";
import { useQuestGuide } from "../../../hooks/Tutorial";
import { QuestGuide } from "../../../components/Tutorials/Tutorials";
import GameEndCrd from "../../../components/Cards/Reward/GameEnd";
import ReactHowler from "react-howler";
import { trackComponentView, trackEvent } from "../../../utils/ga";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import BgLayout from "../../../components/Layouts/BgLayout";
import CanvasImage from "../../../components/Cards/Canvas/CrdCanvas";
import { CardWrap } from "../../../components/Layouts/Wrapper";
import { PrimaryBtn } from "../../../components/Buttons/PrimaryBtn";
import { Check, ThumbsUp } from "lucide-react";
import { useOpenAd } from "../../../hooks/DappAds";

const tele = window.Telegram?.WebApp;

const Quests = () => {
  const { t } = useTranslation();
  const [showClaimEffect, setShowClaimEffect] = useState(false);
  const [enableGuide, setEnableGuide] = useQuestGuide("tutorial05");
  const [showToggle, setShowToggles] = useState(false);
  const {
    showCard,
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
    isTelegram,
    isTgMobile,
    isBrowser,
    setMinimize,
    setSection,
  } = useContext(FofContext);
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

  // fallback quest
  let initialQuestIndex = activeQuestIndex;

  if (initialQuestIndex === -1) {
    // inactive lost quests

    initialQuestIndex = quests?.findIndex(
      (item) => item.isQuestClaimed === false && item.status === "Inactive"
    );
  }

  const numUnclaimedActiveQuests =
    quests?.filter((item) => item.status === "Active" && !item.isQuestClaimed)
      ?.length || 0;

  if (initialQuestIndex === -1) {
    // completed quests
    initialQuestIndex = quests?.findIndex(
      (item) => item.isQuestClaimed === true
    );
  }

  const noOfUnclaimedQuests = numUnclaimedActiveQuests + lostQuests.length || 0;

  // curr quest
  const [currQuest, setCurrQuest] = useState(initialQuestIndex);
  const [buttonFlip, setButtonFlip] = useState(false);
  const quest = quests?.[currQuest];

  // secret quests
  const secretQuests = categorizeQuestsByMythology(questsData)[activeMyth][
    mythologies[activeMyth]
  ]?.filter((item) => item?.secret === true);

  //* toggle handler functions
  const handlePrev = () => {
    setCurrQuest(
      (prev) => (prev - 1 + (quests.length + 1)) % (quests.length + 1)
    );
  };

  const handleNext = () => {
    setCurrQuest((prev) => (prev + 1) % (quests.length + 1));
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

  const handleCanvasClick = () => {
    if (gameData.mythologies[activeMyth].faith >= 18) {
      setShowCard(
        <GameEndCrd
          activeMyth={activeMyth}
          handleClick={() => {
            setShowCard(null);
          }}
        />
      );
    }
  };

  const { loadAd, isReady } = useOpenAd({
    callReward: handleCanvasClick,
  });

  return (
    <BgLayout>
      {/* Header */}
      <QuestHeader
        totalQuests={quests}
        quest={quest}
        activeMyth={activeMyth}
        currQuest={currQuest}
        completedQuests={completedQuests}
        lostQuests={noOfUnclaimedQuests}
        mythData={mythData}
        showClaimEffect={showClaimEffect}
        setCurrQuest={(idx) => setCurrQuest(idx)}
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

      <div className="center-section">
        {currQuest < quests.length ? (
          <>
            <QuestCard
              quest={quest}
              isGuideActive={enableGuide}
              activeMyth={activeMyth}
              showClaimEffect={showClaimEffect}
              flipButton={() => setButtonFlip((prev) => !prev)}
              t={t}
              InfoCard={
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
              }
            />
          </>
        ) : (
          <CardWrap
            isPacket={true}
            Front={
              <div
                className={`w-full h-full relative flex justify-center items-center`}
              >
                <CanvasImage
                  isTelegram={isTelegram}
                  isTgMobile={isTgMobile}
                  grid={[3, 6]}
                  handleClick={() => {}}
                  imageUrl={assets.whitelist[mythSections[activeMyth]]}
                  activeParts={handleActiveParts(
                    gameData.mythologies[activeMyth].faith
                  )}
                />
                <IconBtn
                  isJigsaw={true}
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
                />
              </div>
            }
            Back={
              <div className="flex h-full w-full justify-center items-center">
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
            }
          />
        )}
      </div>

      <div className="absolute flex flex-col justify-center items-center w-full bottom-0 mb-safeBottom pb-1">
        {currQuest < quests.length ? (
          <div className={`button ${buttonFlip ? "flipped" : ""}`}>
            <div
              className={`button__face button__face--front flex justify-center items-center`}
            >
              <PrimaryBtn
                showGlow={quest?.isQuestClaimed}
                mode="action"
                centerContent={<Check size={"1.75rem"} strokeWidth={5} />}
                handleCenterClick={handleButtonClick}
                handleNext={handleNext}
                handlePrev={handlePrev}
                isFlagged={quest?.isQuestClaimed}
              />
            </div>
            <div className="button__face button__face--back z-50 flex justify-center items-center">
              <PrimaryBtn
                mode="share"
                onClick={() => {
                  if (quest?.isShared) {
                  } else {
                    handleClaimShareReward();
                  }
                }}
                rightContent={1}
                disable={quest?.isShared}
                link={`https://twitter.com/intent/tweet?text=%F0%9F%8C%8D%20Check%20it%20out!%20%F0%9F%92%AF%0ADive%20into%20world%20mythologies%20and%20Play-2-Learn%20with%20Forges%20of%20Faith%20from%20the%20BeGODS%20Mythoverse!%20%F0%9F%9B%A1%F0%9F%94%A5%0A%40BattleofGods_io%0Ahttps%3A%2F%2Fx.com%2FBattleofGods_io%2Fstatus%2F${quest.link[0]}%0A%0A%F0%9F%8E%AE%20Play%20now%3A%20https%3A%2F%2Fplay.begods.games`}
              />
            </div>
          </div>
        ) : (
          <div className={`button`}>
            <div
              className={`button__face button__face--front flex justify-center items-center`}
            >
              <PrimaryBtn
                mode="action"
                centerContent={
                  <ThumbsUp
                    size={"1.75rem"}
                    color={
                      gameData.mythologies[activeMyth].faith < 18
                        ? "gray"
                        : "white"
                    }
                  />
                }
                handleNext={handleNext}
                handlePrev={handlePrev}
                handleCenterClick={() => {
                  if (gameData.mythologies[activeMyth].faith >= 18 && isReady) {
                    loadAd();
                  }
                }}
              />
            </div>
            <div className="button__face button__face--back z-50 flex justify-center items-center"></div>
          </div>
        )}
      </div>

      <div className="absolute">
        <ReactHowler
          src={assets.audio.forgeBg}
          playing={enableSound}
          loop
          preload={true}
          html5={true}
        />
      </div>
      {/* Toggles */}
      {showToggle && (
        <div className="z-50">
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
          <ToggleBack
            minimize={2}
            handleClick={() => {
              setSection(2);
              setMinimize(2);
            }}
            activeMyth={8}
          />
        </div>
      )}
    </BgLayout>
  );
};

export default Quests;
