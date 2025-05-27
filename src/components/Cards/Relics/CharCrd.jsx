import React from "react";
import IconBtn from "../../Buttons/IconBtn";

const CharCrd = ({ handleClose, itemId }) => {
  return (
    <div className="card__face card__face--front relative flex justify-center items-center">
      <div
        className={`relative card-shadow-white flex justify-center items-center`}
      >
        <div className="relative w-full h-full text-card">
          <img
            src={`https://media.publit.io/file/BeGods/chars/240px-${itemId}.png`}
            alt="info background"
            className="w-full h-full object-cover rounded-primary z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default CharCrd;
