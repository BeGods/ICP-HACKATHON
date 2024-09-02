import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";
import {
  claimAutomataBooster,
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

const HeaderContent = ({ activeMyth, t }) => {
  return (
    <>
      <div className="h-full -ml-[14%] mr-auto mt-1">
        <Symbol myth={mythSections[activeMyth]} isCard={false} />
      </div>
      <div className="flex flex-col flex-grow justify-start items-end text-white pr-5">
        <div className="text-right  gap-1 flex font-medium text-head">
          <span className={`text-${mythSections[activeMyth]}-text  uppercase`}>
            <span>BOOSTER</span>
          </span>
        </div>
        <h1
          className={`glow-text-${mythSections[activeMyth]} font-${mythSections[activeMyth]}  uppercase  -mt-4 -mr-2`}
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
  const { gameData, setGameData, setSection, activeMyth, setActiveMyth } =
    useContext(MyContext);
  const multiColorOrbs = gameData.multiColorOrbs;
  const mythData = gameData.mythologies[activeMyth].boosters;

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
          status={"success"}
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
          status={"fail"}
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
          status={"success"}
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
          status={"fail"}
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
            desc={t("toasts.Booster_Lost_Not_Available.error.desc")}
            status={"success"}
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
          status={"fail"}
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
      setGameData((prevData) => {
        const updatedData = {
          ...prevData,
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

      setShowCard(false);
      console.log("claimed succesfully");
      toast.success(
        <ToastMesg
          title={t("toasts.Booster_ShardsClaim.success.title")}
          desc={t("toasts.Booster_ShardsClaim.success.desc")}
          status={"success"}
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
          status={"fail"}
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
      setGameData((prevData) => {
        const updatedData = {
          ...prevData,
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
      setShowCard(false);

      toast.success(
        <ToastMesg
          title={t("toasts.Booster_AutomataClaim.success.title")}
          desc={t("toasts.Booster_AutomataClaim.success.desc")}
          status={"success"}
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
          status={"fail"}
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
            backgroundImage: `url(/assets/uxui/fof.header.paper.png)`,
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
        <HeaderContent
          activeMyth={activeMyth}
          gameData={gameData}
          t={t}
          multiColorOrbs={multiColorOrbs}
        />
      </div>
      {/* Content */}
      <div className="flex flex-grow justify-center items-center">
        <ToggleLeft
          handleClick={() => {
            setActiveMyth((prev) => (prev - 1 + 4) % 4);
          }}
          activeMyth={activeMyth}
        />
        {/* BOOSTER CARDS */}
        <div className="flex flex-col items-center justify-center w-full gap-[15px]">
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
          {/*  LOST QUESTS  */}
          <BoosterCard
            isActive={false}
            handleClick={handleLostQuest}
            activeMyth={activeMyth}
            t={t}
            booster={1}
          />
          {/* SHARDS BOOSTER */}
          <BoosterCard
            isActive={mythData.isShardsClaimActive}
            handleClick={() => {
              setShowCard(true);
              setActiveCard("shard");
            }}
            activeMyth={activeMyth}
            t={t}
            booster={2}
          />
        </div>
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
      </div>
      {/* Footer */}
      <Footer />
      {/* Booster card */}
      {activeCard === "automata" && (
        <BoosterClaim
          activeCard={activeCard}
          activeMyth={activeMyth}
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
      {activeCard === "shard" && (
        <BoosterClaim
          activeCard={activeCard}
          activeMyth={activeMyth}
          closeCard={() => setActiveCard(null)}
          Button={
            <BoosterButtom
              activeCard={activeCard}
              mythData={mythData}
              handleClaim={handleClaimAutomata}
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
