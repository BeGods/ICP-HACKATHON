import React, { useContext } from "react";
import IconBtn from "../../Buttons/IconBtn";
import { FofContext } from "../../../context/context";

const MoonInfoCard = ({ handleClick }) => {
  const { assets } = useContext(FofContext);

  const handleCardClick = (e) => {
    e.stopPropagation();
    handleClick();
  };

  return (
    <div
      onClick={() => {
        setShowCard(null);
      }}
      className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50"
    >
      <div className="relative card-width rounded-lg shadow-lg card-shadow-white">
        <div className="relative w-full h-full text-card">
          <img
            src={assets.uxui.bgInfomoon}
            alt="info card background"
            className="w-full h-full object-cover rounded-primary z-10"
          />
        </div>

        <IconBtn
          isInfo={false}
          activeMyth={4}
          handleClick={handleCardClick}
          align={1}
        />
      </div>
    </div>
  );
};

export default MoonInfoCard;
