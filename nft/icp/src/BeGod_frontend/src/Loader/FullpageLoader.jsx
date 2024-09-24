import React from "react";
import "./FullpageLoader.css";

const FullpageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <figure>
        <div class="dot white"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </figure>
    </div>
  );
};

export default FullpageLoader;
