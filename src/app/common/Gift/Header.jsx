import { useContext, useState } from "react";
import { MainContext } from "../../../context/context";
import { handleClickHaptic } from "../../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const GiftHeader = ({ category, setCategory }) => {
  const { enableHaptic } = useContext(MainContext);

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="flex items-center max-w-[720px] justify-center w-[80%] z-50 mt-2 p-0.5 text-[24px] bg-white border border-black rounded-full shadow">
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            setCategory(0);
          }}
          className={`flex-1 flex items-center justify-center rounded-full ${
            category == 0 ? "bg-black text-white " : "text-black"
          } font-symbols py-1`}
        >
          1
        </div>
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            setCategory(1);
          }}
          className={`flex-1 flex items-center justify-center rounded-full ${
            category == 1 ? "bg-black text-white " : "text-black"
          } font-symbols py-1`}
        >
          0
        </div>
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            setCategory(2);
          }}
          className={`flex-1 flex items-center justify-center rounded-full ${
            category == 2 ? "bg-black text-white " : "text-black"
          } font-fof py-1`}
        >
          $
        </div>
      </div>
      <div className="font-fof text-[2rem] mt-1 uppercase text-white drop-shadow">
        {category == 0 ? "Vouchers" : category == 1 ? "tasks" : "payouts"}
      </div>
    </div>
  );
};

export default GiftHeader;
