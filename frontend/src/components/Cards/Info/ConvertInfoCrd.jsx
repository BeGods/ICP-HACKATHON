import React, { useEffect, useState, useRef, useContext } from "react";
import { mythSymbols } from "../../../utils/constants.fof";
import IconBtn from "../../Buttons/IconBtn";
import { FofContext } from "../../../context/context";
import OverlayLayout from "../../Layouts/OverlayLayout";
import { CardWrap } from "../../Layouts/Wrapper";
import { useTranslation } from "react-i18next";

const ConvertCard = ({ t, assets, myths, activeColor }) => {
  return (
    <div className="relative w-full h-full text-card">
      <img
        src={assets.uxui.bgInfo}
        alt="card"
        className="w-full h-full object-cover rounded-primary"
      />
      <div className="absolute top-0 w-full text-center text-paperHead font-bold mt-2 uppercase">
        <div>{t(`keywords.conversion`)}</div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center mx-auto my-auto w-full h-full justify-center">
        <div className="flex flex-col gap-y-2  h-fit">
          {Object.entries(mythSymbols)
            .filter(([key, value]) => key !== "other")
            .map(([key, value], index) => (
              <React.Fragment key={key}>
                <div className="flex justify-center items-center gap-x-3">
                  <div
                    className={`flex relative text-center justify-center  items-center max-w-xs-orb rounded-full glow-icon-black`}
                  >
                    <img
                      src={assets.uxui.baseOrb}
                      alt={`${key} orb`}
                      className={`filter-orbs-${key}`}
                    />
                    <span
                      className={`absolute  opacity-50 orb-symbol-shadow  z-1 flex justify-center items-center font-symbols text-white text-symbol-xs mt-1`}
                    >
                      {value}
                    </span>
                  </div>
                  <h1 className="text-paperHead font-semibold">
                    {value != 3 ? "+" : "|"}
                  </h1>
                  <div
                    className={`flex relative text-center  justify-center items-center max-w-xs-orb rounded-full glow-icon-black`}
                  >
                    <img
                      src={assets.uxui.baseOrb}
                      alt={`${key} orb`}
                      className={`filter-orbs-${key}`}
                    />
                    <span
                      className={`absolute z-1 text-symbol-xs  opacity-50 orb-symbol-shadow  mt-1 justify-center items-center font-symbols text-white `}
                    >
                      {value}
                    </span>
                  </div>
                  <h1 className="text-paperHead font-semibold">=</h1>
                  <div
                    className={`flex relative text-center justify-center items-center max-w-xs-orb -mt-1 rounded-full glow-icon-black`}
                  >
                    <img src={assets.items.multiorb} alt="multi orb" />
                  </div>
                </div>
              </React.Fragment>
            ))}
          <div className="flex justify-center items-center gap-x-3 -ml-[15px]">
            <div className="text-paperHead -ml-2.5">1,000</div>
            <div className="text-paperHead font-roboto font-medium">X</div>
            <div
              className={`flex relative text-center justify-center items-center max-w-xs-orb rounded-full glow-icon-black`}
            >
              <img
                src={assets.uxui.baseOrb}
                alt={`gray orb`}
                className={`filter-orbs-${myths[activeColor]} transition-all duration-1000`}
              />
              <span
                className={`absolute z-1  justify-center items-center font-symbols text-white `}
              >
                <div className="text-symbol-xs transition-all duration-1000  opacity-50 orb-symbol-shadow  mt-1 justify-center items-center font-symbols text-white">
                  {mythSymbols[myths[activeColor]]}
                </div>
              </span>
            </div>
            <h1 className="text-paperHead font-semibold">=</h1>
            <div
              className={`flex relative text-center justify-end items-center max-w-xs-orb -mr-2 rounded-full glow-icon-black`}
            >
              <img src={assets.uxui.baseOrb} alt={`gray orb`} />
              <span
                className={`absolute z-1 text-symbol-xs opacity-50 orb-symbol-shadow  mt-1  mr-1 font-symbols text-white `}
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

const ConvertInfo = ({ handleClick }) => {
  const { t } = useTranslation();
  const { assets, isTgMobile, section, setShowBack, setShowCard } =
    useContext(FofContext);
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

  useEffect(() => {
    setShowBack(section);

    return () => {
      setShowBack(null);
    };
  }, []);

  return (
    <OverlayLayout>
      <div className="center-section">
        <CardWrap
          Front={
            <div className="w-full h-full relative card-shadow-white  flex justify-center items-center">
              <ConvertCard
                assets={assets}
                myths={myths}
                t={t}
                handleClick={handleClick}
                activeColor={activeColor}
              />
            </div>
          }
          Back={
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="relative w-full h-full text-card">
                <img
                  src={assets.uxui.bgInfoMoon}
                  alt="info card background"
                  className="w-full h-full object-cover rounded-primary z-10"
                />
              </div>
            </div>
          }
        />
      </div>
    </OverlayLayout>
  );
};

export default ConvertInfo;
