import { CornerUpLeft, CornerUpRight } from "lucide-react";
import React from "react";

const ConvertButton = () => {
  return (
    <div className="flex items-center justify-between h-[54px] w-[192px] mx-auto -mt-2 border border-yellow-500 bg-glass-black text-white font-montserrat rounded-button">
      <div className="flex justify-center items-center w-1/4 border-r-[0.5px] border-borderGray h-full">
        <CornerUpLeft color="white" className="h-[20px] w-[20px]" />
      </div>
      <div className="text-[16px] uppercase">CONVERT</div>
      <div className="flex justify-center items-center w-1/4 border-l-[0.5px] border-borderGray h-full">
        <CornerUpRight color="white" className="h-[20px] w-[20px]" />
      </div>
    </div>
  );
};

export default ConvertButton;
