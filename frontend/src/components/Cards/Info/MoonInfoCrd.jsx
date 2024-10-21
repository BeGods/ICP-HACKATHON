import React, { useContext } from "react";
import IconBtn from "../../Buttons/IconBtn";

const MoonInfoCard = ({ handleClick }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="relative w-[72%] rounded-lg shadow-lg card-shadow-white">
        <div className="relative w-full h-full text-card">
          <img
            src="/assets/cards/320px-info_moon.jpg"
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

export default MoonInfoCard;
