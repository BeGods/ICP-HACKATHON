import { useContext, useEffect, useState } from "react";
import "../../../styles/carousel.scss";
import BoosterClaim from "../../../components/Cards/Boosters/BoosterCrd";
import BoosterItem from "./Item";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { hasTimeElapsed } from "../../../helpers/booster.helper";
import { mythologies } from "../../../utils/constants.fof";
import { FofContext } from "../../../context/context";
import { useTranslation } from "react-i18next";
import CarouselLayout from "../../../components/Layouts/CarouselLayout";

const tele = window.Telegram?.WebApp;

const BoosterCarousel = ({ enableGuide, mythData }) => {
  const { t } = useTranslation();
  const {
    setShowCard,
    activeMyth,
    gameData,
    setSection,
    enableHaptic,
    questsData,
    setMinimize,
  } = useContext(FofContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const boosters = [
      {
        key: "automata",
        component: (
          <BoosterItem
            key="automata"
            activeCard="automata"
            index={0}
            isGuideActive={enableGuide}
            isActive={!mythData.isAutomataActive}
            handleClick={() => {
              handleBoosterClick("automata", 0, false);
            }}
            activeMyth={activeMyth}
            t={t}
            booster={0}
            mythData={mythData}
          />
        ),
      },
      {
        key: "minion",
        component: (
          <BoosterItem
            key="minion"
            activeCard="minion"
            index={1}
            isActive={mythData.isShardsClaimActive}
            handleClick={() => handleBoosterClick("minion", 2, false)}
            activeMyth={activeMyth}
            t={t}
            booster={2}
            mythData={mythData}
          />
        ),
      },
      {
        key: "quests",
        component: (
          <BoosterItem
            key="quests"
            index={2}
            isGuideActive={enableGuide}
            isActive={true}
            handleClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setSection(1);
              setMinimize(1);
            }}
            activeMyth={activeMyth}
            t={t}
            booster={1}
            mythData={mythData}
          />
        ),
      },
      {
        key: "burst",
        component: (
          <BoosterItem
            key="burst"
            index={3}
            activeCard="burst"
            isActive={
              !gameData.mythologies[activeMyth].boosters.isBurstActive ||
              gameData.mythologies[activeMyth].boosters.isBurstActiveToClaim
            }
            handleClick={() => handleBoosterClick("burst", 6, false)}
            isGuideActive={enableGuide}
            activeMyth={activeMyth}
            t={t}
            booster={6}
            mythData={mythData}
          />
        ),
      },
    ];

    // Add conditional boosters
    if (gameData.isBurstAutoPayActive) {
      boosters.push({
        key: "multiBurst",
        component: (
          <BoosterItem
            key="multiBurst"
            index={0}
            activeCard="burst"
            isGuideActive={enableGuide}
            isActive={true}
            handleClick={() => handleBoosterClick("burst", 8, true)}
            activeMyth={activeMyth}
            t={t}
            booster={8}
            mythData={mythData}
          />
        ),
      });
    }

    if (gameData.isEligibleToAutomataAuto) {
      boosters.push({
        key: "multiAutomata",
        component: (
          <BoosterItem
            key="multiAutomata"
            index={0}
            activeCard="automata"
            isGuideActive={enableGuide}
            isActive={true}
            handleClick={() => handleBoosterClick("automata", 7, true)}
            activeMyth={activeMyth}
            t={t}
            booster={7}
            mythData={mythData}
          />
        ),
      });
    }

    const dailyQuest = questsData.find((quest) => quest.status === "Active");
    const boosterStatus = {
      quests:
        dailyQuest &&
        !dailyQuest.isClaimed &&
        dailyQuest.mythology === mythologies[activeMyth],
      multiAutomata: gameData?.isAutomataAutoActive === -1,
      multiBurst: hasTimeElapsed(gameData.autoPayBurstExpiry),
      moon: !gameData.isMoonActive,
      automata: !gameData.mythologies[activeMyth].boosters.isAutomataActive,
      burst: gameData.mythologies[activeMyth].boosters.isBurstActiveToClaim,
      minion: gameData.mythologies[activeMyth].boosters.isShardsClaimActive,
    };

    const predefinedOrder = [
      "quests",
      "multiAutomata",
      "multiBurst",
      "moon",
      "automata",
      "burst",
      "minion",
    ];

    const sortedItems = boosters
      .filter((item) => predefinedOrder.includes(item.key))
      .sort((a, b) => {
        const statusA = boosterStatus[a.key] || false;
        const statusB = boosterStatus[b.key] || false;

        if (statusA && !statusB) return -1;
        if (!statusA && statusB) return 1;

        const orderA = predefinedOrder.indexOf(a.key);
        const orderB = predefinedOrder.indexOf(b.key);
        return orderA - orderB;
      })
      .map((item) => item.component);

    setItems(sortedItems);
  }, [activeMyth, enableGuide, mythData, gameData]);

  const handleBoosterClick = (activeCard, booster, isAutoPay) => {
    if (
      activeCard === "burst" &&
      !isAutoPay &&
      !gameData.mythologies[activeMyth].isEligibleForBurst
    ) {
    } else {
      setShowCard(
        <BoosterClaim
          booster={booster}
          isAutoPay={isAutoPay}
          activeCard={activeCard}
          activeMyth={activeMyth}
          mythData={mythData}
          closeCard={() => setShowCard(null)}
          t={t}
        />
      );
    }
  };

  return <CarouselLayout items={items} extraPadd={true} />;
};

export default BoosterCarousel;
