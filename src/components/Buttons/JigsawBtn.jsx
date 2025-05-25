import React, { useCallback, useState } from "react";
import { mythSections } from "../../utils/constants.fof";
import {
  CornerUpLeft,
  CornerUpRight,
  Download,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useAdsgram } from "../../hooks/Adsgram";
import { showToast } from "../Toast/Toast";

const JigsawButton = ({
  activeMyth,
  handleNext,
  handlePrev,
  faith,
  disableLeft,
  handleClick,
  isPartner,
  limit,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const adsgramId = import.meta.env.VITE_AD_VOUCHER_CLAIM;

  const onReward = useCallback(() => {
    handleClick();
  }, []);
  const onError = useCallback((result) => {
    console.log(result);
    showToast("ad_error");
  }, []);

  const showAd = useAdsgram({
    blockId: adsgramId,
    onReward,
    onError,
  });

  return (
    <div
      onClick={() => {
        if (faith == limit) {
          showAd();
        } else if (faith < limit && isPartner) {
          handleClick();
        }
      }}
      onMouseDown={() => {
        setIsClicked(true);
      }}
      onMouseUp={() => {
        setIsClicked(false);
      }}
      onMouseLeave={() => {
        setIsClicked(false);
      }}
      onTouchStart={() => {
        setIsClicked(true);
      }}
      onTouchEnd={() => {
        setIsClicked(false);
      }}
      onTouchCancel={() => {
        setIsClicked(false);
      }}
      className={`flex items-center justify-between h-button-primary w-button-primary mx-auto ${
        isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
      } border ${
        faith != 12
          ? "border-borderGray"
          : `border-${mythSections[activeMyth]}-primary`
      } bg-glass-black  rounded-primary z-[99]  top-0 left-0 right-0`}
      style={{ top: "100%", transform: "translateY(-50%)" }}
    >
      <div className="flex justify-center items-center w-1/4 border-r-secondary border-borderGray h-full">
        <CornerUpLeft
          color={disableLeft ? "#707579" : `white`}
          className="h-icon-secondary w-icon-secondary"
          onClick={handlePrev}
        />
      </div>
      {faith < limit && isPartner ? (
        <div
          className={`flex shadow-black shadow-2xl justify-center text-[40px] font-symbols items-center bg-black text-white border-white p-[1rem] border-[3px] rounded-full`}
        >
          <Share2 size={"2rem"} />
        </div>
      ) : (
        <div
          className={`flex shadow-black shadow-2xl justify-center text-[40px] font-symbols items-center bg-black ${
            faith < limit
              ? "text-textGray border-borderDark"
              : "text-white border-white"
          }  p-[1rem] border-[3px] rounded-full`}
        >
          <ThumbsUp size={"2rem"} />
        </div>
      )}

      <div className="flex justify-center items-center w-1/4 border-l-secondary border-borderGray h-full">
        <CornerUpRight
          color="#707579"
          className="h-icon-secondary w-icon-secondary"
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default JigsawButton;
