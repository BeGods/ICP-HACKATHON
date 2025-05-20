import React, { useContext } from "react";
import { RorContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { elementMythNames, mythSymbols } from "../../../utils/constants.ror";

const CurrencyCrd = ({ itemId, handleFlip, handleClose }) => {
  const { assets } = useContext(RorContext);
  const element = itemId.id?.split(".")[1]?.slice(0, -2);
  const mythology = elementMythNames[element]?.toLowerCase() ?? element;

  return (
    <div
      onClick={handleFlip}
      className="card__face card__face--front relative flex justify-center items-center"
    >
      <div
        className={`absolute inset-0 bg-cover bg-center rounded-primary z-0`}
        style={{ backgroundImage: `url(${assets.uxui.baseBgA})` }}
      />

      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
        {/* <div className="relative m-2 flex justify-center items-center w-[50px] h-[4rem]">
          <div className="absolute text-[10.5vw] font-fof font-bold text-shadow text-white">
            {itemId.count}
          </div>
        </div> */}
        <div
          className={`flex m-2  relative text-center justify-center text-black-sm-contour items-center glow-icon-${
            mythology === "black"
              ? "white"
              : mythology === "white"
              ? "black"
              : mythology
          } `}
        >
          <img
            src={`${assets.uxui.baseOrb}`}
            alt="orb"
            className={`filter-orbs-${mythology} overflow-hidden max-w-[50px]`}
          />
          <span
            className={`absolute z-1 text-black-sm-contour  ${
              mythology === "white"
                ? "text-black opacity-80"
                : "text-white opacity-50"
            } font-symbols  text-symbol-sm mt-1`}
          >
            {mythology === "black" || mythology === "white"
              ? "g"
              : mythSymbols[mythology]}
          </span>
        </div>

        <div className="relative w-[240px] h-[240px] flex justify-center items-center">
          <div className="relative w-full h-full">
            <img
              src={`https://media.publit.io/file/BeGods/items/240px-${itemId.id}.png`}
              alt="relic"
              className={`z-10 w-full h-full object-contain`}
            />
          </div>
        </div>

        <div className="relative w-full h-[19%] mt-auto card-shadow-white-celtic z-10">
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat rounded-b-primary filter-paper-${mythology}`}
            style={{ backgroundImage: `url(${assets.uxui.footer})` }}
          />
          <div className="absolute font-symbols text-black-contour text-[50px] flex justify-center items-center w-full h-full">
            l
          </div>
        </div>
      </div>
      <IconBtn
        isInfo={false}
        activeMyth={5}
        align={10}
        handleClick={handleClose}
      />
    </div>
  );
};

export default CurrencyCrd;
