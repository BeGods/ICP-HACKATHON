import { useContext } from "react";
import { MainContext } from "../../../context/context";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { Gamepad2, Mails, Megaphone } from "lucide-react";

const tele = window.Telegram?.WebApp;

const iconMap = [
  { icon: <Gamepad2 size={28} />, label: "IN GAME" },
  { icon: <Mails size={24} />, label: "NOTIFICATIONS" },
  { icon: <Megaphone size={28} />, label: "ANNOUNCEMENTS" },
];

const NotifHeader = ({ category, setCategory }) => {
  const { enableHaptic } = useContext(MainContext);

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="flex items-center max-w-[720px] justify-center w-[80%] z-50 mt-1  text-[24px] bg-white border border-black rounded-full shadow">
        {iconMap.map((item, idx) => {
          const isActive = category === idx;

          return (
            <div
              key={idx}
              onClick={() => {
                handleClickHaptic(tele, enableHaptic);
                setCategory(idx);
              }}
              className={`flex-1 relative flex items-center justify-center rounded-full py-2.5 cursor-pointer transition-colors duration-200 ease-in-out ${
                isActive ? "bg-black text-white" : "text-black"
              }`}
            >
              {item.icon}
            </div>
          );
        })}
      </div>
      <div
        className={`font-fof w-full text-center mt-[6.3rem] absolute top-0 text-[4.5dvh] uppercase text-white text-black-contour drop-shadow z-50`}
      >
        {iconMap[category].label}
      </div>
    </div>
  );
};

export default NotifHeader;
