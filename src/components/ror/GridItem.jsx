import React, { useContext } from "react";
import { gameItems } from "../../utils/gameItems";
import { useMaskStyle } from "../../hooks/MaskStyle";
import { RorContext } from "../../context/context";
import { reformatPotion } from "../../helpers/game.helper";

const GridItem = ({
  itemObj,
  itemsWithAllFrags,
  handleClick,
  isInfo,
  isStage,
  hideBg,
  showClaim,
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

  const isGrayscale =
    isStage &&
    (itemObj?.isComplete === true ||
      !itemsWithAllFrags.includes(itemDetails?.id));

  return (
    <div
      onClick={handleClick}
      className={`relative ${isGrayscale ? "grayscale" : ""} 
    w-full h-auto 
    max-w-[120px] flex flex-col items-center 
    shadow-2xl rounded-md overflow-hidden`}
    >
      <div className={`flex flex-col rounded-md border items-center w-full`}>
        <div className="relative w-full aspect-square max-w-[120px] overflow-hidden rounded-md">
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
                  isInfo ? assets.uxui.bgInfo : assets.uxui.baseBgA
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          <div className="absolute inset-0 z-10 border border-white/50 rounded-md overflow-hidden">
            <div
              className={`w-full h-full flex justify-center items-end select-none ${
                !itemObj?.isComplete ? "grayscale" : ""
              }`}
              style={{
                backgroundImage: `url(https://media.publit.io/file/BeGods/items/240px-${itemObj?.itemId}.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="w-full">{mask}</div>
          </div>
        </div>

        <div className="w-full text-center text-white text-sm leading-tight break-words px-1 py-1">
          {showClaim || itemDetails?.name || ""}
        </div>
      </div>
    </div>
  );
};

export default GridItem;
