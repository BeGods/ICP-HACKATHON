import React from "react";

const ProgressBarArc = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
      >
        {/* Semicircle with gaps */}
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="transparent"
          stroke="black"
          strokeWidth="20"
          strokeDasharray="53,4"
        />
      </svg>
    </div>
  );
};

export default ProgressBarArc;
