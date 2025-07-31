import HeaderLayout, {
  HeaderCategoryLayout,
} from "../../../components/Layouts/HeaderLayout";

const iconMap = [
  {
    icon: <span className="text-[1.5rem] font-symbols">u</span>,
    label: "Referrals",
  },
  {
    icon: <span className="text-[1.5rem] font-symbols">$</span>,
    label: "Leaderboard",
  },
  {
    icon: <span className="text-[1.5rem] font-symbols">%</span>,
    label: "Hall Of Fame",
  },
];

const LeaderboardHeader = ({ category, setCategory }) => {
  return (
    <HeaderLayout
      hideBg={true}
      activeMyth={8}
      title={""}
      BottomChild={<></>}
      CenterChild={
        <HeaderCategoryLayout
          category={category}
          setCategory={setCategory}
          iconMap={iconMap}
        />
      }
    />
  );
};

export default LeaderboardHeader;
