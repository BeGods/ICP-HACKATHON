import React, { useContext } from "react";
import { convertOrbs } from "../utils/api";
import { MyContext } from "../context/context";

const Convert = () => {
  const { gameData, setGameData } = useContext(MyContext);

  // convert orbs to multicolor
  const handleOrbsConversion = async () => {
    const token = localStorage.getItem("accessToken");
    const mythologyName = {
      mythologyName: gameData[activeMyth].name,
    };
    try {
      await convertOrbs(mythologyName, token);
      console.log("Converted Successfully");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1>Multicolor orbs: {gameData?.multiColorOrbs}</h1>
      <button
        className="bg-black border p-2 text-white"
        onClick={handleOrbsConversion}
      >
        Convert
      </button>
    </div>
  );
};

export default Convert;
