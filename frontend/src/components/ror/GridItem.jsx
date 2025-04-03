import React from "react";
import { overlayStyle } from "../../utils/constants.ror";
import { gameItems } from "../../utils/gameItems";

const GridItem = ({ itemObj, itemsWithAllFrags }) => {
  const itemDetails = gameItems.find((item) => item.id === itemObj.itemId);

  return (
    <div className={`relative h-[120px] w-[120px] overflow-hidden`}>
      <div
        className={`glow-icon-white h-full w-full ${
          !itemsWithAllFrags.includes(itemDetails.id) && "opacity-50"
        }`}
        style={{
          backgroundImage: `url(/assets/ror-cards/240px-${itemObj.itemId}_off.png)`,
          backgroundSize: "cover",
          backgroundPosition: "10% 20%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="glow-icon-white ">{itemDetails.name}</div>
      </div>
      <div className={`${itemObj.isComplete && "hidden"}`}>
        {itemDetails.fragments.length === 3 && itemObj.fragmentId === 1 ? (
          <>
            <div className="absolute top-0 left-0 h-full w-[32.5%] bg-gray-900 mix-blend-hue opacity-100"></div>
            <div className="absolute top-0 right-0 h-full w-[32.5%] bg-gray-900 mix-blend-hue opacity-100"></div>
          </>
        ) : (
          <div
            className={`absolute ${
              overlayStyle[itemDetails.fragments.length][itemObj.fragmentId]
            } bg-gray-900  grayscale mix-blend-hue opacity-100`}
          ></div>
        )}
      </div>
    </div>
  );
};

export default GridItem;
