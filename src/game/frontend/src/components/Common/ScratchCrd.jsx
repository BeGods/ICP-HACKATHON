import confetti from "canvas-confetti";
import React, { useEffect, useRef, useState } from "react";
import ScratchCard from "react-scratchcard-v2";

const Scratch = ({ handleComplete, item, image, src }) => {
  const [showEffect, setShowEffect] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showFlip, setShowFlip] = useState(false);
  const [coins, setCoins] = useState(0);
  const [shards, setShards] = useState(null);
  const [icon, setIcon] = useState("A");

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
    } else if (item?.includes("shard")) {
      setShards(100);
    } else if (item === "meal") {
      setShards("Meal");
    } else if (item?.includes("starter02")) {
      setShards("Map");
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
        className={`relative h-[320px] w-[320px] flex justify-center items-center reward-pop-in transition-all duration-1000`}
      >
        <div className={`orb ${flipped ? "flipped" : ""}`}>
          <div className="flex flex-col justify-center items-center w-full relative h-full orb__face orb__face--front">
            <div
              className={`h-[240px] w-[240px]`}
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "100% 20%",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="absolute w-full h-full flex justify-center  items-center text-[8rem] mt-2 text-white text-black-contour">
              {coins > 0 && coins}
            </div>
            <div className="absolute w-full h-full flex justify-center  items-end text-[4rem] mb-0 mt-10 ml-5 text-white text-black-contour">
              {shards && shards}
            </div>
          </div>
          <div
            className={`orb__face orb__face--back relative flex flex-col justify-center items-center`}
          >
            <div className="text-white transition-transform duration-1000 font-symbols text-[40vw]  mx-auto icon-black-contour">
              {icon}
            </div>
            <div className="font-fof uppercase text-gold text-[4rem] font-bold -mt-[2vh] text-black-contour">
              {coins + (coins > 0 && " Gobcoin")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scratch;
