import React, { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { FofContext } from "../../../context/context";

import ClaimRewardBtn from "../../Buttons/ClaimRewardBtn";

const BlackOrbRewardCrd = ({ reward, blackorbs, value, handAction }) => {
  const { assets, setShowCard } = useContext(FofContext);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const playConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  useEffect(() => {
    if (value != "-1") {
      playConfetti();
    }
    const interval = setInterval(() => {
      setFlipped((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0  bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="relative w-[72%] rounded-lg shadow-lg mt-[70px] flex flex-col z-50">
        <div className="flex justify-center items-center w-full absolute  h-full">
          <div className="flex relative flex-col items-center cursor-pointer mt-5 z-50">
            <div className={``}>
              <div className={`orb ${flipped ? "flipped" : ""}`}>
                <div className="orb__face orb__face--front  flex justify-center items-center">
                  <div className="flex justify-center items-center w-full absolute glow-tap-white h-full">
                    <img
                      src={`${assets.uxui.baseorb}`}
                      alt="orb"
                      className="filter-orbs-black rounded-full"
                    />
                    <span
                      className={`absolute inset-0 flex justify-center items-center text-[180px] mt-4 text-white font-symbols opacity-50 orb-symbol-shadow`}
                    >
                      g
                    </span>
                  </div>
                </div>
                <div className="orb__face orb__face--back flex justify-center items-center">
                  <div className="flex justify-center items-center w-full absolute h-full glow-tap-white">
                    <img
                      src={reward}
                      alt="reward"
                      className="rounded-full w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gold text-[12.2vw] w-full flex justify-center">
              {blackorbs == 1 ? `${value} Black ORB` : "3 Black ORBS"}
            </div>
            <ClaimRewardBtn
              handleClick={() => {
                handAction();
                setShowCard(null);
              }}
            />
          </div>
        </div>
      </div>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 10, position: "fixed", top: 0, left: 0 }}
        />
      )}
    </div>
  );
};

export default BlackOrbRewardCrd;
