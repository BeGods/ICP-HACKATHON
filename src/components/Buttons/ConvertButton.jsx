import { RotateCcw, RotateCw } from "lucide-react";
import React from "react";

const ConvertButton = ({ handleNext, handlePrev, action }) => {
  return (
    <div className="flex items-center justify-between h-[45px] w-[192px] mx-auto border border-yellow-500 bg-glass-black text-white font-montserrat rounded-button">
      <div
        onClick={handlePrev}
        className="flex justify-center items-center w-1/4 border-r-[0.5px] border-borderGray h-full"
      >
        <RotateCcw color="white" className="h-[20px] w-[20px]" />
      </div>
      <div onClick={action} className="text-[16px] uppercase">
        CONVERT
      </div>
      <div
        onClick={handleNext}
        className="flex justify-center items-center w-1/4 border-l-[0.5px] border-borderGray h-full"
      >
        <RotateCw color="white" className="h-[20px] w-[20px]" />
      </div>
    </div>
  );
};

export default ConvertButton;
