import React, { useState } from "react";
import { telegramGetSafeAreaInsets } from "../utils/device.info";

const Test = () => {
  return (
    <div
      className="w-screen bg-white flex justify-center items-center"
      style={{ height: `calc(100vh - ${safeArea.top}px)` }}
    >
      <div className="bg-white text-black text-[2vw] p-3">
        <p>Safe Area Insets: {JSON.stringify(safeArea)}</p>
      </div>
    </div>
  );
};

export default Test;
