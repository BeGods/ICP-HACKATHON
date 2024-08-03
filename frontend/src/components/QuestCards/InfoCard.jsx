import React from "react";

const mythSections = ["celtic", "egyptian", "greek", "norse"];
const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];

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
        {/* <img
          src={`/cards/${activeCard}_info.png`}
          alt="card"
          className="w-full h-full mx-auto"
        /> */}
        <div className="relative h-full w-full">
          <img
            src={`/themes/card.png`}
            alt="card"
            className="w-full h-full mx-auto"
          />
          <div className="absolute top-0 right-0 h-full w-full cursor-pointer">
            <div className="flex w-full">
              <div className="flex flex-col leading-tight justify-center items-center flex-grow font-montserrat text-card pt-4">
                <div className="text-left pl-8">
                  <h1 className="text-[22px] font-bold">DISCOVER</h1>
                  <h2 className="-mt-1 uppercase">{mythologies[activeMyth]}</h2>
                </div>
              </div>
              <div className="flex justify-end">
                <img
                  src="/icons/close.svg"
                  alt="close"
                  className="w-[38px] h-[38px] ml-auto mt-1 mr-1"
                  onClick={handleShowInfo}
                />
              </div>
            </div>
            <div className="flex mx-auto w-[75%] py-6">
              <img
                src={`/images/frame.png`}
                alt="card"
                className="w-full h-full mx-auto"
              />
            </div>
            <div className="leading-[15px] text-[13px] text-left w-[80%] mx-auto pt-2.5">
              “The Death of Viriatus, Chief of the Lusitanians”, ca 1807, is a
              painting by Jose de Madrazo y Agudo, a Spanish neoclassical
              painter. Visit the original in Museo del Prado, Madrid - Spain.
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
