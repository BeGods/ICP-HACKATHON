import React, { useContext, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import PayoutInfoCard from "../Info/PayoutInfoCrd";

const tele = window.Telegram?.WebApp;

const PayoutItem = ({ item }) => {
  const { enableHaptic, game, assets, isTelegram } = useContext(MainContext);
  const fofContext = useContext(FofContext);
  const rorContext = useContext(RorContext);
  const setSection =
    game === "fof" ? fofContext.setSection : rorContext.setSection;
  const setShowCard =
    game === "fof" ? fofContext.setShowCard : rorContext.setShowCard;
  const redeemIdx = game === "fof" ? 6 : 14;
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      className={`flex cursor-pointer gap-1 border
${
  isClicked ? `glow-button-white` : ""
} rounded-primary h-[90px] w-full  bg-glass-black border text-white p-[10px]`}
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
    >
      <div className=" rounded-full flex justify-start items-center">
        <img
          src={isTelegram ? assets.misc.tgStar : assets.misc.kaia}
          alt="partner"
          className="rounded-full w-[65px]"
        />
      </div>
      <div className={`flex flex-col text-white flex-grow justify-center ml-1`}>
        <h1 className="text-tertiary uppercase">
          {item?.title?.length > 14
            ? item?.title?.slice(0, 14) + "..."
            : item?.title}
        </h1>

        <h2 className="text-tertiary">
          +{item?.amount}
          <span className="pl-1 text-gold">{isTelegram ? "STAR" : "KAIA"}</span>
        </h2>
      </div>
      <div className="flex justify-center items-center w-[8%] ">
        {item.isClaimed ? (
          <div className="flex justify-center items-center h-[30px] w-[30px] p-1 border-2 rounded-full">
            <Check strokeWidth={3} color="white" />
          </div>
        ) : (
          <ChevronRight className="absolute" size={"30px"} color="white" />
        )}
      </div>
    </div>
  );
};

export default PayoutItem;
