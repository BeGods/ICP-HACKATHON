import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../context/context";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import HeaderLayout from "../../../components/Layouts/HeaderLayout";

const tele = window.Telegram?.WebApp;

const BottomChild = ({ category, setCategory }) => {
  const { enableHaptic } = useContext(MainContext);
  const labels = ["Referrals", "Leaderboard", "Hall Of Fame"];
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
      {[0, 1, 2].map((cat) => {
        const isActive = category === cat;
        const icons = ["u", "$", "%"];

        return (
          <div
            key={cat}
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setCategory(cat);
            }}
            className={`flex-1 relative flex items-center justify-center rounded-primary gap-x-2 h-full transition-all duration-200 ease-in-out cursor-pointer ${
              isActive ? "bg-black text-white" : "text-black"
            } font-symbols`}
          >
            <span className="text-[1.5rem]">{icons[cat]}</span>
          </div>
        );
      })}
      <div
        className={`font-fof w-full text-center mt-[7rem] absolute top-0 text-[4.5dvh] uppercase text-white text-black-contour drop-shadow z-50 ${
          fadeOut ? "disappear" : ""
        }`}
      >
        {labels[category]}
      </div>
    </div>
  );
};

const LeaderboardHeader = ({ category, setCategory }) => {
  return (
    <HeaderLayout
      hideBg={true}
      activeMyth={8}
      title={""}
      BottomChild={<></>}
      CenterChild={
        <BottomChild category={category} setCategory={setCategory} />
      }
    />
  );
};

export default LeaderboardHeader;
