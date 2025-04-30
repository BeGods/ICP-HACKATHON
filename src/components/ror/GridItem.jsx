import React, { useContext } from "react";
import { gameItems } from "../../utils/gameItems";
import { useMaskStyle } from "../../hooks/MaskStyle";
import { RorContext } from "../../context/context";
import { reformatPotion } from "../../helpers/game.helper";
import { calculateRemainingTime } from "../../helpers/ror.timers.helper";

const GridItem = ({
  itemObj,
  itemsWithAllFrags,
  handleClick,
  isInfo,
  isStage,
  hideBg,
  showClaim,
  timer,
}) => {
  const { assets } = useContext(RorContext);
  const itemDetails = gameItems.find((item) => item?.id === itemObj?.itemId);

  const mask = useMaskStyle(
    itemDetails?.id,
    itemDetails?.fragments.length,
    Array.isArray(itemObj?.fragmentId)
      ? itemObj?.fragmentId
      : [itemObj?.fragmentId]
  );
  const timeLeft = timer - Date.now();

  const isGrayscale =
    isStage &&
    (itemObj?.isComplete === true ||
      !itemsWithAllFrags.includes(itemDetails?.id));

  return (
    <div
      onClick={handleClick}
      className={`relative ${
        isGrayscale && "grayscale"
      }  w-full h-full max-w-[120px] max-h-[140px] flex flex-col items-center shadow-2xl rounded-md overflow-hidden`}
    >
      <div className="relative w-full aspect-square max-w-[120px]">
        {!hideBg && (
          <div
            className={`absolute inset-0 z-0 opacity-50 ${
              itemObj.isComplete &&
              `filter-${
                !isInfo && itemObj?.itemId?.includes("potion")
                  ? reformatPotion(itemObj?.itemId)?.split(".")[0]
                  : itemObj?.itemId?.split(".")[0]
              }`
            }`}
            style={{
              backgroundImage: `url(${
                isInfo ? assets.uxui.info : assets.uxui.basebg
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}

        <div className="absolute inset-0 z-50 border border-white/50 rounded-md">
          <div
            className={`w-full h-full flex justify-center items-end  ${
              !itemObj?.isComplete && "grayscale"
            }`}
            style={{
              backgroundImage: `url(/assets/ror-cards/240px-${itemObj?.itemId}_on.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className={`${itemObj?.isComplete ? "hidden" : ""} w-full`}>
            {mask}
          </div>
        </div>
      </div>

      {timeLeft && timeLeft > 0 ? (
        <div className="w-full uppercase text-center text-[1rem] break-words px-1 bg-black py-1 text-white rounded-md">
          {calculateRemainingTime(timeLeft)}
        </div>
      ) : showClaim ? (
        <div className="w-full uppercase text-center text-[1rem] break-words px-1 bg-black py-1 text-white rounded-md">
          MINT
        </div>
      ) : (
        <div className="w-full text-center text-white text-[1rem] mt-1 break-words px-1">
          {itemDetails?.name ?? ""}
        </div>
      )}
    </div>
  );
};

export default GridItem;
