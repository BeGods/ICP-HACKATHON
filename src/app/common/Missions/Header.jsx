import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../context/context";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import HeaderLayout from "../../../components/Layouts/HeaderLayout";

const tele = window.Telegram?.WebApp;

const BottomChild = ({ category, setCategory, categoryCntArr }) => {
  const { enableHaptic } = useContext(MainContext);
  const labels = ["Vouchers", "Tasks", "Payouts"];
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setFadeOut(false);
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [category]);

  return (
    <div className="flex transition-all -mt-[1.3rem] p-0.5 duration-500 items-center justify-center max-w-[720px] w-[85%] z-50 mx-auto h-button-primary rounded-primary bg-white border border-black shadow">
      {[0, 1, 2].map((cat) => {
        const isActive = category === cat;
        const icons = ["1", "0", "t"];

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

            {isActive && (
              <span className="absolute -top-1 -right-1 font-roboto text-[1rem] border border-black font-bold bg-white text-black w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                {categoryCntArr[cat]}
              </span>
            )}
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

const GiftHeader = ({ category, setCategory, categoryCntArr }) => {
  return (
    <HeaderLayout
      activeMyth={8}
      title={""}
      BottomChild={<></>}
      CenterChild={
        <BottomChild
          category={category}
          setCategory={setCategory}
          categoryCntArr={categoryCntArr}
        />
      }
    />
  );
};

export default GiftHeader;
