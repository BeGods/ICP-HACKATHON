import React, { useContext, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import { handleClickHaptic } from "../../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const GiftItemCrd = ({ item }) => {
  const { setActiveReward, enableHaptic, game } = useContext(MainContext);
  const fofContext = useContext(FofContext);
  const rorContext = useContext(RorContext);
  const setSection =
    game === "fof" ? fofContext.setSection : rorContext.setSection;
  const redeemIdx = game === "fof" ? 6 : 14;
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        handleClickHaptic(tele, enableHaptic);
        setActiveReward(item);
        setSection(redeemIdx);
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
      }  bg-glass-black-lg text-white items-center gap-x-2.5 border rounded-primary w-full cursor-pointer h-[4.65rem] px-4`}
    >
      <div className="font-symbols w-[3rem]">
        <img
          src={
            item.partnerType == "playsuper"
              ? `${item.metadata.campaignCoverImage}`
              : `https://media.publit.io/file/Partners/160px-${item.metadata.campaignCoverImage}.bubble.png`
          }
          alt="partner"
        />
      </div>
      <div className={`flex flex-col text-white flex-grow justify-center`}>
        <h1 className="text-tertiary uppercase">{item.metadata.brandName}</h1>
        <h2 className="text-tertiary">
          {item.metadata.campaignTitle?.length > 20
            ? item?.metadata.campaignTitle?.slice(0, 20) + "..."
            : item?.metadata.campaignTitle}
        </h2>
      </div>
      <div className="flex justify-center items-center pr-1">
        {item.isClaimed ? (
          <div className="flex justify-center items-center h-6 w-6 p-1 bg-white rounded-full">
            <Check strokeWidth={3} color="black" />
          </div>
        ) : item.tokensCollected >= 12 ? (
          <div className="flex justify-center items-center h-6 w-6 p-1 border-2 rounded-full">
            <Check strokeWidth={3} color="white" />
          </div>
        ) : (
          <ChevronRight className="absolute h-6 w-6" classNamecolor="white" />
        )}
      </div>
    </div>
  );
};

export default GiftItemCrd;
