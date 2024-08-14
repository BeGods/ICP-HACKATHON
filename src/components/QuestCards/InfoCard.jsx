import React, { useEffect, useState } from "react";

const mythSections = ["celtic", "egyptian", "greek", "norse"];
const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];

const InfoCard = ({
  t,
  quest,
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
    <div className="fixed flex flex-col justify-center items-center inset-0 bg-black backdrop-blur-sm bg-opacity-60 z-10">
      <div
        style={{
          backgroundImage: `url(/assets/cards/320px-info_background_tiny.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",

          top: 0,
          left: 0,
        }}
        className="flex flex-col items-center gap-4 w-[73%] h-[55%] mt-10 glow-card"
      >
        <div className="flex w-full absolute -mt-[28px] ml-[52px]">
          <img
            src="/assets/icons/close.svg"
            alt="info"
            className={`w-[55px] h-[55px] ml-auto rounded-full ${
              isButtonGlowing == 1
                ? `glow-button-${mythSections[activeMyth]}`
                : ""
            }`}
            onClick={() => {
              handleButtonClick(1);
            }}
          />
        </div>
        <div className="flex w-full">
          <div className="flex flex-col leading-tight justify-center items-center flex-grow  text-card pt-4">
            <div className="text-left">
              <h1 className="text-[28px] font-bold uppercase">
                {t("keywords.discover")}
              </h1>
              <h2 className="-mt-1 font-medium uppercase">
                {t(`mythologies.${mythSections[activeMyth]}`)}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex">
          <img
            src={`/assets/cards/188px-${mythSections[activeMyth]}.quest.${quest?.type}_info_painting_tiny.png`}
            alt="info_painting"
            className="w-[82%] mx-auto"
          />
        </div>
        <div className="leading-[18px] text-[16px] text-left mx-auto w-[80%] text-card font-[550]">
          {t(`quests.${mythSections[activeMyth]}.${quest.type}.desc`)}
        </div>
      </div>
      <div className="relative">
        {/* <div className="absolute flex justify-center items-center w-full -mt-2">
          <div className="bg-black  h-[60px] w-[60px] rounded-full z-0"></div>
        </div> */}
        {!isShared ? (
          <div
            onClick={handleClaimShareReward}
            className={`flex items-center justify-between border border-black h-[60px] w-[192px] mx-auto  bg-${mythSections[activeMyth]} z-50 text-white  rounded-button`}
          >
            <div className="flex justify-center items-center w-1/4 h-full">
              <img src={`/assets/icons/x.svg`} alt="orb" className="w-[85%]" />
            </div>
            <div className="text-[16px] uppercase">{t(`buttons.share`)}</div>
            <div className="flex justify-center items-center w-1/4  h-full">
              <div className="absolute top-0 z-10">
                <img
                  src="/assets/icons/arrow.down.svg"
                  alt="upward"
                  className="z-10 mt-2.5"
                />
              </div>
              <img
                src={`/assets/uxui/240px-orb.multicolor-tiny.png`}
                alt="orb"
                className="w-[85%]"
              />
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center justify-between   h-[60px] w-[192px] mx-auto border border-cardsGray -mt-2 bg-glass-black z-50 text-white  rounded-button`}
          >
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-[16px] uppercase"> {t(`buttons.shared`)}</div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        )}
      </div>
    </div>
    // <div className="fixed inset-0 backdrop-blur-sm bg-amber-200 bg-opacity-50 flex justify-center items-center z-10">
    //   <div className="relative w-[72%] mt-9">
    //     <div className="relative h-full w-full bg-violet-500">
    //       <img
    //         src={`/assets/cards/320px-info_background_tiny.png`}
    //         alt="card"
    //         className="w-full h-full mx-auto"
    //       />
    //       <div className="flex flex-col absolute top-0 right-0 h-full w-full cursor-pointer">
    // <div className="flex w-full">
    //   <div className="flex flex-col leading-tight justify-center items-center flex-grow  text-card pt-4">
    //     <div className="text-left">
    //       <h1 className="text-[22px] font-bold">DISCOVER</h1>
    //       <h2 className="-mt-1 font-medium uppercase">
    //         {mythologies[activeMyth]}
    //       </h2>
    //     </div>
    //   </div>
    //   <div className="flex absolute w-full justify-end">
    //     <img
    //       src="/assets/icons/close.svg"
    //       alt="info"
    //       className={`w-[55px] h-[55px] ml-auto rounded-full -mt-[25px] -mr-6 ${
    //         isButtonGlowing == 1
    //           ? `glow-button-${mythSections[activeMyth]}`
    //           : ""
    //       }`}
    //       onClick={() => {
    //         handleButtonClick(1);
    //       }}
    //     />
    //   </div>
    // </div>
    //         <div className="flex justify-center h-fit w-[72%] bg-red-400">
    //           <img
    //             src={`/assets/cards/320px-${quest?.type}_info_painting_tiny.png`}
    //             alt="info_painting"
    //             className="h-full w-full"
    //           />
    //         </div>
    //         {/* <div className="flex mx-auto w-full">
    //           <img
    //             src={`/assets/cards/320px-${quest?.type}_info_painting_tiny.png`}
    //             alt="info_painting"
    //             className="w-[72%] mx-auto"
    //           />
    //         </div> */}
    //         <div className="leading-[15px] text-[13px] text-left mx-auto text-card font-[400]">
    //           {quest.description}
    //         </div>
    //       </div>
    //     </div>
    //     <div className="absolute flex justify-center items-center w-full -mt-2">
    //       <div className="bg-black  h-[60px] w-[60px] rounded-full z-0"></div>
    //     </div>
    //     {!isShared ? (
    //       <div
    //         onClick={handleClaimShareReward}
    //         className={`flex items-center justify-between h-[45px] w-[192px] mx-auto  bg-${mythSections[activeMyth]} z-50 text-white  rounded-button`}
    //       >
    //         <div className="flex justify-center items-center w-1/4 h-full">
    //           <img
    //             src={`/assets/icons/x.svg`}
    //             alt="orb"
    //             className="w-[32px] h-[32px]"
    //           />
    //         </div>
    //         <div className="text-[16px] uppercase">SHARE</div>
    //         <div className="flex justify-center items-center w-1/4  h-full">
    //           <div className="absolute top-0 z-10">
    //             <img
    //               src="/assets/icons/arrow.down.svg"
    //               alt="upward"
    //               className="z-10 mt-3"
    //             />
    //           </div>
    //           <img
    //             src={`/assets/uxui/240px-orb.multicolor-tiny.png`}
    //             alt="orb"
    //             className="w-[32px] h-[32px]"
    //           />
    //         </div>
    //       </div>
    //     ) : (
    //       <div
    //         className={`flex items-center justify-between h-[45px] w-[192px] mx-auto -mt-2 bg-glass-black z-50 text-white  rounded-button`}
    //       >
    //         <div className="flex justify-center items-center w-1/4 h-full"></div>
    //         <div className="text-[16px] uppercase">SHARED</div>
    //         <div className="flex justify-center items-center w-1/4  h-full"></div>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};

export default InfoCard;
