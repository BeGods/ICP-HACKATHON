import React, { useContext, useRef, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { MyContext } from "../../../context/context";

const tele = window.Telegram?.WebApp;

const GiftItemCrd = ({ item }) => {
  const { setActiveReward, setSection } = useContext(MyContext);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      className={`flex gap-1 border
${
  isClicked ? `glow-button-white` : ""
} rounded-primary h-[90px] w-full  bg-glass-black border text-white p-[15px]`}
      onClick={(e) => {
        e.preventDefault();
        tele.HapticFeedback.notificationOccurred("success");
        setActiveReward(item);
        setSection(6);
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
      <div className="w-[20%]  rounded-full flex justify-start items-center">
        <img
          src={
            item.partnerType == "playsuper"
              ? `${item.metadata.campaignCoverImage}`
              : `https://media.publit.io/file/BattleofGods/FoF/Assets/PARTNERS/160px-${item.metadata.campaignCoverImage}.bubble.png`
          }
          alt="partner"
          className="rounded-full"
        />
      </div>
      <div className={`flex flex-col text-white flex-grow justify-center ml-1`}>
        <h1 className="text-tertiary uppercase">{item.metadata.brandName}</h1>
        <h2 className="text-tertiary">
          {item.metadata.campaignTitle?.length > 18
            ? item?.metadata.campaignTitle?.slice(0, 18) + "..."
            : item?.metadata.campaignTitle}
        </h2>
      </div>
      <div className="flex justify-center items-center w-[8%] ">
        {item.isClaimed ? (
          <div className="flex justify-center items-center h-[30px] w-[30px] p-1 bg-white rounded-full">
            <Check strokeWidth={3} color="black" />
          </div>
        ) : item.tokensCollected >= 12 ? (
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

export default GiftItemCrd;
