import React, { useContext } from "react";
import { RorContext } from "../../../context/context";
import { gameItems } from "../../../utils/gameItems";
import IconBtn from "../../Buttons/IconBtn";
import { useMaskStyle } from "../../../hooks/MaskStyle";
import {
  elementMythNames,
  elements,
  mythSections,
} from "../../../utils/constants.ror";

const RelicCrd = ({
  itemId,
  handleFlip,
  fragmentId,
  isComplete,
  isClose,
  handleClose,
  maskOff,
  isSell,
  hideInfo,
}) => {
  const { assets } = useContext(RorContext);
  let mythology = "other";
  const itemDetails = gameItems.find((item) => item.id === itemId);
  const mask = useMaskStyle(itemId, itemDetails?.fragments?.length ?? 1, [
    fragmentId,
  ]);
  const matchedElement =
    elements.find((element) => itemId?.includes(element)) || null;
  const matchedMyth =
    mythSections.find((element) => itemId?.includes(element)) || null;
  if (matchedMyth && itemId) {
    mythology = matchedMyth;
  } else if (matchedElement && itemId) {
    mythology = elementMythNames[matchedElement]?.toLowerCase();
  }

  return (
    <div
      onClick={handleFlip}
      className="card__face card__face--front relative flex justify-center items-center"
    >
      <div
        className={`absolute inset-0 bg-cover bg-center filter-${mythology} rounded-primary z-0`}
        style={{ backgroundImage: `url(${assets.uxui.baseBgA})` }}
      />

      <div className="relative z-20 flex flex-col select-none items-center justify-center w-full h-full">
        {isSell ? (
          <div className="relative m-2 flex justify-center items-center w-[50px]">
            <img
              src={assets.uxui.gobcoin}
              alt="relic"
              className="w-full select-none"
            />
            <div className="absolute text-[10.5vw] font-roboto font-bold text-shadow text-gray-600 opacity-85 grayscale">
              {!isComplete ? 1 : itemDetails.coins}
            </div>
          </div>
        ) : (
          <div className="relative m-2 flex justify-center items-center w-[50px] h-[5vh]"></div>
        )}

        <div className="relative w-[240px] h-[240px] select-none mt-4 flex justify-center items-center">
          <div
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            className="relative w-full select-none h-full"
          >
            <img
              src={`https://media.publit.io/file/BeGods/items/240px-${itemId}.png`}
              alt="relic"
              draggable={false}
              style={{ userSelect: "none", WebkitUserDrag: "none" }}
              className={`w-full h-full object-contain ${
                !isComplete ? "grayscale" : ""
              }`}
            />
          </div>

          {(!isComplete || isComplete == false) && !maskOff && mask}
        </div>

        <div className="relative w-full h-[19%] mt-auto card-shadow-white-celtic z-10">
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat rounded-b-primary filter-paper-${mythology}`}
            style={{ backgroundImage: `url(${assets.uxui.footer})` }}
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
