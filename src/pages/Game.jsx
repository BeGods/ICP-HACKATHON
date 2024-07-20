import React, { useContext, useState } from "react";
import Convert from "./Convert";
import { MyContext } from "../context/context";

const Game = () => {
  const { gameData, setGameData } = useContext(MyContext);
  const [activeMyth, setActiveMyth] = useState(0);

  return (
    <div className="bg-green-400">
      Game
      {activeMyth < 4 ? (
        <>
          <h1>{gameData?.updatedMythologies[activeMyth].name}</h1>
        </>
      ) : (
        <Convert />
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

export default Game;
