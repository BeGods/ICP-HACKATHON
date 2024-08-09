import React, { useEffect, useState } from "react";

const mythSections = ["celtic", "egyptian", "greek", "norse"];
const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];

const InfoCard = ({
  quest,
  activeCard,
  isShared,
  handleClaimShareReward,
  handleShowInfo,
  activeMyth,
}) => {
  const [isButtonGlowing, setIsButtonGlowing] = useState(0);

  const handleButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
      handleShowInfo();
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="relative w-[72%] rounded-lg shadow-lg mt-10">
        {/* <img
          src={`/cards/${activeCard}_info.png`}
          alt="card"
          className="w-full h-full mx-auto"
        /> */}
        <div className="relative h-full w-full">
          <img
            src={`/assets/cards/320px-info_background_tiny.png`}
            alt="card"
            className="w-full h-full mx-auto"
          />
          <div className="absolute top-0 right-0 h-full w-full cursor-pointer">
            <div className="flex w-full">
              <div className="flex flex-col leading-tight justify-center items-center flex-grow font-montserrat text-card pt-4">
                <div className="text-left pl-8">
                  <h1 className="text-[22px] font-bold">DISCOVER</h1>
                  <h2 className="-mt-1 font-medium uppercase">
                    {mythologies[activeMyth]}
                  </h2>
                </div>
              </div>
              <div className="flex absolute w-full justify-end">
                <img
                  src="/assets/icons/close.svg"
                  alt="info"
                  className={`w-[55px] h-[55px] ml-auto rounded-full -mt-6 -mr-6 ${
                    isButtonGlowing == 1
                      ? `glow-button-${mythSections[activeMyth]}`
                      : ""
                  }`}
                  onClick={() => {
                    handleButtonClick(1);
                  }}
                />
              </div>
            </div>
            <div className="flex mx-auto w-[55%] py-6">
              <img
                //320px-norse.quest.A02_info_painting_tiny.png
                src={`/assets/cards/320px-${quest?.type}_info_painting_tiny.png`}
                alt="info_painting"
                className="w-full h-full mx-auto"
              />
            </div>
            <div className="leading-[15px] text-[13px] text-left w-[85%] mx-auto pt-1.5 text-card font-medium">
              {quest.description}
            </div>
          </div>
        </div>

        {!isShared ? (
          <div
            onClick={handleClaimShareReward}
            className={`flex items-center justify-between h-[54px] w-[192px] mx-auto -mt-2 bg-${mythSections[activeMyth]} z-50 text-white font-montserrat rounded-button`}
          >
            <div className="flex justify-center items-center w-1/4 h-full">
              <img
                src={`/assets/icons/x.svg`}
                alt="orb"
                className="w-[32px] h-[32px]"
              />
            </div>
            <div className="text-[16px] uppercase">SHARE</div>
            <div className="flex justify-center items-center w-1/4  h-full">
              <div className="absolute top-0 z-10">
                <img
                  src="/assets/icons/arrow.down.svg"
                  alt="upward"
                  className="z-10 mt-3"
                />
              </div>
              <img
                src={`/assets/myths-orbs/orb.multicolor-tiny.png`}
                alt="orb"
                className="w-[32px] h-[32px]"
              />
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center justify-between h-[54px] w-[192px] mx-auto -mt-2 bg-glass-black z-50 text-white font-montserrat rounded-button`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-[16px] uppercase">SHARED</div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
