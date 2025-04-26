import React, { useContext } from "react";
import { gameItems } from "../../utils/gameItems";
import { useMaskStyle } from "../../hooks/MaskStyle";
import { RorContext } from "../../context/context";

const GridItem = ({
  itemObj,
  itemsWithAllFrags,
  handleClick,
  isInfo,
  isStage,
}) => {
  const { assets } = useContext(RorContext);
  let itemDetails = gameItems.find((item) => item?.id === itemObj?.itemId);
  const mask = useMaskStyle(
    itemDetails?.id,
    itemDetails?.fragments.length,
    Array.isArray(itemObj?.fragmentId)
      ? itemObj?.fragmentId
      : [itemObj?.fragmentId]
  );

  return (
    <div
      onClick={handleClick}
      className={`relative w-[100%] ${
        !isStage && !itemsWithAllFrags.includes(itemDetails?.id) && "grayscale"
      } ${
        isStage &&
        !itemObj.isComplete &&
        !itemsWithAllFrags.includes(itemDetails?.id) &&
        "grayscale"
      } aspect-square max-w-[120px] border border-white/10 shadow-2xl rounded-md overflow-auto`}
    >
      <div
        className={`absolute inset-0 z-0 filter-${
          !isInfo && itemObj?.itemId?.split(".")[0]
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
      <div className="absolute inset-0 z-50 p-1.5">
        <div
          className={`w-full h-full flex justify-center items-end rounded-md `}
          style={{
            backgroundImage: `url(/assets/ror-cards/240px-${itemObj?.itemId}_on.png)`,
            backgroundSize: "cover",
            backgroundPosition: "10% 20%",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div className={`${itemObj?.isComplete && "hidden"}`}>{mask}</div>
      </div>
    </div>
  );
};

export default GridItem;
