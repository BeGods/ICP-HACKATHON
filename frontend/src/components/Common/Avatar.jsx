import React from "react";
import { mythSections } from "../../utils/constants";

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
];

const getRandomColor = () => {
  return mythSections[Math.floor(Math.random() * mythSections.length)];
};

const Avatar = ({ name, color }) => {
  const firstLetter = name.charAt(0).toUpperCase();
  const avatarColor = color ? color : getRandomColor();

  return (
    <div
      className={`flex relative text-center justify-center text-black-sm-contour items-center glow-icon-${avatarColor}`}
    >
      <img
        src="/assets/uxui/240px-orb.base.png"
        alt="orb"
        className={`filter-orbs-${avatarColor} overflow-hidden max-w-[10vw]`}
      />
      <span
        className={`absolute z-1 text-black-sm-contour transition-all duration-1000  text-[25px] mt-1 opacity-70`}
      >
        {firstLetter}
      </span>
    </div>
  );
};

export default Avatar;
