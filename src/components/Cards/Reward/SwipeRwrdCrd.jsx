import React, { useContext, useEffect, useState } from "react";
import { RorContext } from "../../../context/context";

const SwipeRwrdCrd = (props) => {
  const { assets, isTelegram } = useContext(RorContext);
  const [flipped, setFlipped] = useState(false);

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setFlipped((prev) => !prev);
  //     }, 2500);
  //     return () => clearInterval(interval);
  //   }, []);

  return (
    <div className="fixed inset-0  bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-[99]">
      <div className="relative w-[72%] rounded-lg shadow-lg -mt-[30px] flex flex-col z-50">
        <div
          className={`card ${
            isTelegram ? "h-[45.35vh] mt-[4.5vh]" : "h-[50dvh] mt-[2vh]"
          } ${flipped ? "flipped" : ""}`}
        >
          <div
            onClick={(e) => {
              setFlipped((prev) => !prev);
            }}
            className="card__face card__face--front relative card-shadow-white  flex justify-center items-center"
          >
            <div className="relative w-full h-full text-card">
              <img
                src={assets.uxui.info}
                alt="info card background"
                className="w-full h-full object-cover grayscale rounded-primary z-10"
              />
            </div>
            <div className="absolute flex flex-col justify-center items-center z-20">
              <img
                src={`/assets/ror-cards/240px-norse.relic.C09_on.png`}
                alt="reward"
              />
              <div className="text-num mt-5">Hello</div>
            </div>
          </div>
          <div
            onClick={(e) => {
              setFlipped((prev) => !prev);
            }}
            className="card__face card__face--back relative card-shadow-white  flex justify-center items-center"
          >
            <div className="relative w-full h-full text-card">
              <img
                src={assets.uxui.info}
                alt="info card background"
                className="w-full h-full object-cover grayscale rounded-primary z-10"
              />
            </div>
            <div className="absolute flex flex-col justify-center items-center z-20">
              <img
                src={`/assets/ror-cards/240px-shard.water.png`}
                alt="reward"
              />
              <div className="text-num mt-5">Hello</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeRwrdCrd;
