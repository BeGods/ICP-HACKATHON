import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../context/context";
import {
  claimAutomataBooster,
  claimBurstBooster,
  claimShardsBooster,
} from "../../utils/api";
import { useTranslation } from "react-i18next";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { mythologies, mythSections } from "../../utils/constants";
import BoosterItem from "../../components/Cards/Boosters/BoosterItem";
import BoosterBtn from "../../components/Buttons/BoosterBtn";
import BoosterClaim from "../../components/Cards/Boosters/BoosterCrd";
import { showToast } from "../../components/Toast/Toast";
import { BoosterGuide } from "../../components/Common/Tutorials";
import MythInfoCard from "../../components/Cards/Info/MythInfoCrd";
import BoosterHeader from "./Header";
import { useBoosterGuide } from "../../hooks/Tutorial";
import { toast } from "react-toastify";
import CarouselBtn from "../../components/Buttons/CarouselBtn";

const tele = window.Telegram?.WebApp;

const Boosters = () => {
  const { t } = useTranslation();
  const {
    gameData,
    setGameData,
    setSection,
    activeMyth,
    setActiveMyth,
    authToken,
    setShowCard,
    setShowBooster,
    assets,
  } = useContext(MyContext);
  const multiColorOrbs = gameData.multiColorOrbs;
  const mythData = gameData.mythologies[activeMyth].boosters;
  const [showToggles, setShowToggles] = useState(false);
  const [currState, setCurrState] = useState(0);
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
        setShowCard(null);
        disableRef.current = false;
        showToast("booster_success");
        setShowBooster("automata");
        setSection(0);
      } catch (error) {
        disableRef.current = false;
        setShowCard(null);
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
    setShowCard(
      <BoosterClaim
        activeCard={"automata"}
        activeMyth={activeMyth}
        mythData={mythData}
        closeCard={() => setShowCard(null)}
        Button={
          <BoosterBtn
            activeCard={"automata"}
            mythData={mythData}
            handleClaim={handleClaimAutomata}
            t={t}
          />
        }
      />
    );
  };

  const [enableGuide, setEnableGuide] = useBoosterGuide(
    "lp2",
    handleClaimAutomata,
    handleCardChange,
    guideTimeoutId
  );

  useEffect(() => {
    if (enableGuide) {
      setShowCard(
        <BoosterGuide
          handleClick={() => {
            setEnableGuide(false);
            guideTimeoutId.current = null;
            clearTimeout(guideTimeoutId);
          }}
        />
      );
    }
  }, [enableGuide]);

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

        setShowCard(null);
        showToast("booster_success");
        setShowBooster("minion");
        setSection(0);
        disableRef.current === false;
      } catch (error) {
        setShowCard(null);
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
      setShowCard(null);
      showToast("booster_success");
      setSection(0);
    } catch (error) {
      setShowCard(null);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("booster_error");
    }
  };

  useEffect(() => {}, [gameData]);

  useEffect(() => {
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
      <BoosterHeader
        activeMyth={activeMyth}
        gameData={mythData}
        t={t}
        multiColorOrbs={multiColorOrbs}
        showSymbol={() => {
          setShowCard(
            <MythInfoCard
              close={() => {
                setShowCard(false);
              }}
            />
          );
        }}
      />

      {/* BOOSTER CARDS */}
      <div className="flex flex-col items-center justify-center h-screen w-screen absolute mx-auto">
        <div className="flex flex-col w-[70%] min-h-[40vh] items-center justify-start gap-[15px]">
          {currState === 0 ? (
            <>
              {/* AUTOMATA */}
              <BoosterItem
                isGuideActive={enableGuide}
                isActive={!mythData.isAutomataActive}
                handleClick={() => {
                  tele.HapticFeedback.notificationOccurred("success");
                  setShowCard(
                    <BoosterClaim
                      activeCard={"automata"}
                      activeMyth={activeMyth}
                      mythData={mythData}
                      closeCard={() => setShowCard(null)}
                      Button={
                        <BoosterBtn
                          activeCard={"automata"}
                          mythData={mythData}
                          handleClaim={handleClaimAutomata}
                          activeMyth={activeMyth}
                          t={t}
                        />
                      }
                    />
                  );
                }}
                activeMyth={activeMyth}
                t={t}
                booster={0}
              />
              {/* SHARDS BOOSTER */}
              <BoosterItem
                isActive={mythData.isShardsClaimActive}
                handleClick={() => {
                  tele.HapticFeedback.notificationOccurred("success");
                  setShowCard(
                    <BoosterClaim
                      activeCard={"minion"}
                      activeMyth={activeMyth}
                      mythData={mythData}
                      closeCard={() => setShowCard(null)}
                      Button={
                        <BoosterBtn
                          activeCard={"minion"}
                          mythData={mythData}
                          handleClaim={handleClaimShards}
                          activeMyth={activeMyth}
                          t={t}
                        />
                      }
                    />
                  );
                }}
                activeMyth={activeMyth}
                t={t}
                booster={2}
              />
              {/* Quest */}
              <BoosterItem
                isGuideActive={enableGuide}
                isActive={true}
                handleClick={() => {
                  tele.HapticFeedback.notificationOccurred("success");
                  setSection(1);
                }}
                activeMyth={activeMyth}
                t={t}
                booster={1}
              />
            </>
          ) : (
            <>
              {/* BURST */}
              <BoosterItem
                isActive={
                  !gameData.mythologies[activeMyth].boosters.isBurstActive &&
                  gameData.mythologies[activeMyth].boosters.isBurstActiveToClaim
                }
                handleClick={() => {
                  if (gameData.mythologies[activeMyth].isEligibleForBurst) {
                    tele.HapticFeedback.notificationOccurred("success");
                    setShowCard(
                      <BoosterClaim
                        activeCard={"burst"}
                        activeMyth={activeMyth}
                        mythData={mythData}
                        closeCard={() => setShowCard(null)}
                        Button={
                          <BoosterBtn
                            activeCard={"burst"}
                            mythData={mythData}
                            handleClaim={handleClaimBurst}
                            activeMyth={activeMyth}
                            t={t}
                          />
                        }
                      />
                    );
                  } else {
                    toast.error("Locked");
                  }
                }}
                mythData={mythData}
                isGuideActive={enableGuide}
                activeMyth={activeMyth}
                t={t}
                booster={6}
              />
            </>
          )}
        </div>
      </div>

      {mythData.isEligibleForBurst && (
        <div className="absolute bottom-0 w-full mb-[15vh]">
          <CarouselBtn
            icon={"k"}
            currState={currState}
            lastState={1}
            activeMyth={activeMyth}
            handlePrev={() => {
              tele.HapticFeedback.notificationOccurred("success");

              setCurrState((prev) => (prev === 1 ? prev - 1 : prev));
            }}
            handleNext={() => {
              tele.HapticFeedback.notificationOccurred("success");

              setCurrState((prev) => (prev === 0 ? prev + 1 : prev));
            }}
          />
        </div>
      )}

      {/* Toggles */}
      {showToggles && (
        <>
          <ToggleLeft
            minimize={2}
            handleClick={() => {
              setActiveMyth((prev) => (prev - 1 + 4) % 4);
            }}
            activeMyth={activeMyth}
          />
          <ToggleRight
            minimize={2}
            handleClick={() => {
              if (activeMyth < 4) {
                setActiveMyth((prev) => (prev + 1) % 4);
              } else {
                setSection(6);
              }
            }}
            activeMyth={activeMyth}
          />
        </>
      )}
    </div>
  );
};

export default Boosters;
