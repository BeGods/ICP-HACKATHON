import React, { useState } from "react";

const mythSections = ["celtic", "egyptian", "greek", "norse"];

const OrbCard = ({ activeMyth, updateBlackOrbStatus, closeCard }) => {
  const [isButtonGlowing, setIsButtonGlowing] = useState(0);

  const handleButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
      closeCard();
    }, 100);
  };

  return (
    <div className="fixed flex flex-col justify-center items-center inset-0 backdrop-blur-sm bg-opacity-50 z-10">
      <div className="relative w-[73%] h-[55%] flex items-center justify-center rounded-[10px]">
        <div
          className="absolute inset-0 filter-card"
          style={{
            backgroundImage: `url(/assets/cards/320px-info_background_tiny.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
        <div className="relative h-full w-full flex flex-col items-center">
          <div className="flex w-full absolute justify-end z-50">
            <img
              src="/assets/icons/close.svg"
              alt="info"
              className={`w-[55px] h-[55px] ml-auto rounded-full -mt-[28px] -mr-[28px] ${
                isButtonGlowing === 1
                  ? `glow-button-${mythSections[activeMyth]}`
                  : ""
              }`}
              onClick={() => {
                handleButtonClick(1);
              }}
            />
          </div>
          <div className="flex flex-col justify-center items-center h-full w-full">
            {/* <div
              className={`flex relative text-center justify-center items-center w-2/3 h-full  `}
            >
              <img
                src="/assets/uxui/240px-shard.base-tiny.png"
                alt="orb"
                className={`filter-orbs-celtic  `}
              />
            </div> */}
            <div
              className={`flex relative text-center justify-center items-center w-2/3 h-full rounded-full glow-orb-black`}
            >
              <img
                src="/assets/uxui/240px-orb.base-tiny.png"
                alt="orb"
                className={`filter-orbs-black rounded-full orb`}
              />
              <span
                className={`absolute z-1 text-[200px] text-white font-symbols opacity-50 orb-glow`}
              >
                3
              </span>
            </div>
            {/* <div className="mb-auto" style={{ filter: " brightness(65%)" }}>
              <img src="/assets/uxui/fof.footer.paper_tiny.png" alt="footer" />
            </div> */}
            <div
              className={`flex relative items-center h-[29%] w-full uppercase glow-card-celtic text-white`}
            >
              <div
                style={{
                  backgroundImage: `url(/assets/uxui/fof.footer.paper_tiny.png)`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
                className={` rounded-b-[15px]`}
              />
              <div className="flex justify-between w-full h-full items-center px-3 z-10"></div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex items-center justify-between h-[60px] w-[192px] mx-auto border border-celtic-primary  bg-glass-black z-50 text-white  rounded-button`}
      >
        <div className="flex justify-center items-center w-1/4 h-full"></div>
        <div className="text-[16px] uppercase">Claim</div>
        <div className="flex justify-center items-center w-1/4  h-full"></div>
      </div>
    </div>
  );
};

export default OrbCard;
