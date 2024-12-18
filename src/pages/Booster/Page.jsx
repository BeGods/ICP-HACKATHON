import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../context/context";
import { claimAutomataBooster } from "../../utils/api";
import { useTranslation } from "react-i18next";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { mythologies, mythSections } from "../../utils/constants";
import BoosterBtn from "../../components/Buttons/BoosterBtn";
import BoosterClaim from "../../components/Cards/Boosters/BoosterCrd";
import { showToast } from "../../components/Toast/Toast";
import { BoosterGuide } from "../../components/Common/Tutorials";
import MythInfoCard from "../../components/Cards/Info/MythInfoCrd";
import BoosterHeader from "./Header";
import { useBoosterGuide } from "../../hooks/Tutorial";
import BoosterCarousel from "../../components/Carousel/BoosterCarousel";
import ReactHowler from "react-howler";
import { trackComponentView, trackEvent } from "../../utils/ga";

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
    enableSound,
  } = useContext(MyContext);
  const multiColorOrbs = gameData.multiColorOrbs;
  const mythData = gameData.mythologies[activeMyth].boosters;
  const [showToggles, setShowToggles] = useState(false);
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
        trackEvent("purchase", "claim_automata", "success");

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
    "tutorial03",
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

  useEffect(() => {
    trackComponentView("boosters");
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
        <div className="flex flex-col w-[70%] items-center justify-start gap-[15px]">
          <BoosterCarousel mythData={mythData} enableGuide={enableGuide} />
        </div>
      </div>

      <ReactHowler
        src={assets.audio.forgeBg}
        playing={enableSound}
        loop
        preload={true}
        html5={true}
      />

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
