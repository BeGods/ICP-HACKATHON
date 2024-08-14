import React from "react";

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
];

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const Avatar = ({ name, profile, color }) => {
  const firstLetter = name.charAt(0).toUpperCase();
  const avatarColor = color ? color : getRandomColor();

  return (
    <div
      className={`w-full h-full flex items-center justify-center text-white ${
        profile == 1 ? "text-2xl" : "text-lg"
      } font-bold rounded-full ${avatarColor}`}
    >
      {firstLetter}
    </div>
  );
};

export default Avatar;
