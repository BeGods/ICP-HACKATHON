import React, { useContext, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import PayoutInfoCard from "../../../components/Cards/Info/PayoutInfoCrd";

const tele = window.Telegram?.WebApp;

const PayoutItem = ({ item }) => {
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
        setShowCard(
          <PayoutInfoCard close={() => setShowCard(null)} data={item} />
        );
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
      <div className="font-symbols w-[3rem]">
        <img
          src={
            item.paymentType?.includes("USDT")
              ? assets.misc.usdt
              : isTelegram
              ? assets.misc.tgStar
              : assets.misc.kaia
          }
          alt="token"
        />
      </div>
      <div className={`flex flex-col text-white flex-grow justify-center`}>
        <h1 className="text-tertiary uppercase">
          {item?.title?.length > 14
            ? item?.title?.slice(0, 14) + "..."
            : item?.title}
        </h1>

        <h2 className="text-tertiary flex gap-x-2">
          +{item?.amount}
          <span className="text-gold">
            {item.paymentType?.includes("USDT")
              ? "USDT"
              : isTelegram
              ? "STAR"
              : "KAIA"}
          </span>
        </h2>
      </div>
      <div className="flex justify-center items-center pr-1">
        {item.isClaimed ? (
          <div className="flex justify-center items-center h-6 w-6 p-1 bg-white rounded-full">
            <Check strokeWidth={3} color="black" />
          </div>
        ) : (
          <ChevronRight className="absolute h-6 w-6" color="white" />
        )}
      </div>
    </div>
  );
};

export default PayoutItem;
