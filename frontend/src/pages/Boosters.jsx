import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";
import {
  claimAutomataBooster,
  claimBurstBooster,
  claimLostQuest,
  claimQuestOrbsReward,
  claimShardsBooster,
  fetchLostQuests,
} from "../utils/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ToggleLeft, ToggleRight } from "../components/Common/SectionToggles";
import { mythologies, mythSections } from "../utils/variables";
import BoosterCard from "../components/Cards/Boosters/BoosterCard";
import BoosterButtom from "../components/Buttons/BoosterButtom";
import Symbol from "../components/Common/Symbol";
import ToastMesg from "../components/Toast/ToastMesg";
import Footer from "../components/Common/Footer";
import BoosterClaim from "../components/Cards/Boosters/BoosterClaim";
import { showToast } from "../components/Toast/Toast";
import Header from "../components/Headers/Header";
import { BoosterGuide } from "../components/Common/Tutorial";

const HeaderContent = ({ activeMyth, t }) => {
  return (
    <>
      <div className="h-full -ml-[14%] mr-auto mt-1">
        <Symbol myth={mythSections[activeMyth]} isCard={false} />
      </div>
      <div className="flex flex-col flex-grow justify-start items-end text-white pr-5">
        <div className="text-right  gap-1 flex font-medium text-head">
          <span
            className={`text-white glow-myth-${mythSections[activeMyth]} uppercase`}
          >
            <span>BOOSTER</span>
          </span>
        </div>
        <h1
          className={`text-${mythSections[activeMyth]}-text text-black-contour text-[17vw] font-${mythSections[activeMyth]}  uppercase -mt-4 -ml-2`}
        >
          {t(`mythologies.${mythSections[activeMyth]}`)}
        </h1>
      </div>
    </>
  );
};

const Boosters = () => {
  const { t } = useTranslation();
  const [showCard, setShowCard] = useState(false);
  const [lostQuest, setLostQuest] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [quest, setQuest] = useState(0);
  const [showQuest, setShowQuest] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [enableGuide, setEnableGuide] = useState(false);
  const {
    gameData,
    setGameData,
    setSection,
    activeMyth,
    setActiveMyth,
    setShowBooster,
    setShowGlow,
  } = useContext(MyContext);
  const multiColorOrbs = gameData.multiColorOrbs;
  const mythData = gameData.mythologies[activeMyth].boosters;

  useEffect(() => {
    let guide = JSON.parse(localStorage.getItem("guide"));

    if (!guide.includes(2)) {
      setEnableGuide(true);
      setTimeout(() => {
        setEnableGuide(false);
        setActiveCard("automata");
        guide.push(2);
        localStorage.setItem("guide", JSON.stringify(guide));
        setTimeout(() => {
          handleClaimAutomata();
        }, 3000);
      }, 5000);
    }
  }, []);

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

    if (activeCard === "minion") {
      handleClaimShards();
    } else if (activeCard === "automata") {
      handleClaimAutomata();
    } else if (activeCard === "burst") {
      handleClaimBurst();
    }
  };

  const handleClaimShards = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const mythologyName = {
      mythologyName: mythologies[activeMyth],
    };
    try {
      const response = await claimShardsBooster(mythologyName, accessToken);
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
      showToast("claim_minion_success");
      setShowGlow("minion");
      setSection(0);
    } catch (error) {
      setActiveCard(null);
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("claim_minion_error");
    }
  };

  const handleClaimAutomata = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const mythologyName = {
      mythologyName: mythologies[activeMyth],
    };
    try {
      const response = await claimAutomataBooster(mythologyName, accessToken);

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
      showToast("claim_automata_success");
      setShowGlow("automata");
      setSection(0);
    } catch (error) {
      setActiveCard(null);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("claim_automata_error");
    }
  };

  const handleClaimBurst = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const mythologyName = {
      mythologyName: mythologies[activeMyth],
    };
    try {
      await claimBurstBooster(mythologyName, accessToken);

      setGameData((prevData) => {
        const updatedData = {
          ...prevData,
          multiColorOrbs: prevData.multiColorOrbs - 9,
          mythologies: prevData.mythologies.map((item) =>
            item.name === mythologies[activeMyth]
              ? {
                  ...item,
                  isStarActive: true,
                }
              : item
          ),
        };

        return updatedData;
      });
      setActiveCard(null);
      showToast("claim_burst_success");
      setSection(0);
    } catch (error) {
      setActiveCard(null);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("claim_burst_error");
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
            gameData={gameData}
            t={t}
            multiColorOrbs={multiColorOrbs}
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
              isActive={!gameData.mythologies[activeMyth].isStarActive}
              handleClick={() => {
                setShowCard(true);
                setActiveCard("burst");
              }}
              activeMyth={activeMyth}
              t={t}
              booster={6}
            />
          )}
          {/* AUTOMATA BOOSTER */}
          <BoosterCard
            isActive={!mythData.isAutomataActive}
            handleClick={() => {
              setShowCard(true);
              setActiveCard("automata");
            }}
            activeMyth={activeMyth}
            t={t}
            booster={0}
          />
          {/* SHARDS BOOSTER */}
          <BoosterCard
            isActive={mythData.isShardsClaimActive}
            handleClick={() => {
              setShowCard(true);
              setActiveCard("minion");
            }}
            activeMyth={activeMyth}
            t={t}
            booster={2}
          />
          {/*  LOST QUESTS  */}
          <BoosterCard
            isActive={false}
            handleClick={handleLostQuest}
            activeMyth={activeMyth}
            t={t}
            booster={1}
          />
        </div>
      </div>

      {enableGuide && (
        <BoosterGuide
          handleClick={() => {
            setEnableGuide(false);
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
            <BoosterButtom
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
