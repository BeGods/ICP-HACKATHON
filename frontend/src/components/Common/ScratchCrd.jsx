import confetti from "canvas-confetti";
import React, { useEffect, useRef, useState } from "react";
import ScratchCard from "react-scratchcard-v2";

const Scratch = ({ handleComplete, item, image }) => {
  const [showEffect, setShowEffect] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showFlip, setShowFlip] = useState(false);
  const [coins, setCoins] = useState(0);
  const [icon, setIcon] = useState("A");
  const scratchRef = useRef();

  useEffect(() => {
    if (!item) {
      return;
    }

    if (item?.includes("coin 2")) {
      setCoins(2);
      setIcon("A");
    } else if (item?.includes("coin 1")) {
      setCoins(1);
      setIcon("A");
    }
  }, [item, showFlip]);

  const triggerEffect = () => {
    setShowEffect(true);
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.7 },
    });
    setTimeout(() => {
      setShowEffect(false);
      setShowFlip(true);
    }, 1000);
    handleComplete();
  };

  useEffect(() => {
    setTimeout(() => {
      triggerEffect();
    }, 500);
  }, []);

  return (
    <div>
      <div
        className={`relative h-[320px] w-[320px] flex justify-center items-center  overflow-hidden reward-pop-in transition-all duration-1000`}
      >
        <div className={`orb ${flipped ? "flipped" : ""}`}>
          <div className="flex justify-center items-center w-full relative h-full orb__face orb__face--front">
            <div
              className={`h-[240px] w-[240px]`}
              style={{
                backgroundImage: `url(https://media.publit.io/file/BeGods/items/240px-${
                  item?.includes("coin") ? "gobcoin" : item
                }.png)`,
                backgroundSize: "cover",
                backgroundPosition: "100% 20%",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="absolute text-num text-white text-black-contour">
              {coins > 0 && coins}
            </div>
          </div>
          <div
            className={`orb__face orb__face--back relative flex flex-col justify-center items-center`}
          >
            <div className="text-white transition-transform duration-1000 font-symbols text-[40vw]  mx-auto icon-black-contour">
              {icon}
            </div>
            <div className="font-fof uppercase text-gold text-[10vw] font-bold -mt-[2vh] text-black-contour">
              {coins + (coins > 0 && " Gobcoin")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scratch;
