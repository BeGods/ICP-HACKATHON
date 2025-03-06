import React, { useState } from "react";

const CitadelItem = ({ itemKey, handleClick, isMulti }) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      onClick={handleClick}
      className={`flex gap-1 border  text-white ${
        isMulti ? "border-multiColor" : "border-white"
      } ${
        isClicked ? `glow-button-white` : ""
      } rounded-primary h-[90px] w-full bg-glass-black p-[15px]`}
      onMouseDown={() => {
        setIsClicked(true);
      }}
      onMouseUp={() => {
        setIsClicked(false);
      }}
      onMouseLeave={() => {
        setIsClicked(false);
      }}
      onTouchStart={() => {
        setIsClicked(true);
      }}
      onTouchEnd={() => {
        setIsClicked(false);
      }}
      onTouchCancel={() => {
        setIsClicked(false);
      }}
    >
      <div>
        <div
          className={`font-symbols ${
            isMulti && "gradient-multi"
          } text-booster p-0 -mt-2 mr-2`}
        >
          2
        </div>
      </div>
      <div className={`flex flex-col flex-grow justify-center -ml-1`}>
        <h1 className="text-tertiary uppercase">{itemKey}</h1>
        <h2 className="text-tertiary">{itemKey}</h2>
      </div>
    </div>
  );
};

export default CitadelItem;
