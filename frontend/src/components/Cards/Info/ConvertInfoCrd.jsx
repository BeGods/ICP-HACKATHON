import React, { useEffect, useState, useRef } from "react";
import { mythSymbols } from "../../../utils/constants";
import IconBtn from "../../Buttons/IconBtn";

const ConvertInfo = ({ t, handleClick }) => {
  const [activeColor, setActiveColor] = useState(0);
  const myths = ["greek", "celtic", "norse", "egyptian"];
  const activeColorRef = useRef(activeColor);

  activeColorRef.current = activeColor;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColor((prev) => (prev + 1) % myths.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [myths.length]);

  return (
    <div className="fixed inset-0  bg-black bg-opacity-85  backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="relative w-[72%] rounded-lg shadow-lg card-shadow-white">
        <div className="relative w-full h-full text-card">
          <img
            src="/assets/cards/320px-info_background.jpg"
            alt="card"
            className="w-full h-full object-cover rounded-primary"
          />
          <div className="absolute top-0 w-full text-center text-[28px]  font-bold mt-2 uppercase">
            {t(`keywords.conversion`)}
          </div>
          <div className="absolute inset-0 flex flex-col items-center mx-auto my-auto w-fit h-fit justify-center">
            <div className="flex flex-col h-fit">
              {Object.entries(mythSymbols)
                .filter(([key, value]) => key !== "other")
                .map(([key, value], index) => (
                  <React.Fragment key={key}>
                    <div className="flex justify-center items-center gap-x-3 mt-2">
                      <div
                        className={`flex relative text-center justify-center  items-center max-w-orb rounded-full glow-icon-${key}`}
                      >
                        <img
                          src="/assets/uxui/240px-orb.base.png"
                          alt={`${key} orb`}
                          className={`filter-orbs-${key}`}
                        />
                        <span
                          className={`absolute  opacity-50 orb-symbol-shadow  z-1 flex justify-center items-center font-symbols text-white text-[30px] mt-1 `}
                        >
                          {value}
                        </span>
                      </div>

                      <h1 className="text-[30px] font-semibold">
                        {value != 3 ? "+" : "|"}
                      </h1>
                      <div
                        className={`flex relative text-center  justify-center items-center max-w-orb  rounded-full glow-icon-${key}`}
                      >
                        <img
                          src="/assets/uxui/240px-orb.base.png"
                          alt={`${key} orb`}
                          className={`filter-orbs-${key}`}
                        />
                        <span
                          className={`absolute z-1 text-[30px]  opacity-50 orb-symbol-shadow  mt-1 justify-center items-center font-symbols text-white `}
                        >
                          {value}
                        </span>
                      </div>
                      <h1 className="text-[30px] font-semibold">=</h1>
                      <div
                        className={`flex relative text-center justify-center items-center max-w-orb -mt-1 rounded-full glow-icon-black`}
                      >
                        <img
                          src="/assets/uxui/240px-orb.multicolor.png"
                          alt="multi orb"
                        />
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              <div className="flex justify-center items-center gap-x-3 -ml-2.5 mt-2">
                <div className="text-[30px] font-">1000</div>
                <div className="text-[24px] font-medium">X</div>
                <div
                  className={`flex relative text-center justify-center items-center max-w-orb rounded-full glow-icon-black`}
                >
                  <img
                    src="/assets/uxui/240px-orb.base.png"
                    alt={`gray orb`}
                    className={`filter-orbs-${myths[activeColor]} transition-all duration-1000`}
                  />
                  <span
                    className={`absolute z-1  justify-center items-center font-symbols text-white `}
                  >
                    <div className="text-[30px] transition-all duration-1000  opacity-50 orb-symbol-shadow  mt-1 justify-center items-center font-symbols text-white">
                      {mythSymbols[myths[activeColor]]}
                    </div>
                  </span>
                </div>
                <h1 className="text-[30px] font-semibold">=</h1>
                <div
                  className={`flex relative text-center justify-end items-center max-w-orb -mr-2 rounded-full glow-icon-black`}
                >
                  <img src="/assets/uxui/240px-orb.base.png" alt={`gray orb`} />
                  <span
                    className={`absolute z-1 text-[30px] opacity-50 orb-symbol-shadow  mt-1  mr-1 font-symbols text-white `}
                  >
                    g
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <IconBtn
          isInfo={false}
          activeMyth={4}
          handleClick={handleClick}
          align={1}
        />
      </div>
    </div>
  );
};

export default ConvertInfo;
