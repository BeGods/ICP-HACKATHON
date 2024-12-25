import React, { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { MyContext } from "../../../context/context";

import ClaimRewardBtn from "../../Buttons/ClaimRewardBtn";

const BlackOrbRewardCrd = ({}) => {
  const { assets, setShowCard } = useContext(MyContext);
  const [showConfetti, setShowConfetti] = useState(false);

  const playConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  useEffect(() => {
    playConfetti();
  }, []);

  return (
    <div className="fixed inset-0  bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="relative w-[72%] rounded-lg shadow-lg mt-[70px] flex flex-col z-50">
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-center items-center w-full absolute h-full glow-tap-white">
            <img
              src={`${assets.uxui.baseorb}`}
              alt="orb"
              className="filter-orbs-black rounded-full"
            />
            <span
              className={`absolute inset-0 flex justify-center items-center text-[180px] mt-4 ml-4 text-white font-symbols opacity-50 orb-symbol-shadow`}
            >
              g
            </span>
          </div>
        </div>
        <div className="text-gold mt-[40vw] text-[12.2vw] w-full flex justify-center">
          3 Black ORBS
        </div>
        <ClaimRewardBtn
          handleClick={() => {
            setShowCard(null);
          }}
        />
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
