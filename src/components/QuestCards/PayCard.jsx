import React, { useState } from "react";
import QuestSymbol from "./QuestSymbol";

const mythSections = ["celtic", "egyptian", "greek", "norse"];
const symbols = {
  greek: 4,
  celtic: 2,
  norse: 5,
  egyptian: 1,
};

function PayCard({ t, quest, handlePay, handleShowPay, activeMyth }) {
  const [isButtonGlowing, setIsButtonGlowing] = useState(0);

  const handleButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
      handleShowPay();
    }, 100);
  };

  return (
    <div className="fixed inset-0  bg-black bg-opacity-60 flex justify-center items-center z-10">
      <div className="relative w-[72%] rounded-lg shadow-lg mt-10 flex flex-col z-50">
        <div className="relative">
          <div className="absolute  bg-black h-full w-full z-10 opacity-50 rounded-xl"></div>

          {/* Card Image */}
          <img
            src={`/assets/cards/320px-${mythSections[activeMyth]}.quest.${quest?.type}_tiny.png`}
            alt="card"
            className="w-full h-full mx-auto grayscale"
          />
          {/* Close Button */}
          <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
            <div className="flex w-full">
              <div className="flex flex-grow">
                <div className="flex w-[85%] pl-2 mt-2 z-50">
                  {Object.entries(quest.requiredOrbs).map(([key, value]) => (
                    <div className="flex " key={key}>
                      {Array.from({ length: value }, (_, index) => (
                        <div
                          key={index}
                          className={`flex relative text-center justify-center items-center glow-icon-${key.toLowerCase()}`}
                        >
                          <img
                            src="/assets/uxui/240px-orb.base-tiny.png"
                            alt="orb"
                            className={`filter-orbs-${key.toLowerCase()} `}
                          />
                          <span
                            className={`absolute z-1 opacity-50 orb-glow font-symbols text-white text-[2rem] ${
                              key.toLowerCase() === "egyptian" && "ml-[2px]"
                            } ${key.toLowerCase() === "greek" && "ml-[5px]"}`}
                          >
                            {symbols[key.toLowerCase()]}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`absolute top-0 right-0 w-[55px] h-[55px] cursor-pointer z-50`}
              >
                <img
                  src="/assets/icons/close.svg"
                  alt="close"
                  className={`h-full w-full rounded-full ml-auto -mt-6 -mr-6 ${
                    isButtonGlowing === 1
                      ? `glow-button-${mythSections[activeMyth]}`
                      : ""
                  }`}
                  onClick={() => handleButtonClick(1)}
                />
              </div>
            </div>
            <div
              className={`flex relative items-center h-[19%] uppercase glow-card-${mythSections[activeMyth]} text-white grayscale`}
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
                className={`filter-paper-${mythSections[activeMyth]} rounded-b-[15px]`}
              />
              <div className="flex justify-between w-full h-full items-center px-3 z-10">
                <div>{quest?.questName}</div>
                <div className="">
                  <QuestSymbol myth={mythSections[activeMyth]} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div
          onClick={handlePay}
          className={`flex items-center justify-between h-[60px] w-[192px] mx-auto border border-${mythSections[activeMyth]}-primary bg-glass-black z-50 text-white  rounded-button`}
        >
          <div className="flex justify-center items-center w-1/4 h-full"></div>
          <div className="text-[16px] uppercase">{t("buttons.pay")}</div>
          <div className="flex justify-center items-center w-1/4  h-full"></div>
        </div>
      </div>
    </div>
  );
}

export default PayCard;
