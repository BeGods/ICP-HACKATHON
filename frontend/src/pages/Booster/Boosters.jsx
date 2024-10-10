import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../context/context";
import {
  claimAutomataBooster,
  claimBurstBooster,
  claimLostQuest,
  claimQuestOrbsReward,
  claimShardsBooster,
  fetchLostQuests,
} from "../../utils/api";
import { useTranslation } from "react-i18next";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { mythologies, mythSections } from "../../utils/variables";
import BoosterCard from "../../components/Cards/Boosters/BoosterCard";
import BoosterBtn from "../../components/Buttons/BoosterBtn";
import Footer from "../../components/Common/Footer";
import BoosterClaim from "../../components/Cards/Boosters/BoosterClaim";
import { showToast } from "../../components/Toast/Toast";
import Header from "../../components/Headers/Header";
import { BoosterGuide } from "../../components/Common/Tutorial";
import MythInfoCard from "../../components/Cards/MythInfoCard";
import PayCard from "../../components/Cards/QuestCards/PayCard";
import OrbClaimCard from "../../components/Cards/QuestCards/OrbClaimCard";
import MilestoneCard from "../../components/Cards/MilestoneCard";
import BoosterHeader from "./Header";
import { useBoosterGuide } from "../../hooks/Tutorial";

const tele = window.Telegram?.WebApp;

