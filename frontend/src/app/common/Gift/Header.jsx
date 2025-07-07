import { useContext, useState } from "react";
import { MainContext } from "../../../context/context";
import { handleClickHaptic } from "../../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const GiftHeader = ({ category, setCategory, categoryCntArr }) => {
  const { enableHaptic } = useContext(MainContext);

  return (
    <div className="flex items-center max-w-[720px] justify-center w-[80%] z-50 mt-1 p-0.5 text-[24px] mx-auto bg-white border border-black rounded-full shadow">
      {[0, 1, 2].map((cat) => {
        const isActive = category === cat;
        const icons = ["1", "0", "t"];
        const labels = ["Vouchers", "Tasks", "Payouts"];

        return (
          <div
            key={cat}
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setCategory(cat);
            }}
            className={`flex-1 relative flex items-center justify-center rounded-full gap-x-2 py-1 transition-all duration-200 ease-in-out cursor-pointer ${
              isActive ? "bg-black text-white" : "text-black"
            } font-symbols`}
          >
            <span>{icons[cat]}</span>

            {isActive && (
              <span className="absolute -top-1 -right-1 font-roboto text-[1rem] border border-black font-bold bg-white text-black w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                {categoryCntArr[cat]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GiftHeader;
