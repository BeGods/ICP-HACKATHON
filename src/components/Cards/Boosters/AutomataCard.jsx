import React from "react";
import { elements } from "../../../utils/variables";
import IconButton from "../../Common/IconButton";

const AutomataCard = ({ activeCard, activeMyth, Button, closeCard }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex  flex-col justify-center items-center z-50">
      <div className="relative w-[72%] glow-card rounded-lg shadow-lg mt-[78px]">
        <img
          src={`/assets/cards/320px-${
            activeCard + "." + elements[activeMyth]
          }1.png`}
          alt="card"
          className="w-full h-full mx-auto"
        />
        <IconButton
          isInfo={false}
          activeMyth={activeMyth}
          handleClick={closeCard}
          align={1}
        />
        <div className="absolute font-symbols text-[200px] -mt-[200px] ml-10">
          b
        </div>
      </div>
      {Button}
    </div>
  );
};

export default AutomataCard;
