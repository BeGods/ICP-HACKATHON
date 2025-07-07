import React, { useContext, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import { handleClickHaptic } from "../../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const NotifItem = ({ item }) => {
  const { enableHaptic, game, assets, isTelegram } = useContext(MainContext);
  const fofContext = useContext(FofContext);
  const rorContext = useContext(RorContext);
  const setShowCard =
    game === "fof" ? fofContext.setShowCard : rorContext.setShowCard;
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        handleClickHaptic(tele, enableHaptic);
      }}
      onMouseDown={() => {
        setIsClicked(true);
      }}
      onMouseUp={() => {
        setIsClicked(false);
      }}
      onMouseLeave={() => {
        setIsClicked(false);
      }}
      onTouchStart={() => {
        setIsClicked(true);
      }}
      onTouchEnd={() => {
        setIsClicked(false);
      }}
      onTouchCancel={() => {
        setIsClicked(false);
      }}
      className={`flex ${
        isClicked ? `glow-button-white` : ""
      } bg-glass-black-lg text-white items-center gap-x-2.5 border rounded-primary w-full cursor-pointer h-[4.65rem] px-4`}
    >
      <div className="font-symbols w-[3rem]">{item?.icon}</div>
      <div className={`flex flex-col text-white flex-grow justify-center`}>
        <h1 className="text-tertiary uppercase">
          {item?.title?.length > 14
            ? item?.title?.slice(0, 14) + "..."
            : item?.title}
        </h1>
        <h2 className="text-tertiary flex gap-x-2">
          {item?.desc?.length > 20
            ? item?.desc?.slice(0, 20) + "..."
            : item?.desc}
        </h2>
      </div>
    </div>
  );
};

export default NotifItem;
