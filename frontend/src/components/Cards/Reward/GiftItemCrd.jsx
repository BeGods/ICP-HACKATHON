import React, { useContext, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
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
} rounded-primary h-[90px] w-full  bg-black border text-white p-[15px]`}
      onClick={() => {
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
      <div className="w-[20%] flex justify-start items-center">
        <img
          src={`/assets/partners/160px-${item.category}.bubble.png`}
          alt="partner"
          className="rounded-full"
        />
      </div>
      <div className={`flex flex-col text-white flex-grow justify-center ml-1`}>
        <h1 className="text-tertiary uppercase">{item.name}</h1>
        <h2 className="text-tertiary">
          {item.description.length > 20
            ? item.description.slice(0, 20) + "..."
            : item.description}
        </h2>
      </div>
      <div className="flex justify-center items-center w-[8%] ">
        <ChevronRight className="absolute" size={"30px"} color="white" />
      </div>
    </div>
  );
};

export default GiftItemCrd;
