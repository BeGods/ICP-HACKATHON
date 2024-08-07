import React, { useState } from "react";

const mythSections = ["celtic", "egyptian", "greek", "norse"];

function OrbClaimCard({
  activeCard,
  handleOrbClaimReward,
  handleShowClaim,
  activeMyth,
}) {
  const [isButtonGlowing, setIsButtonGlowing] = useState(0);

  const handleButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
      handleShowClaim();
    }, 100);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="relative w-[72%] rounded-lg shadow-lg mt-10">
        <img
          src={`/cards/${activeCard}_raw.png`}
          alt="card"
          className="w-full h-full mx-auto"
        />
        <div
          className={`absolute top-0 right-0 w-[55px] h-[55px] cursor-pointer `}
        >
          <img
            src="/assets/icons/close.svg"
            alt="cose"
            className={`h-full w-full rounded-full ml-auto -mt-6 -mr-6 ${
              isButtonGlowing == 1
                ? `glow-button-${mythSections[activeMyth]}`
                : ""
            }`}
            onClick={() => {
              handleButtonClick(1);
            }}
          />
        </div>
        <div
          onClick={handleOrbClaimReward}
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

          <div
            className={`flex justify-center items-center w-1/4 border-borderGray h-full`}
          >
            <div className="absolute top-0 z-10">
              <img
                src="/assets/icons/arrow.down.svg"
                alt="upward"
                className="z-10 mt-3 mr-0.5"
              />
            </div>
            <div className={`filter-orbs-${mythSections[activeMyth]}`}>
              <img
                src={`/assets/myths-orbs/orb.base-tiny.png`}
                alt="orb"
                className="w-[40px] h-[40px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrbClaimCard;
