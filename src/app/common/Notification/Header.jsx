import { Gamepad2, Mails, Megaphone } from "lucide-react";
import HeaderLayout, {
  HeaderCategoryLayout,
} from "../../../components/Layouts/HeaderLayout";

const iconMap = [
  { icon: <Gamepad2 size={28} />, label: "IN GAME" },
  { icon: <Mails size={24} />, label: "NOTIFICATIONS" },
  { icon: <Megaphone size={28} />, label: "ANNOUNCEMENTS" },
];

const NotifHeader = ({ category, setCategory }) => {
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
        />
      }
    />
  );
};

export default NotifHeader;
