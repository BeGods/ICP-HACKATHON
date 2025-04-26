import React, { useContext, useEffect, useState } from "react";
import { RorContext } from "../../../context/context";
import RelicCrd from "../Relics/RelicCrd";
import RelicInfo from "../Relics/RelicInfo";
import CharCrd from "../Relics/CharCrd";
import { mythElementNamesLowerCase } from "../../../utils/constants.ror";

const RelicRwrdCrd = ({
  showBoots,
  claimBoots,
  itemId,
  ButtonFront,
  ButtonBack,
  isChar,
  fragmentId,
  isComplete,
  maskOff,
  mythology,
  hasShards,
}) => {
  const { isTelegram, setShowCard } = useContext(RorContext);
  const [flipped, setFlipped] = useState(false);
  alert;
  const cardHeight = isTelegram ? "h-[47vh] mt-[4.5vh]" : "h-[50dvh] mt-[2vh]";

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipped((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-[99]">
      {showBoots && (
        <div
          onClick={claimBoots}
          className="absolute mb-[5vh] flex justify-center w-full bottom-0  z-50"
        >
          <img
            src={`/assets/ror-cards/240px-${mythology?.toLowerCase()}.artifact.starter02_on.png`}
            alt="item"
            className="w-[14vw] scale-point"
          />
        </div>
      )}

      {hasShards && (
        <div className="flex flex-col justify-center items-center reward-pop-in">
          <div className="flex relative justify-center items-center  rounded-full p-2.5 w-[60vw]">
            <img src={`/assets/ror-cards/240px-shard.fire.png`} alt="item" />
          </div>
          <div className={`text-[12vw] -mt-4 ml-5 glow-icon-greek text-white`}>
            +300
          </div>
        </div>
      )}

      {isChar ? (
        <CharCrd
          cardHeight={cardHeight}
          itemId={itemId}
          handleClose={() => setShowCard(null)}
        />
      ) : (
        <>
          <div className="relative w-[72%] h-[57%] card-shadow-white rounded-lg shadow-lg flex flex-col z-50">
            <div className={`card  ${cardHeight}  ${flipped ? "flipped" : ""}`}>
              <RelicCrd
                fragmentId={fragmentId}
                isComplete={isComplete}
                itemId={itemId}
                maskOff={maskOff}
                handleFlip={() => setFlipped((prev) => !prev)}
              />
              <RelicInfo handleFlip={() => setFlipped((prev) => !prev)} />
            </div>
          </div>
          <div className={`button  z-50 ${flipped ? "flipped mt-3" : "mt-2"}`}>
            <div
              className={`button__face button__face--front flex justify-center items-center`}
            >
              {ButtonFront}
            </div>
            <div className="button__face button__face--back z-50 mt-0.5 flex justify-center items-center">
              {ButtonBack}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RelicRwrdCrd;
