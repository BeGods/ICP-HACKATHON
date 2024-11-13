import React, { useEffect, useState } from "react";

const Createcollectionloader = ({ done, total }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (total > 0) {
      const calculatedProgress = Math.min((done / total) * 100, 100);
      setProgress(calculatedProgress);
      setIsComplete(calculatedProgress >= 100);
    }
  }, [done, total]);

  return (
    <div className="flex flex-col items-center justify-center h-screen mt-[-5rem]">
      {/* Spinner */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 border-8 border-gray-700 border-t-gray-400 rounded-full animate-spin"></div>
        <p className="mt-2 text-2xl font-medium text-white">
          Please wait till NFT Minted...
        </p>
      </div>

      {/* Loading Bar */}
      <div
        className={`relative w-3/5 h-6 bg-gray-300 border-2 border-black rounded-full shadow-lg overflow-hidden transform transition-transform duration-700 ${
          isComplete ? "rotate-180" : ""
        }`}
      >
        <div
          className="h-full bg-gradient-to-r from-yellow-300 to-yellow-600 transition-width duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Text */}
      <p className="mt-6 text-2xl text-white">
        <span>{done}</span> / <span>{total}</span> NFT Minting...
      </p>
    </div>
  );
};

export default Createcollectionloader;
