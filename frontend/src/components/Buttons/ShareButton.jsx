import React, { useRef, useState } from "react";
import { mythSections } from "../../utils/variables";
import { Share2 } from "lucide-react";

const ShareButton = ({ isShared, isInfo, handleClaim, activeMyth, t }) => {
  const [isClicked, setIsClicked] = useState(false);
  let disableClick = useRef(false);

  return (
    <div
      onClick={() => {
        if (disableClick.current === false) {
          disableClick.current = true;
          handleClaim();
          setTimeout(() => {
            disableClick.current = false;
          }, 2000);
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
      className="relative"
    >
      {!isShared ? (
        <div
          className={`flex items-center  mt-[10px] justify-between ${
            isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
          }  border border-black h-button-primary w-button-primary mx-auto  bg-${
            mythSections[activeMyth]
          } z-50 text-white  rounded-primary`}
        >
          <div className="flex justify-center items-center w-1/4 h-full">
            <div className="flex justify-center items-center w-[40px] h-[40px]  bg-black rounded-full">
              <img
                src={`https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-white-icon.png`}
                alt="orb"
                className="w-[25px]"
              />
            </div>
          </div>
          <div>
            <Share2 size={"8vw"} />
          </div>
          {isInfo ? (
            <div className="flex justify-center items-center w-1/4  h-full">
              <img
                src={`/assets/uxui/240px-orb.multicolor.png`}
                alt="orb"
                className="w-[85%]"
              />
            </div>
          ) : (
            <div
              className={`flex justify-center items-center w-1/4 border-borderGray h-full`}
            >
              <div className={`filter-orbs-${mythSections[activeMyth]}`}>
                <img
                  src={`/assets/uxui/240px-orb.base.png`}
                  alt="orb"
                  className="w-[85%]"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex items-center justify-between  h-button-primary w-button-primary mt-[10px] mx-auto border border-cardsGray  bg-glass-black z-50 text-cardsGray
            rounded-primary`}
        >
          <div className="flex justify-center items-center w-1/4 h-full"></div>
          <Share2 size={"8vw"} />
          <div className="flex justify-center items-center w-1/4  h-full"></div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
