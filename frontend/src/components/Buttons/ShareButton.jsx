import React, { useState } from "react";
import { mythSections } from "../../utils/variables";

const ShareButton = ({ isShared, isInfo, handleClaim, activeMyth, t }) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
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
          onClick={handleClaim}
          className={`flex items-center  mt-[10px] justify-between ${
            isClicked ? `glow-button-${mythSections[activeMyth]}` : ""
          }  border border-black h-button-primary w-button-primary mx-auto  bg-${
            mythSections[activeMyth]
          } z-50 text-white  rounded-primary`}
        >
          <div className="flex justify-center items-center w-1/4 h-full">
            <img src={`/assets/icons/x.svg`} alt="orb" className="w-[85%]" />
          </div>
          <div className="text-[16px] uppercase">{t(`buttons.share`)}</div>
          {isInfo ? (
            <div className="flex justify-center items-center w-1/4  h-full">
              <div className="absolute top-0 z-10">
                <img
                  src="/assets/icons/arrow.down.svg"
                  alt="upward"
                  className="z-10 mt-2.5"
                />
              </div>
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
              <div className="absolute top-0 z-10">
                <img
                  src="/assets/icons/arrow.down.svg"
                  alt="downward"
                  className="z-10 mt-3 mr-1.5"
                />
              </div>
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
          <div className="text-[16px] uppercase"> {t(`buttons.shared`)}</div>
          <div className="flex justify-center items-center w-1/4  h-full"></div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
