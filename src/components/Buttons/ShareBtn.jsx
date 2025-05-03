import React, { useContext, useRef, useState } from "react";
import { mythSections, mythSymbols } from "../../utils/constants.fof";
import { Share2, ThumbsUp } from "lucide-react";
import { MainContext } from "../../context/context";

const ShareButton = ({
  isShared,
  isInfo,
  handleClaim,
  activeMyth,
  link,
  isCoin,
}) => {
  const { assets } = useContext(MainContext);
  const [isClicked, setIsClicked] = useState(false);
  const [showRedirect, setShowRedirect] = useState(true);
  let disableClick = useRef(false);

  return (
    <div
      onClick={() => {
        if (!isShared) {
          if (showRedirect) {
            window.open(link, "_blank");
            setShowRedirect(false);
          } else {
            if (disableClick.current === false) {
              disableClick.current = true;
              setTimeout(() => {
                disableClick.current = false;
              }, 2000);
              handleClaim();
            }
          }
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
          <div className="flex justify-center items-center h-full">
            <div className="flex justify-center items-center w-[40px] h-[40px]  bg-black rounded-full">
              <img
                src={`https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-white-icon.png`}
                alt="orb"
                className="w-[25px]"
              />
            </div>
          </div>
          {showRedirect ? (
            <div
              className={`flex shadow-black shadow-2xl justify-center items-center bg-black border-[3px] p-[5vw] rounded-full`}
            >
              <Share2 size={"7.5vw"} color="white" />
            </div>
          ) : (
            <div
              className={`flex shadow-black shadow-2xl justify-center items-center bg-black border-[3px] p-[5vw] rounded-full`}
            >
              <ThumbsUp size={"7.5vw"} color="white" />
            </div>
          )}
          {isInfo ? (
            <div className="flex justify-end items-center w-1/4  h-full">
              <img
                src={`${assets.uxui.multiorb}`}
                alt="orb"
                className="w-[85%]"
              />
            </div>
          ) : (
            <div
              className={`flex justify-center items-center w-1/4 border-borderGray h-full`}
            >
              {isCoin ? (
                <div
                  className={`flex  relative text-center justify-center text-black-sm-contour items-center `}
                >
                  <img
                    src={`https://media.publit.io/file/BeGods/items/240px-gobcoin.png`}
                    alt="orb"
                    className={` overflow-hidden max-w-[10vw]`}
                  />
                  <div
                    className="absolute text-[7vw] font-roboto font-bold text-shadow grayscale"
                    style={{
                      backgroundImage: "url('/assets/metal.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    3
                  </div>
                </div>
              ) : (
                <div
                  className={`flex  relative text-center justify-center text-black-sm-contour items-center glow-icon-${mythSections[activeMyth]} `}
                >
                  <img
                    src={`${assets.uxui.baseorb}`}
                    alt="orb"
                    className={`filter-orbs-${mythSections[activeMyth]} overflow-hidden max-w-[10vw]`}
                  />
                  <span
                    className={`absolute z-1  text-black-sm-contour opacity-50 text-white font-symbols  text-symbol-sm mt-1`}
                  >
                    {mythSymbols[mythSections[activeMyth]]}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex items-center justify-between  h-button-primary w-button-primary mt-[10px] mx-auto border border-cardsGray  bg-glass-black z-50 text-cardsGray
            rounded-primary`}
        >
          <div className="flex justify-center items-center w-1/4 h-full"></div>
          <Share2 size={"7.5vw"} />
          <div className="flex justify-center items-center w-1/4  h-full"></div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
