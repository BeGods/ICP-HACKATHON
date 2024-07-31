import React from "react";

const mythSections = ["celtic", "egyptian", "greek", "norse"];

const InfoCard = ({
  activeCard,
  isShared,
  handleClaimShareReward,
  handleShowInfo,
  activeMyth,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="relative w-[72%] rounded-lg shadow-lg mt-10">
        <img
          src={`/cards/${activeCard}_info.png`}
          alt="card"
          className="w-full h-full mx-auto"
        />
        <div className="absolute top-0 right-0 h-10 w-10 cursor-pointer">
          <img
            src="/icons/close.svg"
            alt="close"
            className="w-[38px] h-[38px] mt-1"
            onClick={handleShowInfo}
          />
        </div>
        {!isShared ? (
          <div
            onClick={handleClaimShareReward}
            className={`flex items-center justify-between h-[54px] w-[192px] mx-auto -mt-2 bg-${mythSections[activeMyth]} z-50 text-white font-montserrat rounded-button`}
          >
            <div className="flex justify-center items-center w-1/4 h-full">
              <img
                src={`/icons/x.png`}
                alt="orb"
                className="w-[32px] h-[32px]"
              />
            </div>
            <div className="text-[16px] uppercase">SHARE</div>
            <div className="flex justify-center items-center w-1/4  h-full">
              <img
                src={`/images/multiorb.png`}
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
