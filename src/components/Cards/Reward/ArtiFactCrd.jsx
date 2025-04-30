import React, { useContext, useState } from "react";
import { RorContext } from "../../../context/context";
import RelicCrd from "../Relics/RelicCrd";
import { ToggleLeft, ToggleRight } from "../../Common/SectionToggles";
import RoRBtn from "../../ror/RoRBtn";
import DefaultBtn from "../../Buttons/DefaultBtn";
import { mythSections } from "../../../utils/constants.fof";
import { claimArtifact } from "../../../utils/api.ror";
import { toast } from "react-toastify";

const ArtifactCrd = ({ category, handleClick, items, initalIdx = 0 }) => {
  const { isTelegram, setShowCard, gameData, setGameData, authToken } =
    useContext(RorContext);
  const [idx, setIdx] = useState(initalIdx);
  const [flipped, setFlipped] = useState(false);

  const itemExists = gameData?.pouch?.includes(items[idx].id) ? true : false;

  const cardHeight = isTelegram ? "h-[47vh] mt-[4.5vh]" : "h-[50dvh] mt-[2vh]";

  const handleClaimItem = async () => {
    try {
      await claimArtifact(authToken, items[idx].id);
      setGameData((prev) => {
        let updatedPouch = [...prev.pouch, items[idx].id];
        let updatdStats = { ...prev.stats };

        updatdStats.gobcoin -= 1;

        return {
          ...prev,
          pouch: updatedPouch,
          stats: updatdStats,
        };
      });

      handleClick();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-[99]">
      <div className="relative w-[72%] h-[57%] card-shadow-white rounded-lg shadow-lg flex flex-col z-50">
        <div className={`card  ${cardHeight}  ${flipped ? "flipped" : ""}`}>
          <RelicCrd
            isClose={true}
            fragmentId={0}
            isComplete={true}
            itemId={items[idx].id}
            handleClose={() => setShowCard(false)}
            handleFlip={() => {}}
          />
        </div>
      </div>
      <div className={`button  z-50 ${flipped ? "flipped mt-3" : "mt-2"}`}>
        <div
          className={`button__face button__face--front flex justify-center items-center`}
        >
          {itemExists ? (
            <DefaultBtn
              message={3}
              activeMyth={mythSections.indexOf(items[idx]?.id?.split(".")[0])}
              handleClick={() => {
                const myth = items[idx]?.id?.split(".")[0];
                if (category == 0) {
                  handleClick(myth);
                }
                setShowCard(null);
              }}
            />
          ) : (
            <RoRBtn
              left={1}
              right={1}
              handleClick={handleClaimItem}
              disable={itemExists}
            />
          )}
        </div>
        <div className="button__face button__face--back z-50 mt-0.5 flex justify-center items-center">
          <></>
        </div>
      </div>

      <div>
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
    </div>
  );
};

export default ArtifactCrd;
