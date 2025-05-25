import React, { useContext } from "react";
import IconBtn from "../../Buttons/IconBtn";
import { FofContext } from "../../../context/context";
import { mythSections } from "../../../utils/constants.fof";

const GameEndCrd = ({ handleClick, activeMyth }) => {
  const { assets } = useContext(FofContext);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div
        className={`relative card-width rounded-lg shadow-lg card-shadow-white`}
      >
        <div className="relative w-full h-full text-card">
          <img
            src={assets.win[mythSections[activeMyth]]}
            alt="info card background"
            className="w-full h-full object-cover rounded-primary z-10"
          />
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

export default GameEndCrd;
