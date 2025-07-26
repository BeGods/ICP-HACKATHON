import { formatTwoNums } from "../../../helpers/leaderboard.helper";
import HeaderLayout, {
  HeadbarLayout,
  HeaderMythSymbol,
} from "../../../components/Layouts/HeaderLayout";

const BottomChild = ({
  activeMyth,
  completedQuests,
  lostQuests,
  setCurrQuest,
  totalQuests,
}) => {
  const data = [
    {
      icon: "i",
      value: formatTwoNums(lostQuests),
      label: "UNCLAIMED",
      handleClick: () => {
        setCurrQuest(0);
      },
    },
    {
      icon: "j",
      value: formatTwoNums(completedQuests.length),
      label: "CLAIMED",
      handleClick: () => {
        setCurrQuest(totalQuests.length - completedQuests.length);
      },
    },
  ];
  return <HeadbarLayout activeMyth={activeMyth} data={data} />;
};

const QuestHeader = ({
  activeMyth,
  currQuest,
  lostQuests,
  completedQuests,
  quest,
  totalQuests,
  setCurrQuest,
}) => {
  return (
    <HeaderLayout
      activeMyth={activeMyth}
      title={""}
      BottomChild={
        <BottomChild
          completedQuests={completedQuests}
          currQuest={currQuest}
          lostQuests={lostQuests}
          activeMyth={activeMyth}
          quest={quest}
          totalQuests={totalQuests}
          setCurrQuest={setCurrQuest}
        />
      }
      CenterChild={<HeaderMythSymbol />}
    />
  );
};

export default QuestHeader;
