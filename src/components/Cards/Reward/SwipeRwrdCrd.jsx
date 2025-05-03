import React, { useContext, useEffect, useState } from "react";
import { RorContext } from "../../../context/context";
import { gameItems } from "../../../utils/gameItems";

const SwipeRwrdCrd = ({ reward, showBoots, digMyth, claimBoots }) => {
  const { assets, isTelegram } = useContext(RorContext);
  const [flipped, setFlipped] = useState(false);

  const hasFragment = !!reward?.fragment;
  const hasShards = reward?.shards > 0;
  const canFlip = hasFragment && hasShards;
  const destrItemIds = hasFragment && reward?.fragment?.itemId?.split(".");

  useEffect(() => {
    if (!canFlip) return;
    const interval = setInterval(() => {
      setFlipped((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, [canFlip]);

  const cardHeight = isTelegram
    ? "h-[45.35vh] mt-[4.5vh]"
    : "h-[50dvh] mt-[2vh]";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-[99]">
      {showBoots && (
        <div
          onClick={claimBoots}
          className="absolute mb-[5vh] flex justify-center w-full bottom-0  z-50"
        >
          <img
            src={`https://media.publit.io/file/BeGods/items/240px-${"celtic"?.toLowerCase()}.artifact.starter02.png`}
            alt="item"
            className="w-[14vw] scale-point"
          />
        </div>
      )}

      <div className="relative w-[72%] rounded-lg shadow-lg -mt-[30px] flex flex-col z-50">
        <div
          className={`card ${cardHeight} ${
            canFlip && flipped ? "flipped" : ""
          }`}
        >
          {/* fragment */}
          {reward?.isDragon && (
            <div
              onClick={() => canFlip && setFlipped((prev) => !prev)}
              className="card__face card__face--front relative card-shadow-white flex justify-center items-center"
            >
              <div className="relative w-full h-full text-card">
                <img
                  src={assets.uxui.info}
                  alt="info background"
                  className="w-full h-full object-cover grayscale rounded-primary z-10"
                />
              </div>
              <div className="absolute flex flex-col justify-center items-center z-20">
                <img
                  src={`/assets/ror-cards/240px-${reward?.mythology.toLowerCase()}.char.C00.png`}
                  alt="dragon"
                />
              </div>
            </div>
          )}

          {/* fragment */}
          {hasFragment && !reward?.isDragon && (
            <div
              onClick={() => canFlip && setFlipped((prev) => !prev)}
              className="card__face card__face--front relative card-shadow-white flex justify-center items-center"
            >
              <div className="relative w-full h-full text-card">
                <img
                  src={assets.uxui.info}
                  alt="info background"
                  className="w-full h-full object-cover grayscale rounded-primary z-10"
                />
              </div>
              <div className="absolute flex flex-col justify-center items-center z-20">
                <img
                  src={
                    reward.fragment?.isChar
                      ? `/assets/ror-cards/240px-${destrItemIds[0]}.char.${destrItemIds[2]}.png`
                      : `https://media.publit.io/file/BeGods/items/240px-${reward.fragment.itemId}.png`
                  }
                  alt="fragment"
                />
                {!reward.fragment?.isChar && reward?.fragment && (
                  <div className="text-num mt-5">
                    {
                      gameItems.find(
                        (item) => item.id == reward?.fragment?.itemId
                      )?.name
                    }
                  </div>
                )}
              </div>
            </div>
          )}

          {/* shard */}
          {hasShards && (
            <div
              onClick={() => canFlip && setFlipped((prev) => !prev)}
              className={`card__face ${
                hasFragment ? "card__face--back" : "card__face--front"
              } relative card-shadow-white flex justify-center items-center`}
            >
              <div className="relative w-full h-full text-card">
                <img
                  src={assets.uxui.info}
                  alt="info background"
                  className="w-full h-full object-cover grayscale rounded-primary z-10"
                />
              </div>
              <div className="absolute flex flex-col justify-center items-center z-20">
                <img
                  src={`https://media.publit.io/file/BeGods/items/240px-shard.water.png`}
                  alt="shards"
                />
                <div className="text-num mt-5">Shards x{reward.shards}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwipeRwrdCrd;
