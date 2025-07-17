import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../context/context";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { Gamepad2, Mails, Megaphone } from "lucide-react";
import HeaderLayout from "../../../components/Layouts/HeaderLayout";

const tele = window.Telegram?.WebApp;

const iconMap = [
  { icon: <Gamepad2 size={28} />, label: "IN GAME" },
  { icon: <Mails size={24} />, label: "NOTIFICATIONS" },
  { icon: <Megaphone size={28} />, label: "ANNOUNCEMENTS" },
];

const BottomChild = ({ category, setCategory }) => {
  const { enableHaptic } = useContext(MainContext);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setFadeOut(false);
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [category]);

  return (
    <div className="flex transition-all duration-500 -mt-[1.3rem] items-center justify-center max-w-[720px] w-[85%] z-50 mx-auto h-button-primary p-0.5 rounded-primary bg-white border border-black shadow">
      {iconMap.map((item, idx) => {
        const isActive = category === idx;

        return (
          <div
            key={idx}
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setCategory(idx);
            }}
            className={`flex-1 relative flex items-center justify-center rounded-primary gap-x-2 h-full transition-all duration-200 ease-in-out cursor-pointer ${
              isActive ? "bg-black text-white" : "text-black"
            } font-symbols`}
          >
            {item.icon}
          </div>
        );
      })}
      <div
        className={`font-fof w-full text-center mt-[7rem] absolute top-0 text-[4.5dvh] uppercase text-white text-black-contour drop-shadow z-50 ${
          fadeOut ? "disappear" : ""
        }`}
      >
        {iconMap[category].label}
      </div>
    </div>
  );
};

const NotifHeader = ({ category, setCategory }) => {
  return (
    <HeaderLayout
      activeMyth={8}
      title={""}
      BottomChild={<></>}
      CenterChild={
        <BottomChild category={category} setCategory={setCategory} />
      }
    />
  );
};

export default NotifHeader;
