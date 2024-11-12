import React from "react";
import image from "./404.png"; // Adjust the path according to your project structure

const UnauthorizedPage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-black-900 text-white h-screen flex flex-col items-center justify-center px-4">
      {/* Inline Style for Keyframes Animation */}
      <style>
        {`
          @keyframes bounce-20 {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          .animate-bounce-20 {
            animation: bounce-20 2s infinite;
          }
        `}
      </style>

      <div className="text-center">
        {/* Image with Custom Bouncing Animation */}
        <div className="pt-10 pb-10">
          <img
            src={image}
            alt="Unauthorized Access"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto animate-bounce-20"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-6 text-yellow-400">
          401 - Unauthorized
        </h1>

        {/* Description */}
        <p className=" mt-4 mb-4 text-md sm:text-lg md:text-xl max-w-md mx-auto text-gray-300">
          Oops! You don’t have permission to access this page. Please contact
          the administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;