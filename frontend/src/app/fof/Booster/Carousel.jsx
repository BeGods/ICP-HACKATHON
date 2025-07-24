import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FofContext } from "../../../context/context";
import BoosterClaim from "../../../components/Cards/Boosters/BoosterCrd";
import CarouselLayout, {
  ItemLayout,
} from "../../../components/Layouts/CarouselLayout";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import {
  getTimerContent,
  hasTimeElapsed,
} from "../../../helpers/booster.helper";
import {
  boosterIcon,
  mythologies,
  mythSections,
} from "../../../utils/constants.fof";
import "../../../styles/carousel.scss";

const tele = window.Telegram?.WebApp;

const descAddOn = [
  "Max. 99",
  "+20%",
  "Max. 99",
  "Max. 99",
  "Max. 99",
  "Max. 99",
  "1000*n",
  "",
  "",
];

const BoosterItem = ({
  activeCard,
  isActive,
  handleClick,
  activeMyth,
  t,
  booster,
  myth,
  isAutoPay,
  gameData,
}) => {
  const boosterTextColor = `text-${mythSections[activeMyth]}-text`;
  const isBurstDisabled = booster === 6 && !myth?.isEligibleForBurst;
  const showTimer = getTimerContent(activeCard, gameData, myth, isAutoPay);

  return (
    <ItemLayout
      handleClick={handleClick}
      item={{
        icon: (
          <div
            className={`
              font-symbols text-iconLg
              ${
                !isActive && booster < 6
                  ? `glow-icon-${mythSections[activeMyth]}`
                  : ""
              }
              ${
                booster === 6 && !myth?.isEligibleForBurst
                  ? "text-gray-400"
                  : ""
              }
              ${booster === 7 || booster === 8 ? "gradient-multi" : ""}
              ${
                booster === 6 && myth?.isEligibleForBurst && !isActive
                  ? `glow-icon-${mythSections[activeMyth]}`
                  : ""
              }
            `}
          >
            {boosterIcon[booster]}
          </div>
        ),
        title: t(`boosters.${booster}.title`),
        desc: showTimer
          ? ["", t(`boosters.${booster}.desc`)]
          : [
              t(`boosters.${booster}.desc`),
              descAddOn[booster],
              boosterTextColor,
            ],
        disable: isBurstDisabled,
        borderStyle: isAutoPay
          ? "border-multiColor"
          : `border-${mythSections[activeMyth]}-primary`,
      }}
    />
  );
};

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

  const handleBoosterClick = (activeCard, booster, isAutoPay) => {
    if (
      activeCard === "burst" &&
      !isAutoPay &&
      !gameData.mythologies[activeMyth].isEligibleForBurst
    )
      return;
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
  };

  useEffect(() => {
    const boosters = [
      {
        key: "automata",
        component: (
          <BoosterItem
            key="automata"
            activeCard="automata"
            isActive={!mythData.isAutomataActive}
            handleClick={() => handleBoosterClick("automata", 0, false)}
            activeMyth={activeMyth}
            t={t}
            booster={0}
            myth={mythData}
            gameData={gameData}
          />
        ),
      },
      {
        key: "minion",
        component: (
          <BoosterItem
            key="minion"
            activeCard="minion"
            isActive={mythData.isShardsClaimActive}
            handleClick={() => handleBoosterClick("minion", 2, false)}
            activeMyth={activeMyth}
            t={t}
            booster={2}
            myth={mythData}
            gameData={gameData}
          />
        ),
      },
      {
        key: "quests",
        component: (
          <BoosterItem
            key="quests"
            isActive={true}
            handleClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setSection(1);
              setMinimize(1);
            }}
            activeMyth={activeMyth}
            t={t}
            booster={1}
            myth={mythData}
            gameData={gameData}
          />
        ),
      },
      {
        key: "burst",
        component: (
          <BoosterItem
            key="burst"
            activeCard="burst"
            isActive={
              !gameData.mythologies[activeMyth].boosters.isBurstActive ||
              gameData.mythologies[activeMyth].boosters.isBurstActiveToClaim
            }
            handleClick={() => handleBoosterClick("burst", 6, false)}
            activeMyth={activeMyth}
            t={t}
            booster={6}
            myth={mythData}
            gameData={gameData}
          />
        ),
      },
    ];

    if (gameData.isBurstAutoPayActive) {
      boosters.push({
        key: "multiBurst",
        component: (
          <BoosterItem
            key="multiBurst"
            activeCard="burst"
            isActive={true}
            handleClick={() => handleBoosterClick("burst", 8, true)}
            activeMyth={activeMyth}
            t={t}
            booster={8}
            myth={mythData}
            isAutoPay={true}
            gameData={gameData}
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
            activeCard="automata"
            isActive={true}
            handleClick={() => handleBoosterClick("automata", 7, true)}
            activeMyth={activeMyth}
            t={t}
            booster={7}
            myth={mythData}
            isAutoPay={true}
            gameData={gameData}
          />
        ),
      });
    }

    const dailyQuest = questsData.find((q) => q.status === "Active");
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
        return predefinedOrder.indexOf(a.key) - predefinedOrder.indexOf(b.key);
      })
      .map((item) => item.component);

    setItems(sortedItems);
  }, [activeMyth, enableGuide, mythData, gameData]);

  return <CarouselLayout items={items} extraPadd={true} />;
};

export default BoosterCarousel;
