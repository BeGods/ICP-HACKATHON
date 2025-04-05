import { Crown } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Scratch from "../../components/Common/ScratchCrd";
import { RorContext } from "../../context/context";
import { gameItems } from "../../utils/gameItems";

const Gacha = () => {
  const { setSection, isTelegram } = useContext(RorContext);
  const [changeText, setChangeText] = useState("SCRATCH");
  const [item, setItem] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) =>
        prevText === "SCRATCH" ? "BONUS" : "SCRATCH"
      );
    }, 1500);

    const artifacts = gameItems.filter((item) =>
      item.id.includes("celtic.artifact")
    );
    const randomItem = artifacts[Math.floor(Math.random() * artifacts.length)];
    console.log(randomItem.id);

    setItem(randomItem.id);

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className={`flex flex-col ${
        isTelegram ? "tg-container-height" : "browser-container-height"
      } w-screen justify-center font-fof items-center bg-black`}
    >
      <div className="flex flex-col w-full h-full items-center pt-4">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center w-full h-1/5">
          <Crown color="#FFD660" size={"20vw"} />
          <h1 className="uppercase text-gold text-[14.2vw] -mt-4 scale-zero text-black-contour">
            {changeText}
          </h1>
        </div>
        {/* Scratch */}
        <div
          className={`absolute ${
            isTelegram ? "tg-container-height" : "browser-container-height"
          } w-screen flex justify-center items-center`}
        >
          <Scratch
            item={item}
            handleComplete={() => {
              setTimeout(() => {
                setSection(0);
              }, 3000);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Gacha;
