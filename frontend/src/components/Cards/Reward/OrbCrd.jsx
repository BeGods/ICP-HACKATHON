import React, { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { FofContext } from "../../../context/context";

import OverlayLayout from "../../Layouts/OverlayLayout";
import { ButtonLayout } from "../../Layouts/ButtonLayout";
import { ThumbsUp } from "lucide-react";

const BlackOrbRewardCrd = ({ reward, blackorbs, value, handAction }) => {
  const { assets, setShowCard, setShowBack, section } = useContext(FofContext);
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

  useEffect(() => {
    setShowBack(section);

    return () => {
      setShowBack(null);
    };
  }, []);

  return (
    <OverlayLayout>
      <div className="center-section">
        <div
          className={`relative card-width rounded-lg shadow-lg flex flex-col z-50`}
        >
          <div className="flex justify-center items-center w-full absolute  h-full">
            <div className="flex relative flex-col items-center cursor-pointer mt-5 z-50">
              <div className={``}>
                <div className={`orb ${flipped ? "flipped" : ""}`}>
                  <div className="orb__face orb__face--front  flex justify-center items-center">
                    <div className="flex justify-center items-center w-full absolute glow-tap-white h-full">
                      <img
                        src={`${assets.uxui.baseOrb}`}
                        alt="orb"
                        className="filter-orbs-black rounded-full"
                      />
                      <span
                        className={`absolute inset-0 flex justify-center items-center text-element-lg mt-14 text-white font-symbols opacity-50 orb-symbol-shadow`}
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
              <div className="text-gold text-[3rem] w-full flex justify-center">
                {blackorbs == 1 ? `${value} Black ORB` : "3 Black ORBS"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex absolute items-start bottom-0 mb-safeBottom justify-center w-full">
        <ButtonLayout
          mode="default"
          onClick={() => {
            handAction();
            setShowCard(null);
          }}
          centerContent={<ThumbsUp size={"1.75rem"} />}
        />
      </div>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 10, position: "fixed", top: 0, left: 0 }}
        />
      )}
    </OverlayLayout>
  );
};

export default BlackOrbRewardCrd;
