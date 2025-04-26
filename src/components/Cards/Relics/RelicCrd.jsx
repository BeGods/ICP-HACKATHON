import React, { useContext } from "react";
import { RorContext } from "../../../context/context";
import { gameItems } from "../../../utils/gameItems";
import IconBtn from "../../Buttons/IconBtn";
import { useMaskStyle } from "../../../hooks/MaskStyle";

const RelicCrd = ({
  itemId,
  handleFlip,
  fragmentId,
  isComplete,
  isClose,
  handleClose,
  maskOff,
}) => {
  const { assets } = useContext(RorContext);
  const mythology = itemId.split(".")[0];
  const itemDetails = gameItems.find((item) => item.id === itemId);
  const mask = useMaskStyle(itemId, itemDetails?.fragments?.length ?? 1, [
    fragmentId,
  ]);

  return (
    <div
      onClick={handleFlip}
      className="card__face card__face--front relative flex justify-center items-center"
    >
      <div
        className={`absolute inset-0 bg-cover bg-center filter-${mythology} rounded-primary z-0`}
        style={{ backgroundImage: `url(${assets.uxui.basebg})` }}
      />

      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
        <div className="relative m-2 flex justify-center items-center w-[50px]">
          <img
            src={`/assets/240px-gobcoin.png`}
            alt="relic"
            className="w-full"
          />
          <div
            className="absolute text-num font-roboto font-bold text-shadow grayscale"
            style={{
              backgroundImage: "url('/assets/metal.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {itemDetails?.coins ?? 1}
          </div>
        </div>
        <div className="relative w-[240px] h-[240px] flex justify-center items-center">
          <div className="relative w-full h-full">
            <img
              src={`/assets/ror-cards/240px-${itemId}_${
                isComplete ? "on" : "off"
              }.png`}
              alt="relic"
              className="z-10 w-full h-full object-contain"
            />
            {(!isComplete || isComplete == false) && !maskOff && mask}
          </div>
        </div>

        <div className="relative w-full h-[19%] mt-auto card-shadow-white-celtic z-10">
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat rounded-b-primary filter-paper-${mythology}`}
            style={{ backgroundImage: `url(${assets.uxui.paper})` }}
          />
          <div className="absolute uppercase glow-text-quest flex justify-center items-center w-full h-full">
            {itemDetails.name}
          </div>
        </div>
      </div>
      <IconBtn
        isInfo={!isClose ? true : false}
        activeMyth={5}
        align={10}
        handleClick={handleClose}
      />
    </div>
  );
};

export default RelicCrd;
