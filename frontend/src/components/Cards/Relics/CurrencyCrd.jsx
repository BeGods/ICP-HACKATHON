import React, { useContext } from "react";
import { RorContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { elementMythNames } from "../../../utils/constants.ror";

const CurrencyCrd = ({ itemId, handleFlip, handleClose }) => {
  const { assets } = useContext(RorContext);
  const element = itemId.id.split(".")[1];
  const mythology = elementMythNames[element]?.toLowerCase();

  return (
    <div
      onClick={handleFlip}
      className="card__face card__face--front relative flex justify-center items-center"
    >
      <div
        className={`absolute inset-0 bg-cover bg-center filter-${mythology} rounded-primary z-0`}
        style={{ backgroundImage: `url(${assets.uxui.basebg})` }}
      />

      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
        <div className="relative m-2 flex justify-center items-center w-[50px]">
          <img
            src={`https://media.publit.io/file/BeGods/items/240px-gobcoin.png`}
            alt="relic"
            className="w-full"
          />
          <div className="absolute text-[10.5vw] font-roboto font-bold text-shadow text-gray-600 opacity-85 grayscale">
            1
          </div>
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
            style={{ backgroundImage: `url(${assets.uxui.paper})` }}
          />
          <div className="absolute uppercase glow-text-quest flex justify-center items-center w-full h-full">
            {itemId.name}
          </div>
        </div>
      </div>
      <IconBtn
        isInfo={true}
        activeMyth={5}
        align={10}
        handleClick={handleClose}
      />
    </div>
  );
};

export default CurrencyCrd;
