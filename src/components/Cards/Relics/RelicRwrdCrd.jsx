import React, { useContext, useEffect, useState } from "react";
import { RorContext } from "../../../context/context";
import RelicCrd from "./RelicCrd";
import RelicInfo from "./RelicInfo";
import CharCrd from "./CharCrd";
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
  hideInfo,
  isSell,
}) => {
  const { isTgMobile, setShowCard } = useContext(RorContext);
  const [flipped, setFlipped] = useState(false);

  const cardHeight = isTgMobile ? "h-[49vh] mt-[4.5vh]" : "h-[50dvh] mt-[2vh]";

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFlipped((prev) => !prev);
  //   }, 2500);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="fixed inset-0 select-none bg-black  bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-[99]">
      {showBoots && (
        <div
          onClick={claimBoots}
          className="absolute mb-[5vh] flex justify-center w-full bottom-0  z-50"
        >
          <img
            src={`https://media.publit.io/file/BeGods/items/240px-${mythology?.toLowerCase()}.artifact.starter02.png`}
            alt="item"
            className="w-[14vw] scale-point"
          />
        </div>
      )}

      {isChar ? (
        <>
          <div
            className={`relative select-none card-width card-shadow-white rounded-lg shadow-lg flex flex-col z-50`}
          >
            <div className={`card ${cardHeight} select-none`}>
              <CharCrd
                cardHeight={cardHeight}
                itemId={itemId}
                handleClose={() => setShowCard(null)}
              />
            </div>
          </div>
          <div className={`button  z-50 mt-2`}>
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
      ) : (
        <>
          <div
            className={`relative select-none card-width card-shadow-white rounded-lg shadow-lg flex flex-col z-50`}
          >
            <div
              className={`card ${cardHeight} select-none  ${
                flipped ? "flipped" : ""
              }`}
            >
              <RelicCrd
                isSell={isSell}
                handleClose={() => setShowCard(null)}
                isClose={hideInfo}
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
