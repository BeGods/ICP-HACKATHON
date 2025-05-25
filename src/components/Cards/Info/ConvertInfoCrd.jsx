import React, { useEffect, useState, useRef, useContext } from "react";
import { mythSymbols } from "../../../utils/constants.fof";
import IconBtn from "../../Buttons/IconBtn";
import { FofContext } from "../../../context/context";

const ConvertCard = ({ t, assets, myths, activeColor }) => {
  return (
    <div className="relative w-full h-full text-card">
      <img
        src={assets.uxui.bgInfo}
        alt="card"
        className="w-full h-full object-cover rounded-primary"
      />
      <div className="absolute top-0 w-full text-center text-[28px] font-bold mt-2 uppercase">
        <div>{t(`keywords.conversion`)}</div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center mx-auto my-auto w-full h-full justify-center">
        <div className="flex flex-col h-fit">
          {Object.entries(mythSymbols)
            .filter(([key, value]) => key !== "other")
            .map(([key, value], index) => (
              <React.Fragment key={key}>
                <div className="flex justify-center items-center gap-x-3">
                  <div
                    className={`flex relative text-center justify-center  items-center max-w-orb rounded-full glow-icon-black`}
                  >
                    <img
                      src={assets.uxui.baseOrb}
                      alt={`${key} orb`}
                      className={`filter-orbs-${key}`}
                    />
                    <span
                      className={`absolute  opacity-50 orb-symbol-shadow  z-1 flex justify-center items-center font-symbols text-white text-symbol-sm mt-1`}
                    >
                      {value}
                    </span>
                  </div>
                  <h1 className="text-primary font-semibold">
                    {value != 3 ? "+" : "|"}
                  </h1>
                  <div
                    className={`flex relative text-center  justify-center items-center max-w-orb rounded-full glow-icon-black`}
                  >
                    <img
                      src={assets.uxui.baseOrb}
                      alt={`${key} orb`}
                      className={`filter-orbs-${key}`}
                    />
                    <span
                      className={`absolute z-1 text-symbol-sm  opacity-50 orb-symbol-shadow  mt-1 justify-center items-center font-symbols text-white `}
                    >
                      {value}
                    </span>
                  </div>
                  <h1 className="text-primary font-semibold">=</h1>
                  <div
                    className={`flex relative text-center justify-center items-center max-w-orb -mt-1 rounded-full glow-icon-black`}
                  >
                    <img src={assets.items.multiorb} alt="multi orb" />
                  </div>
                </div>
              </React.Fragment>
            ))}
          <div className="flex justify-center items-center gap-x-3 -ml-[15px]">
            <div className="text-[28px] -ml-2.5">1,000</div>
            <div className="text-[24px] font-roboto font-medium">X</div>
            <div
              className={`flex relative text-center justify-center items-center max-w-orb rounded-full glow-icon-black`}
            >
              <img
                src={assets.uxui.baseOrb}
                alt={`gray orb`}
                className={`filter-orbs-${myths[activeColor]} transition-all duration-1000`}
              />
              <span
                className={`absolute z-1  justify-center items-center font-symbols text-white `}
              >
                <div className="text-symbol-sm transition-all duration-1000  opacity-50 orb-symbol-shadow  mt-1 justify-center items-center font-symbols text-white">
                  {mythSymbols[myths[activeColor]]}
                </div>
              </span>
            </div>
            <h1 className="text-primary font-semibold">=</h1>
            <div
              className={`flex relative text-center justify-end items-center max-w-orb -mr-2 rounded-full glow-icon-black`}
            >
              <img src={assets.uxui.baseOrb} alt={`gray orb`} />
              <span
                className={`absolute z-1 text-symbol-sm opacity-50 orb-symbol-shadow  mt-1  mr-1 font-symbols text-white `}
              >
                g
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full text-center text-paperSub font-bold pb-2 uppercase">
        <div className="text-para font-medium">{t(`note.tower`)}</div>
      </div>
    </div>
  );
};

const ConvertInfo = ({ t, handleClick }) => {
  const { assets, isTelegram } = useContext(FofContext);
  const [activeColor, setActiveColor] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const myths = ["greek", "celtic", "norse", "egyptian"];
  const activeColorRef = useRef(activeColor);

  activeColorRef.current = activeColor;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColor((prev) => (prev + 1) % myths.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [myths.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipped((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0  bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div
        onClick={handleClick}
        className={`relative card-width rounded-lg shadow-lg -mt-[30px] flex flex-col z-50`}
      >
        <div
          className={`card ${
            isTelegram ? "h-[45.35vh] mt-[4.5vh]" : "h-[50dvh] mt-[2vh]"
          } ${flipped ? "flipped" : ""}`}
        >
          <div
            onClick={(e) => {
              setFlipped((prev) => !prev);
            }}
            className="card__face card__face--front relative card-shadow-white  flex justify-center items-center"
          >
            <ConvertCard
              assets={assets}
              myths={myths}
              t={t}
              handleClick={handleClick}
              activeColor={activeColor}
            />
            <IconBtn
              isInfo={false}
              activeMyth={4}
              handleClick={handleClick}
              align={8}
            />
          </div>
          <div
            onClick={(e) => {
              setFlipped((prev) => !prev);
            }}
            className="card__face card__face--back flex flex-col justify-center items-center"
          >
            <div className="relative w-full h-full text-card">
              <img
                src={assets.uxui.bgInfoMoon}
                alt="info card background"
                className="w-full h-full object-cover rounded-primary z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvertInfo;
