import { mythSections } from "../../../utils/constants.fof";
import { useTranslation } from "react-i18next";
import { formatTwoNums } from "../../../helpers/leaderboard.helper";
import HeaderLayout, {
  HeadbarLayout,
  HeaderMythSymbol,
} from "../../../components/Layouts/HeaderLayout";
import { useContext } from "react";
import { MainContext } from "../../../context/context";
import OrbInfoCard from "../../../components/Cards/Info/OrbInfoCard";
import BoosterClaim from "../../../components/Cards/Boosters/BoosterCrd";

const BottomChild = ({ activeMyth, gameData, mythData }) => {
  const { t } = useTranslation();
  const { setShowCard, setSection } = useContext(MainContext);

  const data = [
    {
      icon: 9,
      value: gameData.shardslvl,
      label: t(`boosters.${2}.title`),
      handleClick: () => {
        setShowCard(
          <BoosterClaim
            booster={2}
            isAutoPay={false}
            activeCard={"minion"}
            activeMyth={activeMyth}
            mythData={mythData}
            closeCard={() => setShowCard(null)}
            t={t}
          />
        );
      },
    },
    {
      icon: "n",
      value: gameData?.automatalvl
        ? formatTwoNums(gameData.automatalvl + 1)
        : 1,
      label: t(`boosters.${0}.title`),
      handleClick: () => {
        setShowCard(
          <BoosterClaim
            booster={0}
            isAutoPay={false}
            activeCard={"automata"}
            activeMyth={activeMyth}
            mythData={mythData}
            closeCard={() => setShowCard(null)}
            t={t}
          />
        );
      },
    },
  ];
  return <HeadbarLayout activeMyth={activeMyth} data={data} />;
};

const BoosterHeader = ({ activeMyth, gameData, mythData }) => {
  const { t } = useTranslation();

  return (
    <HeaderLayout
      activeMyth={activeMyth}
      hideContour={true}
      title={t(`mythologies.${mythSections[activeMyth]}`)}
      BottomChild={
        <BottomChild
          activeMyth={activeMyth}
          gameData={gameData}
          mythData={mythData}
        />
      }
      CenterChild={<HeaderMythSymbol />}
    />
  );
};

export default BoosterHeader;
