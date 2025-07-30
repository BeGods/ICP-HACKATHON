import HeaderLayout, {
  HeaderCategoryLayout,
} from "../../../components/Layouts/HeaderLayout";

const iconMap = [
  {
    icon: <span className="text-[1.5rem] font-symbols">1</span>,
    label: "Vouchers",
  },
  {
    icon: <span className="text-[1.5rem] font-symbols">0</span>,
    label: "Tasks",
  },
  {
    icon: <span className="text-[1.5rem] font-symbols">t</span>,
    label: "Payouts",
  },
];

const GiftHeader = ({ category, setCategory, categoryCntArr }) => {
  return (
    <HeaderLayout
      activeMyth={8}
      title={""}
      BottomChild={<></>}
      CenterChild={
        <HeaderCategoryLayout
          category={category}
          setCategory={setCategory}
          iconMap={iconMap}
          categoryCntArr={categoryCntArr}
        />
      }
    />
  );
};

export default GiftHeader;
