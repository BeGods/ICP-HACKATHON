import React from "react";

const ProgressBar = ({ value, max, activeMyth }) => {
  const width = Math.min(100, Math.max(0, (value / max) * 100));

  const mythSections = ["celtic", "egyptian", "greek", "norse", "other"];

  return (
    <div className="w-full rounded-full -mt-1">
      <div className="bg-gray-500/25 h-[15px] rounded-full">
        <div
          style={{
            width: `${width}%`,
          }}
          className={`gradient-${mythSections[activeMyth]} h-[15px] rounded-full transition-all duration-300`}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
