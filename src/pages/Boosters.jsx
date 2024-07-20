import React, { useState } from "react";

const Boosters = ({ gameData }) => {
  const [activeMyth, setActiveMyth] = useState(0);

  return (
    <div className="bg-green-400">
      Boosters
      {activeMyth < 4 ? (
        <>
          <h1>{gameData[activeMyth].name}</h1>
        </>
      ) : (
        <div>MultiColor</div>
      )}
      <div className="flex gap-4 bg-yellow-300">
        <button
          onClick={() => {
            setActiveMyth((prev) => (prev - 1 + 5) % 5);
          }}
        >
          Prev
        </button>
        <button
          onClick={() => {
            setActiveMyth((prev) => (prev + 1) % 5);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Boosters;
