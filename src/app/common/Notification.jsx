import { useEffect, useState } from "react";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import BgLayout from "../../components/Layouts/BgLayout";
import CarouselLayout, {
  ItemLayout,
} from "../../components/Layouts/CarouselLayout";
import { useStore } from "../../store/useStore";
import { Gamepad2, Mails, Megaphone } from "lucide-react";
import HeaderLayout, {
  HeaderCategoryLayout,
} from "../../components/Layouts/HeaderLayout";

const iconMap = [
  { icon: <Gamepad2 size={28} />, label: "IN GAME" },
  { icon: <Mails size={24} />, label: "NOTIFICATIONS" },
  { icon: <Megaphone size={28} />, label: "ANNOUNCEMENTS" },
];

const Notification = () => {
  const setSection = useStore((s) => s.setSection);
  const game = useStore((s) => s.game);
  const [category, setCategory] = useState(1);
  const [notifs, setNotifs] = useState([]);
  const [items, setItems] = useState([]);
  const profileIdx = game == "fof" ? 3 : 8;

  useEffect(() => {
    const itemsDataMapped = notifs.map((item, idx) => (
      <ItemLayout key={item.id} item={item} />
    ));

    setItems(itemsDataMapped);
  }, [notifs]);

  return (
    <BgLayout>
      {/* Header */}
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
      <CarouselLayout items={items} />
      <>
        <ToggleBack
          minimize={2}
          handleClick={() => {
            setSection(profileIdx);
          }}
          activeMyth={8}
        />
        <ToggleLeft
          minimize={2}
          handleClick={() => {
            setCategory((prev) => (prev - 1 + 3) % 3);
          }}
          activeMyth={4}
        />
        <ToggleRight
          minimize={2}
          handleClick={() => {
            setCategory((prev) => (prev + 1) % 3);
          }}
          activeMyth={4}
        />
      </>
    </BgLayout>
  );
};

export default Notification;
