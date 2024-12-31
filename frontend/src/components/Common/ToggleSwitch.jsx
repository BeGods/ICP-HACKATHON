import React from "react";

export const ToggleSwitch = ({ handleToggle, isActive }) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      <h2 className="text-secondary">ON</h2>
      <label className="relative inline-block w-11 h-6">
        <input
          type="checkbox"
          checked={!isActive}
          onChange={handleToggle}
          className="opacity-0 w-0 h-0"
        />
        <div
          className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-400 rounded-full transition-all duration-300 ${
            !isActive ? "" : "bg-green-500"
          }`}
        >
          <div
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${
              !isActive ? "translate-x-5" : ""
            }`}
          ></div>
        </div>
      </label>
      <h2 className="text-secondary">OFF</h2>
    </div>
  );
};

export const ToggleTab = ({ handleToggle, isActive }) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      <h2 className="text-secondary">ON</h2>
      <label className="relative inline-block w-11 h-6">
        <input
          type="checkbox"
          checked={!isActive}
          onChange={handleToggle}
          className="opacity-0 w-0 h-0"
        />
        <div
          className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-400 rounded-full transition-all duration-300 ${
            !isActive ? "" : "bg-green-500"
          }`}
        >
          <div
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${
              !isActive ? "translate-x-5" : ""
            }`}
          ></div>
        </div>
      </label>
      <h2 className="text-secondary">OFF</h2>
    </div>
  );
};
