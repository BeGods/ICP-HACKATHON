import React from "react";
import IconBtn from "../../Buttons/IconBtn";

const CharCrd = ({ handleClose, itemId }) => {
  return (
    <div className="relative w-[72%] h-[53%]">
      <div
        className={`relative card-shadow-white flex justify-center items-center`}
      >
        <div className="relative w-full h-full text-card">
          <img
            src={`/assets/ror-cards/240px-${itemId}.png`}
            alt="info background"
            className="w-full h-full object-cover rounded-primary z-10"
          />
        </div>
        <IconBtn
          isInfo={false}
          activeMyth={5}
          align={10}
          handleClick={handleClose}
        />
      </div>
    </div>
  );
};

export default CharCrd;
