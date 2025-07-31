import { useEffect, useRef, useState } from "react";
import { claimAutomataBooster } from "../../../utils/api.fof";
import { useTranslation } from "react-i18next";
import {
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import { mythologies } from "../../../utils/constants.fof";
import BoosterClaim from "../../../components/Cards/Boosters/BoosterCrd";
import { showToast } from "../../../components/Toast/Toast";
import { BoosterGuide } from "../../../components/Tutorials/Tutorials";
import BoosterHeader from "./Header";
import { useBoosterGuide } from "../../../hooks/useTutorial";
import ReactHowler from "react-howler";
import { trackComponentView, trackEvent } from "../../../utils/ga";
import BgLayout from "../../../components/Layouts/BgLayout";
import BoosterCarousel from "./Carousel";
import { useStore } from "../../../store/useStore";

const Boosters = () => {
  const { t } = useTranslation();
  const gameData = useStore((s) => s.gameData);
  const setGameData = useStore((s) => s.setGameData);
  const setSection = useStore((s) => s.setSection);
  const activeMyth = useStore((s) => s.activeMyth);

  const setActiveMyth = useStore((s) => s.setActiveMyth);
  const authToken = useStore((s) => s.authToken);
  const setShowBooster = useStore((s) => s.setShowBooster);
  const assets = useStore((s) => s.assets);
  const enableSound = useStore((s) => s.enableSound);
  const showAnmt = useStore((s) => s.showAnmt);
  const setShowAnmt = useStore((s) => s.setShowAnmt);
  const setShowCard = useStore((s) => s.setShowCard);
  const multiColorOrbs = gameData.multiColorOrbs;
  const mythData = gameData.mythologies[activeMyth].boosters;
  const [showToggles, setShowToggles] = useState(false);
  let guideTimeoutId = useRef(null);

  const handleClaimAutomata = async () => {
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
      showToast("booster_success");
      setShowBooster("automata");
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

  const handleCardChange = () => {
    setShowCard(
      <BoosterClaim
        activeCard={"automata"}
        activeMyth={activeMyth}
        mythData={mythData}
        isAutoPay={false}
        closeCard={() => {
          setShowCard(null);
          setShowAnmt(false);
        }}
      />
    );
  };

  useEffect(() => {
    if (showAnmt && !enableGuide) {
      handleCardChange();
    }
  }, []);

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
    <BgLayout>
      {/* Header */}
      <BoosterHeader
        activeMyth={activeMyth}
        gameData={mythData}
        t={t}
        multiColorOrbs={multiColorOrbs}
        mythData={mythData}
      />

      {/* BOOSTER CARDS */}
      <BoosterCarousel mythData={mythData} enableGuide={enableGuide} />

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
    </BgLayout>
  );
};

export default Boosters;
