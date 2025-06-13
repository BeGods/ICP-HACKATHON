import React, { useEffect, useState } from "react";

const GachaRoll = ({ showSpin }) => {
  const itemArr = ["c", "g", 9, "n", "j", "f", "d", "e"];
  const [currItem, setCurrItem] = useState(0);

  useEffect(() => {
    let interval;
    if (showSpin) {
      interval = setInterval(() => {
        setCurrItem((prev) => (prev + 1) % itemArr.length);
      }, 175);
    } else {
      setCurrItem(6);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [showSpin]);

  return (
    <ul className={`circle-container font-symbols text-white text-[9dvh]`}>
      {itemArr.map((item, index) => (
        <li key={index}>
          <h1
            className={`transition-all text-black-contour duration-150 ${
              currItem === index ? "scale-150" : "scale-100"
            }`}
          >
            {item}
          </h1>
        </li>
      ))}
    </ul>
  );
};

export default GachaRoll;
