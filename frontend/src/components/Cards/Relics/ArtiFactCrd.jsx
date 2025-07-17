import React, { useContext, useState } from "react";
import { RorContext } from "../../../context/context";
import RelicCrd from "./RelicCrd";
import { ToggleLeft, ToggleRight } from "../../Common/SectionToggles";
import RoRBtn from "../../Buttons/RoRBtn";
import CurrencyCrd from "./CurrencyCrd";
import RelicInfo from "./RelicInfo";
import { X } from "lucide-react";

const ArtifactCrd = ({
  category,
  isClose,
  handleClick,
  items,
  initalIdx = 0,
  isCurrency,
  isPay,
  icon,
}) => {
  const { isTgMobile, setShowCard, gameData, setGameData, authToken } =
    useContext(RorContext);
  const [idx, setIdx] = useState(initalIdx);
  const [flipped, setFlipped] = useState(false);

  // const itemExists = gameData?.pouch?.includes(items[idx].id) ? true : false;

  const cardHeight = isTgMobile ? "h-[47vh] mt-[4.5vh]" : "h-[50dvh] mt-[2vh]";

  return (
    <div
      onClick={() => setShowCard(null)}
      className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-[99]"
    >
      {!isClose && (
        <div className="absolute top-0 right-0 p-6">
          <X color="white" size={"2rem"} />
        </div>
      )}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative card-width card-shadow-white rounded-lg shadow-lg flex flex-col z-50`}
      >
        <div className={`card  ${cardHeight}  ${flipped ? "flipped" : ""}`}>
          {isCurrency ? (
            <CurrencyCrd
              itemId={items[idx]}
              handleClose={handleClick}
              handleFlip={() => setShowCard(false)}
            />
          ) : (
            <RelicCrd
              isClose={isClose}
              fragmentId={0}
              isComplete={true}
              icon={icon}
              itemId={items[idx].id}
              handleClose={() => setShowCard(false)}
              handleFlip={() => setFlipped((prev) => !prev)}
            />
          )}

          <RelicInfo handleFlip={() => setFlipped((prev) => !prev)} />
        </div>
      </div>
      <div className={`button  z-50 ${flipped ? "flipped mt-3" : "mt-2"}`}>
        <div
          className={`button__face button__face--front flex justify-center items-center`}
        >
          <RoRBtn
            itemId={items[idx].id}
            message={isCurrency ? items[idx].count : "Close"}
            left={1}
            right={1}
            isNotPay={!isPay}
            handleClick={() => {
              handleClick(items[idx].id);
            }}
            disable={false}
          />
        </div>
        <div className="button__face button__face--back z-50 mt-0.5 flex justify-center items-center">
          <RoRBtn
            itemId={items[idx].id}
            message={"Close"}
            left={1}
            right={1}
            isNotPay={true}
            handleClick={() => {
              handleClick(items[idx].id);
            }}
            disable={false}
          />
        </div>
      </div>
      {items.length > 1 && (
        <div onClick={(e) => e.stopPropagation()} className="w-full z-50">
          <ToggleLeft
            activeMyth={4}
            handleClick={() => {
              setIdx((prev) => (prev - 1 + items.length) % items.length);
            }}
          />
          <ToggleRight
            activeMyth={4}
            handleClick={() => {
              setIdx((prev) => (prev + 1) % items.length);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ArtifactCrd;

// const handleClaimItem = async () => {
//   try {
//     await claimArtifact(authToken, items[idx].id);
//     setGameData((prev) => {
//       let updatedPouch = [...prev.pouch, items[idx].id];
//       let updatdStats = { ...prev.stats };

//       updatdStats.gobcoin -= 1;

//       return {
//         ...prev,
//         pouch: updatedPouch,
//         stats: updatdStats,
//       };
//     });

//     handleClick();
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       "An unexpected error occurred";
//     toast.error(errorMessage);
//   }
// };

{
  /* */
}