const Boosters = () => {
  const { t } = useTranslation();
  const [lostQuest, setLostQuest] = useState(null);
  const [showClaim, setShowClaim] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [showMythCard, setShowMythCard] = useState(false);

  const {
    gameData,
    setGameData,
    setSection,
    activeMyth,
    setActiveMyth,
    setShowGlow,
    authToken,
  } = useContext(MyContext);
  const multiColorOrbs = gameData.multiColorOrbs;
  const mythData = gameData.mythologies[activeMyth].boosters;
  let guideTimeoutId = useRef(null);
  const disableRef = useRef(false);

  const handleClaimAutomata = async () => {
    if (disableRef.current === false) {
      disableRef.current = true;
      const mythologyName = {
        mythologyName: mythologies[activeMyth],
      };
      try {
        const response = await claimAutomataBooster(mythologyName, authToken);

        setGameData((prevData) => {
          const updatedData = {
            ...prevData,
            multiColorOrbs: prevData.multiColorOrbs - 1,
            mythologies: prevData.mythologies.map((item) =>
              item.name === mythologies[activeMyth]
                ? {
                    ...item,
                    boosters: response.updatedBooster,
                  }
                : item
            ),
          };

          return updatedData;
        });
        setActiveCard(null);
        disableRef.current = false;
        showToast("booster_success");
        setShowGlow("automata");
        setSection(0);
      } catch (error) {
        disableRef.current = false;
        setActiveCard(null);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        showToast("booster_error");
      }
    }
  };

  const handleCardChange = () => {
    setActiveCard("automata");
  };

  const [enableGuide, setEnableGuide] = useBoosterGuide(
    "tut3",
    handleClaimAutomata,
    handleCardChange,
    guideTimeoutId
  );

  // Quests Functions
  const handleOrbClaimReward = async () => {
    const questData = {
      questId: showClaim._id,
    };
    try {
      await claimQuestOrbsReward(questData, authToken);

      setShowClaim(null);
      setShowReward(true);

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
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("orb_claim_error");
    }
  };

  const handleClaimQuest = async () => {
    const questData = {
      questId: lostQuest._id,
    };
    try {
      await claimLostQuest(questData, authToken);
      setShowClaim(lostQuest);
      setLostQuest(null);

      // update game data
      const updatedGameData = {
        ...gameData,
        multiColorOrbs: gameData.multiColorOrbs - 1,
        mythologies: gameData.mythologies.map((myth) => {
          const requiredOrbs = lostQuest.requiredOrbs || {};
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
      showToast("quest_claim_success");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("quest_claim_error");
    }
  };

  // Boosters functions
  const handleLostQuest = async () => {
    try {
      const response = await fetchLostQuests(
        mythologies[activeMyth],
        authToken
      );
      if (response.lostQuests.length !== 0) {
        setLostQuest(response.lostQuests[0]);
      } else {
        showToast("lost_quest_success");
      }
    } catch (error) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("lost_quest_error");
    }
  };

  const handleClaimBooster = (e) => {
    e.preventDefault();

    if (activeCard === "minion" && disableRef.current === false) {
      handleClaimShards();
    } else if (activeCard === "automata" && disableRef.current === false) {
      handleClaimAutomata();
    } else if (activeCard === "burst" && disableRef.current === false) {
      handleClaimBurst();
    }
  };

  const handleClaimShards = async () => {
    if (disableRef.current === false) {
      disableRef.current === true;
      const mythologyName = {
        mythologyName: mythologies[activeMyth],
      };
      try {
        const response = await claimShardsBooster(mythologyName, authToken);
        setGameData((prevData) => {
          const updatedData = {
            ...prevData,
            multiColorOrbs: prevData.multiColorOrbs - 1,
            mythologies: prevData.mythologies.map((item) =>
              item.name === mythologies[activeMyth]
                ? {
                    ...item,
                    boosters: response.updatedBooster,
                  }
                : item
            ),
          };

          return updatedData;
        });

        setActiveCard(null);
        showToast("booster_success");
        setShowGlow("minion");
        setSection(0);
        disableRef.current === false;
      } catch (error) {
        setActiveCard(null);
        disableRef.current === false;
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        showToast("booster_error");
      }
    }
  };

  const handleClaimBurst = async () => {
    const mythologyName = {
      mythologyName: mythologies[activeMyth],
    };
    try {
      const response = await claimBurstBooster(mythologyName, authToken);

      setGameData((prevData) => {
        const updatedData = {
          ...prevData,
          multiColorOrbs: prevData.multiColorOrbs - 3,
          mythologies: prevData.mythologies.map((item) =>
            item.name === mythologies[activeMyth]
              ? {
                  ...item,
                  boosters: response.updatedBooster,
                }
              : item
          ),
        };

        return updatedData;
      });
      setActiveCard(null);
      showToast("booster_success");
      setSection(0);
    } catch (error) {
      setActiveCard(null);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("booster_error");
    }
  };

  useEffect(() => {}, [gameData, showClaim]);

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
            backgroundImage: `url(/assets/uxui/1160px-fof.base.background.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <Header
        children={
          <BoosterHeader
            activeMyth={activeMyth}
            gameData={gameData}
            t={t}
            multiColorOrbs={multiColorOrbs}
            showSymbol={() => {
              setShowMythCard(true);
            }}
          />
        }
      />
      {/* Content */}
      <div className="flex flex-grow justify-center items-center"></div>
      {/* Footer */}
      <Footer />
      <ToggleLeft
        handleClick={() => {
          setActiveMyth((prev) => (prev - 1 + 4) % 4);
        }}
        activeMyth={activeMyth}
      />
      <ToggleRight
        handleClick={() => {
          if (activeMyth < 4) {
            setActiveMyth((prev) => (prev + 1) % 4);
          } else {
            setSection(6);
          }
        }}
        activeMyth={activeMyth}
      />
      {/* BOOSTER CARDS */}
      <div className="flex justify-center h-screen w-screen absolute mx-auto">
        <div className="flex flex-col w-[70%] items-center justify-center gap-[15px]">
          {/* EXTRA BOOSTER */}
          {gameData.mythologies[activeMyth].isEligibleForBurst && (
            <BoosterCard
              isActive={
                !gameData.mythologies[activeMyth].boosters.isBurstActive &&
                gameData.mythologies[activeMyth].boosters.isBurstActiveToClaim
              }
              handleClick={() => {
                tele.HapticFeedback.notificationOccurred("success");
                setActiveCard("burst");
              }}
              isGuideActive={enableGuide}
              activeMyth={activeMyth}
              t={t}
              booster={6}
            />
          )}
          {/* AUTOMATA BOOSTER */}
          <BoosterCard
            isActive={!mythData.isAutomataActive}
            handleClick={() => {
              tele.HapticFeedback.notificationOccurred("success");
              setActiveCard("automata");
            }}
            activeMyth={activeMyth}
            t={t}
            booster={0}
            isGuideActive={enableGuide}
          />
          {/* SHARDS BOOSTER */}
          <BoosterCard
            isActive={mythData.isShardsClaimActive}
            handleClick={() => {
              tele.HapticFeedback.notificationOccurred("success");
              setActiveCard("minion");
            }}
            activeMyth={activeMyth}
            t={t}
            booster={2}
          />
          {/*  LOST QUESTS  */}
          <BoosterCard
            isActive={true}
            handleClick={handleLostQuest}
            activeMyth={activeMyth}
            t={t}
            booster={1}
          />
        </div>
      </div>
      {lostQuest && (
        <PayCard
          t={t}
          quest={lostQuest}
          handlePay={handleClaimQuest}
          handleShowPay={() => {
            setLostQuest(null);
          }}
          handleClaimEffect={() => {
            setShowClaim(true);
            setLostQuest(null);
            handeUpdateOnClaim();
          }}
          activeMyth={activeMyth}
          isBooster={true}
        />
      )}
      {showClaim && (
        <OrbClaimCard
          t={t}
          quest={showClaim}
          handleOrbClaimReward={handleOrbClaimReward}
          handleShowClaim={() => {
            setShowClaim((prev) => !prev);
          }}
          activeMyth={activeMyth}
        />
      )}
      {showReward && (
        <MilestoneCard
          t={t}
          isOrb={true}
          isBlack={false}
          isForge={true}
          activeMyth={activeMyth}
          closeCard={() => {}}
          handleClick={() => {
            tele.HapticFeedback.notificationOccurred("success");
            setShowReward(false);
          }}
        />
      )}
      {showMythCard && (
        <MythInfoCard
          close={() => {
            setShowMythCard(false);
          }}
        />
      )}

      {enableGuide && (
        <BoosterGuide
          handleClick={() => {
            setEnableGuide(false);
            guideTimeoutId.current = null;
            clearTimeout(guideTimeoutId);
          }}
        />
      )}

      {/* Booster card */}
      {(activeCard === "automata" ||
        activeCard === "minion" ||
        activeCard === "burst") && (
        <BoosterClaim
          activeCard={activeCard}
          activeMyth={activeMyth}
          mythData={mythData}
          closeCard={() => setActiveCard(null)}
          Button={
            <BoosterBtn
              activeCard={activeCard}
              mythData={mythData}
              handleClaim={handleClaimBooster}
              activeMyth={activeMyth}
              t={t}
            />
          }
        />
      )}
    </div>
  );
};

export default Boosters;
