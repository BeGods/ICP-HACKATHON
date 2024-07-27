import React from "react";

const ProgressBar = ({ value, max }) => {
  const width = Math.min(100, (value / max) * 100);

  return (
    <div className="w-full rounded-full -mt-1">
      <div className="bg-gray-500/25 h-[15px] rounded-button">
        <div
          style={{
            width: `${width}%`,
          }}
          className={`gradient-celtic h-[15px] rounded-button transition-all duration-300`}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
