import confetti from "canvas-confetti";
import React, { useEffect, useState } from "react";
import ScratchCard from "react-scratchcard-v2";

const Scratch = ({ handleComplete, item, image }) => {
  const [showEffect, setShowEffect] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showFlip, setShowFlip] = useState(false);
  const [coins, setCoins] = useState(0);
  const [icon, setIcon] = useState("A");

  useEffect(() => {
    if (!item) {
      return;
    }

    if (/starter0[3-4]/?.test(item) || item?.includes("common01")) {
      setCoins(2);
      setIcon("A");
    } else if (/starter0[5-9]/?.test(item)) {
      setCoins(1);
      setIcon("A");
    } else if (/common02/?.test(item)) {
      setIcon("Z");
    } else if (/common03/?.test(item)) {
      setIcon("*");
    } else if (/starter02/?.test(item)) {
      setIcon("l"); //!TODO: change icon
    }

    if (showFlip) {
      const interval = setInterval(() => {
        setFlipped((prev) => !prev);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [item, showFlip]);

  return (
    <div>
      <ScratchCard
        width={320}
        height={320}
        finishPercent={35}
        brushSize={25}
        image={image}
        onComplete={() => {
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
        }}
      >
        <div
          className={`relative h-[320px] rounded-md w-[320px] flex justify-center items-center  overflow-hidden ${
            showEffect && "scale-125"
          } transition-all duration-1000`}
        >
          <div className={`orb ${flipped ? "flipped" : ""}`}>
            <div className="flex justify-center items-center w-full relative h-full orb__face orb__face--front">
              <div
                className={`h-[240px] w-[240px]`}
                style={{
                  backgroundImage: `url(https://media.publit.io/file/BeGods/items/240px-${item}.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "100% 20%",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
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
      </ScratchCard>
    </div>
  );
};

export default Scratch;
